# install-from

[![npm version](https://badgen.net/npm/v/install-from)](https://npm.im/install-from) [![CI status](https://github.com/jaydenseric/install-from/workflows/CI/badge.svg)](https://github.com/jaydenseric/install-from/actions)

Reliably installs a local package into another, for testing.

It’s very similar to installing a published package; [`npm pack`](https://docs.npmjs.com/cli/pack) is used to generate a tarball that only includes published files, which are extracted into `node_modules` for a similar result to a regular [`npm install --no-save`](https://docs.npmjs.com/cli/install).

[`npm link` ](https://docs.npmjs.com/cli/link) is a notoriously unreliable way to locally test a package in another package, as it uses symlinks:

- It will not reveal if the [`package.json` `files` field](https://docs.npmjs.com/files/package.json#files) or [`.npmignore`](https://docs.npmjs.com/misc/developers#keeping-files-out-of-your-package) is correct, as [`npm link` ](https://docs.npmjs.com/cli/link) doesn’t use [`npm pack`](https://docs.npmjs.com/cli/pack) like [`npm publish` ](https://docs.npmjs.com/cli/publish) does.
- As the package being tested is not actually installed inside the `node_modules` of the package it’s being tested in, peer dependencies installed in the host package can’t be reached. For example, this makes it difficult to test a package that has a [`react`](https://npm.im/react) peer dependency inside a [Next.js](https://nextjs.org) project.
- How it works is not intuitive. It messes with the global `node_modules` and `bin` directories, and you have to remember to use `npm unlink` to tidy up, which inconveniently strips the dependency from your `package.json`.

## CLI

1. In a terminal, change to the directory of the package you want to test another package in.
2. Run `npx install-from /path/to/package`.

To test changes, run the command again.

## API

### Table of contents

- [function installFrom](#function-installfrom)

### function installFrom

Reliably installs a local package into another, for testing.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `pathPackageFrom` | string | Absolute or CWD relative filesystem path to the package to install from. |
| `pathPackageTo` | string? | Absolute or CWD relative filesystem path to the package to install to, defaulting to `process.cwd()`. |

**Returns:** Promise&lt;void> — Resolves once installation is complete.

#### Examples

_Install a package into another._

> ```js
> const { installFrom } = require('install-from');
>
> installFrom(
>   './packages/package-to-install-from',
>   './packages/package-to-install-to'
> )
>   .then(() => {
>     // …
>   })
>   .catch(() => {
>     // …
>   });
> ```
