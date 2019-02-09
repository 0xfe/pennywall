#!/usr/bin/env node

function log(...args) {
  // eslint-disable-next-line
  console.log(...args);
}

const program = require('commander');

function build(theme) {
  log('build', theme);
}

program
  .version('0.0.1')
  .command('build <theme> [optional]')
  .description('build pennywall')
  .option('-k, --apiKey', 'QUID API Key')
  .action((theme, cmd) => {
    build(theme, cmd);
  });

program.parse(process.argv); // notice that we have to parse in a new statement.
