# 404 Page

## Objective

Present a 404 page for unknown navigation paths, then redirect to the home page.

## Benefits

When paths are mispelled or disabled for certain users, a 404 page, or path not found page can be presented.

## Complete these tasks

1. NOTE: This level requires `spa-template` from a previous level. Complete these tasks from scratch. Do not copy/paste unless the task permits it. Code for TW Elements can be copied/pasted.
2. Set up the website: In your system's file explorer or file picker, copy your `spa-template` folder from a previous level into this level folder. In this level folder, rename `spa-template` to `404-page`. Change the title of the website to `Redirect to the Home Page with a 404 Page`. In the terminal, navigate to the `404-page` folder. Start the Vite server and open a React Debugger browser to the URL provided by Vite. View the website pages. It should work without errors after `node_modules` are installed.
3. Create a 404 page: In the `src/pages/` folder, create `Page404.jsx` that exports the `Page404` component and returns a `main` tag.
4. In the `main` tag, add code for a TWE card that includes a picture. This will be used to present information about the 404 page.
5. Add a `Route` for `Page404`: In `App.jsx`, in the `Routes` tag, add a `Route` tag at bottom of the routes list. In that new `Route`, add the attributes/props `path="*"` and `element={<Page404 />}`. This renders `Page404` for any unspecified path.
6. View the website. After fixing import errors, navigate to an invalid page. Example: `http://localhost:5173/helloWorld`. After fixing `className` error, observe that `Page404` renders without errors, but the button ripple effect is missing.
7. Create a custom hook to initialize the TWE card: In the `src/hooks/` folder, create `useRippleTWE.js` that exports the `useRippleTWE` custom hook. In the TW Elements site, view the JavaScript code for the TWE card. Copy the imports to `useRippleTWE.js`. In `useRippleTWE`, track the mount phase with `useEffect`, `componentDidMount`, and `[]`. Create the callback function `componentDidMount` that runs the `initTWE` code for the TWE card. In `Page404.jsx`, use `useRippleTWE`.
8. View the website. After fixing import errors, navigate to an invalid page. Observe that `Page404` renders without errors and the button shows a ripple effect when clicked.
9. Edit `Page404` to look like a 404 page: In the `src/assets/` folder, place a picture file to represent the 404 page. In `Page404.jsx`, import the picture. Example: `import pic1 from "../assets/404_pic.jpg"`. In the `img` tag, set the `src`. Example: `src={pic1}`
10. Change the title and description to represent a 404 page. Change the button label. Example: `Navigate to Home Page`
11. Create a custom hook for button redirect: In `src/hooks/`, create the file `useRedirect.js` that exports the `useRedirect` custom hook. Add `import { useNavigate } from "react-router";`. This is a custom hook for navigating programmatically.
12. Let `useRedirect` accept the parameter `url`, which will be the URL to redirect to. Add `const navigateTo = useNavigate();`. This is the navigation function. Add `return handleRedirect;`. This gives components access to the handler function.
13. Create the `handleRedirect` function. Add `navigateTo(url);`, which will navigate to the specified `url`.
14. In `Page404.jsx`, add `const handleRedirect = useRedirect("/")`. In the `button` tag, add the attribute `onClick={handleRedirect}`
15. View the website. After fixing import errors, navigate to an invalid page. Observe that `Page404` navigates to the home page when the button is clicked.
16. Add automatic redirect after a few seconds: In `useRedirect.js`, add the parameter `milliseconds`, which will be the number of milliseconds to wait before automatically redirecting. Add `const [timerId, setTimerId] = useState();` to save a timer ID. Track the mount phase with `useEffect`, `componentDidMount`, and `[]`. Create the function `componentDidMount`.
17. Enable automatic redirect when `milliseconds` is specified: In `componentDidMount`, add `if (milliseconds) {}`. This will run the code block only if `milliseconds` are specified. In the code block, add `const id = setTimeout( handleRedirect, milliseconds );`. This will call `handleRedirect` after `milliseconds` have elapsed. Add `setTimerId( id );` to save the reference to the timer.
18. In `handleRedirect`, add `clearTimeout(timerId)`. This will cancel any redirect timers. If the redirect timer is not cancelled, the page will redirect twice when the redirect button is pressed.
19. In `Page404.jsx`, add `5000` milliseconds to `useRedirect`.
20. View the website. Navigate to an invalid page. Observe that `Page404` navigates to the home page automatically after 5 seconds.
21. Add `debugger` breakpoints to `Page404`, `useRedirect`, `componentDidMount`, and `handleRedirect`.
22. View the Home page. Navigate to an invalid page. After fixing import errors, observe how these variables transfer information between components and custom hooks - `url`, `milliseconds`, and `timerId`.
23. In the `Home` component, add a `p` tag that explains how create a 404 page that automatically redirects to a URL.
24. View the website and make sure it runs without errors.

## More Information

- `404` is the error code for page not found.
- JavaScript function names are not allowed to begin with a number.
- The asterisk `*` is often used as a wildcard character that represents all strings.
- Even though `path="*"` represents all paths, the `element` only gets rendered if the previous paths in the `Routes` list don't apply. So `path="*"` is a fallback.
- The function `setTimeout` calls a callback function after a specified number of milliseconds. Example: `setTimeout( myFunction, 1000);`
- The function `setTimeout` returns an ID reference for cancelling the timer. Example: `clearTimeout( id );`
- The
- A handler function could be attached to a button. Example: `onClick={handleClick}`.
- The `useNavigate` hook returns a function that can be used to navigate to a specific URL.

## Usage Tips

- Pictures are usually kept in the `assets` folder.
- In React, pictures must be imported to use them. Example: `import pic1 from "../assets/myPic.jpg";`. Note that curly braces are not used for importing pictures and other files that don't `export` a variable.
- State setters, like `setDidMount`, are not allowed to be called before a component's `return` statement.

## Hints

- 1000 milliseconds is 1 second, so 5000 milliseconds is 5 seconds.
