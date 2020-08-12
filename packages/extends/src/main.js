import Vue from "vue";
import { start, injectCdn, onload } from "@/utils/monkey-starter";
import "@/style/index.scss";
import "@/icons";
import "./plugins/element.js";

const selectorId = "extends-app";

start(selectorId, [injectCdn, onload]).then(async () => {
  // 等待 prettier 加载完毕再加载组件
  const App = await import("./App.vue");
  await import("@/utils/hooks");
  Vue.config.productionTip = false;
  new Vue({
    render: h => h(App.default)
  }).$mount(`#${selectorId}`);
});

window.SWAGGER_EXTENDS_VERSION = {
  BRANCH,
  COMMITHASH,
  VERSION
};
