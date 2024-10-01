import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ["**/node_modules/", "**/dist/"],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ),
  {
    plugins: {
      react,
      // @ts-ignore
      "react-hooks": fixupPluginRules(reactHooks),
      "@typescript-eslint": typescriptEslint,
      prettier,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "react/prop-types": "off",
      ...reactHooks.configs.recommended.rules,
    },
  },
];
