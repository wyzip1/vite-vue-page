import { defineConfig } from "vite";
import { resolve } from "path";
import vuePlugin from "@vitejs/plugin-vue";
import VueScriptSetupExtend from "./plugins/vue-script-setup-extend.js";
import packagesJSON from "./package.json";
import buildFTL, { publicPath } from "build-ftl";

const dependenciesList = Object.keys(packagesJSON.dependencies);

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig(({ mode }) => ({
  plugins: [
    vuePlugin(),
    VueScriptSetupExtend(),
    buildFTL({ entryDir: "./entranceHTML", ftlDir: "./dist2" }),
  ],
  optimizeDeps: {
    include: [...dependenciesList],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
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
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
      input: {
        main: resolve(__dirname, "./entranceHTML/main.html"),
      },
      output: {
        manualChunks: {
          vue: ["vue"],
        },
      },
    },
  },
  base: mode === "development" ? "/" : publicPath,
  css: {
    preprocessorOptions: {
      less: {
        // 允许less语法链式调用
        javascriptEnabled: true,
      },
      scss: {
        // 禁止scss添加@charset: UTF-8
        charset: false,
      },
    },
    postcss: {
      plugins: [
        require("tailwindcss"),
        require("autoprefixer"),
        // 删除样式库中的@charset: UTF-8
        {
          postcssPlugin: "internal:charset-removal",
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === "charset") {
                atRule.remove();
              }
            },
          },
        },
      ],
    },
  },
}));
