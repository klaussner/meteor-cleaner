const {
  parseRelease, parseVersions
} = require('../lib/scan-projects.js');

const versionsList =
`allow-deny@1.0.5
autoupdate@1.3.12`;

describe('Analyze projects', () => {
  test('Parse Meteor release', () => {
    // Regular version
    expect(parseRelease('METEOR@2.4.6')).toEqual({
      'meteor-tool': {
        '2.4.6': true
      }
    });

    // Fourth version component
    expect(parseRelease('METEOR@2.4.6.8')).toEqual({
      'meteor-tool': {
        '2.4.6_8': true
      }
    });

    // Pre-release
    expect(parseRelease('METEOR@2.4.6-beta.8')).toEqual({
      'meteor-tool': {
        '2.4.6-beta.8': true
      }
    });

    // Fourth version component & pre-release
    expect(parseRelease('METEOR@2.4.6.8-beta.10')).toEqual({
      'meteor-tool': {
        '2.4.6-8-beta.10': true
      }
    });

    // Created from a checkout
    expect(parseRelease('none')).toEqual({});
  });

  test('Parse and merge package versions', () => {
    const packages = parseVersions(versionsList, {
      'babel-compiler': {
        '6.19.1': true
      }
    });

    expect(packages).toEqual({
      'allow-deny': {
        '1.0.5': true
      },
      'autoupdate': {
        '1.3.12': true
      },
      'babel-compiler': {
        '6.19.1': true
      }
    });
  });
});
