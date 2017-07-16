const fs = require('fs');
const path = require('path');

const eachFile = require('./each-file');

function parseRelease(release, packages = {}) {
  release = release.trim();

  // Projects created from a checkout don't specify a release.
  if (release === 'none') {
    return packages;
  }

  const [meteor, version] = release.split('@');
  const name = 'meteor-tool';

  // Convert the Meteor release string to a valid package version number. The
  // format depends on the components of the release string. If it has a fourth
  // version component, the last dot is replaced by '-' or '_', depending on
  // whether the version is a pre-release.
  let packageVersion;

  const [main, pre] = version.split('-');
  const dots = main.match(/\./g);

  if (dots && dots.length === 3) {
    const delimiter = pre ? '-' : '_';
    const lastDot = main.lastIndexOf('.');

    // Replace the last dot with the right delimiter.
    packageVersion =
      main.substring(0, lastDot)
      + delimiter
      + main.substring(lastDot + 1);

    if (pre) {
      packageVersion += `-${pre}`;
    }
  } else {
    packageVersion = version;
  }

  packages[name] = Object.assign(packages[name] || {}, {
    [packageVersion]: true
  });

  return packages;
}

function parseVersions(versionsList, packages = {}) {
  versionsList.split('\n').forEach((line) => {
    if (!line) return;

    const [name, version] = line.split('@');

    packages[name] = Object.assign(packages[name] || {}, {
      [version]: true
    });
  });

  return packages;
}

function analyzeProjects(rootPath) {
  const packages = {};

  eachFile(rootPath, (filePath, fileName) => {
    const stats = fs.lstatSync(filePath);

    // Traverse only visible directories.
    if (!stats.isDirectory() || rootPath.startsWith('.')) {
      return;
    }

    // Assume that the directory contains a Meteor project if a `versions` file
    // exists in a `.meteor` subdirectory.
    const versionsPath = path.join(filePath, '.meteor', 'versions');

    if (fs.existsSync(versionsPath)) {
      parseVersions(
        fs.readFileSync(versionsPath, 'utf8'),
        packages
      );

      parseRelease(
        fs.readFileSync(
          path.join(filePath, '.meteor', 'release'),
          'utf8'
        ),
        packages
      );
    } else {
      analyzeProjects(filePath);
    }
  });

  return packages;
};

module.exports = {
  parseRelease, parseVersions, analyzeProjects
};
