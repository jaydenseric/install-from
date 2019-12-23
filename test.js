'use strict'

const assert = require('assert')
const { exec } = require('child_process')
const path = require('path')
const util = require('util')
const { copy, remove } = require('fs-extra')
const { TestDirector } = require('test-director')
const { installFrom } = require('.')

const execAsync = util.promisify(exec)

const FIXTURES_PATH = './fixtures'
const TEMP_PATH_API = './fixtures-temp-api'
const TEMP_PATH_CLI = './fixtures-temp-cli'

const tests = new TestDirector()

tests.add('JS API.', async () => {
  try {
    await copy(FIXTURES_PATH, TEMP_PATH_API)

    await installFrom(
      path.resolve(TEMP_PATH_API, 'package-from'),
      path.resolve(TEMP_PATH_API, 'package-to')
    )

    const { name } = require(path.resolve(
      TEMP_PATH_API,
      'package-to',
      'node_modules',
      'package-from',
      'package.json'
    ))

    assert(name, 'package-from')
  } finally {
    await remove(TEMP_PATH_API)
  }
})

tests.add('CLI.', async () => {
  try {
    await copy(FIXTURES_PATH, TEMP_PATH_CLI)

    // Install the local version of `install-from` in the test package,
    // otherwise npx will attempt to pull it down from the public registry. Then
    // use npx to test the CLI.
    await execAsync(
      `cd ${path.resolve(
        TEMP_PATH_CLI,
        'package-to'
      )} && npm install ../.. && npx install-from ${path.resolve(
        TEMP_PATH_CLI,
        'package-from'
      )}`
    )

    const { name } = require(path.resolve(
      TEMP_PATH_CLI,
      'package-to',
      'node_modules',
      'package-from',
      'package.json'
    ))

    assert(name, 'package-from')
  } finally {
    await remove(TEMP_PATH_CLI)
  }
})

tests.run()
