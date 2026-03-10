const js = require("@eslint/js");

module.exports = [
  {
    ignores: ["node_modules/**", "public/**"],
  },
  {
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        process: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
      },
    },
    rules: {
  "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
  "no-console": "off",
  "no-undef": "error",
},
  },
];