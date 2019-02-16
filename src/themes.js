const fs = require('fs-extra');
const path = require('path');

const THEMES = {
  heart: {
    name: 'Heart',
    variants: {
      maroon: { name: 'Maroon' },
      metal: { name: 'Metal' },
      blue: { name: 'Blue' },
    },
  },
  vegout: {
    name: 'Foodie',
    variants: {
      maroon: { name: 'Maroon' },
      metal: { name: 'Metal' },
      blue: { name: 'Blue' },
    },
  },
};

const SLIDERS = ['default', 'dark', 'blue', 'maroon', 'green', 'red', 'orange'];

class ThemeManager {
  constructor(options) {
    this.basePath = options && options.basePath;
    this.themes = (options && options.themes) || THEMES;
    this.sliders = (options && options.sliders) || SLIDERS;
  }

  exists(theme, variant) {
    return this.themes[theme] !== undefined && this.themes[theme].variants[variant] !== undefined;
  }

  hasSlider(palette) {
    return this.sliders.includes(palette);
  }

  getPath(themeName) {
    const { basePath } = this;
    if (typeof basePath === 'string' && basePath.length > 0) {
      const themePath = path.join(basePath, themeName);

      if (!fs.existsSync(themePath)) {
        return null;
      }

      return themePath;
    }

    if (fs.existsSync(path.join('themes', themeName))) {
      return path.join('themes', themeName);
    }

    if (fs.existsSync(path.join('node_modules/pennywall/themes', themeName))) {
      return path.join('node_modules/pennywall/themes', themeName);
    }

    return null;
  }
}

module.exports = { ThemeManager };
