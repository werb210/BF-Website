module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },

  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },

  settings: {
    react: {
      version: "detect"
    }
  },

  plugins: [
    "@typescript-eslint",
    "react"
  ],

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime"
  ],

  ignorePatterns: [
    "dist",
    "node_modules",
    "vendor",
    "client/scripts",
    "scripts"
  ],

  rules: {
    "@typescript-eslint/no-require-imports": "off",
    "react/prop-types": "off",
    "react/no-unescaped-entities": "off",
    "react/no-unknown-property": "off",
    "@typescript-eslint/no-unused-vars": "off"
  }
};
