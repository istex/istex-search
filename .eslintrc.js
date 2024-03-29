const path = require("path");

/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    "standard-with-typescript",
    "standard-jsx",
    "standard-react",
    "next/core-web-vitals",
    "plugin:@tanstack/eslint-plugin-query/recommended",
    "prettier",
  ],
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json"),
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/ban-types": [
          "error",
          {
            extendDefaults: true,
            types: {
              "{}": false,
            },
          },
        ],
      },
    },
  ],
};
