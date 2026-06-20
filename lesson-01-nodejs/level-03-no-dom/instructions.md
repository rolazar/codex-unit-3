# No DOM

## Objective

Discover the difference between NodeJS and JavaScript.

## Benefits

Knowing the difference between NodeJS and JavaScript will help you understand what NodeJS can and cannot do.

## Complete these tasks

1. In `script.js`, store a value with `localStorage`.
2. Use `document.querySelector` to select a `p` tag.
3. Run the script.

## More Information

- `localStorage` and `document` are objects that comes from web browsers.
- Because the script is not attached to an HTML file, it has no access to the DOM.
- [DOM reference](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model#what_is_a_dom_tree)

## Usage Tips

- Use `localStorage` to store values in the browser and retrieve them.
- `setItem` is a method that accepts a key and value. Example: `localStorage.setItem("myCharacter", "Cookie Monster");`
- `querySelector` is a method that accepts a CSS selector and returns an object. Example: `const listTag = document.querySelector("ul")`
- [Documentation for localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage#examples)

## Hints

- A script may not run if it references undefined objects.
