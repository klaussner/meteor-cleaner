jest.mock('../lib/paths.js', () => {
  return {
    packages: './tests/fixtures/analyze-packages'
  };
});

const analyzePackages = require('../lib/analyze-packages.js');

describe('Analyze packages', () => {
  test('Analyze packages', () => {
    const packages = analyzePackages(true).packages;

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

    expect(packages).toMatchObject({
      'banana': {
        name: 'banana',
        versions: bananaVersions
      },
      'mango': {
        name: 'mango',
        versions: mangoVersions
      }
    });
  });
});
