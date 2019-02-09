#!/usr/bin/env node

const program = require('commander');
const handlebars = require('handlebars');
const fs = require('fs');


function log(...args) {
  // eslint-disable-next-line
  console.log(...args);
}

function build(themeName) {
  const theme = fs.readFileSync(`${themeName}.hbs`).toString();
  const template = handlebars.compile(theme);
  const html = template({
    title: 'hello',
  });
  log(html);
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
