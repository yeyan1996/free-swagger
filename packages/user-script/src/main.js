import Vue from "vue";
import App from "./App.vue";
import { start, injectCdn, onload } from "@/utils/monkey-starter";
import "@/style/index.scss";
import "@/icons";
import "@/utils/hooks";
import "./plugins/element.js";

const selectorId = "extends-app";

start(selectorId, [injectCdn, onload]).then(() => {
  Vue.config.productionTip = false;
  new Vue({
    render: h => h(App)
  }).$mount(`#${selectorId}`);
});

window.SWAGGER_EXTENDS_VERSION = {
  BRANCH,
  COMMITHASH,
  VERSION
};
