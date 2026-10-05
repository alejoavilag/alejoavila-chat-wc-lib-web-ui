import eslint from "@eslint/js";
import angular from "angular-eslint";
import tseslint from "typescript-eslint";

const FRAMEWORK = ["@angular/*", "rxjs", "rxjs/*"];

export default tseslint.config(
  { ignores: ["dist/**", ".angular/**", "node_modules/**"] },
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "alejo", style: "camelCase" },
      ],
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "alejo", style: "kebab-case" },
      ],
    },
  },
  {
    files: ["src/domain/**/*.ts"],
    ignores: ["**/*.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/application/*", "@/infrastructure/*", "@/ui/*", ...FRAMEWORK],
              message:
                "The domain layer must not depend on application, infrastructure, presentation or any framework.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/application/**/*.ts"],
    ignores: ["**/*.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/infrastructure/*", "@/ui/*", ...FRAMEWORK],
              message:
                "The application layer must depend on ports, never on adapters or on the framework.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/infrastructure/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/ui/*"],
              message: "Adapters must not depend on the presentation layer.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [...angular.configs.templateRecommended],
  },
);
