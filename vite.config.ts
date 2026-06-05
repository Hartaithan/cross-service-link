import { minify as minifyHTML } from "html-minifier-terser";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { minify as minifyJS } from "terser";
import { defineConfig, PluginOption } from "vite";

const html: PluginOption = {
  name: "minify-html-raw",
  async transform(code, id) {
    if (!id.endsWith(".html?raw")) return null;
    const match = code.match(/^export default\s+(".*");?$/s);
    if (!match) return null;
    const html = JSON.parse(match[1]);
    const minified = await minifyHTML(html, {
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true,
    });
    return `export default ${JSON.stringify(minified)};`;
  },
};

const loader: PluginOption = {
  name: "loader",
  apply: "build",
  async generateBundle(_options, bundle) {
    const entry = Object.values(bundle).find(
      (chunk) => "isEntry" in chunk && chunk.isEntry === true,
    );
    if (!entry || entry.type !== "chunk") {
      this.error("entry chunk not found");
      return;
    }
    const src = `./${entry.fileName}`;
    const template = readFileSync(resolve("src/loader/index.js"), "utf8");
    const code = template.replace("__CSL_SRC__", src);
    const result = await minifyJS(code, { module: false });
    if (!result || !result.code) {
      this.error("failed to minify loader code");
      return;
    }
    this.emitFile({
      type: "asset",
      fileName: "loader.js",
      source: result.code,
    });
  },
};

const home: PluginOption = {
  name: "home-page",
  apply: "build",
  generateBundle() {
    const html = readFileSync("index.html", "utf-8");
    this.emitFile({ type: "asset", fileName: "index.html", source: html });
  },
};

export default defineConfig({
  plugins: [html, home, loader],
  server: { open: "/dev.html" },
  build: {
    lib: {
      entry: "src/main.ts",
      name: "CrossServiceLink",
      formats: ["umd"],
    },
    rollupOptions: {
      output: { entryFileNames: "widget.[hash].js" },
    },
  },
});
