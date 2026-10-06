import { readFileSync } from 'fs';
import { join } from 'path';

// ng-packagr publishes README.md and LICENSE from the library folder, so they must match the repository ones
describe('package files', () => {
  const root = join(__dirname, '../../../..');
  const lib = join(__dirname, '../..');

  [ 'README.md', 'LICENSE' ].forEach(name => {
    it(`${ name } matches the repository ${ name }`, () => {
      expect(readFileSync(join(lib, name), 'utf8')).toBe(readFileSync(join(root, name), 'utf8'));
    });
  });
});
