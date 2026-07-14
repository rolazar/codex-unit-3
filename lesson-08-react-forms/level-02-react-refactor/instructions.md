# React Refactor

## Objective

Refactor the Web Client page into separate components.

## Benefits

Separating large React components into smaller components helps keep the code readable and reusable.

## Complete these tasks

1. NOTE: This level requires `react-create` from a previous level.
2. Set up the Prisma web client: In the VS Code terminal, navigate to this level folder. Use `npm` to initialize a project, and set the `type` to `module`. Install these packages - `prisma@6`, `dotenv`, and `prisma-json-schema-generator`. Initialize Prisma in the terminal: `npx prisma init`. In `.schema.prisma`, change the `provider` for the `client` to `prisma-client-js`. Under the `client` generator, add the `jsonSchema` generator. In `.env`, replace the string for `DATABASE_URL` with the `Connection string` from Supabase `Session pooler`. In the connection string, replace `[YOUR-PASSWORD]` with the database password you created (or generated).
3. Synchronize Prisma with your database: `npx prisma db pull`. Generate a client to connect to your database: `npx prisma generate`. Information about tables will be added to `prisma/schema.prisma`. Make sure the Prisma web client can connect to your database: In `script.js` import `createWebClient` from `web-client.js`. `await` for the web client to be created. Give the client `json-schema.json`. Use it to get all items from the `products` table. `console.log` the results.
4. Run `script.js`. It should work without errors.
5. Set up the website: In your system's file explorer or file picker, copy your `react-create` folder from a previous level into this level folder. In this level folder, rename `react-create` to `react-refactor`. Change the title of the website to `Refactor the WebClient Component into Separate Components`. In the terminal, navigate to the `react-refactor` folder. Start the Vite server and open a React Debugger browser to the URL provided by Vite.
6. View the website pages and make sure they run without errors. When a valid password is provided, products should be rendered. When a new product is added, it should be rendered.
7. In the folder `src/components/`, create `DbPassword.jsx` that exports the `DbPassword` component.
8. In `WebClient.jsx`, there's a form that gets the database password from the user. Move that form into the `DbPassword` component as the `return` value. Then render `DbPassword` in `WebClient` where the form was.
9. View the Web Client page in the browser. There will be an error because `DbPassword` needs `handleSubmit`.
10. In `WebClient.jsx` move the `useSecret` code to `DbPassword`.
11. View the Web Client page in the browser. There will be an error because `WebClient` needs `password` from `DbPassword`.
12. In the `WebClient` component, add `const [password, setPassword] = useState();`. This will be used to get the password from `DbPassword`.
13. In `WebClient.jsx` where `DbPassword` is rendered, add the prop/attribute `setPassword={setPassword}`. This gives `DbPassword` access to the setter.
14. In `DbPassword.jsx`, the `DbPassword` component can accept attributes/props as parameters. Destructure the parameters with `{ setPassword }`.
15. In the `DbPassword` component, add `useEffect(componentDidUpdate, [password]);`. This will run code whenver `password` changes.
16. Under the `return` statments, add the function `componentDidUpdate`.
17. In `componentDidUpdate`, add `setPassword(password)`. This will update the password whenever it changes. In React, setter functions are not allowed to run before the `return` statement. Setters can run in a `useEffect` or event handler.
18. View the Web Client page and make sure it runs without errors. It should work as intended when entering a database password.
19. In the `src/components/` folder, create `Create.jsx` that exports the `Create` component.
20. In `WebClient.jsx`, there's a form that gets product information from the user. Move that form into the `Create` component as the `return` statement. Then render `Create` in `WebClient` where the form was.
21. View the Web Client page in the browser. There will be an error because `Create` needs the `handleCreate` function.
22. In `WebClient.jsx`, move `handleCreate` to `Create` below the `return` statement.
23. View the Web Client page in the browser. It should render without errors. Try adding a product with the form. There should be an error because `Create` needs `prisma`.
24. In the `WebClient` component where `Create` is rendered, add the attribute/prop `prisma={prisma}`. This will give `Create` access to the `prisma` web client.
25. In `Create.jsx`, the `Create` component can accept attributes/props as parameters. Destructure the parameters with `{ prisma }`. `Create` will have access to the web client through the `prisma` variable.
26. View the Web Client page in the browser. It should render without errors. Try adding a product with the form. It should add a product, but there will be an error because `Create` needs `setData`.
27. In the `WebClient` component where `Create` is rendered, add the attribute/prop `setData={setData}`. This will give `Create` access to the `setData` function.
28. In the `Create` component destructure `setData` in the parameters. `Create` will have access to the setter through the `setData` variable.
29. View the Web Client page in the browser. It should render and function without errors.
30. Add `debugger` breakpoints in `WebClient`, `Create`, and `DbPassword`. Observe as `setPassword`, `prisma`, and `setData` are passed from the parent component `WebClient` to the child components `DbPassword` and `Create`. You may need to disable `StrictMode` for a smoother experience.
31. In the `Home` component, add a `p` tag that explains how to separate larger components into smaller components, and how to pass values between parent and child components.
32. View the website pages and make sure they run without errors.

## More Information

- Components can receive attributes through the `props` object. Example: `function MyComponent(props)`
- The `props` object can be destructured in-line. Example: `function MyComponent({ myProp1, myProp2 })`
- React does not allow setter functions to run before `return` statments. Instead, setter functions can run within `useEffect` or event handlers.
- When refactoring code, make sure it has access to its dependencies - the variables and functions it depends on.
- The database password should not be anywhere in the website code because all website code can be viewed publicly.
- A form can be cleared with the `reset` method. Example: `form.reset();`
- The `Fragment` component is the same as empty tags, except that it can accept a `key`.
- The empty tag can group adjacent elements together without adding a parent element.
- A `key` is required when using `map` to create an array of elements.
- Keys should be unique. Example: `const key = index + item.name;`
- The file `.env` is used to store confidential information.
- From the browser, the Prisma web client cannot access `.env`, which is only accessible in NodeJs.

## Usage Tips

- The initial value of `data` should be an array because arrays have access to the `map` method.
- When using React, external files should be imported into variables.
- When using NodeJs, external files can be referenced by their path.
- `useEffect` callbacks such as `componentDidUpdate` are not allowed to be `async` functions. `async` functions return a Promise. `useEffect` are only only to return cleanup functions like `componentWillUmount`.
- Property shorthand syntax can be used when the an object property matches a variable. Example: Instead of `{ data: data }` the shorthand is `{ data }`.
- The `fieldset` tag groups inputs together and labels them with the `legend` tag.

## Hints

- Prisma is one of the many ways to connect to a database, but it can connect to different types of databases.
- By default, Prisma generates clients in TypeScript.
