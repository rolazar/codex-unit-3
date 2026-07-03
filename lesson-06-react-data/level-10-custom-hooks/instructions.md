# Custom Hooks

## Objective

Create custom hooks and use them.

## Benefits

Custom hooks are useful for separating logic so components can focus on rendering.

## Complete these tasks

1. In your system's file explorer or file picker, copy your `react-template` folder into this level folder. The template should render `Header`, `Main`, and `Footer` components.
2. In this level folder, rename `react-template` to `custom-hooks`.
3. In the terminal, navigate to the `custom-hooks` folder.
4. Start the Vite server and open a web browser to the URL provided by Vite.
5. In the `src/components/` folder, let the `Header` component render the title `Custom Hooks for TW Elements Components`.
6. View the page to make sure it runs without errors.
7. Configure the project for Tailwind and TW Elements: install the packages, initialize Tailwind, edit `tailwind.config.js`, connect Tailwind and TW Elements to `style.css`, and link `style.css` to `index.html`.
8. In the `components` folder, create the file `Slides.jsx` that exports a `Slides` component, which returns a TW Elements carousel, calls `initTWE` in `componentDidMount`, then render `Slides` in the `Main` component. Make sure it works without errors.
9. In the `src` folder, create the `hooks` folder.
10. In the `hooks` folder, create the file `useCarouselTWE.js` that exports the function `useCarouselTWE`. This will be the custom hook for the TW Elements carousel.
11. In `Slides.jsx`, move the code for `useState`, `useEffect`, and `componentDidMount` into the `useCarouselTWE` function.
12. In the `Slides` component, call the `useCarouselTWE` function.
13. View the page to make sure it runs without errors. Observe that `Slides` is more focused on rendering instead of logic.
14. In the `components` folder, create `Navbar.jsx` that exports the `Navbar` component, which returns a TW Elements navbar, calls `initTWE` in `componentDidMount`, then render the `Navbar` component in the `Header` component. Make sure it works without errors.
15. In the `hooks` folder, add `useCollapseTWE.js` that exports the function `useCollapseTWE`. This will be the custom hook for the TW Elements navbar.
16. In the `Slides` component, move the code for `useState`, `useEffect`, and `componentDidMount` into the `useCollapseTWE` function, then call `useCollapseTWE` from the `Navbar` component.
17. View the page to make sure it runs without errors. Observe that `Navbar` is more focused on rendering instead of logic.
18. In the `Main` component, add a `p` tag with a message that explains how to create custom hooks and how to use them.
19. View the page in the browser.

## More Information

- React hooks add additional features to functions, such as persistent variables and the ability to monitor component lifecycles.
- React hooks start with `use` and describe the feature they provide. For example, `useState` provides stateful variables.
- Custom hooks are reusable functions that separate logic so React components can focus on rendering.
- Hooks can only be used in React components and other hooks. They do not work in regular functions.
- [Custom hooks documentation](https://react.dev/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component)

## Usage Tips

- Use curly braces to insert variables into HTML. Example: `<p>{myVariable}</p>`
- In React, the `class` attribute must be replaced with `className`.
- In React, most hyphenated attributes are camelCased. For example, replace `min-width` with `minWidth`.
- In React, the `style` attribute accepts a JavaScript object instead of a string. For example, replace `style="color:red; max-width:100px"` with `style={ {color:"red", maxWidth: "100px"} }`.
- In the `style` attribute, hyphenated CSS properties must be converted to camelCase for React projects.
- React doesn't support HTML comments. Use JavaScript comments instead.

## Hints

- `dev` is a shortcut script in `package.json`.
- `npm run dev` starts a Vite server. Make sure to install the `node_modules` folder with `pnpm install` or `npm install`.
