module.exports = {
 root: true,
 env: {
   node: true
 },
 extends: [
   'eslint:recommended',
   'plugin:@typescript-eslint/recommended',
   'plugin:vue/recommended',
   '@vue/typescript',
 ],
 plugins: [
   "vue",
   "@typescript-eslint",
 ],
 rules: {
   "@typescript-eslint/ban-ts-ignore": "off",
   "@typescript-eslint/explicit-function-return-type": "off",
   "@typescript-eslint/member-delimiter-style": [
     2,
     {
       "multiline": {
         "delimiter": "none",
         "requireLast": false
       },
       "singleline": {
         "delimiter": "comma",
         "requireLast": false
       }
     }
   ],
   "@typescript-eslint/camelcase": "off",
   "@typescript-eslint/indent": ["error", 2],
   "@typescript-eslint/interface-name-prefix": "off",
   "@typescript-eslint/no-explicit-any": "off",
   "@typescript-eslint/semi": [2, "never"],
   "array-bracket-spacing": [
     "error",
     "always",
     { "singleValue": false, "objectsInArrays": false },
   ],
   "ban-ts-ignore": "off",
   "comma-dangle": ["error", "always-multiline"],
   "curly": ["error", "multi-line"],
   "eol-last": ["error", "always"],
   "indent": "off",
   "import/prefer-default-export": "off",
   "interface-name": 0,
   "linebreak-style": 0,
   'max-len': ['error', 120, 2, {
     ignoreUrls: true,
     ignoreComments: false,
     ignoreRegExpLiterals: true,
     ignoreStrings: true,
     ignoreTemplateLiterals: true,
   }],
   "no-console": ["error", { allow: ["info", "error"] }],
   "no-ex-assign": "error",
   "no-loop-func": "error",
   "no-multi-spaces": "error",
   "no-multiple-empty-lines": 2,
   "no-return-assign": "error",
   "no-return-await": "error",
   "no-script-url": "error",
   "no-self-compare": "error",
   "no-var": "error",
   "object-literal-sort-keys": 0,
   "prefer-const": "error",
   "prefer-template": 2,
   "quotes": ["error", "single"],
   "space-infix-ops": "error",
   "space-unary-ops": [
     2, {
       "words": true,
       "nonwords": false,
       "overrides": {
         "new": false,
         "++": true
       }
     }],
     "spaced-comment": ["error", "always", { "markers": ["/"] }],
     "template-curly-spacing": "error",
     "vue/array-bracket-spacing": [
       "error",
       "always",
       { "singleValue": false, "objectsInArrays": false },
     ],
     "vue/eqeqeq": "error",
     "vue/max-attributes-per-line": ["error", {
       "singleline": 3,
       "multiline": {
         "max": 3,
         "allowFirstLine": false
       }
     }],
     "vue/no-parsing-error": ["error", {
       "invalid-first-character-of-tag-name": false
     }],
     "vue/require-v-for-key": "error",
     "vue/space-infix-ops": "error",
     // "vue/no-v-html": "error",
   }
 };
