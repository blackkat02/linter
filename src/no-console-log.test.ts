import { RuleTester } from "@typescript-eslint/rule-tester";
import { noConsoleLog } from "./no-console-log";

const ruleTester = new RuleTester();

ruleTester.run("no-console-log", noConsoleLog, {
  valid: [
    {
      code: `console.error("")`,
    },
    {
      code: `console.warn("")`,
    },
    {
      code: `console.info("")`,
    },
    {
      code: `console.debug("")`,
    },
    {
      code: `console.table({ bar: 1 })`,
    },
    {
      code: `console.trace()`,
    },
    {
      code: `myObject.log("")`,
    },
    {
      code: `const log = console.log;`,
    },
    {
      code: `// console.log("");`,
    },
    {
      code: `
        const customConsole = {
          log: (message) => customLogger(message)
        };
        customConsole.log("");
      `,
    },
    {
      code: `const foo = "console.log(\\"hello\\")";`,
    },
    {
      code: `
        log("message");
      `,
    },
  ],

  invalid: [
    {
      code: `console.log("debug info");`,
      errors: [{ messageId: "noConsoleLog" }],
    },
    {
      code: `
        function foo() {
          console.log("");
        }
      `,
      errors: [{ messageId: "noConsoleLog" }],
    },
    {
      code: `console.log();`,
      errors: [{ messageId: "noConsoleLog" }],
    },
    {
      code: `
        console.log(bar);
      `,
      errors: [{ messageId: "noConsoleLog" }],
    },
    {
      code: `
        if (foo) {
          console.log("");
        }
      `,
      errors: [{ messageId: "noConsoleLog" }],
    },
    {
      code: `window.console.log("");`,
      errors: [{ messageId: "noConsoleLog" }],
    },
    {
      code: `
        console.log("");
        console.error("");
        console.log("");
      `,
      errors: [
        { messageId: "noConsoleLog", line: 2 },
        { messageId: "noConsoleLog", line: 4 },
      ],
    },
  ],
});
