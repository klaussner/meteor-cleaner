'use strict';

jest.mock('../lib/paths.js', () => {
  const rootPath = './tests/fixtures/analyze-packages';

  return {
    meteor: `${rootPath}/meteor-binary`,
    packages: rootPath
  };
});

const analyzePackages = require('../lib/analyze-packages.js');

describe('Analyze packages', () => {
  test('Analyze packages', () => {
    const packagesData = analyzePackages({
      noCache: true
    });

    const bananaVersions = expect.arrayContaining([
      expect.objectContaining({
        version: '1.2.3'
      })
    ]);

    const mangoVersions = expect.arrayContaining([
      expect.objectContaining({
        version: '2.4.6'
      }),
      expect.objectContaining({
        version: '4.8.12'
      })
    ]);

    expect(packagesData.packages).toMatchObject({
      'banana': {
        name: 'banana',
        versions: bananaVersions
      },
      'mango': {
        name: 'mango',
        versions: mangoVersions
      }
    });

    expect(packagesData.toolVersion).toEqual('2.4.6');
  });
});
