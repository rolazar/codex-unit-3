# Update Effect

## Objective

Use a stateful variable to track a component during its update phase.

## Benefits

Every component that changes goes through the update phase.

## Complete these tasks

1. In your system's file explorer or file picker, copy your `react-template` folder into this level folder. The template should render `Header`, `Main`, and `Footer` components.
2. In this level folder, rename `react-template` to `update-effect`.
3. In the terminal, navigate to the `update-effect` folder.
4. Start the Vite server and open the React Debugger browser.
5. In the `src/components/` folder, let the `Header` component render the title `Update Effect`.
6. In the `src/components/` folder, view the `Main` component.
7. Set up the component to track the mount phase. Use `useState`, `didMount`, `setDidMount`, `componentDidMount`, `useEffect`, an empty array of dependencies, and a `p` tag to render the value of `didMount`.
8. View the page to make sure it runs without errors.
9. On the line after `useState`, add `useState(false)` and destructure its items into `update` and `setDidUpdate`.
10. On the line after `useState`, add `useState("The Main component hasn't updated.")` and destructure its items into `message` and `setMessage`.
11. In the `main` tag, render the value of `didUpdate` in a `p` tag, and render the value of `message` in a `p` tag.
12. Inside of the `Main` function and underneath the `return` statement, create a function called `componentDidUpdate`.
13. Let `componentDidUpdate` use an `if` condition that runs code only when `didMount` is `true`.
14. In the `if` code block, use `setDidUpdate` to set `didUpdate` to `true`.
15. On the line under `useEffect`, call the `useEffect` function with `componentDidUpdate` as the callback, and `[ message ]` as the list of dependencies. `componentDidUpdate` will be called whenever `message` changes.
16. View the page to make sure it runs without errors.
17. In the `main` tag, add a `button` tag that says `Click to update`.
18. Add `onClick` and `handleClick` to handle the click event. You'll need to create `handleClick`.
19. In `handleClick`, use `setMessage` to set the value of `message` to `The Main component has updated.`
20. View the page to make sure it runs without errors.
21. Click the button. The `message` should change in the page.
22. Place `debugger` or breakpoint above the `return`, in `componentDidMount`, `componentDidUpdate`, and `handleClick`.
23. Use the `debugger` to watch the stateful variables change - `didMount`, `didUpdate`, and `message`. Also, watch them render on the page.
24. In the `main` tag, add a `p` tag that explains how to track the update phase and why an `if` condition is necessary.
25. View the page to make sure it runs without errors.

## More Information

- `useEffect` always calls its callback function when the component mounts.
- The update phase is when a stateful variable changes after the component has mounted.
- `useEffect` will call the callback function when its dependencies (variables in the list) have changed.

## Usage Tips

- In programming, an effect (or side effect) is when a function interacts or changes something outside the function.
- To change the value with a setter function, provide the new value. Example: `setCount(5);`
- `useEffect` takes in a callback function and an array of variables. Example: `useEffect( myFunction, [myVariable1, myVariable2] )`

## Hints

- `npm run dev` starts a Vite server.
- Make sure to install the `node_modules` folder.
- Remember to import `useState` and `useEffect` from `react`.
- If `useEffect` is not given a list of dependencies (when no array is provided), the callback function will be called whenever anything changes about the component.
