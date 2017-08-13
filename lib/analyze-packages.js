'use strict';

const fs = require('fs');
const Version = require('meteor-version-parser');

const eachFile = require('./each-file.js');
const directorySize = require('./directory-size.js');
const tool = require('../package.json');

function restorePackageName(name) {
  // User and organization names cannot contain underscores, so it's safe to
  // replace the first occurence of '_' with ':' to restore the package name.
  return name.replace('_', ':');
}

function isCacheValid(cache) {
  const oneDay = 24 * 3600 * 1000;
  const age = new Date - new Date(cache.date);

  return (age < oneDay) && (cache.version === tool.version);
}

function analyzeVersions(packagePath) {
  const versions = [];

  eachFile(packagePath, (filePath, fileName) => {
    try {
      const status = fs.lstatSync(filePath);

      // Only use symbolic links to analyze versions.
      if (!(status && status.isSymbolicLink())) {
        return;
      }

      const realPath = fs.realpathSync(filePath);
      const version = Version.parse(fileName);

      versions.push({
        version: fileName,
        isPreRelease: version.prerelease.length > 0,
        path: filePath,
        realPath,
        size: directorySize(realPath)
      });
    } catch (e) {
      // Ignore broken symbolic links (ENOENT).
      if (e.code !== 'ENOENT') {
        console.error(e.stack);
      }
    }
  });

  // Return versions sorted by version number.
  return versions.sort((a, b) => {
    return Version.compare(a.version, b.version);
  });
}

module.exports = function analyzePackages(options) {
  const paths = require('./paths.js');
  let cache, wasCacheUsed, packages;

  // Try to load cached results.
  if (!options.noCache) {
    try {
      cache = !options.ignoreCache &&
        JSON.parse(fs.readFileSync(paths.cache, 'utf8'));
    } catch (e) {
      if (e.code !== 'ENOENT') {
        console.error(e.stack);
      }
    }
  }

  if (cache && isCacheValid(cache)) {
    packages = cache.packages;
    wasCacheUsed = true;
  } else {
    packages = {};

    eachFile(paths.packages, (filePath, fileName) => {
      if (!fs.lstatSync(filePath).isDirectory()) {
        return;
      }

      const packageName = restorePackageName(fileName);

      packages[packageName] = {
        name: packageName,
        versions: analyzeVersions(filePath)
      };
    });

    // Cache the results to speed up the next call of this function.
    if (!options.noCache) {
      fs.writeFileSync(paths.cache, JSON.stringify({
        date: new Date,
        version: tool.version,
        packages
      }));
    }
  }

  // Find out which `meteor-tool` version is currently used.
  const pathSep = require('path').sep;

  const toolVersion = fs.readlinkSync(paths.meteor)
    .split(pathSep)[2];

  return {
    cached: wasCacheUsed,
    packages,
    toolVersion
  };
};
