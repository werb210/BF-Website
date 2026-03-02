module.exports = {
  root: true,

  ignorePatterns: [
    "node_modules/",
    "dist/",
    "vendor/",
    "coverage/",
  ],

  env: {
    es2022: true,
  },

  overrides: [
    // Browser code (client)
    {
      files: ["client/**/*.{js,ts,tsx}"],
      env: {
        browser: true,
        node: false,
      },
      parserOptions: {
        sourceType: "module",
      },
      rules: {
        "no-undef": "off",
      },
    },

    // Server + Node scripts
    {
      files: [
        "server/**/*.js",
        "scripts/**/*.js",
        "client/scripts/**/*.js",
      ],
      env: {
        node: true,
        browser: false,
      },
      parserOptions: {
        sourceType: "script",
      },
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "no-undef": "off",
      },
    },
  ],
};
