import { minify } from "html-minifier-terser";
import { defineConfig, loadEnv, PluginOption } from "vite";

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

const loader = (url: string): PluginOption => ({
  name: "loader",
  apply: "build",
  generateBundle(_options, bundle) {
    const entry = Object.values(bundle).find(
      (chunk) => "isEntry" in chunk && chunk.isEntry === true,
    );
    if (!entry || entry.type !== "chunk") {
      this.error("entry chunk not found");
      return;
    }
    const src = `${url}/${entry.fileName}`;
    const script = `(function(){var s=document.createElement('script');s.src='${src}';s.async=true;document.head.appendChild(s);})()`;
    this.emitFile({ type: "asset", fileName: "loader.js", source: script });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [html, loader(env.BASE_URL)],
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
  };
});
