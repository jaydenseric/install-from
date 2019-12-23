#!/usr/bin/env node

const { installFrom } = require('.')

const [, , pathPackageFrom] = process.argv

if (!pathPackageFrom)
  throw new Error('Missing argument for the path to the package to install.')

installFrom(pathPackageFrom, process.cwd())