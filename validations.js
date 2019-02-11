const validThemes = ['heart'];
const validButtonPalettes = ['default', 'dark', 'blue', 'maroon', 'green', 'red', 'orange'];
const validThemePalettes = ['maroon', 'metal'];

function validate(config) {
  const stringTooLong = (s, len) => typeof s !== 'string' || s.length > (len || 180);

  if (!config.apiKey) {
    return [false, 'Missing API key (apiKey)'];
  }

  if (!config.merchant || stringTooLong(config.merchant.name)) {
    return [false, 'Invalid (or missing) merchant name (merchant.name)'];
  }

  if (!config.destination || stringTooLong(config.destination.url, 1024)) {
    return [false, 'Invalid (or missing) destination (destination.url)'];
  }

  if (!config.button) {
    return [false, 'Missing button information (button)'];
  }

  const missingButtonFields = ['palette', 'text', 'paidText'].filter(field => stringTooLong(config.button[field]));
  if (missingButtonFields.length > 0) {
    return [false, `Missing button field(s): ${missingButtonFields.join(', ')}`];
  }

  if (typeof config.button.min !== 'number' || config.button.min < 0 || config.button.min > 2) {
    return [false, 'Bad minimum price (button.min)'];
  }

  if (typeof config.button.max !== 'number' || config.button.max < 0 || config.button.max > 2) {
    return [false, 'Bad maximum price (button.max)'];
  }

  if (!config.product) {
    return [false, 'Missing product information (product)'];
  }

  const missingProductFields = ['id', 'name', 'description', 'url', 'currency'].filter(field => stringTooLong(config.product[field]));
  if (missingProductFields.length > 0) {
    return [false, `Missing product field(s): ${missingProductFields.join(', ')}`];
  }

  if (config.product.currency.length !== 3) {
    return [false, `Invalid currency (product.currency): ${config.product.currency}`];
  }

  if (typeof config.product.price !== 'number') {
    return [false, `Invalid price (product.price): ${config.product.price}`];
  }

  if (typeof config.theme !== 'object') {
    return [false, 'Missing theme information (theme)'];
  }

  const missingThemeFields = ['name', 'palette', 'icon', 'title', 'message', 'skipText'].filter(field => stringTooLong(config.theme[field]));
  if (missingThemeFields.length > 0) {
    return [false, `Missing theme field(s): ${missingThemeFields.join(', ')}`];
  }

  if (!validThemes.includes(config.theme.name)) {
    return [false, `Invalid theme (theme.name): ${config.theme.name}`];
  }

  if (!validThemePalettes.includes(config.theme.palette)) {
    return [false, `Invalid theme palette (theme.palette): ${config.theme.palette}`];
  }

  if (!validButtonPalettes.includes(config.button.palette)) {
    return [false, `Invalid button palette (button.palette): ${config.button.palette}`];
  }

  return [true, 'ok'];
}

module.exports = { validate };
