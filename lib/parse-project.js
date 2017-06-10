function parseRelease(release, packages = {}) {
  const [meteor, version] = release.split('@');
  const name = 'meteor-tool';

  packages[name] = Object.assign(packages[name] || {}, {
    [version]: true
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

module.exports = { parseRelease, parseVersions };
