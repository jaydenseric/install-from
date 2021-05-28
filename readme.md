# install-from

[![npm version](https://badgen.net/npm/v/install-from)](https://npm.im/install-from) [![CI status](https://github.com/jaydenseric/install-from/workflows/CI/badge.svg)](https://github.com/jaydenseric/install-from/actions)

Reliably installs a local package into another, for testing.

It’s very similar to installing a published package; [`npm pack`](https://docs.npmjs.com/cli/v7/commands/npm-pack) is used to generate a tarball that only includes published files, which are extracted into `node_modules` for a similar result to a regular [`npm install --no-save`](https://docs.npmjs.com/cli/v7/commands/npm-install).

[`npm link`](https://docs.npmjs.com/cli/v7/commands/npm-link) is a notoriously unreliable way to locally test a package in another package, as it uses symlinks:

- It will not reveal if the [`package.json` `files` field](https://docs.npmjs.com/files/package.json#files) or [`.npmignore`](https://docs.npmjs.com/misc/developers#keeping-files-out-of-your-package) is correct, as [`npm link`](https://docs.npmjs.com/cli/v7/commands/npm-link) doesn’t use [`npm pack`](https://docs.npmjs.com/cli/v7/commands/npm-pack) like [`npm publish`](https://docs.npmjs.com/cli/v7/commands/npm-publish) does.
- As the package being tested is not actually installed inside the `node_modules` of the package it’s being tested in, peer dependencies installed in the host package can’t be reached. For example, this makes it difficult to test a package that has a [`react`](https://npm.im/react) peer dependency inside a [Next.js](https://nextjs.org) project.
- How it works is not intuitive. It messes with the global `node_modules` and `bin` directories, and you have to remember to use `npm unlink` to tidy up, which inconveniently strips the dependency from your `package.json`.

## Setup

Installation isn’t required to use the [CLI](#cli) command [`install-from`](#command-install-from) with [`npx`](https://docs.npmjs.com/cli/v7/commands/npx).

To install with [npm](https://npmjs.com/get-npm), run:

```sh
npm install install-from --save-dev
```

Then, use either the [CLI](#cli) command [`install-from`](#command-install-from) or the JS [API](#api) function [`installFrom`](#function-installfrom).

## CLI

### Command `install-from`

Reliably installs a local package into another at the [CWD](https://en.wikipedia.org/wiki/Working_directory), for testing.

#### Arguments

| Argument | Description |
| :-- | :-- |
| 1 | Absolute or [CWD](https://en.wikipedia.org/wiki/Working_directory) relative filesystem path to the package to install from. |

#### Examples

_Installing a local package into another using [`npx`](https://docs.npmjs.com/cli/v7/commands/npx)._

> In a terminal, change to the directory of the package you want to test another package in:
>
> ```sh
> cd ~/Repos/foo
> ```
>
> Then, install the desired local package:
>
> ```sh
> npx install-from ~/Repos/bar
> ```

## API

### function installFrom

Reliably installs a local package into another, for testing.

| Parameter | Type | Description |
| :-- | :-- | :-- |
| `pathPackageFrom` | string | Absolute or [CWD](https://en.wikipedia.org/wiki/Working_directory) relative filesystem path to the package to install from. |
| `pathPackageTo` | string? | Absolute or [CWD](https://en.wikipedia.org/wiki/Working_directory) relative filesystem path to the package to install to, defaulting to `process.cwd()`. |

**Returns:** Promise\<void> — Resolves once installation is complete.

#### Examples

_How to `import`._

> ```js
> import installFrom from 'install-from';
> ```

_Installing a local package into another._

> ```js
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
