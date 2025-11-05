import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tailwind from "eslint-plugin-tailwindcss";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.vite/**",
      "**/.cache/**",
      "**/*.tsbuildinfo",
      "**/coverage/**",
      "**/.tmp/**",
      "**/build/**",
      "**/pnpm-lock.yaml",
    ],
  },
  {
    files: [
      "src/**/*.{js,jsx,ts,tsx}",
      "*.{js,ts}",
      "vite.config.ts",
      "eslint.config.js",
    ],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: false,
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/refs": "off",
      "no-console": ["error", { allow: ["warn", "error", "info"] }],
    },
  },
  ...tailwind.configs["flat/recommended"].map((block) => ({
    ...block,
    settings: {
      ...(block.settings ?? {}),
      tailwindcss: {
        ...(block.settings?.tailwindcss ?? {}),
        config: {
          content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
          theme: {},
          plugins: [],
        },
      },
    },
    rules: {
      ...(block.rules ?? {}),
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-custom-classname": "off",
    },
  })),
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      import: importPlugin,
      "unused-imports": (await import("eslint-plugin-unused-imports")).default,
      prettier: (await import("eslint-plugin-prettier")).default,
    },
    settings: {
      "import/resolver": { typescript: true, node: true },
    },
    rules: {
      "prettier/prettier": "error",
      "import/consistent-type-specifier-style": ["error", "prefer-inline"],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
          pathGroups: [
            { pattern: "react", group: "external", position: "before" },
            { pattern: "next/**", group: "external", position: "before" },
            { pattern: "@/**", group: "internal", position: "before" },
          ],
          pathGroupsExcludedImportTypes: ["react", "next"],
          "newlines-between": "always",
        },
      ],
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
]);
