import { describe, test, expect } from "vitest";
import {
  lessonDir,
  runNode,
  runNodeLines,
  exists,
  readStrippedSource,
  parseArrayLiterals,
  findFunctionBody,
  numberedItemsPresent,
} from "./utils/test-helpers";

describe("lesson-01-nodejs-level-08-reusable-function", () => {
  test("The lesson folder contains script.js.", () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-08-reusable-function");
    expect(exists(`${lessonPath}/script.js`)).toBe(true);
  });

  test("Create an array with 10 values.", () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-08-reusable-function");
    const sourceStripped = readStrippedSource(`${lessonPath}/script.js`);
    const arrays = parseArrayLiterals(sourceStripped);
    expect(arrays.length).toBeGreaterThanOrEqual(1);
    const first = arrays[0] || [];
    expect(first.length).toBe(10);
  });

  test("Create another array.", () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-08-reusable-function");
    const sourceStripped = readStrippedSource(`${lessonPath}/script.js`);
    const arrays = parseArrayLiterals(sourceStripped);
    // Expect at least two array literals in the lesson source.
    expect(arrays.length).toBeGreaterThanOrEqual(2);
  });

  test("Define a function named showItems.", () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-08-reusable-function");
    const sourceStripped = readStrippedSource(`${lessonPath}/script.js`);
    const fnDecl = /function\s+showItems\s*\(/.test(sourceStripped);
    const fnExpr =
      /(?:const|let|var)\s+showItems\s*=\s*\(/.test(sourceStripped) ||
      /(?:const|let|var)\s+showItems\s*=\s*[^=]*=>/.test(sourceStripped);
    expect(fnDecl || fnExpr).toBe(true);
  });

  test("showItems uses a for loop to traverse an array.", () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-08-reusable-function");
    const sourceStripped = readStrippedSource(`${lessonPath}/script.js`);

    // Try to capture the showItems body for inspection (supports function decl and const = () => {} forms).
    const body = findFunctionBody(sourceStripped, "showItems");

    // There should be a for(...) inside the function body and indexing like arr[i]
    const forRe = /for\s*\([^)]*\)/m;
    const indexAccessRe = /[A-Za-z_$][\w$]*\s*\[\s*[A-Za-z_$][\w$]*\s*\]/m;
    expect(body.length).toBeGreaterThan(0);
    expect(forRe.test(body)).toBe(true);
    expect(indexAccessRe.test(body)).toBe(true);
  });

  test("showItems displays each array item.", () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-08-reusable-function");
    const sourceStripped = readStrippedSource(`${lessonPath}/script.js`);
    // Expect console.log to be used somewhere in the file (and particularly in showItems body).
    expect(/console\.log\s*\(/.test(sourceStripped)).toBe(true);
  });

  test("showItems displays numbered items (Example: items 1 to 10).", async () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-08-reusable-function");
    const outputLines = await runNodeLines(["script.js"], { cwd: lessonPath });
    // For each number 1..10, assert at least one line starts with that number.
    for (let num = 1; num <= 10; num++) {
      const re = new RegExp(`^${num}\\b`);
      const found = outputLines.some((line) => re.test(line));
      expect(found).toBe(true);
    }
  });

  test("The first array is displayed as numbered items.", async () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-08-reusable-function");
    const sourceStripped = readStrippedSource(`${lessonPath}/script.js`);
    const arrays = parseArrayLiterals(sourceStripped);
    expect(arrays.length).toBeGreaterThanOrEqual(1);
    const firstItems = arrays[0] || [];

    const outputLines = await runNodeLines(["script.js"], { cwd: lessonPath });

    // Use helper to assert the first array is printed as numbered items.
    expect(numberedItemsPresent(outputLines, firstItems)).toBe(true);
  });

  test("showItems displays items for the second array.", async () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-08-reusable-function");
    const sourceStripped = readStrippedSource(`${lessonPath}/script.js`);
    const arrays = parseArrayLiterals(sourceStripped);
    expect(arrays.length).toBeGreaterThanOrEqual(2);
    const secondItems = arrays[1] || [];

    const outputLines = await runNodeLines(["script.js"], { cwd: lessonPath });
    // Expect at least one literal from the second array to appear in output.
    const anyFound = secondItems.some((it) =>
      outputLines.some((line) => line.includes(it)),
    );
    expect(anyFound).toBe(true);
  });

  test("showItems works for arrays of different lengths.", async () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-08-reusable-function");
    const sourceStripped = readStrippedSource(`${lessonPath}/script.js`);
    const arrays = parseArrayLiterals(sourceStripped);
    // Sum detected array lengths and ensure the script prints at least that many lines.
    const expectedLines = arrays.reduce((s, a) => s + a.length, 0);
    const outputLines = await runNodeLines(["script.js"], { cwd: lessonPath });
    expect(outputLines.length).toBeGreaterThanOrEqual(expectedLines);
  });

  test("script.js runs without errors", async () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-08-reusable-function");
    let thrown = false;
    try {
      const runResult = await runNode(["script.js"], { cwd: lessonPath });
      expect(runResult.stderr.length).toBe(0);
    } catch (err: any) {
      thrown = true;
    }
    expect(thrown).toBe(false);
  });
});
