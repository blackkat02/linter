// Custom ESLint rule: no-console-log
// Purpose: Disallow direct usage of console.log() in the project
// MessageId: noConsoleLog

import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

// Added manually to satisfy generics for RuleCreator (matches TS-ESLint docs format)
interface MyPluginDocs {
  recommended: boolean;
}

const createRule = ESLintUtils.RuleCreator<MyPluginDocs>(
  (name) =>
    `https://github.com/blackkat02/linter/blob/main/docs/rules/${name}.md`
);

function _isNodeConsoleIdentifier(node: TSESTree.Expression): boolean {
  if (node.type === "Identifier" && node.name === "console") {
    return true;
  }
  return false;
}

/* Checks for global aliases like `window.console` / `global.console` / `globalThis.console` */
function _isGlobalAlias(node: TSESTree.MemberExpression): boolean {
  const propertyName =
    node.property.type === "Identifier" ? node.property.name : undefined;

  if (propertyName !== "console") return false;

  const objectName =
    node.object.type === "Identifier" ? node.object.name : undefined;

  if (
    objectName === "window" ||
    objectName === "global" ||
    objectName === "globalThis"
  ) {
    return true;
  } else {
    return false;
  }
}

/* Recursively walks MemberExpression chains to detect console access.
   Handles patterns like:
   - console.log
   - window.console.log
   - globalThis.console.log
*/
const _findConsoleRecursive = (node: TSESTree.Expression): boolean => {
  // Base case: reached `console`
  if (_isNodeConsoleIdentifier(node)) return true;

  // Recursive descent through MemberExpressions
  if (node.type === "MemberExpression") {
    if (_isGlobalAlias(node)) return true;
    return _findConsoleRecursive(node.object);
  }

  return false;
};

export const noConsoleLog = createRule({
  name: "no-console-log",
  meta: {
    type: "problem",
    docs: {
      description: "Disallow direct usage of console.log().",
      recommended: true,
      url: "https://github.com/blackkat02/linter/blob/main/docs/rules/no-console-log.md",
    },
    messages: {
      noConsoleLog:
        "Usage of 'console.log' is disallowed. Use a specialized logger.",
    },
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    return {
      /*
       * Visitor: Targets function calls (CallExpression).
       * Purpose: Ensures the rule only checks for actual EXECUTION of the method
       * (e.g., console.log('msg')) and ignores simple reference assignments
       * (e.g., const log = console.log;).
       */
      CallExpression(callNode: TSESTree.CallExpression) {
        const callee = callNode.callee;

        if (callee.type === "MemberExpression") {
          const memberNode = callee;

          const isLogCall =
            memberNode.property.type === "Identifier" &&
            memberNode.property.name === "log";

          if (isLogCall && _findConsoleRecursive(memberNode.object)) {
            context.report({
              node: memberNode.property,
              messageId: "noConsoleLog",
            });
          }
        }
      },
    };
  },
});
