'use strict';

const text = require('./text.js').text;

const eliminateVersions =  require('./eliminate-versions');
const confirm = require('./confirm.js');

function log(message) {
  console.log(message);
}

// Analyzes the installed packages and outputs the amount of occupied disk
// space. Returns an object with information about each version.
function analyzePackages() {
  const analyzePackages = require('./analyze-packages.js');

  log(text.analyzing);
  const result = analyzePackages();

  // Compute the total size of the analyzed package versions.
  const packages = result.packages;
  let bytes = 0;

  for (let name in packages) {
    packages[name].versions.forEach((version) => {
      bytes += version.size;
    });
  }

  log(text.packagesTotal(bytes, result.cached));

  return packages;
}

// Scans the given path for Meteor projects and outputs the number of used
// package versions. Returns an array of versions.
function scanProjects(rootPath) {
  const scanner = require('./project-scanner.js');

  log(text.scanning);
  const result = scanner.scanProjects(rootPath);

  log(text.versionsTotal(
    Object.keys(result).length
  ));

  return result;
}

// Removes the given versions from the file system.
function removeVersions(versions) {
  log(text.removing);

  versions.forEach((version) => {
  });

  log(text.done);
}

module.exports = function run(program) {
  const packages = analyzePackages();
  let scanned;

  if (program.keepScanned) {
    scanned = scanProjects(program.keepScanned);
  }

  const remove = eliminateVersions(packages, {
    keepLatest: program.keepLatest,
    keepScanned: scanned
  });

  // Compute and output the expected disk space savings.
  let savings = 0;

  remove.forEach((version) => {
    savings += version.size;
  });

  log(text.savings(savings));

  // Ask for confirmation and remove packages.
  if (!program.yes) {
    confirm(text.confirmation).then((confirmed) => {
      if (confirmed) {
        removeVersions(remove);
      }
    });
  } else {
    removeVersions(remove);
  }
};
