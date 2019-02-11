#!/usr/bin/env node

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

function getThemePath(themeName, basePath) {
  const themePath = path.join(basePath || 'themes', themeName);

  if (!fs.existsSync(themePath)) {
    fatal(`could not find theme "${themeName}" in ${themePath}`);
  }

  return themePath;
}

function readConfig(file) {
  const data = fs.readFileSync(mustExist(file));
  return JSON.parse(data.toString());
}

function validate(config) {
  const stringTooLong = (s, len) => typeof s !== 'string' || s.length > (len || 180);

  if (!config.apiKey) {
    return [false, 'Missing API key (apiKey)'];
  }

  if (!config.merchant || stringTooLong(config.merchant.name)) {
    return [false, 'Invalid (or missing) merchant name (merchant.name)'];
  }

  if (!config.product) {
    return [false, 'Missing product information (product)'];
  }

  const missingProductFields = [
    'id',
    'name',
    'description',
    'url',
    'currency',
  ].filter(field => stringTooLong(config.product[field]));

  if (missingProductFields.length > 0) {
    return [
      false,
      `Missing product field(s): ${missingProductFields.join(', ')}`,
    ];
  }

  if (config.product.currency.length !== 3) {
    return [
      false,
      `Invalid currency (product.currency): ${config.product.currency}`,
    ];
  }

  if (typeof config.product.price !== 'number') {
    return [false, `Invalid price (product.price): ${config.product.price}`];
  }

  return [true, 'ok'];
}

function build(themePath, assetPath, params) {
  const [success, message] = validate(params);
  if (!success) {
    throw new Error(`Config error: ${message}`);
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

  return { html, js, css: css.css };
}

module.exports = {
  validate,
  build,
  readConfig,
  getThemePath,
  mustExist,
  log,
  fatal,
};
