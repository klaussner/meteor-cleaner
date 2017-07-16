const fs = require('fs');
const Version = require('meteor-version-parser');

const { packagesPath, cachePath } = require('./paths.js');
const eachFile = require('./each-file.js');
const directorySize = require('./directory-size.js');

function restorePackageName(name) {
  // User and organization names cannot contain underscores, so it is safe to
  // replace the first occurence of '_' with ':' to restore the package name.
  return name.replace('_', ':');
}

function isCacheValid(date) {
  return new Date - new Date(date) < 24 * 3600 * 1000;
}

function analyzeVersions(packagePath) {
  const versions = [];

  eachFile(packagePath, (filePath, fileName) => {
    try {
      const stats = fs.lstatSync(filePath);

      // Only use symbolic links to analyze versions.
      if (stats && stats.isSymbolicLink()) {
        const realPath = fs.realpathSync(filePath);

        versions.push({
          version: fileName,
          path: filePath,
          realPath,
          size: directorySize(realPath)
        });
      }
    } catch (e) {
      // Ignore broken symbolic links (ENOENT).
      if (e.code !== 'ENOENT') {
        console.error(e);
      }
    }
  });

  // Return version information sorted by version number.
  return versions.sort((a, b) => {
    return Version.compare(a.version, b.version);
  });
}

function analyzePackages() {
  let cache, packages;

  // Try to load cached results.
  try {
    cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  } catch (e) {
    if (e.code !== 'ENOENT') {
      console.error(e);
    }
  }

  if (cache && isCacheValid(cache.date)) {
    packages = cache.packages;
  } else {
    packages = {};

    eachFile(packagesPath, (filePath, fileName) => {
      const packageName = restorePackageName(fileName);

      packages[packageName] = {
        name: packageName,
        versions: analyzeVersions(filePath)
      };
    });

    // Cache the results to speed up the next call of this function.
    fs.writeFileSync(cachePath, JSON.stringify({
      date: new Date,
      packages
    }));
  }

  return packages;
};

module.exports = { analyzePackages };
