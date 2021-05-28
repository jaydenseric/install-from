# install-from changelog

## Next

### Major

- Updated Node.js support to `^12.20 || >= 14.13`.
- Updated dev dependencies, some of which require newer Node.js versions than were previously supported.
- The API is now ESM in `.mjs` files instead of CJS in `.js` files, [accessible via `import` but not `require`](https://nodejs.org/dist/latest/docs/api/esm.html#esm_require).
- The function `installFrom` is now a default export.
- The tests are now ESM in `.mjs` files instead of CJS in a `.js` file.
- Added a package `exports` field.

### Patch

- Updated GitHub Actions CI config:
  - Also run on pull request.
  - Run tests with Node.js v12, v14, v16.
  - Updated `actions/checkout` to v2.
  - Updated `actions/setup-node` to v2.
  - Use the simpler [`npm install-test`](https://docs.npmjs.com/cli/v7/commands/npm-install-test) command.
  - Don’t specify the `CI` environment variable as it’s set by default.
- Stop using [`hard-rejection`](https://npm.im/hard-rejection) to detect unhandled `Promise` rejections in tests, as Node.js v15+ does this natively.
- Simplified JSDoc related package scripts now that [`jsdoc-md`](https://npm.im/jsdoc-md) v10+ automatically generates a Prettier formatted readme.
- Added a package `test:jsdoc` script that checks the readme API docs are up to date with the source JSDoc.
- Improved the package `test:prettier` script.
- Configured Prettier option `semi` to the default, `true`.
- Simplified the ESLint config.
- Updated the package `keywords` field.
- More specific package `bin` field.
- Updated CLI module file structure.
- Removed `npm-debug.log` from the `.gitignore` file as npm [v4.2.0](https://github.com/npm/npm/releases/tag/v4.2.0)+ doesn’t create it in the current working directory.
- Updated the EditorConfig.

## 2.0.1

### Patch

- Updated dev dependencies.
- Added a new [`hard-rejection`](https://npm.im/hard-rejection) dev dependency to ensure unhandled rejections in tests exit the process with an error.
- Use [`disposable-directory`](https://npm.im/disposable-directory) to create test fixtures on demand.
- Support installing scoped packages.

## 2.0.0

### Major

- Updated Node.js support from v8.5+ to v10+.
- Updated dev dependencies, some of which only support Node.js v10+.
- Use [`coverage-node`](https://npm.im/coverage-node) for test code coverage.

### Minor

- The second `installFrom` function `pathPackageTo` argument now defaults to `process.cwd()`.
- Setup [GitHub Sponsors funding](https://github.com/sponsors/jaydenseric):
  - Added `.github/funding.yml` to display a sponsor button in GitHub.
  - Added a `package.json` `funding` field to enable npm CLI funding features.

### Patch

- Removed the now redundant [`eslint-plugin-import-order-alphabetical`](https://npm.im/eslint-plugin-import-order-alphabetical) dev dependency.
- Stop using [`husky`](https://npm.im/husky) and [`lint-staged`](https://npm.im/lint-staged).
- Fixed the package `files` field.
- Use strict mode for scripts.
- The `install-from` CLI exits more gracefully when no arguments are used.
- Use destructuring for imports.
- Test Node.js v13 in CI.
- Refactored and improved tests.
- Use the Node.js `child_process` `execFile` API instead of `exec` in the `installFrom` function.
- Documented what the `installFrom` function returns.

## 1.0.0

Initial release.
