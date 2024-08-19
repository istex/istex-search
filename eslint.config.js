import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import neostandard from "neostandard";
import tseslint from "typescript-eslint";

const compat = new FlatCompat();

export default tseslint.config(
  // Base
  eslint.configs.recommended,

  // Standard
  ...neostandard({ noStyle: true }),

  // Next
  ...fixupConfigRules(compat.config(nextPlugin.configs["core-web-vitals"])),
  {
    ignores: [".next/*"],
  },

  // React hooks
  ...fixupConfigRules(compat.config(reactHooksPlugin.configs.recommended)),

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
          caughtErrorsIgnorePattern: "^_",
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

  // Disable type-aware linting for config files
  {
    files: ["*.config.[j|t]s"],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
