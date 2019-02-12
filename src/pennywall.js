#!/usr/bin/env node

const program = require('commander');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const pennywall = require('./index');

function writeFiles(outPath, html, js, css) {
  pennywall.log(chalk.green('building pennywall into'), outPath);
  fs.ensureDirSync(outPath);
  fs.writeFileSync(path.join(outPath, 'index.html'), html);
  fs.writeFileSync(path.join(outPath, 'index.js'), js);
  fs.writeFileSync(path.join(outPath, 'index.css'), css);
}

function copyAssets(outPath, themePath) {
  const assetPath = path.join(outPath, 'assets');
  pennywall.log(chalk.green('copying pennywall assets into'), assetPath);
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
    const config = pennywall.readConfig(configFile);

    if (cmd) {
      if (cmd.apiKey) {
        config.apiKey = cmd.apiKey;
      }
    }

    const outPath = cmd.parent.outpath || 'build/';
    const themePath = pennywall.getThemePath(
      config.theme.name,
      cmd.parent.themepath,
    );
    const assetPath = cmd.parent.shared ? '../assets' : 'assets';

    const files = pennywall.build(themePath, assetPath, config);
    writeFiles(outPath, files.html, files.js, files.css);
    copyAssets(outPath, themePath);
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
