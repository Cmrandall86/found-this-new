import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config} */
export default [
  { 
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module", // Allows the use of import/export statements
      },
      globals: { ...globals.browser, process: "readonly" }
    }
  },
  pluginJs.configs.recommended,
  pluginReact.configs.recommended,
  {
    rules: {
      "react/prop-types": "off" // Turn off prop-types check
    }
  }
];
