# Component Props

## Objective

Use props to pass values to React components.

## Benefits

Passing values to React components makes them more dynamic and reusable.

## Complete these tasks

1. In your system's file explorer or file picker, copy your `react-template` folder into this level folder. The template should render `Header`, `Main`, and `Footer` components.
2. In this level folder, rename `react-template` to `react-props`.
3. In the terminal, navigate to the `react-props` folder.
4. Start the Vite server and open the React Debugger browser. You may need to install `node_modules`.
5. In the `src/components/` folder, view the `Header` component.
6. Let `Header` accept a parameter called `props`.
7. Add `debugger` before the return statement.
8. Use the React Debugger to inspect the `props` object. It should be empty.
9. Open `App.jsx` and view the `App` component. It should render the components `Header`, `Main`, and `Footer`.
10. In the `Header` tag, add the attribute `title="React Props"`.
11. Refresh the debugger or browser. It should stop on the `debugger`.
12. Inspect the `props` object. It should contain the `title` that was passed to the `Header` component.
13. Render `title` in an `h1` tag.
14. Remove the `debugger` from `Header.jsx` and add the debugger to `Main.jsx`.
15. Add the `props` object as a parameter of the `Main` function.
16. In the `App.jsx`, add `message=""` as an attribute of the `Main` component.
17. Let `message` be a string that explains how to use props.
18. In the `Main.jsx` component, use the debugger to inspect the `props` object. It should have the `message` that was passed in.
19. Render `message` in a `p` tag.
20. View the page in the browser.

## More Information

- React components accept a `props` object that contains information the component can use.
- `props` is a regular JavaScript object, so its properties can be accessed the regular JavaScript way.
- When HTML attributes are passed into a React component, the attributes are represented in the `props` object.

## Usage Tips

- The React Debugger opens read-only files when debugging. You won't be able to edit code in that file.
- To edit code while debugging, close the read-only file, edit the code in the original file, save the changes, then refresh the debugger or browser.
- HTML attributes go in the opening tags or self closing tags. Example:

```jsx
<p id="message">Hello World!</p>
<img src="picture.jpg">
```

## Hints

- `npm run dev` starts a Vite server.
- Make sure to install the `node_modules` folder.
- Use curly braces `{}` to insert variables into HTML.
