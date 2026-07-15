# React Read

## Objective

Use the Prisma web client in React to read data.

## Benefits

Dynamically use React to perform CRUD operations on a database with an online form.

## Complete these tasks

1. NOTE: This level requires `spa-template` from a previous level.
2. Set up the Prisma web client: In the VS Code terminal, navigate to this level folder. Use `npm` to initialize a project, and set the `type` to `module`. Install these packages - `prisma@6`, `dotenv`, and `prisma-json-schema-generator`. Initialize Prisma in the terminal: `npx prisma init`. In `.schema.prisma`, change the `provider` for the `client` to `prisma-client-js`. Under the `client` generator, add the `jsonSchema` generator. In `.env`, replace the string for `DATABASE_URL` with the `Connection string` from Supabase `Session pooler`. In the connection string, replace `[YOUR-PASSWORD]` with the database password you created (or generated).
3. Synchronize Prisma with your database: `npx prisma db pull`. Generate a client to connect to your database: `npx prisma generate`. Information about tables will be added to `prisma/schema.prisma`. Make sure the Prisma web client can connect to your database: In `script.js` import `createWebClient` from `web-client.js`. `await` for the web client to be created. Give the client `json-schema.json`. Use it to get all items from the `products` table. `console.log` the results.
4. Run `script.js`. It should work without errors.
5. Set up the website: In your system's file explorer or file picker, copy your `spa-template` folder from a previous level into this level folder. In this level folder, rename `spa-template` to `react-update`. Change the title of the website to `Use a React Form to Update Data`. In the terminal, navigate to the `react-update` folder. Start the Vite server and open a React Debugger browser to the URL provided by Vite.
6. View the website pages and make sure they run without errors. When a valid password is provided, products should be rendered.
7. Convert `ApiKey` to `WebClient`: In the `src/pages/` folder, rename `ApiKey.jsx` to `WebClient.jsx`, rename the `ApiKey` component to `WebClient`. In `App.jsx`, replace `ApiKey` with `WebClient`. Replace the `/apikey` path with `/webclient`. In `Navbar.jsx`, replace the `/apikey` path with `/webclient`, replace the `API Key` link with `Web Client`.
8. View the website pages. After fixing renaming or import errors, observe that the pages render without errors.
9. Refactor and repurpose the form: In the `src/components/` folder, create `DbPassword.jsx` that exports the `DbPassword` component. In `WebClient.jsx`, move the `form`, `output`, and hooks to `DbPassword`. You may need to use an empty tag to group adjacent tags. In `DbPassword`, replace all occurences of `apiKey` with `password`, and replace the `API Key` label with `Database Password`. This converts it to a component that gets database passwords instead of API keys.
10. In `WebClient.jsx`, render `DbPassword` where the `form` used to be.
11. View the website pages. After fixing renaming or import errors, observe that the pages render without errors.
12. Create a custom hook that provides the Prisma web client: In the `src/hooks/` folder, create the file `usePrisma.js` that exports the custom hook `usePrisma` that accepts the `password` parameter. It will return a Prisma web client when a database password is provided. In `usePrisma`, add `const [prisma, setPrisma] = useState();`. This will store the Prisma web client. Add `useEffect(componentDidUpdate, [password])`. This will create the Prisma web client when the password is provided. Add `return prisma;` so components can use the Prisma web client.
13. At the top of `usePrisma.js`, import `createWebClient` from the Prisma web client, and import `json-schem.json` into the `schema` variable. After the `return` statement, create the function `componentDidUpdate` that calls the function `handlePrisma`. Add the `async` function `handlePrisma`. In `handlePrisma`, use a string template to insert the `password` into the connection string, and save the result in `connectionString`. Create the client with `const prisma = await createWebClient({datasourUrl: connectionString, jsonSchema: schema});`. Then add `setPrisma(prisma);`. This will save the Prisma web client in the stateful variable.
14. In the `WebClient` component, add `const [password, setPassword] = useState();` and `const prisma = usePrisma(password);`.
15. Close the browser to reset session storage, then open a new browser page. View the Web Client page. After fixing import errors and handling empty password errors, observe that the webite renders without errors.
16. Let `DbPassword` give `WebClient` the password: In `WebClient.jsx` where `DbPassword` is rendered, add the attribute/prop `setPassword={setPassword}`. In `DbPassword.jsx`, add the parameter `{ setPassword }` to destructure the props object. In the `DbPassword` component, track the update phase with `useEffect`, `componentDidUpdate`, and `[password]` for dependencies. Create the function `componentDidUpdate` that uses `setPassword` to give `WebClient` the password.
17. In the `src/components/` folder, create `Read.jsx` that exports the `Read` component with the parameter `{ prisma }`. The component will use the `prisma` client to read data from the database.
18. Let `Read` return a `form` that uses `fieldset`, `legend`, `button`, and TWE inputs to get a product id, a product name, and max price. Use `useInputTWE` to initialize the inputs. In `WebClient.jsx`, render `Read` under `DbPassword`.
19. View the website pages. After fixing renaming or import errors, observe that the pages render without errors.
20. In the `src/hooks/` folder, create `useRead.js` that exports the `useRead` custom hook that accepts a `prisma` object in parameters. In `useRead`, add `const [data, setData] = useState()`. This will store data from the database. Add `return [data, handleSubmit]`. Add the `async` function `handleSubmit` that accepts the `event` object and prevents default form behavior. In `Read.jsx`, use `useRead`, pass it the `prisma` object, and destructure its items into `data` and `handleSubmit`. In the `form` tag, add the attribute `onSubmit={handleSubmit}`.
21. View the website pages. After import errors, observe that the pages render without errors.
22. In `useRead.jsx`, find products in `handleSubmit`: Add `const form = event.target`. Add `const where = {}`. This is the `where` object that will match products. Use the `prisma` object to search the `products` table with `findMany({where})`. Save the results in the `results` variable.
23. Add a `debugger` breakpoint in `handleSubmit`. View the Web Client page. Observe that the database returns the whole list of `results`.
24. Create a variable to store each value from the form. Example: `const productName = form.elements.name.value;`
25. For the `where` object, only add values if they were provided by the user: Add the `id` property if the user provided a product ID. Add the `name` property if the user provided a product name. Add the `price` property if the user provided a max price. Example: `if (productName) where.name = productName;`
26. For `price`, use `lte` to choose items with prices less than or equal to the max price. Example: `where.price = { lte: 19.99 }`
27. View the Web Client page. Observe that the database returns matching `results`.
28. Let `Read` give `WebClient` the `data` results. In `WebClient.jsx`, add `const [data, setData] = useState([]);`. Where `Read` is rendered, add the attribute/prop `setData={setData}`. In `Read.jsx`, destructure `setData` in parameters. Track the update phase with `useEffect`, `componentDidMount`, and `[data]` for dependencies, which will send the data whenever it changes. Add the function `componentDidMount`, if there is data, use `setData` to send the results to `WebClient`.
29. In `WebClient.jsx`, add an `output` tag with `<dl>{data.map(toDetails)}</dl>`. Create the callback function `toDetails` to render each product with `key`, `Fragment`, `dt`, `dd`, and `img`.
30. View the Web Client page. After fixing any errors, observe that products are rendered when they match the form values.
31. Use `debugger` breakpoints to observe how information flows between components and custom hooks.
32. In the `Home` component, add a `p` tag that explains how use the Prisma web client in React to read data that matches user input.
33. View the website pages and make sure they run without errors.

