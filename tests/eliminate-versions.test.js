'use strict';

const eliminateVersions = require('../lib/eliminate-versions.js');

const packages = {
  banana: {
    name: 'banana',
    versions: [
      {
        version: '1.2.3-alpha.4',
        isPreRelease: true
      },
      { version: '2.0' },
      { version: '42.13.0' }
    ]
  }
};

const packagesData = {
  packages
};

const scanned = {
  'banana': {
    '2.0': true
  }
};

describe('Eliminate versions', () => {
  const bananaPreRelease = expect.objectContaining({
    version: '1.2.3-alpha.4'
  });

  test('Keep latest versions', () => {
    const toRemove = eliminateVersions(packagesData, {
      latest: 2
    });

    expect(toRemove).toEqual([
      bananaPreRelease
    ]);
  });

  test('Keep scanned versions', () => {
    const toRemove = eliminateVersions(packagesData, {
      scanned
    });

    expect(toRemove).toEqual([
      bananaPreRelease,
      { version: '42.13.0' }
    ]);
  });

  test('Keep final versions', () => {
    const toRemove = eliminateVersions(packagesData, {
      final: true
    });

    expect(toRemove).toEqual([
      bananaPreRelease
    ]);
  });

  test('Keep currently used `meteor-tool` version', () => {
    const toRemove = eliminateVersions({
      packages: {
        'meteor-tool': {
          versions: [{ version: '2.4.6' }]
        }
      },
      toolVersion: '2.4.6'
    }, {});

    expect(toRemove).toEqual([]);
  });
});
