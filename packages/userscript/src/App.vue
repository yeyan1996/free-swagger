<template>
  <div @click="collapse = !collapse" v-if="collapse" class="collapse close">
    <svg-icon name="code"></svg-icon>
  </div>

  <div id="extends-app" v-else v-loading="loading">
    <template v-if="state.options.length">
      <api-options ref="apiOptions"></api-options>
      <div class="operation-container">
        <el-button type="primary" @click="handleCopyApi()" class="copy-code">
          <div class="flex justify-center">
            <svg-icon name="copy-white"></svg-icon>
            <span class="ml-3">复制代码块</span>
          </div>
        </el-button>
        <div class="divider"></div>
        <el-link @click="handleCopyType()" :underline="false">
          <svg-icon name="copy-gray" class="copy"></svg-icon>
          <span class="ml-3">{{
            state.storage.currentLanguage === "js"
              ? "复制 typedef"
              : "复制 interface"
          }}</span>
        </el-link>
        <div class="divider"></div>
        <el-link @click="handleCopyPath()" :underline="false">
          <svg-icon name="copy-gray" class="copy"></svg-icon>
          <span class="ml-3">复制url</span>
        </el-link>
        <div class="divider"></div>
        <el-link @click="handleCopyFake()" :underline="false">
          <svg-icon name="copy-gray" class="copy"></svg-icon>
          <span class="ml-3">复制模拟数据</span>
        </el-link>
        <div class="divider"></div>
        <div class="switch-container">
          <span class="text">语言</span>
          <el-switch
            class="ml-10"
            v-model="state.storage.currentLanguage"
            active-value="ts"
            inactive-value="js"
            active-color="#409eff"
            inactive-color="#ecac0f"
            active-text="TS"
            inactive-text="JS"
          >
          </el-switch>
        </div>
      </div>
      <div class="collapse open">
        <more-setting class="more-setting"></more-setting>
        <svg-icon
          name="collapse"
          @click="collapse = !collapse"
          class="collapse-icon"
        ></svg-icon>
      </div>
    </template>
    <template v-else>
      <div @click="handleReload" class="fail">
        插件加载失败，请刷新页面重试
      </div>
    </template>
  </div>
</template>

<script>
import { waitUntil } from "@/utils";
import { state } from "@/state";
import MoreSetting from "@/components/MoreSetting";
import ApiOptions from "@/components/ApiOptions";
import {
  handleCopyApi,
  handleCopyPath,
  handleCopyFake,
  handleCopyType
} from "@/state";
import {
  createApiIconsDom,
  createInterfaceIconDom
} from "@/utils/manually-mount";
import RecursiveIterator from "recursive-iterator";
import { assignSwagger } from "@/utils/hooks";
import axios from "axios";

