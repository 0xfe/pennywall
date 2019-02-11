const assert = require('assert');
const pennywall = require('./index');

const goodConfig = {
  apiKey: 'kt-JH7P34VV62F3LUH3QC01N99LIIKIA8V7',
  merchant: {
    name: "Kev's Vegan Blog",
  },
  product: {
    id: '10001',
    name: 'Online donation',
    description: "Donation to Kev's Vegan Blog",
    url: 'https://kevsveganblog.com/donate',
    price: 1.0,
    currency: 'CAD',
  },
  destination: {
    url: 'https://kevsveganblog.com',
    method: 'GET',
    sendReceipt: false,
  },
  button: {
    slider: true,
    palette: 'dark',
    min: 0,
    max: 2,
    text: 'DONATE',
    paidText: 'THANKS FOR DONATING!',
  },
  theme: {
    name: 'heart',
    palette: 'maroon',
    icon: 'face',
    title: "Donate to Kev's Vegan Blog",
    message:
      'This site is supported with your donations. Please consider adding a tip.',
    allowSkip: true,
    skipText: "No thanks! Take me Kev's Vegan Blog.",
  },
};

describe('Validations', () => {
  describe('good config', () => {
    it('should validate', () => {
      const [result, message] = pennywall.validate(goodConfig);
      assert.equal(message, 'ok');
      assert.equal(result, true);
    });
  });

  describe('merchant', () => {
    it('should validate name', () => {
      const [result, message] = pennywall.validate({
        ...goodConfig,
        ...{ merchant: {} },
      });

      assert.notEqual(message, 'ok');
      assert.equal(result, false);
    });
  });

  describe('product', () => {
    it('missing product', () => {
      const [result, message] = pennywall.validate({
        ...goodConfig,
        ...{ product: {} },
      });

      assert.notEqual(message, 'ok');
      assert.equal(result, false);
    });
  });

  it('missing fields', () => {
    const [result, message] = pennywall.validate({
      ...goodConfig,
      ...{ product: { id: '0002' } },
    });

    assert.notEqual(message, 'ok');
    assert.equal(result, false);
  });

  it('bad price', () => {
    const [result, message] = pennywall.validate({
      ...goodConfig,
      ...{ product: { ...goodConfig.product, ...{ price: 'abc' } } },
    });

    assert.notEqual(message, 'ok');
    assert.equal(result, false);
  });

  it('bad currency', () => {
    const [result, message] = pennywall.validate({
      ...goodConfig,
      ...{ product: { ...goodConfig.product, ...{ currency: 'FIDD' } } },
    });

    assert.notEqual(message, 'ok');
    assert.equal(result, false);
  });
});
