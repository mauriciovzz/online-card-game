import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{.ts}"],
    plugins: { js },
    extends: [
      js.configs.recommended,
      tseslint.configs.stylisticTypeChecked,
      tseslint.configs.strictTypeChecked,
      prettier,
      {
        plugins: {
          prettier: eslintPluginPrettier,
        },
        rules: {
          'prettier/prettier': 'error',
        },
      },
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
