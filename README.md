Linter Core

This project contains a minimal, yet fully functional ESLint plugin core implemented within a single file. It focuses on reliably preventing console.log usage with high precision.


Core Functionality (Single File)

The entire rule code, including the AST traversal logic and helper functions, resides in src/no-console-log.ts.

Rule: no-console-log
Goal: To prohibit the call of console.log().


Key Architectural Solutions

We utilize advanced syntactic analysis to ensure the rule is robust and accurate in complex scenarios, while maintaining ease of configuration.

Call vs. Assignment -- "The CallExpression Visitor is used, which ignores simple reference assignments like const log = console.log;."
Nested Access -- "A recursive function (_traverseConsoleAccess) is implemented to correctly handle chains of access, such as window.console.log."
Code Cleanliness -- Logic is broken into unexported private functions to ensure Single Responsibility Principle (SRP) compliance.


Testing

To confirm reliability, the rule successfully passes all tests, including the scenario that allows aliases for console (e.g., myLogger.log('msg')) when defined locally.

npm run test