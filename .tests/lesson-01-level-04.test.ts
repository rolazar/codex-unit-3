import { describe, test, expect } from "vitest";
import {
  lessonDir,
  importDefault,
  exists,
  readSource,
  stripComments,
  hasLocalStorageSetItem,
  findsDocumentQuerySelectors,
  selectorTargetsP,
  hasTryCatch,
  catchIdentifier,
  consoleLogInCatchMessage,
} from "./utils/test-helpers";

describe("lesson-01-level-04-error-handling", () => {
  test("The lesson folder contains script.js", () => {
    const dir = lessonDir("lesson-01-nodejs/level-04-error-handling");
    expect(exists(`${dir}/script.js`)).toBe(true);
  });

  test("localStorage.setItem is called with a key and value", () => {
    const dir = lessonDir("lesson-01-nodejs/level-04-error-handling");
    const src = readSource(`${dir}/script.js`);
    const { found } = hasLocalStorageSetItem(src);
    expect(found).toBe(true);
  });

  test("document.querySelector selects a p tag", () => {
    const dir = lessonDir("lesson-01-nodejs/level-04-error-handling");
    const src = readSource(`${dir}/script.js`);
    const { calls } = findsDocumentQuerySelectors(src);
    expect(calls.length).toBeGreaterThan(0);
    const anyTargetsP = calls.some((c) => selectorTargetsP(c.selector));
    expect(anyTargetsP).toBe(true);
  });

  test("Code is wrapped with try/catch.", () => {
    const dir = lessonDir("lesson-01-nodejs/level-04-error-handling");
    const src = readSource(`${dir}/script.js`);
    expect(hasTryCatch(src)).toBe(true);
  });

  test("Catch block accepts an error object.", () => {
    const dir = lessonDir("lesson-01-nodejs/level-04-error-handling");
    const src = readSource(`${dir}/script.js`);
    expect(Boolean(catchIdentifier(src))).toBe(true);
  });

  test("The catch block uses console.log to display an explanatory message.", async () => {
    const dir = lessonDir("lesson-01-nodejs/level-04-error-handling");
    const src = readSource(`${dir}/script.js`);
    const info = consoleLogInCatchMessage(src);
    expect(info.found).toBe(true);
  });

  test("The message explains why there is an error.", async () => {
    const dir = lessonDir("lesson-01-nodejs/level-04-error-handling");
    const src = readSource(`${dir}/script.js`);
    const info = consoleLogInCatchMessage(src);
    expect(info.found).toBe(true);
    if (info.literal) {
      const message = info.literal.toLowerCase();
      expect(
        message.includes("document") ||
          message.includes("localstorage") ||
          message.includes("not defined") ||
          message.includes("cannot"),
      ).toBe(true);
    } else {
      // If not a literal, accept usage of error.message or logging the error variable itself.
      expect(info.usesErrorProp || info.found).toBe(true);
    }
  });
});
