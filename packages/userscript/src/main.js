import Vue from "vue";
import { start, injectCdn } from "@/utils/monkey-starter";
import "@/style/index.css";
import "@/icons";
import "./plugins/element.js";
import "@/utils/hooks";

const selectorId = "extends-app";

start(selectorId, [injectCdn]).then(async () => {
  // 等待 prettier 加载完毕再加载组件
  const { default: App } = await import("./App.vue");
  Vue.config.productionTip = false;
  new Vue({
    render: h => h(App)
  }).$mount(`#${selectorId}`);
});

window.SWAGGER_EXTENDS_VERSION = {
  BRANCH: BRANCH,
  COMMITHASH: COMMITHASH,
  VERSION: VERSION
};
