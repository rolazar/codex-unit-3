# NPM Scripts

## Objective

Learn about NPM scripts and how to run them.

## Benefits

NPM scripts let you run terminal commands by typing the shortcut instead of the whole terminal command.

## Complete these tasks

1. In a VS Code terminal, navigate to this level folder.
2. Use `npm` to create a `vite` project called `react`, scaffolded with `React` and `JavaScript`. A Vite server should automatically start.
3. In the terminal, type `q` then press `ENTER` to stop the Vite server.
4. In the VS Code file list, select the `react` folder, then view `package.json`.
5. Observe in `package.json` that the `"scripts"` object has some properties (`"dev"`, `"build"`, `"preview"`, etc).
6. Observe that their values are terminal commands.
7. In the terminal, navigate to the `react` folder of this level.
8. Use `npm` to run the `build` script.
9. Observe that the terminal command for the `build` script ran `vite build`.
10. Use `npm` to run the `preview` script.
11. Observe that the terminal command for the `preview` script ran `vite preview`.
12. In `index.html`, add a `p` tag to display a message.
13. Let the message explain NPM scripts.
14. View your message in the browser.

## More Information

- NPM scripts are shortcuts defined in `package.json` under the `"scripts"` field.
- `"scripts"` should be an object with the name of shortcuts and their terminal commands. Example:

```json
{
  "scripts": {
    "shortcut1": "terminal command 1",
    "shortcut2": "terminal command 2"
  }
}
```

## Usage Tips

- Use `npm run` to run an NPM script. Example: `npm run shortcut1`.
- Commas are used to separate each field and value pair.
- JSON is just like JavaScript objects, except that each property should be in quotes. Example:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "author": "Frontend Developer"
}
```

## Hints

- NPM scripts are useful for remembering terminal commands.
- The `dev` script starts a server that refreshes whenever code is changed.
- You may need to run `npm run build` then `npm run preview` again to render the latest code changes.
