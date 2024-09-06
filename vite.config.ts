import { defineConfig } from "vite";
import { resolve } from "path";

import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import VueScriptSetupExtend from "./plugins/vue-script-setup-extend.js";

import packagesJSON from "./package.json";
import buildFTL, { publicPath } from "build-ftl";

const dependenciesList = Object.keys(packagesJSON.dependencies);

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "vue-router"],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: "src/auto-imports.d.ts",
    }),
    VueScriptSetupExtend(),
    buildFTL({ entryDir: "./entranceHTML", ftlDir: "./dist2" }),
  ],
  optimizeDeps: {
    include: [...dependenciesList],
  },
  resolve: {
    alias: { "@": resolve(__dirname, "./src") },
    extensions: [".js", ".tsx", ".vue", ".jsx", ".ts"],
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    proxy: {
      "/developmentApi": {
        target: "",
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/developmentApi/, ""),
      },
    },
    open: true,
  },
  build: {
    // 启用manifest.json 文件
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "./entranceHTML/main.html"),
      },
      output: {
        manualChunks: {
          vue: ["vue"],
          "vue-router": ["vue-router"],
        },
      },
    },
  },
  base: mode === "development" ? "/" : publicPath,
  css: {
    postcss: { plugins: [require("tailwindcss"), require("autoprefixer")] },
  },
}));
