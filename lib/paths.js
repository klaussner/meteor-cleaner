'use strict';

const os = require('os');
const path = require('path');

const home = os.homedir();

module.exports = {
  meteor: path.join(home, '.meteor', 'meteor'),
  packages: path.join(home, '.meteor', 'packages'),
  cache: path.join(home, '.meteor-cleaner-cache')
};
