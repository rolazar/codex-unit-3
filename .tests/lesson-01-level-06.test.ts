import { describe, test, expect } from "vitest";
import path from "path";
import {
  lessonDir,
  exists,
  readSource,
  hasLocalStorageSetItem,
  findsDocumentQuerySelectors,
  selectorTargetsP,
  hasTryCatch,
  catchIdentifier,
  consoleLogInCatchMessage,
  consoleLogExplainsDebug,
  hasDebuggerStatement,
  runNode,
} from "./utils/test-helpers";

describe("lesson-01-nodejs-level-06-debugger-controls", () => {
  test("The lesson folder contains script.js.", () => {
    const dir = lessonDir("lesson-01-nodejs/level-06-debugger-controls");
    const p = path.join(dir, "script.js");
    expect(exists(p)).toBe(true);
  });

  test("script.js stores a value using localStorage.", () => {
    const dir = lessonDir("lesson-01-nodejs/level-06-debugger-controls");
    const p = path.join(dir, "script.js");
    const src = readSource(p);
    const res = hasLocalStorageSetItem(src);
    expect(res.found).toBe(true);
  });

  test("script.js selects a <p> element using document.querySelector.", () => {
    const dir = lessonDir("lesson-01-nodejs/level-06-debugger-controls");
    const p = path.join(dir, "script.js");
    const src = readSource(p);
    const calls = findsDocumentQuerySelectors(src).calls || [];
    const foundP = calls.some((c) => selectorTargetsP(c.selector));
    expect(foundP).toBe(true);
  });

  test("The code is wrapped in try/catch.", () => {
    const dir = lessonDir("lesson-01-nodejs/level-06-debugger-controls");
    const p = path.join(dir, "script.js");
    const src = readSource(p);
    expect(hasTryCatch(src)).toBe(true);
    // Ensure a catch identifier is present (e.g. catch(error))
    expect(catchIdentifier(src)).not.toBeNull();
  });

  test("The catch block accepts an error object.", () => {
    const dir = lessonDir("lesson-01-nodejs/level-06-debugger-controls");
    const p = path.join(dir, "script.js");
    const src = readSource(p);
    const id = catchIdentifier(src);
    expect(id).not.toBeNull();
  });

  test("The catch block uses console.log to display a message.", () => {
    const dir = lessonDir("lesson-01-nodejs/level-06-debugger-controls");
    const p = path.join(dir, "script.js");
    const src = readSource(p);

    const catchLog = consoleLogInCatchMessage(src);
    expect(catchLog.found).toBe(true);

    if (catchLog.found && catchLog.literal) {
      const explains = consoleLogExplainsDebug(src);
      expect(
        explains.mentionsDebug ||
          explains.mentionsAction ||
          explains.mentionsTerminal,
      ).toBe(true);
    }
  });

  test("script.js runs without errors.", async () => {
    const dir = lessonDir("lesson-01-nodejs/level-06-debugger-controls");
    const p = path.join(dir, "script.js");

    // runNode expects args array: pass the script path
    const result = await runNode([p], { cwd: dir, timeoutMs: 5000 });

    // No stderr and some stdout is expected (the catch should log a message)
    expect(result.stderr).toBe("");
    expect(result.stdout.length).toBeGreaterThan(0);
  });
});
