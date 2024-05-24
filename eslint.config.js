import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import prettierConfig from "eslint-config-prettier";
import standardConfig from "eslint-config-standard";
import standardJsxConfig from "eslint-config-standard-jsx";
import standardReactConfig from "eslint-config-standard-react";
import tseslint from "typescript-eslint";

const compat = new FlatCompat();

export default tseslint.config(
  // Base
  eslint.configs.recommended,

  // Standard
  // necessary to transform to flat config until the npm packages are updated
  ...compat.config(standardConfig),
  ...compat.config(standardReactConfig),
  ...compat.config(standardJsxConfig),

  // Next
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    ignores: [".next/*"],
  },

  // TypeScript
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },

  // Custom rules
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true },
      ],
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: false,
          allowNullableBoolean: false,
          allowNullableString: false,
          allowNullableNumber: false,
          allowAny: false,
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "inline-type-imports",
        },
      ],
      "react/react-in-jsx-scope": "off",
    },
  },

  // Prettier
  prettierConfig,

  // Disable type-aware linting for config files
  {
    files: ["*.config.[j|t]s"],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
