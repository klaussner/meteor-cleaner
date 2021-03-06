'use strict';

const text = require('./text.js').text;

const eliminateVersions = require('./eliminate-versions');
const confirm = require('./confirm.js');

function log(message) {
  console.log(message);
}

// Analyzes the installed packages and outputs the amount of occupied disk
// space. Returns an object with information about each package.
function analyzePackages(options) {
  const analyzePackages = require('./analyze-packages.js');

  log(text.analyzing);
  const result = analyzePackages(options);

  // Compute the total size of the analyzed versions.
  const packages = result.packages;
  let bytes = 0;

  for (let name in packages) {
    packages[name].versions.forEach((version) => {
      bytes += version.size;
    });
  }

  log(text.packagesTotal(bytes, result.cached));

  return result;
}

// Scans the given path for Meteor projects and outputs the number of used
// versions. Returns an object with the used version numbers of each package.
function scanProjects(rootPath) {
  const scanner = require('./project-scanner.js');

  log(text.scanning);

  const packages = scanner.scanProjects(rootPath);
  let count = 0;

  for (let name in packages) {
    const versions = Object.keys(packages[name]);
    count += versions.length;
  }

  log(text.versionsTotal(count));

  return packages;
}

// Removes the given versions from the file system.
function removeVersions(versions) {
  const rimraf = require('rimraf');

  function remove(path) {
    rimraf.sync(path, {
      glob: false
    });
  }

  log(text.removing);

  versions.forEach((version) => {
    try {
      remove(version.realPath);
      remove(version.path);
    } catch (e) {
      console.error(e.stack);
    }
  });

  // Remove the cache because it's no longer accurate.
  remove(require('./paths.js').cache);

  log(text.done);
}

module.exports = function run(program) {
  const packagesData = analyzePackages({
    ignoreCache: program.ignoreCache
  });

  let scanned;

  if (program.keepScanned) {
    scanned = scanProjects(program.keepScanned);
  }

  const toRemove = eliminateVersions(packagesData, {
    latest: program.keepLatest,
    scanned: scanned,
    final: program.keepFinal
  });

  // Compute and output the expected disk space savings.
  log(text.savings(
    toRemove.reduce((savings, version) => {
      return savings + version.size;
    }, 0))
  );

  // Ask for confirmation and remove packages.
  if (!program.yes) {
    confirm(text.confirmation).then((confirmed) => {
      if (confirmed) {
        removeVersions(toRemove);
      }
    });
  } else {
    removeVersions(toRemove);
  }
};
