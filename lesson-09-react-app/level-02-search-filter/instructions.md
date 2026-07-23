# Search Filter

## Objective

Use controlled inputs to display real-time search results.

## Benefits

Controlled inputs can provide fast search results in React.

## Complete these tasks

1. NOTE: This level requires `prisma-template` and `client-template` from a previous level. Complete these tasks from scratch. Do not copy/paste unless the task permits it. Code for TW Elements can be copied/pasted.
2. Set up the Prisma web client: In your system's file explorer or file picker, copy your `prisma-template` folder from a previous level into this level folder. In the terminal, navigate to `prisma-template` and run `script.js`. It should work without errors after `node_modules` are installed. You may need to update it to work with foreign keys and join tables.
3. Set up the website: In your system's file explorer or file picker, copy your `client-template` folder from a previous level into this level folder. In this level folder, rename `client-template` to `search-filter`. Change the title of the website to `Real-time Search with Controlled Inputs`. In the terminal, navigate to the `search-filter` folder. Start the Vite server and open a React Debugger browser to the URL provided by Vite. View the website pages. They should work without errors after `node_modules` are installed.
4. In the `src/components/` folder, create `Search.jsx` that exports the `Search` component. Let it return a `form` tag with TWE inputs to get product ID, product name, and max price. Initialize the inputs with `useInputTWE`. This form will get search criteria without a form handler nor a submit button. In `WebClient.jsx`, render `Search` below the `DbPassword` component.
5. View the website pages. After fixing import errors, observe that the Web Client page renders the `Search` form.
6. `Search` needs to send search criteria to `WebClient`: In `WebClient.jsx`, add `const [search, setSearch] = useState();`. This will store the search criteria. Where `Search` is rendered, add the attribute/prop `setSearch={setSearch}`. This gives the setter to `Search`. In `Search.jsx`, destructure `setSearch` in parameters. This gives `Search` access to the setter.
7. View the website pages. After fixing import errors, observe that the Web Client page renders the `Search` form.
8. Create a custom hook so `Search` can gather search criteria real-time: In `src/hooks/`, create `useControlledInput.js` that exports the custom hook `useControlledInput`. Add `const [value, setValue] = useState();` to store the value of an input. Add `return [value, handleChange]`. Create the function `handleChange` that accepts an `event` object. Add `const input = event.target` to access the input element. Add `const inputValue = input.value` to get the value in the input. Use `setValue` to store the input value in the state variable.
9. Turn the `Search` inputs into controlled inputs: In `Search.jsx`, use `useControlledInput` to manage each input. Example: `const [id, handleId] = useControlledInput();`. Add handlers as an attribute/prop for each input. Example: `onChange={handleId}`.
10. View the website pages. After fixing import errors, use the `debugger` to observe that the variables from `useControlledInput` change whenever something is typed in the `Search` form.
11. Form the `search` object: In `Search.jsx`, track the update phase with `useEffect`, `componentDidUpdate`, and an array with each controlled input variable. Example: `[id, name, maxPrice]`. Add the function `componentDidUpdate` that forms a `data` object from the input values. Example: `const data = {id, name, maxPrice} `. Use `setSearch` to save the `data` object in the stateful variable.
12. View the website pages. After fixing import errors, use the `debugger` to observe the `data` object in `Search.jsx` and the `search` object in `WebClient.jsx`.
13. Create a custom hook to receive all products from the database: In `src/hooks/` folder, create `useProducts.js` that exports the custom hook `useProducts` that accepts a `prisma` object in parameters. Track the update phase with `useEffect`, `componentDidUpdate`, and `[prisma]` as the dependency list. This will call `componentDidUpdate` whenever the `prisma` object changes. Create the function `componentDidUpdate` that calls the function `handleProducts` only `if` there is a `prisma` object. Create the `async` function `handleProducts` that uses the `prisma` object to get all items from the `products` table. In `WebClient.jsx`, add `useProducts(prisma);`.
14. View the website pages. After fixing import errors, use the `debugger` to observe that `handleProducts` gets all products.
15. `WebClient` needs access to the products: In `useProducts.js`, add `const [products, setProducts] = useState();` to store product information. Add `return products;` to give components access to the products. In `handleProducts`, use `setProducts` to save the results in the state variable. In `WebClient.jsx`, store the return value of `useProducts` in a `products` variable.
16. View the website pages. After fixing import errors, use the `debugger` to observe that `WebClient` gets all products.
17. Create a custom hook to filter products according to the `search` criteria: In the `src/hooks/` folder, create `useSearch.js` that exports the custom hook `useSearch` which accepts the list of `products` and the `search` criteria as parameters. Add `const [results, setResults] = useState([]);` to store search results in an array. Add `return results;` to give components access to the search results. In `WebClient.jsx`, use `useSearch`, pass it `products` and `search`, then store the return value in `searchResults`. In the `output` tag, render `<dl>{searchResults.map(toDetails)}</dl>`.
18. View the website pages. After fixing import errors and entering the database password, use the `debugger` to observe that `products` and `search` criteria are receive in `useSearch.js`, and that `WebClient` renders empty search results.
19. Update `useSearch` to filter the results: In `useSearch.js`, track the update phase with `useEffect`, `componentDidUpdate`, and `[products, search]`, which runs `componentDidUpdate` whenever the products list or search criteria change.
20. Create the function `componentDidUpdate`, then add an `if` statement that checks for `products`. In the code block for the `if` statment, add `const searchResults = products.filter(toMatch);`. Arrays come with the `filter` method that takes a callback function. Use `setResults` to save `searchResults` in to the state variable.
21. Create the function `toMatch` that takes an `item` as a parameter. It should return `true` if the `item` matches search criteria, otherwise return false. Add `return true;`.
22. View the website pages. After fixing import errors, use the `debugger` to observe that `useSearch` returns all products when `search` criteria is not provided, and that `WebClient` renders all products.
23. In `toMatch`, check if the price meets the search criteria: Add a boolean variable `isLowerPrice` that checks if the item price is less than or equal to the search price. Example: `Number(item.price) <= Number(search.maxPrice);`. That converts the strings into numbers and compares their values. Then add an `if` condition that returns `false` if a max price was specified and the item price is not lower. Example: `if (search.maxPrice && !isLowerPrice) return false;`.
24. View the website pages. After fixing logic errors, observe that products are rendered whose price is less than the max price, and all products are rendered if no max price is specified.
25. In `toMatch`, add a boolean variable and an `if` condition to check the product name. Example: `const includesName = item.name.includes(search.name);`
26. View the website pages. After fixing logic errors, observe that products are rendered whose name includes the search name.
27. In `toMatch`, add a boolean variable and an `if` condition to check the product ID. Example: `if (search.id && !matchesId) return false;`
28. View the Web Client page. After fixing any errors, observe that a product is rendered when its ID matches the search ID.
29. In the `Home` component, add a `p` tag that explains how to use controlled inputs and a search filter to render real-time search results.
30. View the website pages and make sure they run without errors.

## More Information

- Arrays come with the `filter` methods. It takes a callback function that should return true when an item matches requirements.
- The Boolean operator for AND is `&&` which returns true when 2 conditions are true. Example: `search.name && IncludesName`
- The Boolean operator for NOT is `!` which returns the opposite of a condtion. Example: `!isLowerPrice`
- Controlled inputs do not require the `submit` event to view their values.
- Strings come with the `includes` method that returns `true` if the string contains a substring. Example: `const isGreeting = myString.includes("hello");`
- React components can accept attributes. Example: `<MyComponent myAtrribute="myValue" />`
- React components can access them through the `props` object. Example: `function MyComponent(props) { ... }`
- The `props` object can be destructured in-line. Example: `function MyComponent({ myAttribute1, myAttribute2 })`
- To run code if a variable has a value, an `if` statement can be used. Example: `if (productName) { //RUN THIS CODE IF productName HAS A VALUE }`
- The `fieldset` tag groups inputs together and labels them with the `legend` tag.

## Usage Tips

- Strings come with the method `toLoweCase` that's useful for ignoring uppercase letters. Example: `const lowerCaseString = myString.toLowerCase();`
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
