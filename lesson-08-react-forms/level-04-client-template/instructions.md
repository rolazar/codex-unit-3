# Client Template

## Objective

Create templates for the Prisma client and the web client in React.

## Benefits

These templates will speed up development of websites that use the Prisma web client.

## Complete these tasks

1. NOTE: This level requires `spa-template` from a previous level. Complete these tasks from scratch. Do not copy/paste unless the task permits it.
2. In the `prisma-template` folder of this level folder, set up the Prisma web client: In the VS Code terminal, navigate to the `prisma-template` folder. Use `npm` to initialize a project, and set the `type` to `module`. Install these packages - `prisma@6`, `dotenv`, and `prisma-json-schema-generator`.
3. Initialize Prisma in the terminal: `npx prisma init`. In `schema.prisma`, change the `provider` for `generator client` to `prisma-client-js`. Under the `generator client` section, add the `generator jsonSchema` section. Set the `provider` to `"prisma-json-schema-generator"` and set `output` to `".."`.
4. In `.env`, replace the string for `DATABASE_URL` with the `Connection string` from Supabase `Session pooler`. In the connection string, replace `[YOUR-PASSWORD]` with the database password you created (or generated).
5. Synchronize Prisma with your database: `npx prisma db pull`. Generate a client to connect to your database: `npx prisma generate`. Information about tables will be added to `prisma/schema.prisma`.
6. Make sure `PrismaClient` can connect to your database: In `script.js` import `PrismaClient` from a relative path in the `generated` folder. Create a `new PrismaClient()`. Use it to create, read, update, and delete items from the `products` table. `console.log` the results. These will serve as examples that remind you how to use `PrismaClient`.
7. Make sure the Prisma web client can connect to your database: In `script.js` import `createWebClient` from `web-client.js`. `await` for the web client to be created. Give the client `json-schema.json`. Use it to get all items from the `products` table. `console.log` the results. This will serve as an example that reminds you how to use the Prisma web client.
8. Run `script.js` and make sure it works without errors.
9. Set up the website: In your system's file explorer or file picker, copy your `spa-template` folder from a previous level into this level folder. In this level folder, rename `spa-template` to `client-template`. The `client-template` folder should be next to the `prisma-template` folder. Change the title of the website to `Prisma Web Client and React Templates`. In the terminal, navigate to the `client-template` folder. Start the Vite server and open a React Debugger browser to the URL provided by Vite.
10. View the website pages and make sure they run without errors.
11. Convert `ApiKey` to `WebClient`: In the `src/pages/` folder, rename `ApiKey.jsx` to `WebClient.jsx`, rename the `ApiKey` component to `WebClient`. In `App.jsx`, replace `ApiKey` with `WebClient`. Replace the `/apikey` path with `/webclient`. In `Navbar.jsx`, replace the `/apikey` path with `/webclient`, replace the `API Key` link with `Web Client`.
12. View the website pages. After fixing renaming or import errors, observe that the pages render without errors.
13. Refactor and repurpose the form: In the `src/components/` folder, create `DbPassword.jsx` that exports the `DbPassword` component. In `WebClient.jsx`, move the `form`, `output` tag, and hooks to `DbPassword`. In `DbPassword`, use an empty tag to group the `form` and `output` tags together, replace all occurences of `apiKey` with `password`, and replace the `API Key` label with `Database Password`. This converts it to a component that gets database passwords instead of API keys.
14. In `WebClient.jsx`, render `DbPassword` where the `form` used to be.
15. View the website pages. After fixing renaming and import errors, observe that the pages render without errors.
16. Create a custom hook that provides the Prisma web client: In the `src/hooks/` folder, create the file `usePrisma.js` that exports the custom hook `usePrisma` that accepts the `password` parameter. It will return a Prisma web client when a database password is provided. In `usePrisma`, add `const [prisma, setPrisma] = useState();`. This will store the Prisma web client. Add `useEffect(componentDidUpdate, [password])`. This will create the Prisma web client when the password is provided. Add `return prisma;` so components can use the Prisma web client.
17. At the top of `usePrisma.js`, import `createWebClient` from a relative path in the `prisma-template` folder, and import `json-schem.json` into the `schema` variable.
18. After the `return` statement, create the function `componentDidUpdate` that calls the function `handlePrisma`. Under `componentDidUpdate`, add the `async` function `handlePrisma`. In `handlePrisma`, add an `if` condition to run code only when a `password` is provided. In the `if` code block, use a string template to insert the `password` into the connection string, save the result in `connectionString`, create the client with `const prisma = await createWebClient({datasourceUrl: connectionString, jsonSchema: schema});`, then add `setPrisma(prisma);`. This will save the Prisma web client in the stateful variable.
19. In the `WebClient` component, add `const [password, setPassword] = useState();`. This will store the password. Add `const prisma = usePrisma(password);`. This will use the password.
20. Close the browser to reset session storage. Then open the browser and view the Web Client page. After fixing import errors, observe that the webite renders without errors.
21. Let `DbPassword` give `WebClient` the password: In `WebClient.jsx` where `DbPassword` is rendered, add the attribute/prop `setPassword={setPassword}`. In `DbPassword.jsx`, add the parameter `{ setPassword }` to destructure the props object. When `DbPassword` uses `setPassword`, the `WebClient` component will get the `password`.
22. In the `DbPassword` component, track the update phase with `useEffect`, `componentDidUpdate`, and `[password]` for dependencies. This will call `componentDidUpdate` whenever `password` changes. Create the function `componentDidUpdate` that uses `setPassword` to give `WebClient` the password.
23. In `WebClient.jsx`, add `const [data, setData] = useState([])`. In the `return`, add and `output` tag with the content `<dl>{data.map(toDetails)}</dl>`. Create the callback function `toDetails` to render a data `item` with `key`, `Fragment`, `dt` and `dd`.
24. View the website. After fixing any errors, observe that the Web Client page renders.
25. Add `debugger` breakpoints to `WebClient`, `usePrisma`, `DbPassword`, and `componentDidUpdate`. Observe how `prisma` and `password` change, and how information flows between components and custom hooks.
26. In the `Home` component, add a `p` tag that explains how to create templates for the Prisma Client in NodeJs and for the Prisma web client in React that separates logic from rendering.
27. View the website pages and make sure they run without errors.
28. Copy the `prisma-template` and `client-template` folders to a location that's easier to access for creating new projects. In the copied folders, do not include the `node_modules` folder nor any lock files like `pnpm-lock.yaml` or `package-lock.json`.

## More Information

- React components can accept attributes. Example: `<MyComponent message="Hello World!" myAttribute={myVariable} />`
- React components can access them through the `props` object. Example: `function MyComponent(props) { ... }`
- The `props` object can be destructured in-line. Example: `function MyComponent({ message, myAttribute })`
- After inserting the `password` into `connectionString`, it should be the same as `DATABASE_URL` in `.env`.
- To run code if a variable is not undefined, an `if` statement can be used. Example: `if (productName) { //RUN THIS CODE IF productName HAS A VALUE }`
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
