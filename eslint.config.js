import noConsoleLogRule from "./dist/no-console-log.js";
import parser from "@typescript-eslint/parser";

export default [
  {
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      custom: {
        rules: {
          "no-console-log": noConsoleLogRule,
        },
      },
    },
    rules: {
      "custom/no-console-log": "error",
    },
  },
];
