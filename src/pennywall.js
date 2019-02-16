#!/usr/bin/env node

const program = require('commander');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { Pennywall, ThemeManager } = require('./index');

function log(...args) {
  // eslint-disable-next-line
  console.log(...args);
}

function writeFiles(outPath, html, js, css) {
  log(chalk.green('building pennywall into'), outPath);
  fs.ensureDirSync(outPath);
  fs.writeFileSync(path.join(outPath, 'index.html'), html);
  fs.writeFileSync(path.join(outPath, 'index.js'), js);
  fs.writeFileSync(path.join(outPath, 'index.css'), css);
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
  .option('--themepath [themepath]', 'path to themes')
  .option('--shared', 'shared asset path (for hosted environments)')
  .command('build')
  .option('-k, --apiKey [quidApiKey]', 'override QUID API key')
  .description('build pennywall using config file')
  .action((cmd) => {
    const configFile = cmd.parent.config || 'pennywall.json';
    const assetPath = cmd.parent.shared ? '../assets' : 'assets';

    const themeManager = new ThemeManager(cmd.parent.themepath);
    const pennywall = new Pennywall({ assetPath, themeManager });

    const config = pennywall.loadConfig(configFile);

    if (cmd) {
      if (cmd.apiKey) {
        // HACK BEWARE: here be dragons
        config.apiKey = cmd.apiKey;
        pennywall.setConfig(config);
      }
    }

    const outPath = cmd.parent.outpath || 'build/';

    const files = pennywall.build();
    writeFiles(outPath, files.html, files.js, files.css);
    copyAssets(outPath, themeManager.getPath(config.theme.name));
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
