import { describe, test, expect } from "vitest";
import {
  lessonDir,
  exists,
  readSource,
  runNode,
  consoleLogExplainsDebug,
  consoleLogMessages,
} from "./utils/test-helpers";

describe("lesson-01-level-05-debug-terminal", () => {
  test("The lesson folder contains script.js", () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-05-debug-terminal");
    expect(exists(`${lessonPath}/script.js`)).toBe(true);
  });

  test("script.js contains console.log with an explanatory message.", () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-05-debug-terminal");
    const source = readSource(`${lessonPath}/script.js`);
    const info = consoleLogMessages(source);
    expect(info.found).toBe(true);
    if (info.found) {
      const lower = info.literals.map((l) => l.toLowerCase());
      const anyRelevant = lower.some(
        (l) =>
          l.includes("debug") ||
          l.includes("terminal") ||
          l.includes("javascript"),
      );
      expect(anyRelevant).toBe(true);
    }
  });

  test("The message explains how to use the JavaScript Debug Terminal to start the debugger.", () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-05-debug-terminal");
    const source = readSource(`${lessonPath}/script.js`);
    const info = consoleLogExplainsDebug(source);
    expect(info.found).toBe(true);
    if (info.found) {
      expect(info.mentionsDebug).toBe(true);
      expect(info.mentionsAction || info.mentionsTerminal).toBe(true);
    }
  });

  test("script.js runs without errors.", async () => {
    const lessonPath = lessonDir("lesson-01-nodejs/level-05-debug-terminal");
    const scriptPath = `${lessonPath}/script.js`;
    try {
      const { stdout, stderr } = await runNode([scriptPath], {
        cwd: lessonPath,
        timeoutMs: 5000,
      });
      // running should not produce stderr; stdout may contain the explanatory message
      expect(stderr).toBe("");
      expect(stdout).toBeDefined();
    } catch (err) {
      // If node exits non-zero, fail the test with the error message
      throw new Error(String(err));
    }
  });
});
