const os = require('os');
const path = require('path');

const home = os.homedir();

module.exports = {
  packagesPath: path.join(home, '.meteor', 'packages'),
  cachePath: path.join(home, '.meteor-cleaner-cache')
};
