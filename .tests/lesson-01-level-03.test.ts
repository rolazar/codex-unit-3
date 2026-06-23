import { describe, test, expect } from "vitest";
import { lessonDir, runNode, exists } from "./utils/test-helpers";
import fs from "fs";

describe("lesson-01-level-03-no-dom", () => {
  test("The lesson folder contains script.js", () => {
    const dir = lessonDir("lesson-01-nodejs/level-03-no-dom");
    expect(exists(`${dir}/script.js`)).toBe(true);
  });

  test("A key and value are stored with localStorage", () => {
    const dir = lessonDir("lesson-01-nodejs/level-03-no-dom");
    const src = fs.readFileSync(`${dir}/script.js`, "utf8");
    // Remove comments to avoid matching commented-out examples.
    const stripped = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
    // Expect a call to localStorage.setItem with two arguments (key and value).
    const callRe = /localStorage\.setItem\s*\(\s*[^,]+\s*,\s*[^)]+\)/
    expect(callRe.test(stripped)).toBe(true)
  });

  test('A p tag is selected with document.querySelector', () => {
    const dir = lessonDir('lesson-01-nodejs/level-03-no-dom')
    const src = fs.readFileSync(`${dir}/script.js`, 'utf8')
    // Remove comments to avoid matching commented-out examples.
    const stripped = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
    // Find a document.querySelector call with a string literal selector.
    const dqRe = /document\.querySelector\s*\(\s*(['`\"])([^'"`]+)\1\s*\)/
    const m = dqRe.exec(stripped)
    expect(m).not.toBeNull()
    const selector = m ? m[2].trim() : ''
    // Split selector into simple tokens by whitespace or combinators and check
    // that at least one token targets a p tag (e.g. 'p', 'p.some', 'div p').
    const tokens = selector.split(/\s*[>+~]\s*|\s+/).map(t => t.trim()).filter(Boolean)
    const selectsP = tokens.some(t => t.startsWith('p') || /(^|[^a-zA-Z0-9_-])p($|[^a-zA-Z0-9_-])/.test(t))
    expect(selectsP).toBe(true)
  })

  test("script.js runs with errors when executed with `node`", async () => {
    const dir = lessonDir("lesson-01-nodejs/level-03-no-dom");
    let threw = false;
    try {
      await runNode(["script.js"], { cwd: dir });
    } catch (err: any) {
      threw = true;
      // If available, stderr should mention document or localStorage being undefined.
      const stderr = String(err.stderr ?? "");
      expect(
        stderr.length > 0 ||
          stderr.includes("document") ||
          stderr.includes("localStorage") ||
          String(err.message).length > 0,
      ).toBe(true);
    }
    expect(threw).toBe(true);
  });
});
