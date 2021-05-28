import { strictEqual } from 'assert';
import fs from 'fs';
import { join } from 'path';
import disposableDirectory from 'disposable-directory';
import installFrom from '../index.mjs';

export default (tests) => {
  tests.add('`installFrom` with a non-scoped package.', async () => {
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

  tests.add('`installFrom` with a scoped package.', async () => {
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
};
