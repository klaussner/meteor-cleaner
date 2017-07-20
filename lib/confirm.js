const readline = require('readline');

// Asks the user for confirmation. The returned promise is resolved with `true`
// for user input that starts with `y` (the default is `false`).
module.exports = function confirm(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const promise = new Promise((resolve) => {
    let confirmed = false;

    rl.question(question, (answer) => {
      if (answer.trim().toLocaleLowerCase().startsWith('y')) {
        confirmed = true;
      }

      rl.close();
      resolve(confirmed);
    });
  });

  return promise;
};
