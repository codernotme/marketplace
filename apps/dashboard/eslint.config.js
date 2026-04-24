import { nextJsConfig } from "@workspace/eslint-config/next-js"

/** @type {import("eslint").Linter.Config} */
export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/public/**",
      "**/dist/**",
      "**/coverage/**",
      "**/*.png",
      "**/*.jpg",
      "**/*.jpeg",
      "**/*.gif",
      "**/*.svg",
      "**/*.ico",
      "**/*.webp",
      "**/*.woff",
      "**/*.woff2",
      "**/*.ttf",
      "**/*.otf",
      "**/*.node",
    ],
  },
  ...nextJsConfig,
]
