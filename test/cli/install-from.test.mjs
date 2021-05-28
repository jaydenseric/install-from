import { strictEqual } from 'assert';
import { spawnSync } from 'child_process';
import fs from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import disposableDirectory from 'disposable-directory';

const CLI_INSTALL_FROM_PATH = fileURLToPath(
  new URL('../../cli/install-from.mjs', import.meta.url)
);

export default (tests) => {
  tests.add('`install-from` command without arguments.', async () => {
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
        [CLI_INSTALL_FROM_PATH],
        {
          cwd: packageToPath,
        }
      );

      if (error) throw error;

      strictEqual(stdout.toString(), '');
      strictEqual(
        stderr.toString(),
        'Missing argument for the path to the package to install.\n'
      );
      strictEqual(status, 1);
    });
  });

  tests.add('`install-from` command with arguments.', async () => {
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
        [CLI_INSTALL_FROM_PATH, packageFromPath],
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
};
