'use strict';

const chalk = require('chalk');

const done = chalk`{bold.green Done}`;

function formatBytes(bytes) {
  return Math.round(bytes / (1024 * 1024));
}

module.exports = {
  analyzing: '> Analyzing packages...',
  scanning: '> Scanning Meteor projects...',
  confirmation: chalk`[{green ?}] Do you want to remove these packages? (yN) `,
  removing: '> Removing packages...',
  done,

  packagesTotal: (bytes, cached) => {
    const
      cachedText = cached ? ' (cached)' : '',
      sizeText = chalk`{bold ${formatBytes(bytes)} MiB}`;

    return `${done}${cachedText} Total size: ${sizeText}`;
  },

  versionsTotal: (count) => {
    const countText = chalk`{bold ${count}}`;
    return `${done} Used package versions: ${countText}`;
  },

  savings: (bytes) => {
    const sizeText = chalk`{bold ${formatBytes(bytes)} MiB}`;
    return `> ${sizeText} of packages are about to be removed.`;
  }
};
