module.exports = {
  "env": {
      node: true
  },
  "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended"
  ],
  "overrides": [
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module"
  },
  "plugins": [
      "@typescript-eslint"
  ],
  "rules": {
      "no-console": 1
  }
}