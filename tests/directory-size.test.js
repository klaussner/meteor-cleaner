'use strict';

const directorySize = require('../lib/directory-size.js');

describe('Directory size', () => {
  test('Measure the size of nested directories', () => {
    const size = directorySize('./tests/fixtures/size-test');

    expect(size).toBe(9);
  });
});
