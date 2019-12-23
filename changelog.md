# install-from changelog

## Next

### Major

- Updated Node.js support from v8.5+ to v10+.
- Updated dev dependencies, some of which only support Node.js v10+.

### Minor

- Setup [GitHub Sponsors funding](https://github.com/sponsors/jaydenseric):
  - Added `.github/funding.yml` to display a sponsor button in GitHub.
  - Added a `package.json` `funding` field to enable npm CLI funding features.

### Patch

- Removed the now redundant [`eslint-plugin-import-order-alphabetical`](https://npm.im/eslint-plugin-import-order-alphabetical) dev dependency.
- Stop using [`husky`](https://npm.im/husky) and [`lint-staged`](https://npm.im/lint-staged).
- Fixed the package `files` field.
- Use strict mode for scripts.
- Test Node.js v13 in CI.
- Rename a variable in tests.

## 1.0.0

Initial release.
