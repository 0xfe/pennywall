#!/usr/bin/env node

const program = require('commander');
const handlebars = require('handlebars');
const fs = require('fs-extra');
const path = require('path');
const sass = require('node-sass');

function log(...args) {
  // eslint-disable-next-line
  console.log(...args);
}

function readConfig(file) {
  const data = fs.readFileSync(file);
  return JSON.parse(data.toString());
}

function build(params) {
  const themeName = params.theme.name;
  const themePath = path.join('themes', themeName);

  // Load index page
  const index = path.join(themePath, 'index.hbs');

  // Load SASS
  let sassFile = path.join(themePath, 'index.scss');
  if (params.theme.palette) {
    sassFile = path.join(themePath, `index-${params.theme.palette}.scss`);
  }

  // Load index JS
  const jsFile = path.join(themePath, 'index.js');

  const theme = fs.readFileSync(index).toString();
  const template = handlebars.compile(theme);
  const html = template(params);

  const jsTemplate = handlebars.compile(fs.readFileSync(jsFile).toString());
  const js = jsTemplate(params);

  const outPath = 'build';
  log('generating assets into', outPath);
  fs.ensureDirSync(outPath);

  const css = sass.renderSync({
    file: sassFile,
    outFile: path.join(outPath, 'index.css'),
  });

  fs.writeFileSync(path.join(outPath, 'index.html'), html);
  fs.writeFileSync(path.join(outPath, 'index.js'), js);
  fs.writeFileSync(path.join(outPath, 'index.css'), css.css);
  fs.copySync(path.join(themePath, 'assets'), path.join(outPath, 'assets'));
}

program
  .version('0.0.1')
  .command('build [optional]')
  .description('build pennywall')
  .option('--apiKey [apiKey]', 'QUID API Key')
  .option('--title [title]', 'Page title')
  .action((_, options) => {
    const config = readConfig('pennywall.json');

    if (options) {
      if (options.apiKey) {
        config.apiKey = options.apiKey;
      }
    }

    build(config);
  });

program.parse(process.argv); // notice that we have to parse in a new statement.
