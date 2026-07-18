# React Delete

## Objective

Use the Prisma web client in React to delete data.

## Benefits

Dynamically use React to perform CRUD operations on a database with an online form.

## Complete these tasks

1. NOTE: This level requires `prisma-template` and `client-template` from a previous level. Complete these tasks from scratch. Do not copy/paste unless the task permits it. Code for TW Elements can be copied/pasted.
2. Set up the Prisma web client: In your system's file explorer or file picker, copy your `prisma-template` folder from a previous level into this level folder. In the terminal, navigate to `prisma-template` and run `script.js`. It should work without errors after `node_modules` are installed.
3. Set up the website: In your system's file explorer or file picker, copy your `client-template` folder from a previous level into this level folder. In this level folder, rename `client-template` to `react-delete`. Change the title of the website to `Use a React Form to Delete Data`. In the terminal, navigate to the `react-delete` folder. Start the Vite server and open a React Debugger browser to the URL provided by Vite. View the website pages. They should work without errors after `node_modules` are installed.
4. In the `src/components/` folder, create `Delete.jsx` that exports the `Delete` component with destrucutred parameters `{ prisma, setData }`. The component will accept the `prisma` client as an attribute/prop and use it to update data from the database. Then it will use `setData` to send data to components.
5. In the `Delete` component, use the custom hook `useInputTWE` to initialize TWE inputs.
6. Let `Delete` return a `form` that uses `fieldset`, `legend`, and a TWE input to get a product id. The user will be able to specify which product to delete. Add a TWE submit `button`.
7. In `WebClient.jsx` and under `DbPassword`, render `Delete`. Give it the attribute/prop `prisma={prisma}`. This will give `Delete` access to the `prisma` client. Add the attribute/prop `setData={setData}`. This will give `Delete` a way to send `data` to `WebClient`.
8. View the website pages. After fixing rename and import errors, observe that the Web Client page renders.
9. In the `src/hooks/` folder, create `useDelete.js` that exports the `useDelete` custom hook and accepts a `prisma` object in parameters. It needs a `prisma` client to delete information in the database.
10. In `useDelete`, add `const [data, setData] = useState()`. This will store data from the database. Add `return [data, handleSubmit]` to give components access to the `data` and the form handler.
11. After the `return` statement, add the `async` function `handleSubmit` that accepts the `event` object and prevents default form behavior.
12. In `Delete.jsx`, use `useDelete`, pass it the `prisma` object, and destructure its items into `data` and `handleSubmit`. In the `form` tag, add the attribute `onSubmit={handleSubmit}`.
13. View the website pages. After fixing import errors, observe that the Web Client page renders.
14. In `useDelete.js`, delete a product in `handleSubmit`: Add `const form = event.target`. Add a `where` object to contain the product ID from `form.elements`. The `where` object will help delete a product by ID.
15. Use the `prisma` object to delete from the `products` table with `delete({where})`. That is property shorthand syntax. Then save the result in the `result` variable. Note that only 1 result will be provided.
16. View the Web Client page. With a `debugger`, observe that the database will not return a `result` when a product ID is not provided or if the ID doesn't exist. When a valid ID is provided, the database only returns the deleted `result`. It is an object, not an array.
17. Let `Delete` give `WebClient` the `result`: In `handleSubmit` in `useDelete.js`, after getting `result`, add `setData([result])`. That will store an array with the `result` object in it. `WebClient` expects results to be an array. In `Delete.jsx`, track the update phase with `useEffect`, `componentDidUpdate`, and `[data]` for dependencies. This will be used to send `data` whenever it changes. Add the function `componentDidUpdate` and an `if` statement that checks for `data`. In the `if` code block, use `setData` to send the `result` to `WebClient`.
18. View the Web Client page. It should render after fixing import and reference errors.
19. In `WebClient.jsx`, add `debugger` to the function `toDetails` to view `item` properties. Render `item` with `key`, `Fragment`, `dt`, `dd`, and `img`.
20. View the Web Client page. When a valid product ID is provided, the deleted product should be rendered.
21. Handle errors: Add `try/catch` blocks. In the `try` code block, place the "happy path" code that runs when there are no errors. In the `catch` block, create a `message` object with a `name` property. Give it an appropriate value, then use `setData` to save an array with the `message` object in it. `WebClient` expects the data to be an array.
22. View the Web Client page. After fixing any errors, observe that the message is rendered when an invalid product ID is provided.
23. Add `debugger` breakpoints to `WebClient`, `Delete`, `componentDidUpdate` in `Delete.jsx`, `useDelete`, `handeSubmit` in `useDelete.js`, and the `catch` block. Observe how these variables transfer information between components and custom hooks - `prisma`, `setData`, and `data`.
24. In the `Home` component, add a `p` tag that explains how use the Prisma web client in React to delete data that matches user input.
25. View the website pages and make sure they run without errors.

## More Information

- React components can accept attributes. Example: `<MyComponent myAtrribute="myValue" />`
- React components can access them through the `props` object. Example: `function MyComponent(props) { ... }`
- The `props` object can be destructured in-line. Example: `function MyComponent({ myAttribute1, myAttribute2 })`
- For help with `prisma` methods, try using `PrismaClient` in `script.js` for Intellisense popups and autocompletions.
- Property shorthand syntax can be used when an object property matches a variable. Example: Instead of `{ where: where }` the shorthand is `{ where }`.
- The `fieldset` tag groups inputs together and labels them with the `legend` tag.
- The `prisma` client's `delete` method needs a `where` object.
- `WebClient` expects `data` to be an array, but the `prisma` delete returns an object. To give `WebClient` what it expects, but the object in an array.
- The `message` object mimicks a product object so `toDetails` can render it.

## Usage Tips

- The `Fragment` component is the same as empty brackets, except that it can accept a `key`.
- The empty tag can group adjacent elements together without adding a parent element.
- A `key` is required when using `map` to create an array of elements.
- Keys should be unique. Example: `const key = index + item.name;`
- The details list is made with the `dl` tag. The `dt` tag represents the title. The `dd` tag represesents the description.

## Hints

- The database password should not be anywhere in the website code because all website code can be viewed publicly.
- Prisma is one of the many ways to connect to a database, but it can connect to different types of databases.
- `useEffect` callbacks such as `componentDidUpdate` are not allowed to be `async` functions. `async` functions return a Promise. `useEffect` callback functions are only allowed to return cleanup functions like `componentWillUmount`.
- A form can be cleared with the `reset` method. Example: `form.reset();`
