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

function getThemePath(themeName) {
  const themePath = path.join('themes', themeName);

  if (!fs.existsSync(themePath)) {
    fatal(`could not find theme "${themeName}" in ${themePath}`);
  }

  return themePath;
}

function build(themePath, assetPath, params) {
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

  let html;
  let js;
  let css;

  try {
    const jsTemplate = handlebars.compile(fs.readFileSync(jsFile).toString());
    js = jsTemplate(params);

    const htmlTemplate = handlebars.compile(
      fs.readFileSync(indexFile).toString(),
    );

    const newParams = params;
    newParams.assetPath = assetPath;
    html = htmlTemplate(newParams);

    css = sass.renderSync({
      file: sassFile,
      outFile: 'index.css',
    });
  } catch (e) {
    fatal(e);
  }

  return { html, js, css };
}

function writeFiles(outPath, html, js, css) {
  log(chalk.green('building pennywall into'), outPath);
  fs.ensureDirSync(outPath);
  fs.writeFileSync(path.join(outPath, 'index.html'), html);
  fs.writeFileSync(path.join(outPath, 'index.js'), js);
  fs.writeFileSync(path.join(outPath, 'index.css'), css.css);
}

function copyAssets(outPath, themePath) {
  const assetPath = path.join(outPath, 'assets');
  log(chalk.green('copying pennywall assets into'), assetPath);
  fs.copySync(path.join(themePath, 'assets'), assetPath);
}

program
  .version('0.0.1')
  .option('-c, --config [config]', 'set configuration file')
  .option('-o, --outpath [outpath]', 'generate files to path')
  .option('--shared', 'shared asset path (for hosted environments)')
  .command('build')
  .option('-k, --apiKey [quidApiKey]', 'override QUID API key')
  .description('build pennywall using config file')
  .action((cmd) => {
    const configFile = cmd.parent.config || 'pennywall.json';
    const config = readConfig(configFile);

    if (cmd) {
      if (cmd.apiKey) {
        config.apiKey = cmd.apiKey;
      }
    }

    log(cmd);
    const outPath = cmd.parent.outpath || 'build/';
    const themePath = getThemePath(config.theme.name);
    const assetPath = cmd.parent.shared ? '../assets' : 'assets';

    const files = build(themePath, assetPath, config);
    writeFiles(outPath, files.html, files.js, files.css);
    copyAssets(outPath, getThemePath(config.theme.name));
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

module.exports = { build };
