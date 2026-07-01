# Form Input

## Objective

Render data from a form.

## Benefits

Data from a form is processed differently in React.

## Complete these tasks

1. In your system's file explorer or file picker, copy your `react-template` folder into this level folder. The template should render `Header`, `Main`, and `Footer` components.
2. In this level folder, rename `react-template` to `form-input`.
3. Start the Vite server and open the React Debugger browser.
4. In the `src/components/` folder, let the `Header` component render the title `Render Data from a Form`.
5. View the page to make sure it runs without errors.
6. Code the following tasks from scratch. Don't copy/paste.
7. In the `src/components/` folder, view the file `Main.jsx`.
8. In `Main`, add `useState()` and destructure its items into `values` and `setValues`. This will keep track of form values.
9. In the `main` tag, add a `form` tag, 3 `input` and `label` tags, `name` attributes, and a submit `button`. Choose appropriate labels and input types.
10. After the `form`, add an `output` tag that renders the `values` variable.
11. View the page to make sure it runs without errors.
12. In the `form` tag, add the attribute `onSubmit={handleSubmit}`.
13. In `Main` and under the `return` statement, add the function `handleSubmit` that accepts the `event` object and prevents default form behavior.
14. In `handleSubmit`, add `const form = event.target;`.
15. Add an array `formInputs` to contain a list of objects.
16. Let the objects have these properties - `label` and `value` - that represent values from the form. Example: `{label: "Email", value: form.elements.email.value}`.
17. Use the `map` method of `formInputs` to convert the items with `toDetails`.
18. Outside and under the `Main` function, create the function `toDetails` to accept a `formInput` parameter.
19. In `toDetails`, add `const details = <details></details>`.
20. Use information from `formInput` to add a `summary` tag and content in the `details` tag.
21. In `toDetails`, `return` the `details` object.
22. In `handleSubmit`, store the results of `map` into `const details`, then `setValues(details)`.
23. View the page to make sure it runs without errors.
24. Place `debugger` breakpoints in `Main`, `handleSubmit`, and `toDetails`.
25. Use the `debugger` to watch the variables change - `values`, `formInputs` and `details`. Also, watch characters render on the page.
26. Use `Dev Tools` to inspect the DOM. Watch the `details` tags get added to the `output` tag.
27. In the `main` tag, add a `p` tag that explains how to use to render form values after they are submitted.
28. View the page to make sure it runs without errors.

## More Information

- The `onSubmit` attribute calls the handler function when the form it submitted.
- The form element can be obtained from `event.target`.
- Form values can be obtained from `form.elements`.
- All arrays have access to the `map` method.
- The `map` method takes in a callback function.
- The callback function receives an item of the array, the index number of the item, and the complete array. If only the item is needed, parameters for the index number and the array can be omitted.
- Callback functions for the `map` method often begin with `to` and describe what they produce. Example: `toCard` produces a card and `toFigure` produces a figure.
- The `map` method returns an array of items produced by the callback function.

## Usage Tips

- In `StrictMode`, components are automatically forced to quickly mount, unmount, then mount again.
- [`details` and `summary` are semantic tags for subjects with descriptions.](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details).

## Hints

- `npm run dev` starts a Vite server. Remember to navigate to the project folder in the terminal and install the `node_modules` folder.
- Use curly braces to render a variable in HTML. Example: `<p>{content}</p>`
- The debugger can be used to inspect `form.elements`.
