'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function eachFile(rootPath, callback) {
  fs.readdirSync(rootPath).forEach((fileName) => {
    callback(path.join(rootPath, fileName), fileName);
  });
};
