# Node Modules

## Objective

Learn about Node modules and how to use them.

## Benefits

Many Node modules (packages) come with instructions how to install and use them.

## Complete these tasks

1. In the NPMJS website, find `chalk` and review some of its details.
2. In the terminal, navigate to this level folder.
3. Use `npm` to initialize a new project.
4. Follow the `chalk` installations instructions.
5. In `script.js`, follow the `chalk` usage instructions to display a message.
6. Let the message be color green and explain Node modules.
7. Run `script.js`. There may be an error.
8. In `package.json`, change the value of `"type"` to `"module"`
9. Run `script.js`.
10. Observe the previous error and how it was fixed.
11. In the VS Code file list, observe that there is a `node_modules` folder.
12. Find `chalk` in the `node_modules` folder and view some of its files.

## More Information

- The `node_modules` folder contains code from external modules.
- Your project imports modules by package name from `node_modules`. Example: `import chalk from "chalk"`
- In projects with `package.json`, the `import` statement can only be used with `"type": "module"`

## Usage Tips

- Use `npm install` to install a package by name. Example: `npm install some-package`

## Hints

- `chalk` returns a string that can be stored in a variable. Example: `const message = chalk.red("Hello World!")`
