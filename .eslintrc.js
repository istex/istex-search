const path = require("path");

/** @type {import('eslint').Linter.Config} */
module.exports = {
  plugins: ["cypress"],
  extends: [
    "standard-with-typescript",
    "standard-jsx",
    "standard-react",
    "next/core-web-vitals",
    "prettier",
    "plugin:cypress/recommended",
  ],
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json"),
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
  },
};
