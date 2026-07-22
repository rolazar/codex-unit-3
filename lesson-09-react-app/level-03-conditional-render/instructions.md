# Conditional Render

## Objective

Authenticate a user and conditionally hide or show React components.

## Benefits

There are times when components should be shown, and when they should be hidden.

## Complete these tasks

1. NOTE: This level requires `prisma-template` and `client-template` from a previous level. Complete these tasks from scratch. Do not copy/paste unless the task permits it. Code for TW Elements can be copied/pasted.
2. Set up the Prisma web client: In your system's file explorer or file picker, copy your `prisma-template` folder from a previous level into this level folder. In the terminal, navigate to `prisma-template` and run `script.js`. It should work without errors after `node_modules` are installed. You may need to update it to work with foreign keys and join tables.
3. Set up the website: In your system's file explorer or file picker, copy your `client-template` folder from a previous level into this level folder. In this level folder, rename `client-template` to `conditional-render`. Change the title of the website to `Conditionally Hide or Show React Components`. In the terminal, navigate to the `conditional-render` folder. Start the Vite server and open a React Debugger browser to the URL provided by Vite. View the website pages. They should work without errors after `node_modules` are installed.
4. In the `src/components/` folder, create `Login.jsx` that exports the `Login` component. Let it return a `form` tag with TWE inputs for an email, password, and a login/submit button. Initialize the inputs with `useInputTWE`.
5. In `WebClient.jsx`, render `Login` below the `DbPassword` component.
6. View the website pages. After fixing import errors, observe that the Web Client page renders the `Login` form.
7. `Login` needs to send login info to `WebClient`: In `WebClient.jsx`, add `const [login, setLogin] = useState();`. This will store the login info. Where `Login` is rendered, add the attribute/prop `setLogin={setLogin}`. This gives the setter to `Login`.
8. In `Login.jsx`, destructure `setLogin` in parameters. This gives `Login` access to the setter.
9. View the website pages. After fixing import errors, observe that the Web Client page renders the `Login` form.
10. Form the `login` object: In `Login.jsx`, in the `form` tag, add the attribute `onSubmit={handleSubmit}`. Below the `return` statement, add the function `handleSubmit` that accepts an `event` object and prevents default form behavior. Add `const form = event.target;`. Add a `data` object includes the email and password from `form.elements`. Add `setLogin` to send the `data` object to components.
11. View the website pages. After fixing any errors, use the `debugger` in `WebClient.jsx` to observe that the `login` object is received when the form is submitted.
12. Create a custom hook to authenticate the login: In the `src/hooks/` folder, create `useLogin.js` that exports the custom hook `useLogin` that accepts the `prisma` and `login` objects as parameters. Add `const [user, setUser] = useState();`. This will store user information. Add `return user;` to give components access to the user info.
13. In `WebClient.jsx`, use `useLogin`, pass it the `prisma` and `login` objects, and store the return value in `user`.
14. View the website pages. After fixing import errors, use the `debugger` in `useLogin.js` to observe that the `prisma` and `login` object are received when the login form is submitted and a valid database password is provided.
15. Process the login: In `useLogin.js`, track the update phase with `useEffect`, `componentDidUpdate`, and `[prisma, login]` dependencies. This will call `componentDidUpdate` whenever `prisma` or `login` change.
16. Create the function `componentDidUpdate` to call the function `handleLogin` if a `prisma` and `login` object are provided.
17. Create the `async` function `handleLogin` to use the `prisma` object to check the `users` table with `findFirst` and use a `where` object to match the `email` and `password`. Then save the result with `setUser`.
18. View the website pages. After fixing import errors, use the `debugger` to observe in `handleLogin` that a result is received when valid credentials are provided, and in `WebClient` the user info is received.
19. In `WebClient.jsx` above the `return`, add `let component = <Login setLogin={setLogin} />;`. This saves the login form in a variable that can change. Then add `if (user) component = <p>You are logged in.</p>;` This changes `component` to a message if a `user` object has been received.
20. In the `return` where `Login` is rendered, replace the whole component with `{component}`. This will display the `component` variable and whatever HTML it contains.
21. View the Web Client page. After fixing any errors, observe that the `Login` component renders when a user is not logged in, then the `Login` component disappears when a user is logged in.
22. Add `debugger` breakpoints to `WebClient`, `Login`, `handleSubmit` in `Login`, `useLogin`, and `handleLogin`. Observe how these variables transfer information between components and custom hooks - `login` and `component`.
23. In the `Home` component, add a `p` tag that explains how to authenticate a user conditionally render components in React.
24. View the website pages and make sure they run without errors.

## More Information

- To conditionally render components, first store them in a variable, and render that variable. Example: `let component = <MyComponent />`. Then change the value of the variable with a condition. `if (shouldHide) component = <></>;`
- To authenticate a user, use a `where` object to find their record in the database.
- Setter function can be passed between components to give them access to change variable in other components. Example: `<Login setLogin={setLogin} />`
- React components can accept attributes. Example: `<MyComponent myAtrribute="myValue" />`
- React components can access them through the `props` object. Example: `function MyComponent(props) { ... }`
- The `props` object can be destructured in-line. Example: `function MyComponent({ myAttribute1, myAttribute2 })`
- To run code if a variable has a value, an `if` statement can be used. Example: `if (productName) { //RUN THIS CODE IF productName HAS A VALUE }`

## Usage Tips

- The `fieldset` tag groups inputs together and labels them with the `legend` tag.
- The `Fragment` component is the same as empty brackets, except that it can accept a `key`.
- The empty tag can group adjacent elements together without adding a parent element.
- A `key` is required when using `map` to create an array of elements.
- Keys should be unique. Example: `const key = index + item.name;`
- The details list is made with the `dl` tag. The `dt` tag represents the title. The `dd` tag represesents the description.

## Hints

- In `WebClient`, the `data` object is not used. It can be deleted.
- Prisma is one of the many ways to connect to a database, but it can connect to different types of databases.
- `useEffect` callbacks such as `componentDidUpdate` are not allowed to be `async` functions. `async` functions return a Promise. `useEffect` callback functions are only allowed to return cleanup functions like `componentWillUmount`.
- A form can be cleared with the `reset` method. Example: `form.reset();`
