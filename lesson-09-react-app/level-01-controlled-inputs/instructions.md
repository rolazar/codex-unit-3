# Controlled Inputs

## Objective

Track input values real-time without requiring a submit button to be pressed.

## Benefits

Sometimes its useful to get the input value without a submit button.

## Complete these tasks

1. NOTE: This level requires `spa-template` from a previous level. Complete these tasks from scratch. Do not copy/paste unless the task permits it.
2. Set up the website: In your system's file explorer or file picker, copy your `spa-template` folder from a previous level into this level folder. In this level folder, rename `spa-template` to `controlled-inputs`. Change the title of the website to `Control Inputs with React`. In the terminal, navigate to the `controlled-inputs` folder. Start the Vite server and open a React Debugger browser to the URL provided by Vite. View the website pages. It should work without errors after `node_modules` are installed.
3. In the `src/components/` folder, create `Search.jsx` that exports the `Search` component. It will simulate a search form.
4. Let `Search` return a `form` that uses a TWE input to get a product `name`. This will simulate searching for products by and price. Rename attributes appropriately. Do not include a submit button. Use the custom hook `useInputTWE` to initialize the inputs. Render `Search` in the `Home` page.
5. View the Home page. After fixing import errors, observe that the Home page renders.
6. In the `src/hooks/` folder, create `useControlledInput.js` that exports the `useControlledInput` custom hook.
7. In `useControlledInput`, add `const [value, setValue] = useState()`. This will store the value of an input. Add `return [value, handleChange]` to give components access to the `value` and the input handler.
8. After the `return` statement, add the function `handleChange` that accepts the `event` object. Add a `debugger` breakpoint. Differences in the `event` object will be observed later.
9. In `Search.jsx`, use `useControlledInput` and destructure its items into `name` and `handleName`. This will simulate tracking the product name in real-time.
10. In the `input` tag for product name, add the attribute `onChange={handleName}`. This will call the handler whenever the input value changes.
11. View the Home page. After fixing import errors, observe that the Home page renders.
12. Type a value into the input. This will trigger the `debugger` breakpoint in `handleChange`.
13. Inspect the `event` object and observe that it is different. Default behavior does not need to be prevented because it is handling a `change` event, not a `submit` event.
14. In `handleChange`, add `const input = event.target;` because the input is the target of the change event. Add `const newValue = input.value` to store the new value. Add `setValue( newValue )` to save the new value in the state variables.
15. View the Home page. With a `debugger`, observe how `newValue` changes whenever a letter is typed or deleted in the input.
16. Let `Search` give the `Home` page the `value`: In `Home.jsx`, add `const [data, setData] = useState([]);`. This will require the `value` to be sent in an array of `data` objects. Where `Search` is rendered, add the attribute/prop `setData={setData}`. This gives `Search` the ability to send `data` to `Home`.
17. In `Search.jsx`, destructure `setData` from the attribute/props. Track the update phase with `useEffect`, `componentDidUpdate`, and `[name]` for dependencies. This will be used to send data whenever `name` changes. Add the function `componentDidUpdate`. In `componentDidUpdate`, add `const data = { name };`. This creates a `data` object that stores the name with property shortcut syntax. Add `setData( [data] )` to send the `data` object in an array.
18. View the Home page. After fixing import errors, the Home page should render. Observe that
19. In `Home.jsx`, add an `output` tag with a `dl` tag in it. In the `dl` tag, render `data.map(toDetails)`.
20. After the `return` statement, but still within the `Home` function, add the function `toDetails` that takes in an `item` and `index`. Render each `item` with `key`, `Fragment`, `dt`, and `dd`. Let `dt` display `Product Name`. Let `dd` display the real-time name of `item`.
21. View the Web Client page. After fixing any errors, observe that the product name is rendered real-time as it is typed in the input without having to press submit.
22. Add `debugger` breakpoints to `Home`, `Search`, `useControlledInput`, and `handeChange`.
23. View the Home page. After fixing any errors, observe how these variables transfer information between components and custom hooks - `data`, `setData`, and `value`.
24. In the `Home` component, add a `p` tag that explains how use controlled inputs with a custom hook.
25. View the website and make sure it runs without errors.

## More Information

- `Home` expects `data` to be an array of objects.
- The `data` object should contain values from the `form`.
- React components can accept attributes. Example: `<MyComponent myAtrribute="myValue" />`
- React components can access them through the `props` object. Example: `function MyComponent(props) { ... }`
- The `props` object can be destructured in-line. Example: `function MyComponent({ myAttribute1, myAttribute2 })`
- Property shorthand syntax can be used when an object property matches a variable. Example: Instead of `{ where: where }` the shorthand is `{ where }`.
- The custom hook `useControlledInput` returns a value and a handler.
- The handler should be attached to an input. Example: `onChange={handleName}`.
- The value is updated real-time as it is typed in the input.
- The custom hook can be used multiple times. Example:

```javascript
const [name, handleName] = useControlledInput();
const [price, handlePrice] = useControlledInput();
const [src, handleSrc] = useControlledInput();
```

## Usage Tips

- The `useEffect` dependecy list should list the controlled inputs. Example: `[name, price, src]`
- The `Fragment` component is the same as empty brackets, except that it can accept a `key`.
- The empty tag can group adjacent elements together without adding a parent element.
- A `key` is required when using `map` to create an array of elements.
- Keys should be unique. Example: `const key = index + item.name;`
- The details list is made with the `dl` tag. The `dt` tag represents the title. The `dd` tag represesents the description.

## Hints

- A form can be cleared with the `reset` method. Example: `form.reset();`
