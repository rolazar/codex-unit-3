# Browser Debugger

## Objective

Configure the browser with a debugger that can be used to inspect data and run React code line-by-line.

## Benefits

Inspecting data and running code line-by-line aide in understanding how code works.

## Complete these tasks

1. In your system's file explorer or file picker, copy your `react-template` folder into this level folder. The template should render `Header`, `Main`, and `Footer` components.
2. In this level folder, rename `react-template` to `react-debugger`.
3. In the terminal, navigate to the `react-debugger` folder.
4. Start the Vite server, but don't open a web browser to the URL provided by Vite. You may need to install `node_modules`.
5. Open the VS Code Run and Debug panel.
6. Click on the Run and Debug settings gear icon. If you don't see the gear icon, follow the instructions below to open user settings.
7. Find the `"launch"` property, or add it. `"launch"` should be an object.
8. In the `"launch"` object, find the `"configurations"` property, or add it. `"configurations"` should be an array.
9. In the array, add an object `{}` with `"name": "React Debugger"`, `"request": "launch"`, `"type": "chrome"`, `"url": "http://localhost:5173"`, and `"webRoot": "${workspaceFolder}"`
10. Save the changes and view the VS Code Run and Debug panel.
11. In the dropdown, select `React Debugger`.
12. Click on the play button next to the dropdown. A browser should automatically open with your React project.
13. In the `src` folder, view `App.jsx`. There should be the `App` function.
14. In the `App` function, add `debugger` above the `return` statement. After saving, the debugger should stop in the `App` function.
15. In the `Main` component, add a string variable called `message`.
16. Let `message` explain how to start the debugger for React projects.
17. Let a `p` tag render `message`.
18. View the page in the browser.
19. Inspect the `message` variable with the debugger;

## More Information

- In VS Code, the browser debugger for React project must be manually configured by editing the settings file.
- The settings file is in JSON format, so its content is just like an object, except that each property is in quotations.
- The React Debugger opens read-only files when debugging. You won't be able to edit code in that file.
- To edit code while debugging, close the read-only file, edit the code in the original file, save the changes, then refresh the debugger or browser.

## Usage Tips

- To open the `Run and Debug` panel, go to Settings (gear icon) → Command Palette → search for `Run and Debug` → select `Run and Debug: Focus on Debug Console View`
- To open user settings, go to Settings (gear icon) → Command Palette → search for `User Settings` → select `Open User Settings (JSON)`.
- The `type` can be set to a popular browser such as `chrome` or `msedge`.
- Use curly braces to insert variables into HTML. Example: `<p>{myVariable}</p>`
- The `configurations` array should have an object like this:

```json
{
  "name": "React Debugger",
  "request": "launch",
  "type": "chrome",
  "url": "http://localhost:5173",
  "webRoot": "${workspaceFolder}"
}
```

## Hints

- `npm run dev` starts a Vite server.
- Make sure to install the `node_modules` folder.
- Separate each JSON property with a comma.