export default {
  name: "app",
  components: {
    MoreSetting,
    ApiOptions
  },
  data() {
    return {
      state,
      collapse: false,
      loading: true
    };
  },
  watch: {
    // 第一次使用插件时插件可能加载比较慢，导致请求没有被拦截
    // 此时主动更新 swagger 数据
    "state.isNewUi": {
      async handler(newVal) {
        if (newVal == null) return;
        await this.initSwagger();
        if (!newVal) {
          Promise.all([
            this.bindClickEventForController(),
            this.bindClickEventForModel(),
            this.injectIconsForApiNodeList()
          ]);
        }
        this.bindApiHandlerForApiNodeList();
      },
      immediate: true
    },
    "state.options": {
      handler(newVal) {
        if (newVal.length) {
          this.loading = false;
        }
        setTimeout(() => {
          this.loading = false;
        }, 5000);
      },
      immediate: true
    }
  },
  methods: {
    handleCopyType,
    handleCopyApi,
    handleCopyPath,
    handleCopyFake,
    handleReload() {
      location.reload();
    },
    async initSwagger() {
      if (state.isNewUi === true || state.swagger) return;
      const configs = window.ui.getConfigs();
      const url = configs.urls?.[0].url || configs.url;
      if (!url) return;
      const { data } = await axios.get(url);
      if (!state.swagger) {
        return assignSwagger(data, url);
      }
    },
    // 给每个 controller 的 tag （展开行的 dom 节点）绑定事件（老版本）
    async bindClickEventForController() {
      // 确保 DOM 节点存在
      await waitUntil(
        () => [...(document.querySelectorAll(".opblock-tag") ?? [])].length
      );
      const controllerNodeList = [...document.querySelectorAll(".opblock-tag")];
      // 锚点跳转时给当前锚点的 controller 节点注入 icons
      const [openedControllerNode] = controllerNodeList.filter(node =>
        node.parentNode.classList.contains("is-open")
      );
      // 给所有 controller 节点绑定事件，注入 icons
      (openedControllerNode
        ? [...controllerNodeList, openedControllerNode]
        : controllerNodeList
      ).forEach(controllerNode =>
        controllerNode.addEventListener("click", e => {
          this.bindApiHandlerForApiNodeList(e.currentTarget);
          this.injectIconsForApiNodeList(e.currentTarget);
        })
      );
    },
    // 获取当前文档流里的 apiNode
    async getApiNodeList(controllerNode) {
      const _getApiNodeList = () => {
        if (state.isNewUi) {
          return [...document.querySelectorAll("li.menuLi")];
        } else {
          if (controllerNode) {
            return [...controllerNode.parentNode.querySelectorAll(".opblock")];
          } else {
            return [...document.querySelectorAll(".opblock")];
          }
        }
      };
      // 确保 apiNode 存在
      await waitUntil(() => _getApiNodeList().length);
      return _getApiNodeList();
    },
    // 给每个 apiNode 绑定点击 api 事件
    async bindApiHandlerForApiNodeList(controllerNode) {
      const apiNodeList = await this.getApiNodeList(controllerNode);
      apiNodeList.forEach(apiNode => {
        apiNode.addEventListener("click", this.apiNodeHandler);
      });
    },
    apiNodeHandler(e) {
      const apiTag = e.currentTarget;
      if (state.isNewUi) {
        const hashUrl = apiTag.dataset.hashurl;
        const index = hashUrl.lastIndexOf("/");
        const apiName = hashUrl.slice(index + 1, hashUrl.length);
        for (let { node, path } of new RecursiveIterator(state.swagger.paths)) {
          if (node === apiName) {
            const [url, method] = path;
            const key = `${method} ${url} ${state.swagger.paths[url][method].summary}`;
            state.key = key;
            state.currentApi = state.options.find(item => item.key === key);
            break;
          }
        }
      } else {
        const method = apiTag.querySelector(".opblock-summary-method")
          ?.innerText;
        const path = apiTag
          .querySelector(".opblock-summary-path")
          ?.innerText.replace(/\u200B/g, ""); // 替换零宽空白
        const summary = apiTag.querySelector(".opblock-summary-description")
          ?.innerText;
        if (!method || !path || !summary) return;
        state.currentApi = state.options.find(
          item => item.method === method.toLowerCase() && item.path === path
        );
        state.key = state.currentApi.key;
      }
    },
    // 注入 icons（老版本）
    async injectIconsForApiNodeList(controllerNode) {
      const apiNodeList = await this.getApiNodeList(controllerNode);
      apiNodeList.forEach(apiNode => {
        apiNode.style.position = "relative";
        const method = apiNode.querySelector(".opblock-summary-method")
          ?.innerText;
        const path = apiNode
          .querySelector(".opblock-summary-path")
          ?.innerText.replace(/\u200B/g, ""); // 替换零宽空白
        const summary = apiNode.querySelector(".opblock-summary-description")
          ?.innerText;
        if (!method || !path || !summary) return;
        const apiIconsNode = createApiIconsDom(
          path,
          method.toLowerCase(),
          summary
        );
        apiNode.appendChild(apiIconsNode);
      });
    },
    async modelTagHandler() {
      await waitUntil(
        () => [...(document.querySelectorAll(".model-container") ?? [])].length
      );
      const modelNodeList = [...document.querySelectorAll(".model-container")];
      modelNodeList.forEach(node => {
        node.style.position = "relative";
        const interfaceNode = createInterfaceIconDom(node.innerText);
        node.appendChild(interfaceNode);
      });
    },
    // 给所有 model 绑定 TS icon（复制 interface）（老版本）
    async bindClickEventForModel() {
      await waitUntil(() => document.querySelector(".models"));
      document
        .querySelector(".models")
        .firstChild?.addEventListener("click", this.modelTagHandler);
      await this.modelTagHandler();
    }
  }
};
</script>

<style lang="scss" scoped>
.collapse {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: white;
}
.operation-container {
  min-width: 520px;
  display: flex;
  align-items: center;
}
#extends-app {
  height: 55px;
  align-items: center;
  display: flex;
  position: fixed;
  z-index: 100;
  right: 0;
  bottom: 0;
  width: 100%;
  padding: 10px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 2px 1px rgba(0, 0, 0, 0.12);
}

.switch-container {
  display: flex;
  align-items: center;
  .text {
    font-weight: bold;
    color: #606266;
    font-size: 14px;
  }
}

::v-deep .el-switch__label * {
  line-height: initial;
}

::v-deep .el-switch__label--left {
  color: #ffa142 !important;
}

::v-deep .el-switch__label--right {
  color: #409eff !important;
}

.divider {
  margin: 0 12px;
  border-left: 1px solid #bdbdbd;
  height: 27px;
}

.open {
  position: fixed;
  padding-right: 25px;
  right: 0;
  .collapse-icon {
    margin-left: 25px;
    font-size: 30px;
  }
}

.copy-code {
  &:hover {
    opacity: 0.8;
  }
}

.close {
  position: fixed;
  right: 17px;
  bottom: 3px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #2f80ed;
  font-size: 25px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.fail {
  margin-left: 30px;
  color: #409eff;
  cursor: pointer;
}
</style>
