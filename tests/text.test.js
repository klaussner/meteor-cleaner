'use strict';

const formatBytes = require('../lib/text.js').formatBytes;

describe('Text formatting', () => {
  test('Small size (MiB)', () => {
    expect(formatBytes(1024 * 1024)).toBe('1 MiB');
  });

  test('Large size (GiB)', () => {
    const onePointFiveGiB = 1024 * 1024 * (1024 + 512);
    expect(formatBytes(onePointFiveGiB)).toBe('1.50 GiB');
  });
});
