const directorySize = require('../lib/directory-size.js');

describe('Directory size', () => {
  test('Measures size of nested directories', () => {
    const size = directorySize('./tests/fixtures/size-test');

    expect(size).toBe(9);
  });
});
