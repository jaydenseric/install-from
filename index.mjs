import { execFile } from 'child_process';
import fs from 'fs';
import { resolve } from 'path';
import { promisify } from 'util';
import { remove } from 'fs-extra';

const execFilePromise = promisify(execFile);

/**
 * Reliably installs a local package into another, for testing.
 * @kind function
 * @name installFrom
 * @param {string} pathPackageFrom Absolute or [CWD](https://en.wikipedia.org/wiki/Working_directory) relative filesystem path to the package to install from.
 * @param {string} [pathPackageTo] Absolute or [CWD](https://en.wikipedia.org/wiki/Working_directory) relative filesystem path to the package to install to, defaulting to `process.cwd()`.
 * @returns {Promise<void>} Resolves once installation is complete.
 * @example <caption>How to `import`.</caption>
 * ```js
 * import installFrom from 'install-from';
 * ```
 * @example <caption>Installing a local package into another.</caption>
 * ```js
 * installFrom(
 *   './packages/package-to-install-from',
 *   './packages/package-to-install-to'
 * )
 *   .then(() => {
 *     // …
 *   })
 *   .catch(() => {
 *     // …
 *   });
 * ```
 */
export default async function installFrom(
  pathPackageFrom,
  pathPackageTo = process.cwd()
) {
  // Determine the package pack path.
  const { name, version } = JSON.parse(
    await fs.promises.readFile(resolve(pathPackageFrom, 'package.json'), 'utf8')
  );
  const pathPack = resolve(
    pathPackageFrom,

    // Account for a potentially scoped package name.
    `${name.replace('@', '').replace('/', '-')}-${version}.tgz`
  );

  // Pack the package.
  await execFilePromise('npm', ['pack'], { cwd: pathPackageFrom });

  // Install the packed package.
  await execFilePromise('npm', ['install', pathPack, '--no-save'], {
    cwd: pathPackageTo,
  });

  // Delete the pack.
  await remove(pathPack);
}
