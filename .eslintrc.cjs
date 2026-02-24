/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    // 🚫 No hex colors in JSX or TS
    "no-restricted-syntax": [
      "error",
      {
        "selector": "Literal[value=/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/]",
        "message": "Hex colors are forbidden. Use brand tokens."
      }
    ],

    // 🚫 No blue Tailwind utilities
    "no-restricted-properties": [
      "error",
      {
        "object": "className",
        "property": "bg-blue",
        "message": "Do not use blue utilities. Use brand tokens."
      }
    ],

    "no-restricted-imports": [
      "error",
      {
        "patterns": ["*blue*"]
      }
    ]
  }
};
