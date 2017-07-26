const program = require('commander');
const run = require('./lib/run.js');

program
  .version('1.0.0')

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

  // Additional options
  .option('-y, --yes', "don't ask for confirmation")
  .option('--ignore-cache', "ignore the analysis cache")

  .parse(process.argv);

run(program);
