# React Read

## Objective

Use the Prisma web client in React to read data.

## Benefits

Dynamically use React to perform CRUD operations on a database with an online form.

## Complete these tasks

1. NOTE: This level requires `prisma-template` and `client-template` from a previous level. Complete these tasks from scratch. Do not copy/paste unless the task permits it.
2. Set up the Prisma web client: In your system's file explorer or file picker, copy your `prisma-template` folder from a previous level into this level folder. In the terminal, navigate to `prisma-template` and run `script.js`. It should work without errors after `node_modules` are installed.
3. Set up the website: In your system's file explorer or file picker, copy your `client-template` folder from a previous level into this level folder. In this level folder, rename `client-template` to `react-read`. Change the title of the website to `Use a React Form to Read Data`. In the terminal, navigate to the `react-react` folder. Start the Vite server and open a React Debugger browser to the URL provided by Vite. View the website pages. It should work without errors after `node_modules` are installed.
4. In the `src/components/` folder, create `Read.jsx` that exports the `Read` component with destrucutred parameters `{ prisma, setData }`. The component will accept the `prisma` client as an attribute/prop and use it to read data from the database. Then it will use `setData` to send data to components.
5. Let `Read` return a `form` that uses `fieldset`, `legend`, `button`, and TWE inputs to get a product id, a product name, and max price. The user will be able to specify which products to view. Use the custom hook `useInputTWE` to initialize the inputs.
6. In `WebClient.jsx` and under `DbPassword`, render `Read`. Give it the attribute/prop `prisma={prisma}`. This will give `Read` access to the `prisma` client. Add the attribute/prop `setData={setData}`. This will give `Read` a way to send `data` to `WebClient`.
7. View the website pages. After fixing import errors, observe that the Web Client page renders.
8. In the `src/hooks/` folder, create `useRead.js` that exports the `useRead` custom hook and accepts a `prisma` object in parameters. It needs a `prisma` client to read from the database.
9. In `useRead`, add `const [data, setData] = useState()`. This will store data from the database. Add `return [data, handleSubmit]` to give components access to the `data` and the form handler.
10. After the `return` statement, add the `async` function `handleSubmit` that accepts the `event` object and prevents default form behavior.
11. In `Read.jsx`, use `useRead`, pass it the `prisma` object, and destructure its items into `data` and `handleSubmit`. In the `form` tag, add the attribute `onSubmit={handleSubmit}`.
12. View the website pages. After fixing import errors, observe that the the Web Client page renders.
13. In `useRead.jsx`, find products in `handleSubmit`: Add `const form = event.target`. Add `const where = {}`. This is the `where` object that will match products. Use the `prisma` object to search the `products` table with `findMany({where})`. That property shorthand syntax. Then save the results in the `results` variable.
14. View the Web Client page. With a `debugger`, observe that the database returns the whole list of `results` when a valid password is provided.
15. In `handleSubmit`, create variables to store each value from the form. Example: `const productName = form.elements.productName.value;`
16. For the `where` object, only add values if they were provided by the user: Add the `id` property if the user provided a product ID. Add the `name` property if the user provided a product name. Add the `price` property if the user provided a max price. Example: `if (productName) where.name = productName;`
17. Let `price` be an object with the `lte` property to choose items with prices less than or equal to the max price. Example: `where.price = { lte: maxPrice }`
18. View the Web Client page. With a `debugger`, observe how `where` changes when the user inputs different values. Observe that the database only returns matching `results`.
19. Let `Read` give `WebClient` the `data` results: Track the update phase with `useEffect`, `componentDidMount`, and `[data]` for dependencies. This will be used to send data whenever it changes. Add the function `componentDidMount` and an `if` statement that checks for `data`. In the `if` code block, use `setData` to send the `data` to `WebClient`.
20. In `WebClient.jsx`, add `debugger` to the function `toDetails` to view `item` properties. Render each `item` with `key`, `Fragment`, `dt`, `dd`, and `img`.
21. View the Web Client page. After fixing any errors, observe that products are rendered when they match the form values.
22. Add `debugger` breakpoints to `WebClient`, `Read`, `componentDidMount`, `useRead`, and `handeSubmit` in `useRead.js`. Observe how these variables transfer information between components and custom hooks - `prisma`, `setData`, and `data`.
23. In the `Home` component, add a `p` tag that explains how use the Prisma web client in React to read data that matches user input.
24. View the website pages and make sure they run without errors.

## More Information

- React components can accept attributes. Example: `<MyComponent myAtrribute="myValue" />`
- React components can access them through the `props` object. Example: `function MyComponent(props) { ... }`
- The `props` object can be destructured in-line. Example: `function MyComponent({ myAttribute1, myAttribute2 })`
- To run code if a variable has a value, an `if` statement can be used. Example: `if (productName) { //RUN THIS CODE IF productName HAS A VALUE }`
- For help with `prisma` methods, try using `PrismaClient` in `script.js` for Intellisense popups and autocompletions.
- Property shorthand syntax can be used when an object property matches a variable. Example: Instead of `{ where: where }` the shorthand is `{ where }`.
- The `fieldset` tag groups inputs together and labels them with the `legend` tag.
- The database password should not be anywhere in the website code because all website code can be viewed publicly.

## Usage Tips

- The `Fragment` component is the same as empty brackets, except that it can accept a `key`.
- The empty tag can group adjacent elements together without adding a parent element.
- A `key` is required when using `map` to create an array of elements.
- Keys should be unique. Example: `const key = index + item.name;`
- The details list is made with the `dl` tag. The `dt` tag represents the title. The `dd` tag represesents the description.

## Hints

- Prisma is one of the many ways to connect to a database, but it can connect to different types of databases.
- `useEffect` callbacks such as `componentDidUpdate` are not allowed to be `async` functions. `async` functions return a Promise. `useEffect` callback functions are only allowed to return cleanup functions like `componentWillUmount`.
- A form can be cleared with the `reset` method. Example: `form.reset();`
