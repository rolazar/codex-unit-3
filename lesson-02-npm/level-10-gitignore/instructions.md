# Gitignore

## Objective

Learn about `.gitignore` and its role in source control.

## Benefits

It is important to ignore certain files when it comes to source control.

## Complete these tasks

1. In a VS Code terminal, navigate to this level folder.
2. Use `npm` to initialize a project.
3. Use `npm` to install a package from the NPMJS website.
4. View the Source Control Panel.
5. Observe that many downloaded or automatically generated files from `node_modules` can be tracked.
6. In the VS Code file list, select this level folder.
7. Create the file `.gitignore`
8. Edit `.gitignore` and add `node_modules`
9. View the Source Control Panel again.
10. Observe that files from `node_modules` will not be tracked by source control.
11. In `script.js`, use `console.log` to display a message.
12. Let the message explain `.gitignore`
13. Use `node` to run `script.js`

## More Information

- `.gitignore` lists files and folders that should not be included in source control.
- Ignored files are usually automatically generated or downloaded, so there is no need to track them with source control.
- [Gitignore Reference](https://git-scm.com/docs/gitignore)

## Usage Tips

- Manually type in `.gitignore` the files and folders to ignore.

## Hints

- The `node_modules` folder is usually listed in `.gitignore`.
