# React Create

## Objective

Use the Prisma web client in React to create data.

## Benefits

Dynamically use React to perform CRUD operations on a database with an online form.

## Complete these tasks

1. NOTE: This level requires `react-client` from a previous level.
2. Set up the Prisma web client: In the VS Code terminal, navigate to this level folder. Use `npm` to initialize a project, and set the `type` to `module`. Install these packages - `prisma@6`, `dotenv`, and `prisma-json-schema-generator`. Initialize Prisma in the terminal: `npx prisma init`. In `.schema.prisma`, change the `provider` for the `client` to `prisma-client-js`. Under the `client` generator, add the `jsonSchema` generator. In `.env`, replace the string for `DATABASE_URL` with the `Connection string` from Supabase `Session pooler`. In the connection string, replace `[YOUR-PASSWORD]` with the database password you created (or generated).
3. Synchronize Prisma with your database: `npx prisma db pull`. Generate a client to connect to your database: `npx prisma generate`. Information about tables will be added to `prisma/schema.prisma`. Make sure the Prisma web client can connect to your database: In `script.js` import `createWebClient` from `web-client.js`. `await` for the web client to be created. Give the client `json-schema.json`. Use it to get all items from the `products` table. `console.log` the results.
4. Run `script.js`. It should work without errors.
5. Set up the website: In your system's file explorer or file picker, copy your `react-client` folder from a previous level into this level folder. In this level folder, rename `react-client` to `react-create`. Change the title of the website to `Use a React Form to Create Data`. In the terminal, navigate to the `react-create` folder. Start the Vite server and open a React Debugger browser to the URL provided by Vite.
6. View the website pages and make sure they run without errors. When a valid password is provided, products should be rendered.
7. Review the code in `WebClient.jsx`. Observe that `createWebClient` is imported from its relative path, `json-schema.json` is imported into the `schema` variable by its relative path, `handleData` passes the `datasourceUrl` and `jsonSchema` to the web client, the `results` are saved with `setData`, `useEffect` depends on the `password`, and `componentDidUpdate` calls `handleData` if there is a `password`.
8. In `WebClient`, add a new variable `const [prisma, setPrisma] = useState();`. This will store the Prisma web client so it can be reused.
9. In `handleData`, use `setPrisma` to save the Prisma web client.
10. In `WebClient`, before the `output` tag, add another `form` tag.
11. In the new `form` tag, add a `fieldset` tag. This groups related inputs together.
12. In the `fieldset` tag, add a `legend` tag with the content `Create Product Data`.
13. After the `legend` tag, add 3 TW-Elements inputs for a product `name`, `src`, and `price`. Give each input an appropriate `id` and properly match their `label` tags.
14. After the `fieldset` tag, add a TW Elements button that can `submit` the form.
15. View the website pages. They should run without errors, but the TWE inputs make not be rendering properly.
16. Initialize the TWE inputs: In the `src/hooks/` folder, add `useInputTWE.js` that exports the `useInputTWE` custom hook. Add the JavaScript code that TWE inputs need. Remeber to initialize in `componentDidMount`. Then use `useInputTWE` in `WebClient`.
17. View the website pages and make sure they run without errors.
18. In the new `form` tag, add the attribute `onSubmit={handleCreate}`.
19. After the `return` statement, create the function `handleCreate` that takes an `event` object and prevents default form behavior.
20. In the `handleCreate` function, `if` there is a `prisma` client, do the following: Add `const form = event.target;`. Create a `data` object with properties that match the `products` table - `name`, `src`, and `price`. Set the `value` of property with `form.elements`. Add `await prisma.products.create({ data });` to create the new item. Note that property shorthand syntax is used. Add `const results = await prisma.products.findMany();` to get the updated products list. Then use `setData` to save the `results`. To clear the user input, `reset` the `form`.
21. View the website pages and make sure they run without errors. When a product is added,
22. Add `debugger` breakpoints in `WebClient`, `componentDidUpdate`, `handleData`, and `handleCreate`. Watch `data` and `prisma` change values. You may need to disable `StrictMode` for a smoother experience.
23. In the `Home` component, add a `p` tag that explains how use the Prisma web client in React to create data from user input.
24. View the website pages and make sure they run without errors.

## More Information

- Property shorthand syntax can be used when the an object property matches a variable. Example: Instead of `{ data: data }` the shorthand is `{ data }`.
- The `fieldset` tag groups inputs together and labels them with the `legend` tag.
- The database password should not be anywhere in the website code because all website code can be viewed publicly.
- A form can be cleared with the `reset` method. Example: `form.reset();`
- The `Fragment` component is the same as empty brackets, except that it can accept a `key`.
- The empty tag can group adjacent elements together without adding a parent element.
- A `key` is required when using `map` to create an array of elements.
- Keys should be unique. Example: `const key = index + item.name;`
- The details list is made with the `dl` tag. The `dt` tag represents the title. The `dd` tag represesents the description.
- The file `.env` is used to store confidential information.
- The `.env` is usually listed in `.gitignore`, which means the confidential information will not be copied to the repository.
- From the browser, the Prisma web client cannot access `.env`, which is only accessible in NodeJs.

## Usage Tips

- When using React, external files should be imported into variables.
- When using NodeJs, external files can be referenced by their path.
- `useEffect` callbacks such as `componentDidUpdate` are not allowed to be `async` functions. `async` functions return a Promise. `useEffect` are only only to return cleanup functions like `componentWillUmount`.
- In the terminal, run `npm init` in the folder you want to initialize NPM.
- In `package.json`, `type: "module"` allows the use of `import` statements in JavaScript.
- The `dotenv` package is used by Prisma to access values in `.env`.
- The `npx` command runs NPM packages directly in the terminal.
- [Supabase website](https://supabase.com/)
- [Pooler session mode](https://supabase.com/docs/guides/database/connecting-to-postgres#pooler-session-mode)
- [Prisma website](https://www.prisma.io/)

## Hints

- Prisma is one of the many ways to connect to a database, but it can connect to different types of databases.
- Supabase has it's own package, but it only connects to Supabase databases.
- By default, Prisma generates clients in TypeScript.
