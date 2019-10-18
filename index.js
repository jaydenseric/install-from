const { exec } = require('child_process')
const path = require('path')
const util = require('util')
const { remove } = require('fs-extra')

const execAsync = util.promisify(exec)

/**
 * Reliably installs a local package into another, for testing.
 * @kind function
 * @name installFrom
 * @param {string} pathPackageFrom Absolute or CWD relative filesystem path to the package to install from.
 * @param {string} pathPackageTo Absolute or CWD relative filesystem path to the package to install to.
 * @example <caption>Install a package into another.</caption>
 * ```js
 * const { installFrom } = require('install-from')
 *
 * installFrom(
 *   './packages/package-to-install-from',
 *   './packages/package-to-install-to'
 * )
 *   .then(() => {
 *     // …
 *   })
 *   .catch(() => {
 *     // …
 *   })
 * ```
 */
exports.installFrom = async function installFrom(
  pathPackageFrom,
  pathPackageTo
) {
  // Determine the package pack path.
  const { name, version } = require(path.resolve(
    pathPackageFrom,
    'package.json'
  ))
  const pathPack = path.resolve(pathPackageFrom, `${name}-${version}.tgz`)

  // Pack the package.
  await execAsync(`cd ${pathPackageFrom} && npm pack`)

  // Install the packed package.
  await execAsync(`cd ${pathPackageTo} && npm install ${pathPack} --no-save`)

  // Delete the pack.
  await remove(pathPack)
}
