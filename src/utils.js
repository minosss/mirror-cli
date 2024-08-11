import path from 'node:path';
import fs from 'node:fs';

export const logger =
    (scope) =>
      (...args) =>
        // eslint-disable-next-line no-console
        console.log(`[${scope}]`, ...args);

export function hasPackageFile() {
  return fs.existsSync(path.join(process.cwd(), 'package.json'));
}
