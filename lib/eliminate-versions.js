function findRemovableVersions(pkg, options) {
  const latest = options.keepLatest;
  const scanned = options.keepScanned;

  const remove = [];

  pkg.versions.forEach((version, i) => {
    let keepVersion;

    // Keep the version if it's not too old.
    if (i >= pkg.versions.length - latest) {
      keepVersion = true;
    }

    // Keep the version if it's in the list of scanned versions.
    if (scanned) {
      const versions = scanned[pkg.name];

      if (versions && versions[version.version]) {
        keepVersion = true;
      }
    }

    if (!keepVersion) {
      remove.push(version);
    }
  });

  return remove;
}

// Returns an array of versions that should be removed, according to the
// provided options.
module.exports = function eliminateVersions(packages, options) {
  const remove = [];

  for (let name in packages) {
    Array.prototype.push.apply(
      remove,
      findRemovableVersions(packages[name], options)
    );
  }

  return remove;
};
