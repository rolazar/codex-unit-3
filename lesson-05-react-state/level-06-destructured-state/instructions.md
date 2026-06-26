# Destructured State

## Objective

Combine `useState` with array destructuring.

## Benefits

It is common practice to destructure the results of `useState`.

## Complete these tasks

1. In your system's folder explorer or file picker, copy your `react-template` folder into this level folder. The template should render `Header`, `Main`, and `Footer` components.
2. In this level folder, rename `react-template` to `use-state`.
3. In the terminal, navigate to the `use-state` folder.
4. Start the Vite server and open the React Debugger browser. You may need to install `node_modules`.
5. In the `src/components/` folder, let the `Header` component render the title `Statefull Variables`.
6. In the `src/components/` folder, view the `Main` component.
7. Above the `return` statement, add `const result = useState(0);`. You may need to import `useState` from `react`.
8. Add `debugger` on the line after `useState`.
9. View the page in the browser. The debugger should stop in `Main`.
10. Inspect the value of `result`. It should be an array with 2 items.
11. Save the first item in variable called `count`. This is the stateful variable.
12. Save the second item in a variable called `setCount`. This is the setter.
13. In the `main` tag, add a `button` tag that says `Click counter`.
14. Add a `p` tag that renders the value of `count`.
15. Add a `p` tag that renders a message.
16. Let the message explain stateful variables and what happens when the button is clicked.
17. Inside of the `Main` function and underneath the `return` statement, create a function called `handleClick`.
18. Let `handleClick` accept an `event` object and prevent default behavior.
19. In `handleClick`, add `debugger`.
20. Add `setCount` and give it the value of `count + 1`.
21. Use `onClick` to attach `handleClick` to the `button`.
22. View the page in the browser.
23. Click the button. The debugger should stop in `handleClick`.
24. Inspect `count`, run `setCount`, then press play in the debugger controls.
25. View the page in the browser. Observe the rendered value of `count`.

## More Information

- A stateful variable in React preserves its value between function calls. Remember, React components are functions.
- `useState` is a function that accepts an initial value.
- `useState` return an array with the current value and a function to change the value.
- The first item of the array is a stateful value.
- The second item of the array is a function.
- The function provided by `useState` is called a setter because it is used to set (or change) the stateful value.

## Usage Tips

- For named imports from packages, use `import`, the list of exported items in curly braces, `from`, and the package name. Example: `import { useState, useEffect } from "react";`
- To change the value with a setter, provide the new value. Example: `setCount(5);`
- The React Debugger opens read-only files when debugging. You won't be able to edit code in that file.
- To edit code while debugging, close the read-only file, edit the code in the original file, save the changes, then refresh the debugger or browser.

## Hints

- `npm run dev` starts a Vite server.
- Make sure to install the `node_modules` folder.
- Use `event.preventDefault()` to prevent default element behavior.
- To increment a variable, add 1 to it. Example: `myVariable = myVariable + 1`
- Use `onClick` to attach a handler to a `button` tag. Example: `<button onClick={handleClick}>`
- Use curly braces to render a variable in HTML tags. Example: `<p>{myVaiable}</p>`
