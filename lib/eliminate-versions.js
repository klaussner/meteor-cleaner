'use strict';

function versionsToRemove(packageInfo, options) {
  const latest = options.keepLatest;
  const scanned = options.keepScanned;

  const toRemove = [];

  packageInfo.versions.forEach((version, i) => {
    let keepVersion;

    // Keep the version if it's not too old.
    // Cleaning mode: --keep-latest
    if (i >= packageInfo.versions.length - latest) {
      keepVersion = true;
    }

    // Keep the version if it's in the list of scanned versions.
    // Cleaning mode: --keep-scanned
    if (scanned) {
      const versions = scanned[packageInfo.name];

      if (versions && versions[version.version]) {
        keepVersion = true;
      }
    }

    if (!keepVersion) {
      toRemove.push(version);
    }
  });

  return toRemove;
}

// Returns an array of versions that should be removed, according to the
// cleaning modes provided in the options.
module.exports = function eliminateVersions(packages, options) {
  const toRemove = [];

  for (let name in packages) {
    Array.prototype.push.apply(
      toRemove,
      versionsToRemove(packages[name], options)
    );
  }

  return toRemove;
};
