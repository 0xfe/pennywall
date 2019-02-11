#!/usr/bin/env node

const handlebars = require('handlebars');
const fs = require('fs-extra');
const path = require('path');
const sass = require('node-sass');
const chalk = require('chalk');
const validations = require('./validations');

function log(...args) {
  // eslint-disable-next-line
  console.log(...args);
}

function fatal(...args) {
  // eslint-disable-next-line
  console.error(chalk.red('ERROR'), ...args);
  process.exit(-1);
}

function mustExist(file) {
  if (!fs.existsSync(file)) {
    fatal(`could not read file: ${file}`);
  }

  return file;
}

function getThemePath(themeName, basePath) {
  if (typeof basePath === 'string' && basePath.length > 0) {
    const themePath = path.join(basePath, themeName);

    if (!fs.existsSync(themePath)) {
      fatal(`could not find theme "${themeName}" in ${themePath}`);
    }

    return themePath;
  }

  if (fs.existsSync(path.join('themes', themeName))) {
    return path.join('themes', themeName);
  }

  if (fs.existsSync(path.join('node_modules/pennywall/themes', themeName))) {
    return path.join('node_modules/pennywall/themes', themeName);
  }

  fatal(`could not find theme "${themeName}" in themes/ or node_modules/pennywall/themes`);
  return '';
}

function readConfig(file) {
  const data = fs.readFileSync(mustExist(file));
  return JSON.parse(data.toString());
}

function build(themePath, assetPath, params) {
  const [success, message] = validations.validate(params);
  if (!success) {
    throw new Error(`Config error: ${message}`);
  }

  // Load index page
  const indexFile = mustExist(path.join(themePath, 'index.hbs'));

  // Load SASS
  const sassFile = mustExist(params.theme.palette ? path.join(themePath, `index-${params.theme.palette}.scss`) : path.join(themePath, 'index.scss'));

  // Load index JS
  const jsFile = mustExist(path.join(themePath, 'index.js'));

  // Create output path

  let html;
  let js;
  let css;

  try {
    const jsTemplate = handlebars.compile(fs.readFileSync(jsFile).toString());
    js = jsTemplate(params);

    const htmlTemplate = handlebars.compile(fs.readFileSync(indexFile).toString());

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

  return { html, js, css: css.css };
}

module.exports = {
  validate: validations.validate,
  build,
  readConfig,
  getThemePath,
  mustExist,
  log,
  fatal,
};
