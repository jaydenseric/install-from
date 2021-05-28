import { strictEqual } from 'assert';
import { spawnSync } from 'child_process';
import fs from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import disposableDirectory from 'disposable-directory';
import TestDirector from 'test-director';
import installFrom from './index.mjs';

const cliPath = fileURLToPath(new URL('cli.mjs', import.meta.url));
const tests = new TestDirector();

tests.add('`installFrom` function with a non-scoped package.', async () => {
  await disposableDirectory(async (tempDirPath) => {
    const packageFromName = 'package-from';
    const packageToName = 'package-to';
    const packageFromPath = join(tempDirPath, packageFromName);
    const packageToPath = join(tempDirPath, packageToName);

    await fs.promises.mkdir(packageFromPath);
    await fs.promises.writeFile(
      join(packageFromPath, 'package.json'),
      JSON.stringify(
        {
          name: packageFromName,
          version: '0.0.0',
          private: true,
        },
        null,
        2
      )
    );
    await fs.promises.writeFile(join(packageFromPath, 'index.js'), '// From');

    await fs.promises.mkdir(packageToPath);
    await fs.promises.writeFile(
      join(packageToPath, 'package.json'),
      JSON.stringify(
        {
          name: packageToName,
          version: '0.0.0',
          private: true,
        },
        null,
        2
      )
    );

    await installFrom(packageFromPath, packageToPath);

    const { name } = JSON.parse(
      await fs.promises.readFile(
        join(packageToPath, 'node_modules', packageFromName, 'package.json'),
        'utf8'
      )
    );

    strictEqual(name, packageFromName);
    strictEqual(
      await fs.promises.readFile(
        join(packageToPath, 'node_modules', packageFromName, 'index.js'),
        'utf8'
      ),
      '// From'
    );
  });
});

tests.add('`installFrom` function with a scoped package.', async () => {
  await disposableDirectory(async (tempDirPath) => {
    const packageFromNameScope = '@scope-from';
    const packageFromNameName = 'package-from';
    const packageFromName = `${packageFromNameScope}/${packageFromNameName}`;
    const packageToName = 'package-to';
    const packageFromPath = join(tempDirPath, 'from');
    const packageToPath = join(tempDirPath, 'to');

    await fs.promises.mkdir(packageFromPath);

    await fs.promises.writeFile(
      join(packageFromPath, 'package.json'),
      JSON.stringify(
        {
          name: packageFromName,
          version: '0.0.0',
          private: true,
        },
        null,
        2
      )
    );
    await fs.promises.writeFile(join(packageFromPath, 'index.js'), '// From');

    await fs.promises.mkdir(packageToPath);
    await fs.promises.writeFile(
      join(packageToPath, 'package.json'),
      JSON.stringify(
        {
          name: packageToName,
          version: '0.0.0',
          private: true,
        },
        null,
        2
      )
    );

    await installFrom(packageFromPath, packageToPath);

    const { name } = JSON.parse(
      await fs.promises.readFile(
        join(
          packageToPath,
          'node_modules',
          packageFromNameScope,
          packageFromNameName,
          'package.json'
        ),
        'utf8'
      )
    );

    strictEqual(name, packageFromName);
    strictEqual(
      await fs.promises.readFile(
        join(
          packageToPath,
          'node_modules',
          packageFromNameScope,
          packageFromNameName,
          'index.js'
        ),
        'utf8'
      ),
      '// From'
    );
  });
});

tests.add('`install-from` CLI without arguments.', async () => {
  await disposableDirectory(async (tempDirPath) => {
    const packageFromName = 'package-from';
    const packageToName = 'package-to';
    const packageFromPath = join(tempDirPath, packageFromName);
    const packageToPath = join(tempDirPath, packageToName);

    await fs.promises.mkdir(packageFromPath);
    await fs.promises.writeFile(
      join(packageFromPath, 'package.json'),
      JSON.stringify(
        {
          name: packageFromName,
          version: '0.0.0',
          private: true,
        },
        null,
        2
      )
    );
    await fs.promises.writeFile(join(packageFromPath, 'index.js'), '// From');

    await fs.promises.mkdir(packageToPath);
    await fs.promises.writeFile(
      join(packageToPath, 'package.json'),
      JSON.stringify(
        {
          name: packageToName,
          version: '0.0.0',
          private: true,
        },
        null,
        2
      )
    );

    const { stdout, stderr, status, error } = spawnSync('node', [cliPath], {
      cwd: packageToPath,
    });

    if (error) throw error;

    strictEqual(stdout.toString(), '');
    strictEqual(
      stderr.toString(),
      'Missing argument for the path to the package to install.\n'
    );
    strictEqual(status, 1);
  });
});

tests.add('`install-from` CLI with arguments.', async () => {
  await disposableDirectory(async (tempDirPath) => {
    const packageFromName = 'package-from';
    const packageToName = 'package-to';
    const packageFromPath = join(tempDirPath, packageFromName);
    const packageToPath = join(tempDirPath, packageToName);

    await fs.promises.mkdir(packageFromPath);
    await fs.promises.writeFile(
      join(packageFromPath, 'package.json'),
      JSON.stringify(
        {
          name: packageFromName,
          version: '0.0.0',
          private: true,
        },
        null,
        2
      )
    );
    await fs.promises.writeFile(join(packageFromPath, 'index.js'), '// From');

    await fs.promises.mkdir(packageToPath);
    await fs.promises.writeFile(
      join(packageToPath, 'package.json'),
      JSON.stringify(
        {
          name: packageToName,
          version: '0.0.0',
          private: true,
        },
        null,
        2
      )
    );

    const { stdout, stderr, status, error } = spawnSync(
      'node',
      [cliPath, packageFromPath],
      { cwd: packageToPath }
    );

    if (error) throw error;

    strictEqual(stdout.toString(), '');
    strictEqual(stderr.toString(), '');
    strictEqual(status, 0);

    const { name } = JSON.parse(
      await fs.promises.readFile(
        join(packageToPath, 'node_modules', packageFromName, 'package.json'),
        'utf8'
      )
    );

    strictEqual(name, packageFromName);
    strictEqual(
      await fs.promises.readFile(
        join(packageToPath, 'node_modules', packageFromName, 'index.js'),
        'utf8'
      ),
      '// From'
    );
  });
});

tests.run();
