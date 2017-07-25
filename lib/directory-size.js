'use strict';

const fs = require('fs');
const eachFile = require('./each-file.js');

module.exports = function directorySize(rootPath) {
  let size = 0;

  eachFile(rootPath, (filePath) => {
    try {
      const status = fs.lstatSync(filePath);

      // `status.blocks` stores the number of 512 byte blocks that are allocated
      // for a file or directory.
      size += 512 * status.blocks;

      if (status.isDirectory()) {
        size += directorySize(filePath);
      }
    } catch (e) {
      // Ignore files that cannot be checked.
    }
  });

  return size;
};
