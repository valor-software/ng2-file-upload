import { readFile, writeFile } from 'node:fs/promises';

const libPackage = './libs/ng2-file-upload/package.json';
const mainPackage = './package.json';

const readJson = async (path: string) => JSON.parse(await readFile(path, 'utf8'));

(async () => {
  const version = await readJson(mainPackage).then(json => json.version);
  const packageJson = await readJson(libPackage);
  if (packageJson.version) {
    packageJson.version = version;
  }
  await writeFile(libPackage, JSON.stringify(packageJson, null, 2) + '\n');
})();
