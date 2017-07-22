'use strict';

const
  scanner = require('../lib/project-scanner.js'),
  parseRelease = scanner.parseRelease,
  parseVersions = scanner.parseVersions;

const versionsList =
`banana@1.2.3
mango@2.4.6`;

describe('Project scanner', () => {
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
      'papaya': {
        '6.12.18': true
      }
    });

    expect(packages).toEqual({
      'banana': {
        '1.2.3': true
      },
      'mango': {
        '2.4.6': true
      },
      'papaya': {
        '6.12.18': true
      }
    });
  });
});
