import { readJson, writeJson } from 'fs-extra';

const libPackage = './libs/ng2-file-upload/package.json';
const mainPackage = './package.json';

(async () => {
  const version = await readJson(mainPackage).then(json => json.version);
  const packageJson = await readJson(libPackage);
  if (packageJson.version) {
    packageJson.version = version;
  }
  await writeJson(libPackage, packageJson, { spaces: 2 });
})();
