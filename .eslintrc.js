module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // отключаю, т.к. в классе использую underscore для имен приватных методов
    'no-underscore-dangle': 'off',
    // пришлось отключить, т.к. линтер ругается на изменение
    // DOM-элементов через textContent и innerHTML
    'no-param-reassign': 'off',
  },
};
