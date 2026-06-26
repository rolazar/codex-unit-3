# Frameworks

## Objective

Learn the main differences between a framework, a library, and a language.

## Benefits

Knowing the difference between a framework, a library, and a language will help you communcate more effectively as a programmer.

## Complete these tasks

1. In your system's folder explorer or file picker, copy your `react-template` folder into this level folder.
2. In this level folder, rename `react-template` to `react-framework`.
3. In the terminal, navigate to the `react-framework` folder.
4. Start the Vite server with `npm run dev`.
5. Open a web browser to the URL provided by Vite.
6. In `App.jsx`, let the `App` function return a `main` tag.
7. In the `main` tag, add an `h1` tag, a `p` tag, and 1 `img` tag.
8. Let the `h1` title be `Framework, Library, or Language`
9. Let the `p` tag describe the difference between a programming language, a library, and a framework.
10. In the level folder, move `illustration.png` to the `assets` folder.
11. Import `illustration.png` into a variable.
12. Let the image source be the variable for `illustration.png`.
13. View the page in the browser.
14. In `App.css`, use flexbox to arrange the images horizontally.
15. In `index.css`, add at least 2 styles to improve the website's layout and appearance.
16. View the page in the browser.

## More Information

- React is a framework because it calls your code. Your code doesn't call React.
- Modules like `node:os` and `node:path` are libraries because they contain code that you call.
- JavaScript, HTML, and CSS are languages they have their own syntax.
- [Software Framework vs Library](https://www.geeksforgeeks.org/software-engineering/software-framework-vs-library/)

## Usage Tips

- To import a picture into a React project, use `import`, a variable name, `from`, and the relative image path. Example: `import myPicture from "./assets/myPicture.jpg";`
- To insert a picture, use curly braces and the picture variable as the image `src`. Example: `<img src={myPicture} />`

## Hints

- If the `node_modules` folder isn't installed - In the terminal, navigate to the project folder, then run `npm install`. NPM packages for the project will be installed. An internet connection is required to download the packages.
