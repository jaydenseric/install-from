# install-from changelog

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
