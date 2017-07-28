'use strict';

const fs = require('fs');
const path = require('path');

const eachFile = require('./each-file');

function parseRelease(release, packages) {
  release = release.trim();
  packages = packages || {};

  const releaseSplit = release.split('@');
  let version;

  // Only parse release strings with format `track@version`.
  if (releaseSplit.length !== 2) {
    return packages;
  } else {
    const track = releaseSplit[0];
    version = releaseSplit[1];

    // Tracks other than `METEOR` aren't supported.
    if (track !== 'METEOR') {
      return packages;
    }
  }

  const name = 'meteor-tool';

  // Convert the Meteor release string to a valid version number.
  let packageVersion;

  const versionSplit = version.split('-');
  const pre = versionSplit[1];

  let main = versionSplit[0];
  const dots = main.match(/\./g);

  // Add omitted `.0` version components.
  if (dots && dots.length < 2) {
    let toAdd = 2 - dots.length;

    while (toAdd-- > 0) {
      main += '.0';
    }
  }

  // If the version number has a fourth component, the last dot is replaced by
  // '-' or '_', depending on whether the version is a pre-release.
  if (dots && dots.length === 3) {
    const delimiter = pre ? '-' : '_';
    const lastDot = main.lastIndexOf('.');

    packageVersion =
      main.substring(0, lastDot)
      + delimiter
      + main.substring(lastDot + 1);
  } else {
    packageVersion = main;
  }

  if (pre) {
    packageVersion += `-${pre}`;
  }

  packages[name] = Object.assign(packages[name] || {}, {
    [packageVersion]: true
  });

  return packages;
}

function parseVersions(versions, packages) {
  packages = packages || {};

  versions.split('\n').forEach((line) => {
    if (!line) return;

    const versionSplit = line.split('@');
    const name = versionSplit[0];
    const version = versionSplit[1];

    packages[name] = Object.assign(packages[name] || {}, {
      [version]: true
    });
  });

  return packages;
}

function scanProjects(rootPath, packages) {
  packages = packages || {};

  eachFile(rootPath, (filePath, fileName) => {
    const status = fs.lstatSync(filePath);

    // Traverse only visible directories.
    if (!status.isDirectory() || fileName.startsWith('.')) {
      return;
    }

    // Assume that the directory contains a Meteor project if a `release` file
    // exists in a `.meteor` subdirectory.
    const releasePath = path.join(filePath, '.meteor', 'release');

    if (fs.existsSync(releasePath)) {
      try {
        parseRelease(
          fs.readFileSync(releasePath, 'utf8'),
          packages
        );

        parseVersions(
          fs.readFileSync(
            path.join(filePath, '.meteor', 'versions'),
            'utf8'
          ),
          packages
        );
      } catch (e) {
        // Ignore nonexistent files.
        if (e.code !== 'ENOENT') {
          console.error(e.stack);
        }
      }
    } else {
      scanProjects(filePath, packages);
    }
  });

  return packages;
}

module.exports = {
  scanProjects, parseRelease, parseVersions
};
