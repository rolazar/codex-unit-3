# Named Imports

## Objective

Access and use named exports from separate files. Observe that values must be defined during the export.

## Benefits

Named exports and imports allow code to be accessed by the same variable name from another file.

## Complete these tasks

1. In `messages.js` export a `const` string variable called `message1`.
2. Let `message1` explain how to use named exports.
3. In `index.js`, import `message1`.
4. Add `console.log` to display `message1`.
5. In the terminal, navigate to this folder and run `index.js`.
6. In `messages.js`, export a `const` string variable called `message2`.
7. Let `message2` explain how to use named imports.
8. In `index.js`, import `message2`.
9. Add `console.log` to display `message2`.
10. Run `index.js`

## More Information

- Named exports must be defined on the same line.
- Usually the file name matches the name of the variable or function that is being exported.
- `import` and `from` accesses code from another file.
- [Using named exports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export#using_named_exports)

## Usage Tips

- A variable or function name can be exported by name. Example: `export const message = "Hello world!"`
- To `import` by name, use curly braces, the same name that is exported, and specify the relative file path. Example: `import { myValue } from "./myValue.js"`
- To import multiple named exports from a file, separate them with commas. Example: `import { myValue, myMessage, myFunction } from "./myFile.js"`

## Hints

- Multiple named exports are allowed per file.
- An `index` file is usually the entry point that brings all files together.
