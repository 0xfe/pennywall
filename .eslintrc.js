module.exports = {
  plugins: ["mocha"],
  parser: "babel-eslint",
  env: {
    browser: true,
    jquery: true,
    es6: true,
    node: true,
    mocha: true
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 6
  },
  rules: {
    "max-len": [1, 180, 2, { ignoreComments: true }],
    "mocha/no-exclusive-tests": "error"
  },
  extends: ["airbnb-base"]
};
