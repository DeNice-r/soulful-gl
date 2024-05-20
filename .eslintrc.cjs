/** @type {import("eslint").Linter.Config} */
const config = {
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": true,
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "react",
        "unused-imports"
    ],
    "extends": [
        "next/core-web-vitals",
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:@typescript-eslint/recommended",
        "eslint:recommended",
        "prettier",
        "plugin:prettier/recommended"
    ],
    "rules": {
        "react-hooks/exhaustive-deps": "off",

        "@typescript-eslint/consistent-type-imports": [
            "error",
            {
                "prefer": "type-imports",
                "fixStyle": "inline-type-imports"
            }
        ],
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/no-misused-promises": [
            "error",
            {
                "checksVoidReturn": {
                    "attributes": false
                }
            }
        ],
        "@typescript-eslint/no-explicit-any": "error",
        "prettier/prettier": "error",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "unused-imports/no-unused-vars": [
            "warn",
            {
                "vars": "all",
                "varsIgnorePattern": "^_",
                "args": "after-used",
                "argsIgnorePattern": "^_"
            }
        ],
        "unused-imports/no-unused-imports": "error",
        "no-undef": "off",  // Recommended to turn off for TypeScript https://typescript-eslint.io/troubleshooting/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
        "indent": "off"
    }
}
module.exports = config;
