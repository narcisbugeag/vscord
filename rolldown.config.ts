import { defineConfig } from "rolldown";

const production = process.argv.includes("--production");

export default defineConfig({
    input: "src/index.ts",
    platform: "node",
    output: {
        format: "cjs",
        minify: production,
        sourcemap: !production,
        file: "dist/index.js",
        cleanDir: true
    },
    external: ["vscode"],
    logLevel: "silent"
});
