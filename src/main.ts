import { createApp } from "vue";
import App from "./App.vue";
import "@/styles/index.css";
import router from "./router/index";

import { setDialogDefaultOptions } from "vant";
setDialogDefaultOptions({
  confirmButtonColor: "#1989fa",
});

createApp(App).use(router).mount("#app");
