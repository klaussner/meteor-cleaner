const fs = require('fs');
const semver = require('semver');

const eachFile = require('./each-file.js');

function restorePackageName(name) {
  // User and organization names cannot contain underscores, so it is safe to
  // replace the first occurence of '_' with ':' to restore the package name.
  return name.replace('_', ':');
}

function analyzeVersions(packagePath) {
  const versions = [];

  eachFile(packagePath, (filePath, fileName) => {
    const stats = fs.lstatSync(filePath);

    // Only use symbolic links to analyze versions.
    if (stats.isSymbolicLink()) {
      const realPath = fs.realpathSync(filePath);

      versions.push({
        version: fileName,
        realPath,
        size: directorySize(realPath)
      });
    }
  });

  // Return version information sorted by version number.
  return versions.sort((a, b) => {
    return semver.compare(a.version, b.version);
  });
}

module.exports = function analyzePackages() {
  const packages = {};

  eachFile(packagesPath, (filePath, fileName) => {
    const packageName = restorePackageName(fileName);

    packages[packageName] = {
      name: packageName,
      versions: analyzeVersions(filePath)
    };
  });

  return packages;
};
