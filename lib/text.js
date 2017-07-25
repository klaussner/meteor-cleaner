'use strict';

const chalk = require('chalk');

// Formats the given byte size, depending on how large it is.
function formatBytes(bytes) {
  let unit = 'MiB';
  let size = Math.round(bytes / (1024 * 1024));

  if (size > 1024) {
    unit = 'GiB';
    size = (size / 1024).toFixed(2);
  }

  return `${size} ${unit}`;
}

const done = chalk`{bold.green Done}`;

const text = {
  analyzing: '› Analyzing packages...',
  scanning: '› Scanning Meteor projects...',
  confirmation: chalk`{green ?} Do you want to remove these packages? (yN) `,
  removing: '› Removing packages...',
  done,

  packagesTotal: (bytes, cached) => {
    const
      cachedText = cached ? ' (cached)' : '',
      sizeText = chalk`{bold ${formatBytes(bytes)}}`;

    return `${done}${cachedText} Total size: ${sizeText}`;
  },

  versionsTotal: (count) => {
    const countText = chalk`{bold ${count}}`;
    return `${done} Used package versions: ${countText}`;
  },

  savings: (bytes) => {
    const sizeText = chalk`{bold ${formatBytes(bytes)}}`;
    return `› ${sizeText} of packages are about to be removed.`;
  }
};

module.exports = {
  text, formatBytes
};
