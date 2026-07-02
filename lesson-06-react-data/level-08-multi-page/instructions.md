# Multi-page

## Objective

Navigate between pages in a React project.

## Benefits

There are noticeable differences in how multi-page websites are created with React projects.

## Complete these tasks

1. In your system's file explorer or file picker, copy your `react-template` folder into this level folder. The template should render `Header`, `Main`, and `Footer` components in `App.jsx` wrapped by empty tags.
2. In this level folder, rename `react-template` to `multi-page`.
3. Start the Vite server and open a web browser to the URL provided by Vite.
4. In the `src/components/` folder, let the `Header` component render the title `Create a Multi-Page Website with React`.
5. View the page to make sure it runs without errors.
6. Code the following tasks from scratch. Don't copy/paste.
7. In the `src` folder, create the `pages` folder.
8. Move `Main.jsx` from the `components` folder to the `pages` folder. This folder will hold components that render pages of the website.
9. In `Main.jsx`, rename the `Main` function to `Home`.
10. Rename `Main.jsx` to `Home.jsx`. This component will render the home page of the website.
11. In `App.jsx`, replace `Main` with `Home`.
12. View the page to make sure it runs without errors.
13. In a new terminal, navigate to the `multi-page` folder.
14. Install the package `react-router`.
15. In `App.jsx`, import `BrowserRouter`, `Routes`, and `Route` from `react-router`. These React components are required to create a multi-page website.
16. Replace the empty tags with `BrowserRouter` tags.
17. In the `BrowserRouter` tags, add `Routes` tags.
18. In the `Routes` tags, add a self-closing `Route` tag.
19. In the `Route` tag, add the attribute `path="/"`. This is the path for the home page.
20. In the `Route` tag, add the attribute `element={}` and move the `Home` tag into the curly braces. The `element` will be rendered when the `path` is visited in the browser.
21. Move the `Header` above the `Routes` opening tag. This will make the `Header` visible at the top of all pages.
22. Move the `Footer` tag below the `Routes` closing tag. This will make the `Footer` visible at the bottom of all pages.
23. View the page to make sure it runs without errors.
24. In the `pages` folder, create an `About` component that returns a `main` tag with some content.
25. In `App.jsx` between the `Routes` tags, add a self-closing `Route` tag.
26. In the `Route` tag, add the attributes `path="/about"` and `element={<About />}`
27. View the page to make sure it runs without errors.
28. In the `Header` component, add a navbar with the `nav` tag with `a` tags that link to `/` and `/about`.
29. View the page to make sure it runs without errors. Use the navbar to navigate between pages. Observe the `path` in the address bar.
30. In the `Home` page, add a `p` tag that explains how to create a multi-page website with `react-router`.
31. View the page to make sure it runs without errors.

## More Information

- A `Route` requires a `path` and an `element`. Example: `<Route path="/" element={ <Home /> } />`
- A `Route` will render its element when the `path` is visited in the browser.
- HTML elements and components outside of the `Routes` tags will always be rendered on any `path`.
- [React Router usage instructions](https://reactrouter.com/start/declarative/routing)

## Usage Tips

- An `a` tag needs a label and a link. Example: `<a href="/about">About</a>`
- In `StrictMode`, components are automatically forced to quickly mount, unmount, then mount again. It's ok to temporarily disable `StrictMode`.
- Named imports require curly braces. Example: `import { Routes } from "react-router";`
- Empty tags, also known as React Fragments, don't appear in the DOM, but they can wrap HTML tags and React components. Example:

```jsx
<>
  <Header />
  <Main />
  <Footer />
</>
```

## Hints

- `npm run dev` starts a Vite server. Remember to navigate to the project folder in the terminal and install the `node_modules` folder.
- Use curly braces to render a variable in HTML. Example: `<p>{content}</p>`
