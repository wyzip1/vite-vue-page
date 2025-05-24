import { createApp } from "vue";
import App from "./App.vue";
import "@/styles/tailwind.css";
import "vant/lib/index.css";

import { setDialogDefaultOptions } from "vant";
setDialogDefaultOptions({
  confirmButtonColor: "#1989fa",
});

createApp(App).mount("#app");
