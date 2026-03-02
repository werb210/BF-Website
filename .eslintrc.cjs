module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
    es2022: true,
  },

  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },

  plugins: ["@typescript-eslint"],

  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],

  ignorePatterns: ["node_modules/", "dist/", "vendor/", "coverage/"],

  overrides: [
    {
      files: ["server/**/*.js", "scripts/**/*.js", "client/scripts/**/*.js"],
      parserOptions: {
        sourceType: "script",
      },
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-require-imports": "off",
      },
    },
  ],
};
