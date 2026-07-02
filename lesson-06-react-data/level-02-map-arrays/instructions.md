# Map Arrays

## Objective

Use the `map` method and a callback function to transform data to a stateful array of React elements.

## Benefits

The `map` method of an array can be used to replace the `for` loop.

## Complete these tasks

1. In your system's file explorer or file picker, copy your `react-template` folder into this level folder. The template should render `Header`, `Main`, and `Footer` components.
2. In this level folder, rename `react-template` to `map-arrays`.
3. Start the Vite server and open the React Debugger browser.
4. In the `src/components/` folder, let the `Header` component render the title `Map Arrays to React Elements`.
5. View the page to make sure it runs without errors.
6. Code the following tasks from scratch. Don't copy/paste.
7. In the `src/components/` folder, view the file `Main.jsx`.
8. Set up the component to track the mount phase. Use `useState`, `didMount`, `setDidMount`, `useEffect`, `componentDidMount`, an empty array of dependencies, and a `p` tag to render the value of `didMount`.
9. In the `src` folder, create a `data` folder with a `data.js` file in it.
10. In `data.js`, add `export const data`, where `data` is an array of 5 objects.
11. Let each object have a `name` and `description`. The `name` is a subject - a person, place, or thing. The `description` should describe the subject.
12. In `Main.jsx`, import the `data` array from `"./data/data.js"`.
13. View the page to make sure it runs without errors.
14. In the `Main` component, on the line after `useState`, add `const [] = useState([]);`. This stateful array will contain HTML code.
15. Destructure the items into `subjects` and `setSubjects`.
16. In the `main` tag, render `subjects` in a `section` tag.
17. View the page to make sure it runs without errors.
18. Outside and under the `Main` function, create the function `toDetails`. This will be the callback function for the `map` method.
19. In `toDetails` parameters, receive a `dataItem`, which will be an object from the `data` array.
20. In `toDetails`, add `const details = <details></details>;`
21. In the `details` tag, add a `summary` tag that contains the `name` from `dataItem`.
22. In the `details` tag, add the `description` from `dataItem`.
23. In `toDetails`, `return` the details object. This object will be added to the array that `map` produces.
24. In `componentDidMount`, add `const details = data.map(toDetails);`.
25. On the line after `details`, add `setSubjects(details);`.
26. View the page to make sure it runs without errors.
27. Place `debugger` breakpoints in `Main`, `componentDidMount`, and `toDetails`.
28. Use the `debugger` to watch the variables change - `subjects` and `details`. Also, watch subjects render on the page.
29. Use `Dev Tools` to inspect the DOM. Watch the `details` tags get added to the DOM tree.
30. In the `main` tag, add a `p` tag that explains how to use `map` to render a data array with HTML.
31. View the page to make sure it runs without errors.

## More Information

- All arrays have access to the `map` method.
- The `map` method takes in a callback function.
- The callback function receives an item of the array, the index number of the item, and the complete array. If only the item is needed, parameters for the index number and the array can be omitted.
- Callback functions for the `map` method often begin with `to` and describe what they produce. Example: `toDetails` produces details and `toFigure` produces a figure.
- The `map` method returns an array of items produced by the callback function.
- The data array contains objects with subject information. Example:

```javascript
{
  name: "Oak Tree",
  description: "An oak is a hardwood tree or shrub in the genus Quercus of the beech family."
}
```

## Usage Tips

- During the mount phase, the `Main` component renders the data into HTML tags.
- The details are processed in `componentDidMount`, which only runs when `Main` mounts.
- In `StrictMode`, components are automatically forced to quickly mount, unmount, then mount again.
- `useEffect` always calls its callback function when the component mounts.
- [`details` and `summary` are semantic tags for subjects with descriptions.](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details).
- Named imports require curly braces. Example: `import {data} from "./data/data.js";`

## Hints

- `npm run dev` starts a Vite server. Remember to navigate to the project folder in the terminal and install the `node_modules` folder.
- Remember to import `useState` and `useEffect` from `react`.
- Named exports use `export`. Default exports use `export default`.
- Use curly braces to render a variable in HTML. Example: `<p>{content}</p>`
- The `key` prop error will not prevent the page from rendering.
