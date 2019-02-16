#!/usr/bin/env node

const handlebars = require('handlebars');
const fs = require('fs-extra');
const path = require('path');
const sass = require('node-sass');
const { validate } = require('./validations');
const { ThemeManager } = require('./themes');

function mustExist(file) {
  if (!fs.existsSync(file)) {
    throw new Error(`could not read file: ${file}`);
  }

  return file;
}

class Pennywall {
  constructor(options) {
    this.assetPath = (options && options.assetPath) || 'assets';
    this.themeManager = (options && options.themeManager) || new ThemeManager();
    this.reset();
  }

  reset() {
    this.output = {
      success: false,
      html: '',
      js: '',
      css: '',
    };
  }

  loadConfig(file) {
    const data = fs.readFileSync(mustExist(file));
    this.config = JSON.parse(data.toString());
    return this.config;
  }

  setConfig(config) {
    this.config = config;
    return this;
  }

  validate() {
    return validate(this.config, this.themeManager);
  }

  build() {
    this.reset();
    const [success, message] = this.validate();
    this.themePath = this.themeManager.getPath(this.config.theme.name);
    if (!success) {
      return { success, message };
    }

    // Load index page
    const indexFile = mustExist(path.join(this.themePath, 'index.hbs'));

    // Load SASS
    const sassFile = mustExist(this.config.theme.palette ? path.join(this.themePath, `index-${this.config.theme.palette}.scss`) : path.join(this.themePath, 'index.scss'));

    // Load index JS
    const jsFile = mustExist(path.join(this.themePath, 'index.js'));

    // Create output path

    let html;
    let js;
    let css;

    try {
      const jsTemplate = handlebars.compile(fs.readFileSync(jsFile).toString());
      js = jsTemplate(this.config);

      const htmlTemplate = handlebars.compile(fs.readFileSync(indexFile).toString());

      const newParams = this.config;
      newParams.assetPath = this.assetPath;
      html = htmlTemplate(newParams);

      css = sass.renderSync({
        file: sassFile,
        outFile: 'index.css',
      });
    } catch (e) {
      return { success: false, message: e };
    }

    this.output = {
      success: true,
      html,
      js,
      css: css.css,
    };

    return this.output;
  }
}

module.exports = { Pennywall, ThemeManager };
