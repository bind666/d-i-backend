// import js from "@eslint/js";
// import globals from "globals";
// import tseslint from "typescript-eslint";
// import { defineConfig } from "eslint/config";

// export default defineConfig([
//   { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
//   tseslint.configs.recommended,
// ]);
// import js from "@eslint/js";
// import globals from "globals";
// import tseslint from "typescript-eslint";
// import prettier from "eslint-config-prettier";
// import { defineConfig } from "eslint/config";

// export default defineConfig([
//     {
//         files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
//         plugins: {
//             js,
//         },
//         languageOptions: {
//             ecmaVersion: "latest",
//             sourceType: "module",
//             globals: {
//                 ...globals.node,
//                 ...globals.es2021,
//             },
//         },
//         rules: {
//             ...js.configs.recommended.rules,
//         },
//     },
//     ...tseslint.configs.recommended,
//     {
//         rules: {
//             ...prettier.rules, // 👈 disables rules that conflict with Prettier
//         },
//     },
//     {
//         rules: {
//             "@typescript-eslint/no-explicit-any": "off", // 👈 disables the rule
//         },
//     },
// ]);

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        ignores: ["node_modules", "dist", "build", "*.config.js"],
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: {
            js,
        },
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.es2021,
            },
        },
        rules: {
            ...js.configs.recommended.rules,
        },
    },
    ...tseslint.configs.recommended,
    {
        rules: {
            ...prettier.rules, // disables rules that conflict with Prettier
        },
    },
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "off", // disables the rule
        },
    },
]);
