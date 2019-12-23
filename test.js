'use strict'

const { strictEqual } = require('assert')
const { spawnSync } = require('child_process')
const { join } = require('path')
const { remove } = require('fs-extra')
const { TestDirector } = require('test-director')
const { installFrom } = require('.')

const PATH_PACKAGE_FROM = join(__dirname, 'fixtures', 'package-from')
const PATH_PACKAGE_TO = join(__dirname, 'fixtures', 'package-to')

const tests = new TestDirector()

tests.add('`installFrom` function.', async () => {
  try {
    await installFrom(PATH_PACKAGE_FROM, PATH_PACKAGE_TO)

    const { name } = require(join(
      PATH_PACKAGE_TO,
      'node_modules',
      'package-from',
      'package.json'
    ))

    strictEqual(name, 'package-from')
  } finally {
    await remove(join(PATH_PACKAGE_TO, 'node_modules'))
  }
})

tests.add('`install-from` CLI without arguments.', async () => {
  const { stdout, stderr, status, error } = spawnSync(
    'node',
    [join(__dirname, 'cli')],
    { cwd: PATH_PACKAGE_TO }
  )

  if (error) throw error

  strictEqual(stdout.toString(), '')
  strictEqual(
    stderr.toString(),
    'Missing argument for the path to the package to install.\n'
  )
  strictEqual(status, 1)
})

tests.add('`install-from` CLI with arguments.', async () => {
  try {
    const { stdout, stderr, status, error } = spawnSync(
      'node',
      [join(__dirname, 'cli'), PATH_PACKAGE_FROM],
      { cwd: PATH_PACKAGE_TO }
    )

    if (error) throw error

    strictEqual(stdout.toString(), '')
    strictEqual(stderr.toString(), '')
    strictEqual(status, 0)

    const { name } = require(join(
      PATH_PACKAGE_TO,
      'node_modules',
      'package-from',
      'package.json'
    ))

    strictEqual(name, 'package-from')
  } finally {
    await remove(join(PATH_PACKAGE_TO, 'node_modules'))
  }
})

tests.run()
