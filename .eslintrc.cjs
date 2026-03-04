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
    "react",
    "react-hooks"
  ],

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],

  ignorePatterns: [
    "dist",
    "node_modules"
  ]
};
