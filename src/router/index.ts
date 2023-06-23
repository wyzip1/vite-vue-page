import { createRouter, createWebHashHistory } from "vue-router";
import { folderRoutes } from "./folderRoutes";

export default createRouter({
  history: createWebHashHistory(),
  routes: folderRoutes(),
});
