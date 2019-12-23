'use strict'

const assert = require('assert')
const { spawnSync } = require('child_process')
const path = require('path')
const { remove } = require('fs-extra')
const { TestDirector } = require('test-director')
const { installFrom } = require('.')

const PATH_PACKAGE_FROM = path.join(__dirname, 'fixtures', 'package-from')
const PATH_PACKAGE_TO = path.join(__dirname, 'fixtures', 'package-to')

const tests = new TestDirector()

tests.add('`installFrom` function.', async () => {
  try {
    await installFrom(PATH_PACKAGE_FROM, PATH_PACKAGE_TO)

    const { name } = require(path.join(
      PATH_PACKAGE_TO,
      'node_modules',
      'package-from',
      'package.json'
    ))

    assert.strictEqual(name, 'package-from')
  } finally {
    await remove(path.join(PATH_PACKAGE_TO, 'node_modules'))
  }
})

tests.add('`install-from` CLI without arguments.', async () => {
  const { stdout, stderr, status, error } = spawnSync(
    'node',
    [path.join(__dirname, 'cli')],
    { cwd: PATH_PACKAGE_TO }
  )

  if (error) throw error

  assert.strictEqual(stdout.toString(), '')
  assert.strictEqual(
    stderr.toString(),
    'Missing argument for the path to the package to install.\n'
  )
  assert.strictEqual(status, 1)
})

tests.add('`install-from` CLI with arguments.', async () => {
  try {
    const { stdout, stderr, status, error } = spawnSync(
      'node',
      [path.join(__dirname, 'cli'), PATH_PACKAGE_FROM],
      { cwd: PATH_PACKAGE_TO }
    )

    if (error) throw error

    assert.strictEqual(stdout.toString(), '')
    assert.strictEqual(stderr.toString(), '')
    assert.strictEqual(status, 0)

    const { name } = require(path.join(
      PATH_PACKAGE_TO,
      'node_modules',
      'package-from',
      'package.json'
    ))

    assert.strictEqual(name, 'package-from')
  } finally {
    await remove(path.join(PATH_PACKAGE_TO, 'node_modules'))
  }
})

tests.run()