## More Information

- React components can accept attributes. Example: `<MyComponent myAtrribute="myValue" />`
- React components can access them through the `props` object. Example: `function MyComponent(props) { ... }`
- The `props` object can be destructured in-line. Example: `function MyComponent({ myAttribute1, myAttribute2 })`
- After inserting the `password` into `connectionString`, it should be the same as `DATABASE_URL` in `.env`.
- A Boolean variable can be used to name a condition. Example: `const isPrice = form.elements.price.value` says that if a price was provided, `isPrice` will be true.
- To run code if a variable is not undefined, an `if` statement can be used. Example: `if (isPrice) { //RUN THIS CODE IF isPrice IS TRUE }`
- For help with `prisma` methods, try using `PrismaClient` in `script.js` for Intellisense popups and autocompletions.
- Property shorthand syntax can be used when an object property matches a variable. Example: Instead of `{ where: where }` the shorthand is `{ where }`.
- The `fieldset` tag groups inputs together and labels them with the `legend` tag.
- The database password should not be anywhere in the website code because all website code can be viewed publicly.

## Usage Tips

- When using React, external files should be imported into variables.
- When using NodeJs, external files can be referenced by their path.
- In the terminal, run `npm init` in the folder you want to initialize NPM.
- In `package.json`, `type: "module"` allows the use of `import` statements in JavaScript.
- The `dotenv` package is used by Prisma to access values in `.env`.
- The `Fragment` component is the same as empty brackets, except that it can accept a `key`.
- The empty tag can group adjacent elements together without adding a parent element.
- A `key` is required when using `map` to create an array of elements.
- Keys should be unique. Example: `const key = index + item.name;`
- The details list is made with the `dl` tag. The `dt` tag represents the title. The `dd` tag represesents the description.
- The file `.env` is used to store confidential information.
- The `.env` is usually listed in `.gitignore`, which means the confidential information will not be copied to the repository.
- From the browser, the Prisma web client cannot access `.env`, which is only accessible in NodeJs.

## Hints

- Prisma is one of the many ways to connect to a database, but it can connect to different types of databases.
- `useEffect` callbacks such as `componentDidUpdate` are not allowed to be `async` functions. `async` functions return a Promise. `useEffect` callback functions are only allowed to return cleanup functions like `componentWillUmount`.
- A form can be cleared with the `reset` method. Example: `form.reset();`
