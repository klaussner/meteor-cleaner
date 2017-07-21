'use strict';

const fs = require('fs');
const path = require('path');

const eachFile = require('./each-file.js');

module.exports = function directorySize(rootPath) {
  let size = 0;

  eachFile(rootPath, (filePath) => {
    try {
      const stats = fs.lstatSync(filePath);

      size += stats.isDirectory()
        ? directorySize(filePath)
        : stats.size;
    } catch (e) {
      // Ignore files that cannot be checked.
    }
  });

  return size;
};
