// Write your rule here!
// Name your rule like noConsoleLog
// MessageId should be also noConsoleLog

import { ESLintUtils, TSESTree } from "@typescript-eslint/utils";

interface MyPluginDocs {
  recommended: boolean;
}

const createRule = ESLintUtils.RuleCreator<MyPluginDocs>(
  (name) =>
    `https://github.com/blackkat02/linter/blob/main/docs/rules/${name}.md`
);

// 🔧 Допоміжна функція з правильною типізацією та перевірками
const _isConsoleAccess = (node: TSESTree.Expression): boolean => {
  if (node.type === "Identifier" && node.name === "console") {
    return true;
  }

  if (node.type === "MemberExpression") {
    const object = node.object;
    const property = node.property;

    const propertyName =
      property.type === "Identifier" ? property.name : undefined;

    const objectName = object.type === "Identifier" ? object.name : undefined;

    if (objectName === "window" && propertyName === "console") {
      return true;
    }

    return _isConsoleAccess(object); // рекурсивний виклик
  }

  return false;
};

export const noConsoleLog = createRule({
  name: "no-console-log",
  meta: {
    type: "problem",
    docs: {
      description: "Забороняє пряме використання console.log().",
      recommended: true,
      url: "https://github.com/blackkat02/linter/blob/main/docs/rules/no-console-log.md",
    },
    messages: {
      noConsoleLog:
        "Виклик 'console.log' заборонено. Використовуйте спеціалізований логер.",
    },
    schema: [],
  },
  defaultOptions: [],

  create(context) {
    return {
      CallExpression(callNode: TSESTree.CallExpression) {
        const callee = callNode.callee;

        if (callee.type === "MemberExpression") {
          const memberNode = callee;

          if (
            memberNode.property.type === "Identifier" &&
            memberNode.property.name === "log" &&
            _isConsoleAccess(memberNode.object)
          ) {
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
