import { describe, test, expect } from "vitest";
import { lessonDir, runNode, exists } from "./utils/test-helpers";

describe("lesson-01-level-02-nodejs-script", () => {
  test("The lesson folder contains script.js", () => {
    const dir = lessonDir("lesson-01-nodejs/level-02-nodejs-script");
    expect(exists(`${dir}/script.js`)).toBe(true);
  });

  test("script.js uses console.log to display a message.", async () => {
    const dir = lessonDir("lesson-01-nodejs/level-02-nodejs-script");
    const { stdout } = await runNode(["script.js"], { cwd: dir });
    expect(stdout.trim().length).toBeGreaterThan(0);
  });

  test("The message explains how to run JavaScript files in the terminal.", async () => {
    const dir = lessonDir("lesson-01-nodejs/level-02-nodejs-script");
    const { stdout } = await runNode(["script.js"], { cwd: dir });
    const text = String(stdout).toLowerCase();
    // Students were asked to explain how to run JS files in the terminal; require
    // the message to mention `node` so graders can identify correct intent.
    expect(text.includes("node")).toBe(true);
    // Basic sanity: message is not a placeholder.
    expect(
      text.includes("todo") ||
        text.includes("placeholder") ||
        text.includes("lorem"),
    ).toBe(false);
  });

  test("script.js runs without errors.", async () => {
    const dir = lessonDir("lesson-01-nodejs/level-02-nodejs-script");
    const { stderr } = await runNode(["script.js"], { cwd: dir });
    expect(stderr).toBe("");
  });
});
