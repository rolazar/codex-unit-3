# Render Arrays

## Objective

Render data into a a stateful array of React elements.

## Benefits

React can be used to render data with HTML.

## Complete these tasks

1. In your system's file explorer or file picker, copy your `react-template` folder into this level folder. The template should render `Header`, `Main`, and `Footer` components.
2. In this level folder, rename `react-template` to `render-arrays`.

3. Start the Vite server and open the React Debugger browser.
4. In the `src/components/` folder, let the `Header` component render the title `Render Data Arrays with React`.
5. In the `src/components/` folder, view the file `Main.jsx`.
6. Set up the component to track the mount phase. Use `useState`, `didMount`, `setDidMount`, `componentDidMount`, `useEffect`, an empty array of dependencies, and a `p` tag to render the value of `didMount`. Code from scratch. Don't copy/paste.
7. View the page to make sure it runs without errors.
8. In the `src` folder, create a `data` folder with a `data.js` file in it.
9. In `data.js`, `export default` an array of 5 objects.
10. Let each object have a `src` and `caption`. The `src` can reference a local image or an image URL. The `caption` should describe the image.
11. In `Main.jsx`, import the data array from `"./data/data.js"`.
12. View the page to make sure it runs without errors.
13. In the `Main` component, on the line after `useState`, add `const [] = useState([]);`. This stateful array will contain HTML code.
14. Destructure the items into `images` and `setImages`.
15. In the `main` tag, render `images` in a `section` tag.
16. View the page to make sure it runs without errors.
17. In `componentDidMount`, add `const figures = [];`
18. On the line after `figures`, traverse the data array with a `for` loop.
19. In the `for` loop, add `const figure = <figure></figure>;`
20. In the `figure` tag, add an `img` tag with the `src` from the data array item.
21. Add a `figcaption` tag with the `caption` from the data array item.
22. On the line after `figure`, add `figures.push(figure);`
23. After the `for` loop, add `setImages(figures);`.
24. View the page to make sure it runs without errors.
25. Place `debugger` breakpoints in `Main` and `componentDidMount`.
26. Use the `debugger` to watch the variables change - `images` and `figures`. Also, watch images render on the page.
27. Use `Dev Tools` to inspect the DOM. Watch the `figure` tags get added to the DOM tree.
28. In the `main` tag, add a `p` tag that explains how to render a data array with HTML.
29. View the page to make sure it runs without errors.

## More Information

- During the mount phase, the `Main` component renders the data into HTML tags.
- The images are processed in `componentDidMount`, which only runs when `Main` mounts.
- In `StrictMode`, components are automatically forced to quickly mount, unmount, then mount again.
- `useEffect` always calls its callback function when the component mounts.
- The data array contains objects with image information. Example:

```javascript
{
  src: "https://treehugger.com/common-oak-trees.png",
  caption: "Diagram of common North American Oak trees and their leaves."
}
```

## Usage Tips

- The `for` loop accepts an initial count, the ending condition, and an incrementor.
- The `push` method adds an item to an array.
- `figure` and `figcapture` are semantic tags for pictures with captions.
- Semantic tags describe the content they contain.
- Default imports don't use curly braces. Example: `import data from "./data/data.js";`

## Hints

- `npm run dev` starts a Vite server. Remember to navigate to the project folder in the terminal and install the `node_modules` folder.
- Remember to import `useState` and `useEffect` from `react`.
- Local images can be imported as variables. Example: `import pic1 from "./assets/pic1.jpg";`
- Named exports use `export`. Default exports use `export default`.
