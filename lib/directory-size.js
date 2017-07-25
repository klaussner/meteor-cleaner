'use strict';

const fs = require('fs');
const eachFile = require('./each-file.js');

module.exports = function directorySize(rootPath) {
  let size = 0;

  eachFile(rootPath, (filePath) => {
    try {
      const status = fs.lstatSync(filePath);

      size += status.isDirectory()
        ? directorySize(filePath)
        : status.size;
    } catch (e) {
      // Ignore files that cannot be checked.
    }
  });

  return size;
};
