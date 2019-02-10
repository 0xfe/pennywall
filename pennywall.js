#!/usr/bin/env node

const program = require('commander');
const handlebars = require('handlebars');
const fs = require('fs-extra');
const path = require('path');
const sass = require('node-sass');
const chalk = require('chalk');

function log(...args) {
  // eslint-disable-next-line
  console.log(...args);
}

function fatal(...args) {
  // eslint-disable-next-line
  console.error(chalk.red("ERROR"), ...args);
  process.exit(-1);
}

function mustExist(file) {
  if (!fs.existsSync(file)) {
    fatal(`could not read file: ${file}`);
  }

  return file;
}

function readConfig(file) {
  const data = fs.readFileSync(mustExist(file));
  return JSON.parse(data.toString());
}

function build(params) {
  const themeName = params.theme.name;
  const themePath = path.join('themes', themeName);

  if (!fs.existsSync(themePath)) {
    fatal(`could not find theme "${themeName}" in ${themePath}`);
  }

  // Load index page
  const indexFile = mustExist(path.join(themePath, 'index.hbs'));

  // Load SASS
  const sassFile = mustExist(
    params.theme.palette
      ? path.join(themePath, `index-${params.theme.palette}.scss`)
      : path.join(themePath, 'index.scss'),
  );

  // Load index JS
  const jsFile = mustExist(path.join(themePath, 'index.js'));

  // Create output path
  const outPath = 'build/';
  log(chalk.green('building pennywall into'), outPath);
  fs.ensureDirSync(outPath);

  let html;
  let js;
  let css;

  try {
    const jsTemplate = handlebars.compile(fs.readFileSync(jsFile).toString());
    js = jsTemplate(params);

    const htmlTemplate = handlebars.compile(
      fs.readFileSync(indexFile).toString(),
    );
    html = htmlTemplate(params);

    css = sass.renderSync({
      file: sassFile,
      outFile: path.join(outPath, 'index.css'),
    });
  } catch (e) {
    fatal(e);
  }

  fs.writeFileSync(path.join(outPath, 'index.html'), html);
  fs.writeFileSync(path.join(outPath, 'index.js'), js);
  fs.writeFileSync(path.join(outPath, 'index.css'), css.css);
  fs.copySync(path.join(themePath, 'assets'), path.join(outPath, 'assets'));
}

program
  .version('0.0.1')
  .option('-c, --config [config]', 'enable some foo')
  .command('build')
  .option('-k, --apiKey [override QUID API key]', 'enable some foo')
  .description('build pennywall using config file')
  .action((cmd) => {
    const configFile = cmd.parent.config || 'pennywall.json';
    const config = readConfig(configFile);

    if (cmd) {
      if (cmd.apiKey) {
        config.apiKey = cmd.apiKey;
      }
    }

    build(config);
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
