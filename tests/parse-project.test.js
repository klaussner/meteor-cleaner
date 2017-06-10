const {
  parseRelease, parseVersions
} = require('../lib/parse-project.js');

const versionsList =
`allow-deny@1.0.5
autoupdate@1.3.12`;

describe('Meteor project parser', () => {
  test('Parses release', () => {
    const packages = parseRelease('METEOR@2.4.6-beta.8');

    expect(packages).toEqual({
      'meteor-tool': { '2.4.6-beta.8': true }
    });
  });

  test('Parses and merges package versions', () => {
    const packages = parseVersions(versionsList, {
      'babel-compiler': { '6.19.1': true }
    });

    expect(packages).toEqual({
      'allow-deny': { '1.0.5': true },
      'autoupdate': { '1.3.12': true },
      'babel-compiler': { '6.19.1': true }
    });
  });
});
