#!/usr/bin/env node

'use strict'

const { installFrom } = require('.')

const [, , pathPackageFrom] = process.argv

if (pathPackageFrom) installFrom(pathPackageFrom)
else {
  console.error('Missing argument for the path to the package to install.')
  process.exitCode = 1
}
