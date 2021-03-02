<template>
  <div @click="collapse = !collapse" v-if="collapse" class="collapse close">
    <svg-icon name="code"></svg-icon>
  </div>

  <div id="extends-app" v-else>
    <api-options ref="apiOptions"></api-options>
    <div class="operation-container">
      <el-button type="primary" @click="handleCopyApi()" class="copy-code">
        <div class="flex justify-center">
          <svg-icon name="copy-white"></svg-icon>
          <span class="ml-3">复制代码块</span>
        </div>
      </el-button>
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
  </div>
</template>

<script>
import { wait } from "@/utils";
import { state } from "@/state";
import MoreSetting from "@/components/MoreSetting";
import ApiOptions from "@/components/ApiOptions";
import { handleCopyApi, handleCopyPath, handleCopyFake } from "@/state";
import {
  createApiIconsDom,
  createInterfaceIconDom
} from "@/utils/manually-mount";
import RecursiveIterator from "recursive-iterator";

export default {
  name: "app",
  components: {
    MoreSetting,
    ApiOptions
  },
  data() {
    return {
      state,
      collapse: false
    };
  },
  watch: {
    async "state.domLoaded"(isLoaded) {
      if (!isLoaded) return;
      if (state.isNewUi) {
        await this.injectForController(undefined, true);
      } else {
        await this.bindClickEventForController();
        await this.bindClickEventForModel();
      }
    }
  },
  methods: {
    handleCopyApi,
    handleCopyPath,
    handleCopyFake,
    // 给每个 controller 的 tag （展开行的 dom 节点）绑定事件
    async bindClickEventForController() {
      await wait();
      const controllerNodeList = [...document.querySelectorAll(".opblock-tag")];
      // 给所有 controller 节点绑定事件，注入 icons
      controllerNodeList.forEach(controllerNode =>
        controllerNode.addEventListener("click", e => {
          this.injectForController(e.currentTarget);
        })
      );
      // // 锚点跳转时给当前锚点的 controller 节点注入 icons
      const [openedControllerNode] = controllerNodeList.filter(node =>
        node.parentNode.classList.contains("is-open")
      );
      await this.injectForController(openedControllerNode);
    },
    // 注入 icon + 绑定点击事件
    async injectForController(controllerNode, isNewUi = false) {
      if (!controllerNode && !isNewUi) return;
      await wait(0);
      const apiNodeList = isNewUi
        ? [...document.querySelectorAll("li.menuLi")]
        : [...controllerNode.nextSibling.querySelectorAll(".opblock")];
      apiNodeList.forEach(apiNode => {
        if (!state.isNewUi) {
          this.injectApiIconsForApiNode(apiNode);
        }
        this.bindClickApiHandlerForApiNode(apiNode, state.isNewUi);
      });
    },
    // 注入 icons
    injectApiIconsForApiNode(apiNode) {
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
    },
    // 绑定点击 api 事件
    bindClickApiHandlerForApiNode(apiNode, isNewUi = false) {
      apiNode.addEventListener("click", e => {
        const apiTag = e.currentTarget;
        if (isNewUi) {
          const hashurl = apiTag.dataset.hashurl;
          const index = hashurl.lastIndexOf("/");
          const apiName = hashurl.slice(index + 1, hashurl.length);
          for (let { node, path } of new RecursiveIterator(
            state.swagger.paths
          )) {
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
          const path = apiTag.querySelector(".opblock-summary-path")?.innerText;
          const summary = apiTag.querySelector(".opblock-summary-description")
            ?.innerText;
          if (!method || !path || !summary) return;
          const key = method.toLowerCase() + " " + path + " " + summary;
          state.key = key;
          state.currentApi = state.options.find(item => item.key === key);
        }
        handleCopyApi();
      });
    },
    async bindClickEventForModel() {
      await this.$nextTick();
      document
        .querySelector(".models")
        ?.firstChild?.addEventListener("click", this.modelTagHandler);
    },
    async modelTagHandler() {
      await wait(0);
      const modelNodeList = [...document.querySelectorAll(".model-container")];
      modelNodeList.forEach(node => {
        node.style.position = "relative";
        const interfaceNode = createInterfaceIconDom(node.innerText);
        node.appendChild(interfaceNode);
      });
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
  width: 135px;
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
}
</style>
