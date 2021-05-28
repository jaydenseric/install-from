#!/usr/bin/env node

import installFrom from './index.mjs';

const [, , pathPackageFrom] = process.argv;

if (pathPackageFrom) installFrom(pathPackageFrom);
else {
  console.error('Missing argument for the path to the package to install.');
  process.exitCode = 1;
}
