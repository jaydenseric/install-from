'use strict'

const { strictEqual } = require('assert')
const { spawnSync } = require('child_process')
const fs = require('fs')
const { join, resolve } = require('path')
const { disposableDirectory } = require('disposable-directory')
const { TestDirector } = require('test-director')
const { installFrom } = require('.')

const cliPath = resolve(__dirname, 'cli')
const tests = new TestDirector()

tests.add('`installFrom` function.', async () => {
  await disposableDirectory(async tempDirPath => {
    const packageFromPath = join(tempDirPath, 'package-from')
    const packageToPath = join(tempDirPath, 'package-to')

    await fs.promises.mkdir(packageFromPath)
    await fs.promises.writeFile(
      join(packageFromPath, 'package.json'),
      JSON.stringify(
        {
          name: 'package-from',
          version: '0.0.0',
          private: true
        },
        null,
        2
      )
    )
    await fs.promises.writeFile(join(packageFromPath, 'index.js'), '// From')

    await fs.promises.mkdir(packageToPath)
    await fs.promises.writeFile(
      join(packageToPath, 'package.json'),
      JSON.stringify(
        {
          name: 'package-to',
          version: '0.0.0',
          private: true
        },
        null,
        2
      )
    )

    await installFrom(packageFromPath, packageToPath)

    const { name } = require(join(
      packageToPath,
      'node_modules',
      'package-from',
      'package.json'
    ))

    strictEqual(name, 'package-from')
    strictEqual(
      await fs.promises.readFile(
        join(packageToPath, 'node_modules', 'package-from', 'index.js'),
        'utf8'
      ),
      '// From'
    )
  })
})

tests.add('`install-from` CLI without arguments.', async () => {
  await disposableDirectory(async tempDirPath => {
    const packageFromPath = join(tempDirPath, 'package-from')
    const packageToPath = join(tempDirPath, 'package-to')

    await fs.promises.mkdir(packageFromPath)
    await fs.promises.writeFile(
      join(packageFromPath, 'package.json'),
      JSON.stringify(
        {
          name: 'package-from',
          version: '0.0.0',
          private: true
        },
        null,
        2
      )
    )
    await fs.promises.writeFile(join(packageFromPath, 'index.js'), '// From')

    await fs.promises.mkdir(packageToPath)
    await fs.promises.writeFile(
      join(packageToPath, 'package.json'),
      JSON.stringify(
        {
          name: 'package-to',
          version: '0.0.0',
          private: true
        },
        null,
        2
      )
    )

    const { stdout, stderr, status, error } = spawnSync('node', [cliPath], {
      cwd: packageToPath
    })

    if (error) throw error

    strictEqual(stdout.toString(), '')
    strictEqual(
      stderr.toString(),
      'Missing argument for the path to the package to install.\n'
    )
    strictEqual(status, 1)
  })
})

tests.add('`install-from` CLI with arguments.', async () => {
  await disposableDirectory(async tempDirPath => {
    const packageFromPath = join(tempDirPath, 'package-from')
    const packageToPath = join(tempDirPath, 'package-to')

    await fs.promises.mkdir(packageFromPath)
    await fs.promises.writeFile(
      join(packageFromPath, 'package.json'),
      JSON.stringify(
        {
          name: 'package-from',
          version: '0.0.0',
          private: true
        },
        null,
        2
      )
    )
    await fs.promises.writeFile(join(packageFromPath, 'index.js'), '// From')

    await fs.promises.mkdir(packageToPath)
    await fs.promises.writeFile(
      join(packageToPath, 'package.json'),
      JSON.stringify(
        {
          name: 'package-to',
          version: '0.0.0',
          private: true
        },
        null,
        2
      )
    )

    const { stdout, stderr, status, error } = spawnSync(
      'node',
      [cliPath, packageFromPath],
      { cwd: packageToPath }
    )

    if (error) throw error

    strictEqual(stdout.toString(), '')
    strictEqual(stderr.toString(), '')
    strictEqual(status, 0)

    const { name } = require(join(
      packageToPath,
      'node_modules',
      'package-from',
      'package.json'
    ))

    strictEqual(name, 'package-from')
    strictEqual(
      await fs.promises.readFile(
        join(packageToPath, 'node_modules', 'package-from', 'index.js'),
        'utf8'
      ),
      '// From'
    )
  })
})

tests.run()
