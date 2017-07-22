'use strict';

const eliminateVersions = require('../lib/eliminate-versions.js');

const packages = {
  pkg1: {
    name: 'pkg1',
    versions: [
      { version: '1.2.3-alpha.4' },
      { version: '2.0' },
      { version: '42.13.0' }
    ]
  }
};

const scanned = {
  'pkg1': {
    '2.0': true
  }
};

describe('Eliminate versions', () => {
  test('Keep the latest versions', () => {
    const remove = eliminateVersions(packages, {
      keepLatest: 2
    });

    expect(remove).toEqual([
      { version: '1.2.3-alpha.4' }
    ]);
  });

  test('Keep scanned versions', () => {
    const remove = eliminateVersions(packages, {
      keepScanned: scanned
    });

    expect(remove).toEqual([
      { version: '1.2.3-alpha.4' },
      { version: '42.13.0' }
    ]);
  });
});
