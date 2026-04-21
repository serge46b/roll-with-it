import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import boundaries from "eslint-plugin-boundaries"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      boundaries,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
      "boundaries/legacy-templates": false,
      "boundaries/elements": [
        {
          type: "modules",
          pattern: "src/modules/*",
          mode: "folder",
          capture: ["elementName"],
        },
        {
          type: "components",
          pattern: ["src/components/*.{ts,tsx}", "src/components/**/*.{ts,tsx}"],
          mode: "full",
        },
        {
          type: "shared",
          pattern: ["src/shared/*.{ts,tsx}", "src/shared/**/*.{ts,tsx}"],
          mode: "full",
        },
        {
          type: "app",
          pattern: ["src/app/*.{ts,tsx}", "src/app/**/*.{ts,tsx}"],
          mode: "full",
        },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          message:
            "Layers boundaries violation: components -> only shared; modules -> components and shared; app -> all layers, modules -> only through index.",
          rules: [
            {
              allow: {
                dependency: {
                  relationship: { to: "internal" },
                },
              },
            },
            {
              from: { type: "components" },
              allow: { to: { type: "shared" } },
            },
            {
              from: { type: "modules" },
              allow: {
                to: { type: ["components", "shared", "modules"] },
              },
            },
            {
              from: { type: "app" },
              allow: {
                to: { type: ["app", "components", "modules", "shared"] },
              },
            },
            {
              to: {
                type: "modules",
                internalPath: "!index.{ts,tsx}",
              },
              disallow: {
                dependency: {
                  relationship: { to: "!internal" },
                },
              },
              message:
                "Imports through public API only allowed: `…/modules/<Name>` (index.ts / index.tsx), without deep paths inside the module.",
            },
          ],
        },
      ],
    },
  },
])

export default eslintConfig
