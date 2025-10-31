import eslint from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig } from "eslint/config";
import neostandard from "neostandard";
import tseslint from "typescript-eslint";

export default defineConfig(
  // Base
  eslint.configs.recommended,

  // Standard
  ...neostandard({ noStyle: true }),

  // Next
  ...nextVitals,
  ...nextTs,

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
      // It'd be nice to only disable this rule for the SxProps I don't know how to target
      // types that you don't import explicitly
      "@typescript-eslint/no-misused-spread": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
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
    },
  },

  // Disable type-aware linting for config files
  {
    files: ["*.config.[j|t]s"],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
