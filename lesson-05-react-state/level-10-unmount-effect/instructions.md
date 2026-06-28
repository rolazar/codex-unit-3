# Unmount Effect

## Objective

Track the unmount phase of a component when it is removed from the DOM.

## Benefits

Every component that is removed from the DOM goes through the unmount phase.

## Complete these tasks

1. In your system's file explorer or file picker, copy your `react-template` folder into this level folder. The template should render `Header`, `Main`, and `Footer` components.
2. In this level folder, rename `react-template` to `unmount-effect`.
3. In the terminal, navigate to the `unmount-effect` folder.
4. Start the Vite server and open the React Debugger browser.
5. In the `src/components/` folder, let the `Header` component render the title `Unmount Effect`.
6. In `App.jsx` before the `return`, add `useState(false)` and destructure its items into `unmount` and `setUnmount`.
7. On the line under `useState`, add `let mainComponent = <Main setUnmount={setUnmount}/>`. This will be rendered to mount the `Main` component.
8. On the line under `mainComponent`, add an `if` condition that checks if `unmount` is true.
9. In the `if` code block, add `mainComponent = <></>`. This will be rendered to unmount the `Main` component.
10. In the `return` statement, replace `<Main />` with `{mainComponent}`. A component can only be unmounted by a parent component.
11. View the page to make sure it runs without errors.
12. In the `src/components/` folder, view the `Main` component.
13. In `Main` parameters, destructure `setUnmount` from the props object.
14. Inside of the `Main` function and underneath the `return` statement, create a function called `componentDidUnmount`.
15. Let `componentDidUnmount` return a nameless function. When a function is returned during the mount phase, React will call the function during the unmount phase.
16. In the nameless function, add `alert` to display `The Main component has unmounted`.
17. In the `Main` function, add a `useEffect` with `componentDidUnmount` for the callback and `[]` for dependencies.
18. View the page to make sure it runs without errors.
19. In the `main` tag, add a `button` tag that says `Click to unmount`.
20. Add `onClick` and `handleClick` to handle the click event. You'll need to create `handleClick` under the `return` statement of `Main`.
21. In `handleClick`, add `setUnmount(true)`.
22. View the page to make sure it runs without errors.
23. View the DOM tree and find the `main` tag in it.
24. Click the unmount button. The `Main` component should unmount.
25. Place `debugger` or breakpoint in `Main` above the `return`, in `componentDidUnmount`, `handleClick`, and `App`.
26. Use the `debugger` to watch variables change - `mainComponent`, and `unmount`. Also, watch the page render the alert.
27. In the `main` tag, add a `p` tag with a message.
28. Let the message explain how to run code during the unmount phase.
29. View the page to make sure it runs without errors.

## More Information

- The `alert` function can display a popup message.
- When `useEffect` has an empty array for its list of dependencies, its callback function will be called only when the component mounts.
- When a function is returned during the mount phase, React will call the function during the unmount phase.
- A component cannot unmount itself. It must be unmounted by a parent component.
- You may notice the unmount alert pop up unexpededly. StrictMode (see `main.jsx`) automatically causes components to quickly mount, unmount, then remount. This behavior can help identify bugs during development. StrictMode is disabled during production.

## Usage Tips

- Items from `useState` can be destructured. Example: `const [didMount, setDidMount] = useState(false);`
- In programming, an effect (or side effect) is when a function interacts or changes something outside the function.
- The `props` object can be destructured in parameters. Example: `function MyComponent({ myProp1, myProp2 }) { ... }`
- `useEffect` takes in a callback function and an array of variables. Example: `useEffect( myFunction, [myVariable1, myVariable2] )`
- The `alert` function takes in a string to display. Example: `alert("Hello World!");`
- A nameless function can be defined. Example: `function () { ... }`

## Hints

- `npm run dev` starts a Vite server.
- Make sure to install the `node_modules` folder.
- Remember to import `useState` and `useEffect` from `react`.
- If `useEffect` is not given a list of dependencies (when no array is provided), the callback function will be called whenever anything changes about the component.
- Occasionally check the webpage to make sure your code is rendering properly.
