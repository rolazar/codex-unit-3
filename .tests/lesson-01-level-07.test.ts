import { describe, test, expect } from "vitest";
import { lessonDir, runNode, runNodeLines, exists, readStrippedSource } from "./utils/test-helpers";

describe("lesson-01-level-07", () => {
  test("The lesson folder contains script.js.", () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-07-array-traversal");
    expect(exists(`${lessonPath}/script.js`)).toBe(true);
  });

  test("In script.js, create an array with 10 values.", () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-07-array-traversal");
    const sourceStripped = readStrippedSource(`${lessonPath}/script.js`);
    const arrRe = /(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*\[([\s\S]*?)\]/;
    const match = arrRe.exec(sourceStripped);
    expect(match).not.toBeNull();
    const itemsRaw = match ? match[1] : "";
    const items = itemsRaw
      .split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/)
      .map((item) => item.trim())
      .filter(Boolean);
    expect(items.length).toBe(10);
  });

  test("A for loop has a starting index and an ending condition.", () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-07-array-traversal");
    const sourceStripped = readStrippedSource(`${lessonPath}/script.js`);
    const forRe = /for\s*\(([^)]*)\)/m;
    const matchFor = forRe.exec(sourceStripped);
    expect(matchFor).not.toBeNull();
    const inner = matchFor ? matchFor[1] : "";
    // Expect an initialization that sets an index to 0 and a condition with < or <=
    const initIsZero = /=\s*0\b/.test(inner);
    const hasComparison = /<|<=/.test(inner);
    const hasEndBound = /\.length\b|\d+\b/.test(inner);
    expect(initIsZero).toBe(true);
    expect(hasComparison).toBe(true);
    expect(hasEndBound).toBe(true);
  });

  test("The loop traverses the array.", () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-07-array-traversal");
    const sourceStripped = readStrippedSource(`${lessonPath}/script.js`);
    // Look for indexing like array[index]
    const indexAccessRe = /[A-Za-z_$][\w$]*\s*\[\s*[A-Za-z_$][\w$]*\s*\]/m;
    const matchIndexAccess = indexAccessRe.exec(sourceStripped);
    expect(matchIndexAccess).not.toBeNull();
  });

  test("Display each item in the array.", async () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-07-array-traversal");
    const sourceStripped = readStrippedSource(`${lessonPath}/script.js`);
    // Should use console.log at least once to display values.
    expect(/console\.log\s*\(/.test(sourceStripped)).toBe(true);

    // Also run the script and ensure it prints lines to stdout.
    const outputLines = await runNodeLines(["script.js"], { cwd: lessonPath });
    expect(outputLines.length).toBeGreaterThanOrEqual(10);
  });

  test("Number the items from 1 to 10.", async () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-07-array-traversal");
    const outputLines = await runNodeLines(["script.js"], { cwd: lessonPath });
    // For each number 1..10, assert at least one line starts with that number (e.g. "1.", "1)", "1 " etc.).
    for (let num = 1; num <= 10; num++) {
      const re = new RegExp(`^${num}\\b`);
      const found = outputLines.some((line) => re.test(line));
      expect(found).toBe(true);
    }
  });

  test("script.js runs without errors.", async () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-07-array-traversal");
    let thrown = false;
    try {
      const runResult = await runNode(["script.js"], { cwd: lessonPath });
      // stderr should be empty when running correctly
      expect(runResult.stderr.length).toBe(0);
    } catch (err: any) {
      thrown = true;
    }
    expect(thrown).toBe(false);
  });
});
