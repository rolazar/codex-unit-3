# Navbar

## Objective

Configure the TW Elements navbar for a React project.

## Benefits

There are noticeable differences in how navbars are implemented in React projects.

## Complete these tasks

1. In your system's file explorer or file picker, copy your `react-template` folder into this level folder. The template should render `Header`, `Main`, and `Footer` components.
2. In this level folder, rename `react-template` to `navbar`.
3. In the terminal, navigate to the `navbar` folder.
4. Start the Vite server and open a web browser to the URL provided by Vite.
5. In the `src/components/` folder, let the `Header` component render the title `TW Elements Navbar in React`.
6. View the page to make sure it runs without errors.
7. Configure the project for Tailwind and TW Elements: install the packages, initialize Tailwind, edit `tailwind.config.js`, connect Tailwind and TW Elements to `style.css`, and link `style.css` to `index.html`.
8. In the `components` folder, create the file `Navbar.jsx` to export the `Navbar` component.
9. In `Navbar`, `return` the TW Elements HTML code for a navbar.
10. In the `Header` component, render the `Navbar` component.
11. View the page. There will be errors.
12. Fix errors with comments, `class`, `style`, hyphenated attributes, then restart the server to fix visual/render issues.
13. View the page to make sure it runs without errors. Observe that the navbar collapse menu doesn't work properly.
14. In the TW Elements website, view the JavaScript code for the navbar. In React, `initTWE` must run in the mount phase, after the navbar code has mounted.
15. Set up the `Navbar` component to track the mount phase. Use `useEffect`, `componentDidMount`, and an empty array of dependencies.
16. In `Navbar.jsx`, import the items listed in the TW Elements website, then run `initTWE` in `componentDidMount`.
17. View the page to make sure it runs without errors. Observe that the navbar collapse menu works properly.
18. Set up the project for multiple pages: create the `pages` folder, convert `Main` to `Home`, move `Home` to the `pages` folder, add an `About` page with content, install `react-router`, and route pages with `BrowserRouter` in `App.jsx`.
19. Edit the `Navbar` component to link to valid pages. Remove unused links.
20. View the page in the browser. The navbar should navigate between pages without errors. Observe that pages are fully reloaded when navbar links are visited.
21. In `Navbar.jsx` component, import `NavLink` from `react-router`.
22. In the `Navbar` component, replace the `a` tags with the `NavLink` component.
23. In the `NavLink` components, replace `href=` with `to=`. `NavLink` doesn't use `href`.
24. View the page in the browser. Observe that pages load faster because they do not reload when navbar links are visited.
25. In the `Home` component, add a `p` tag with a message that explains how to use a TW Elements navbar with `react-router` and `NavLink`.
26. View the page in the browser.

## More Information

- [TW Elements navbar](https://tw-elements.com/docs/standard/navigation/navbar/)
- [React Router usage instructions](https://reactrouter.com/start/declarative/routing)
- [NavLink documentation](https://reactrouter.com/api/components/NavLink)
- The `NavLink` component replaces `a` tags, but uses `to=` instead of `href=`.
- The `NavLink` component loads pages faster because they are cached (stored in memory or remembered).

## Usage Tips

- Use curly braces to insert variables into HTML. Example: `<p>{myVariable}</p>`
- In React, the `class` attribute must be replaced with `className`.
- In React, most hyphenated attributes are camelCased. For example, replace `min-width` with `minWidth`.
- In React, the `style` attribute accepts a JavaScript object instead of a string. For example, replace `style="color:red; max-width:100px"` with `style={ {color:"red", maxWidth: "100px"} }`.
- In the `style` attribute, hyphenated CSS properties must be converted to camelCase for React projects.
- [Tailwind v3 installation instructions](https://v3.tailwindcss.com/docs/installation)
- [TW Elements installation instructions](https://tw-elements.com/docs/standard/getting-started/quick-start/#vite)
- TW Elements requires Tailwind version 3, not version 4. View `package.json` for the version that is installed. It's the right version if it starts with `3`.

## Hints

- `npm run dev` starts a Vite server. Make sure to install the `node_modules` folder with `pnpm install` or `npm install`.
