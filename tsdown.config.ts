import { defineConfig } from "tsdown";

export default defineConfig({
    platform: "node",
    target: ["node22", "chrome108"],
    format: "cjs",
    entry: ["src/extension.ts"],
    external: ["vscode"],
    fixedExtension: false,
    minify: true
});
