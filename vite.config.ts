import { defineConfig } from "vite";
import { resolve } from "path";

import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { VantResolver } from "@vant/auto-import-resolver";
import VueScriptSetupExtend from "./plugins/vue-script-setup-extend";
import { viteMockServe } from "vite-plugin-mock";

import packagesJSON from "./package.json";
import buildFTL, { publicPath } from "build-ftl";
import MultiPageAutoPlugin from "vite-plugin-multipage-auto";

const dependenciesList = Object.keys(packagesJSON.dependencies);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    AutoImport({
      imports: ["vue", "vue-router"],
      include: [/\.ts$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: "src/auto-imports.d.ts",
      resolvers: [VantResolver()],
    }),
    Components({ resolvers: [VantResolver()] }),
    VueScriptSetupExtend(),
    MultiPageAutoPlugin(),
    buildFTL({ ftlDir: "./dist2" }),
    viteMockServe(),
  ],
  optimizeDeps: {
    include: [...dependenciesList],
  },
  resolve: {
    alias: { "@": resolve(__dirname, "./src") },
    extensions: [".js", ".tsx", ".vue", ".jsx", ".ts", ".mjs"],
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
      output: { manualChunks: { vue: ["vue"], "vue-router": ["vue-router"] } },
    },
  },
  base: mode === "development" ? "/" : publicPath,
  css: {
    postcss: { plugins: [require("tailwindcss"), require("autoprefixer")] },
  },
}));
