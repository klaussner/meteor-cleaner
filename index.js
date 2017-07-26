const program = require('commander');
const run = require('./lib/run.js');
const tool = require('./package.json');

program
  .version(tool.version)

  // Cleaning modes
  .option(
    '-l, --keep-latest <n>',
    'keep the <n> latest versions of each package',
    parseInt
  )
  .option(
    '-s, --keep-scanned <path>',
    'keep all versions used by Meteor projects in <path>'
  )
  .option(
    '-f, --keep-final',
    'keep final releases (no pre-releases)'
  )

  // Additional options
  .option('-y, --yes', "don't ask for confirmation")
  .option('--ignore-cache', "ignore the analysis cache")

  .parse(process.argv);

run(program);
