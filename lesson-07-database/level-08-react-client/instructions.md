# React Database

## Objective

Connect to a Supabase database with the Prisma web client in React.

## Benefits

Discover the difference between using the Prisma web client in NodeJs and React.

## Complete these tasks

1. In the `codex-unit-3` database in `https://supabase.com/`, create a new table called `products`.
2. Add a `name` column of type `text`. Add a `src` column of type `text`. Add a `price` column of type `numeric`. Default settings are ok. This will store a list of products. Click on `Save`.
3. Click on the `Connect` button at the top. Select `Direct` → select `Session pooler` → take note of the `Connection string`.
4. Set up the Prisma web client: In the VS Code terminal, navigate to this level folder. Use `npm` to initialize a project, and set the `type` to `module`. Install these packages - `prisma@6`, `dotenv`, and `prisma-json-schema-generator`. Initialize Prisma in the terminal: `npx prisma init`. In `.schema.prisma`, change the `provider` for the `client` to `prisma-client-js`. Under the `client` generator, add the `jsonSchema` generator. In `.env`, replace the string for `DATABASE_URL` with the `Connection string` that you noted from Supabase `Session pooler`. In the connection string, replace `[YOUR-PASSWORD]` with the database password you created (or generated).
5. Synchronize Prisma with your database: `npx prisma db pull`. Generate a client to connect to your database: `npx prisma generate`. Information about tables will be added to `prisma/schema.prisma`. Make sure the Prisma web client can connect to your database: In `script.js` import `createWebClient` from `web-client.js`. `await` for the web client to be created. Give the client `json-schema.json`. Use it to add at least 3 items to the `products` table. `console.log` each of the results.
6. Run `script.js`. It should work without errors.
7. Set up the website: In your system's file explorer or file picker, copy your `spa-template` folder into this level folder. The template should render a `Navbar` with TW Elements, gets an API key from the user, and uses the `useSecret` custom hook. In this level folder, rename `spa-template` to `react-client`. Change the title of the website to `Using Prisma Web Client in React`. In the terminal, navigate to the `react-client` folder. Start the Vite server and open a React Debugger browser to the URL provided by Vite.
8. View the website pages and make sure they run without errors.
9. Edit the component that gets an API key from the user. Change it to `WebClient`. Change the label to `Database Password`. Change the `name` attribute to `password`. Change `useSecret` to destructure the secret into `password` and use the `name` attribute `password`. Update `handleSubmit` Update `BrowserRouter` to render `WebClient` with `/webclient` as the path. Update the `Navbar` to link to `Web Client`.
10. View the website pages and make sure they run without errors.
11. In `WebClient`, add `useState([]);` and destructure its items into `data` and `setData`.
12. In the `output` tag, replace its contents with `<dl>{data.map(toDetails)}</dl>`. That will render a details list.
13. Outside and under the `WebClient` component, create the function `toDetails` that accepts an `item` and an `index`. This will return an element that renders an item from the `products` table.
14. In `toDetails`, add a `key` variable that stores a unique value. Add `const details = <Fragment key={key}></Fragment>`. The `Fragment` component is an empty tag that can have a key. Regular empty tags cannot have keys.
15. In the `Fragment` tag, add `<dt></dt>` and `<dd></dd>`. In the `dt` tag, render the product name. In the `dd` tag, render the product image and price. Then `return` the `details` object.
16. View the website pages and make sure they run without errors.
17. At the top of `WebClient.jsx`, import `createWebClient` from its relative path.
18. Also import `schema` from the relative path of `json-schema.json`. This makes the file accessible with the `schema` variable. When using React, external files should be imported into variables.
19. In the `WebClient` component and under the `return`, create an `async` function called `handleData`.
20. Add `const prisma = await createWebClient({})`.
21. In the options object, add `jsonSchema: schema`.
22. In the options object, add the property `datasourceUrl`. Let the `datasourceUrl` be the connection string with the `password` the user provided. The connection string must be provided because the browser doesn't have access to `.env`.
23. Add `const results = await prisma.products.findMany();`.
24. Save the `results` in the stateful variable with `setData`.
25. View the website pages and make sure they run without errors.
26. Update `WebClient` to track the `update` phase: Add `useEffect`, `componentDidUpdate`, and `[password]` for the dependency list. This will call `componentDidUpdate` only when `password` changes.
27. In the `componentDidUpdate` function, `if` there is a `password` call the `handleData` function.
28. View the website pages and make sure they run without errors. When a valid password is provided, products should be rendered.
29. Add `debugger` breakpoints in `WebClient`, `handleData`, and `componentDidUpdate`. Watch `data` and `password` change values. You may need to disable `StrictMode` for a smoother experience.
30. In the `Home` component, add a `p` tag that explains how use the Prisma web client in React to render data on a page.
31. View the website pages and make sure they run without errors.

## More Information

- The database password should not be anywhere in the website code because all website code can be viewed publicly.
- The `Fragment` component is the same as empty brackets, except that it can accept a `key`.
- The empty tag can group adjacent elements together without adding a parent element.
- A `key` is required when using `map` to create an array of elements.
- Keys should be unique. Example: `const key = index + item.name;`
- The details list is made with the `dl` tag. The `dt` tag represents the title. The `dd` tag represesents the description.
- The file `.env` is used to store confidential information.
- The `.env` is usually listed in `.gitignore`, which means the confidential information will not be copied to the repository.
- From the browser, the Prisma web client cannot access `.env`, which is only accessible in NodeJs.
- The `PrismaClient` is accessible from the `generated` folder. Use relative path when importing.
- Configuration for the `jsonSchema` generator.

```js
generator jsonSchema {
  provider = "prisma-json-schema-generator"
  output   = ".."
}
```

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
