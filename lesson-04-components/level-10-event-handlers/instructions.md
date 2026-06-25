# Event Handlers

## Objective

Handle the click event with React.

## Benefits

Handling events with React components makes them more dynamic.

## Complete these tasks

1. In your system's folder explorer or file picker, copy your `react-template` folder into this level folder. The template should render `Header`, `Main`, and `Footer` components.
2. In this level folder, rename `react-template` to `react-events`.
3. In the terminal, navigate to the `react-events` folder.
4. Start the Vite server and open the React Debugger browser. You may need to install `node_modules`.
5. In the `src/components/` folder, view the `Main` component.
6. Add a `button` tag that says `Click event`.
7. Outside and underneath the `Main` function, create a function called `handleClick`.
8. Let `handleClick` accept an `event` object.
9. Let `handleClick` prevent default behavior.
10. In `handleClick`, add `debugger` and use `console.log` to display a message.
11. Let the message explain how to use the click event handler in React.
12. On the `button` tag, add the attribute `onClick={handleClick}`.
13. View the page in the browser.
14. Click on the button. The debugger should activate when the button is clicked.
15. View the message in the console.

## More Information

- In React, event handlers can be directly attached to HTML elements.
- Events are attached to elements with an attribute that starts with `on`.
- The click event can be assigned with the `onClick` attribute of an HTML tag.
- Handler functions can be assigned to event attributes. Example: `onClick={handleClick}`

## Usage Tips

- Use the `onClick` attibute and an event handler to handle click events. Example: `<button onClick={handleClick}>`
- To edit code while debugging, close the read-only file, edit the code in the original file, save the changes, then refresh the debugger or browser.
- Use `event.preventDefault()` to prevent default element behavior.
- HTML attributes go in the opening tags or self closing tags. Example:

```jsx
<p id="message">Hello World!</p>
<img src="picture.jpg">
```

## Hints

- `npm run dev` starts a Vite server.
- Make sure to install the `node_modules` folder.
- Use curly braces `{}` to insert variables into HTML.
- Event handlers are usually functions that start with `handle` and accept an `event` object.
