import { minify } from "html-minifier-terser";
import { defineConfig, PluginOption } from "vite";

const html: PluginOption = {
  name: "minify-html-raw",
  async transform(code, id) {
    if (!id.endsWith(".html?raw")) return null;
    const match = code.match(/^export default\s+(".*");?$/s);
    if (!match) return null;
    const html = JSON.parse(match[1]);
    const minified = await minify(html, {
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true,
    });
    return `export default ${JSON.stringify(minified)};`;
  },
};

export default defineConfig({
  plugins: [html],
  build: {
    lib: {
      entry: "src/main.ts",
      name: "CrossServiceLink",
      fileName: "init",
    },
  },
});
