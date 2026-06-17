# NPM Scripts

## Objective

Learn about NPM scripts and how to run them.

## Benefits

NPM scripts let you run terminal commands by typing the shortcut instead of the whole command.

## Complete these tasks

1. In the terminal, navigate to this level folder.
2. Use `npm` to initialize a new project.
3. In `package.json`, add a `"scripts"` object.
4. In the `"scripts"` objects, add `"start"`.
5. Let the value of `"start"` be `"node script.js"`
6. In `script.js`, use `console.log` to display a message.
7. Let the message explain what NPM scripts are.
8. Run `script.js` with an NPM script.

## More Information

- NPM scripts are shortcuts defined in `package.json` under the `"scripts"` field.
- `"scripts"` should be an object with the name of shortcuts and their terminal commands. Example:

```json
{
  "scripts": {
    "my-shortcut1": "",
    "my-shortcut2": ""
  }
}
```

## Usage Tips

- Use `npm run` to run an NPM script. Example: `npm run my-shortcut`.
- Use commas to separate each field and value pair.
- JSON is just like JavaScript objects, except that each field requires quotes. Example:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "author": "Frontend Developer"
}
```

## Hints

- The `start` and `test` scripts can run without `run`. Example: `npm start` and `npm test`
- NPM scripts are useful for remembering terminal commands, running long terminal commands, and running multiple terminal commands with one command.
