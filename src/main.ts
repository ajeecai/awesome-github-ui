import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import BaseCard from "./components/base/BaseCard.vue";
import BaseBadge from "./components/base/BaseBadge.vue";
import BaseButton from "./components/base/BaseButton.vue";
import BaseDialog from "./components/base/BaseDialog.vue";
import BaseSpinner from "./components/base/BaseSpinner.vue";
import store from "./store/index";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

createApp(App)
  .component("base-card", BaseCard)
  .component("base-badge", BaseBadge)
  .component("base-button", BaseButton)
  .component("base-dialog", BaseDialog)
  .component("base-spinner", BaseSpinner)
  .use(Antd)
  .use(store)
  .use(router)
  .mount("#app");
