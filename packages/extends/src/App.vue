<template>
  <div @click="collapse = !collapse" v-if="collapse" class="collapse">
    <i class="el-icon-setting"></i>
  </div>

  <div id="extends-app" v-else>
    <api-options ref="apiOptions"></api-options>
    <div class="operation-container">
      <el-link @click="handleCopyPath()" :underline="false">复制url</el-link>
      <el-link @click="handleCopyApi()" :underline="false">复制snippet</el-link>
      <el-link @click="handleCopyFake()" :underline="false"
        >复制模拟数据</el-link
      >
      <div class="switch-container">
        <span class="text">语言：</span>
        <el-switch
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

    <div class="collapse">
      <div class="right">
        <more-setting class="more-setting"></more-setting>
      </div>
      <i class="el-icon-caret-left" @click="collapse = !collapse"></i>
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
      await this.controllerTagBindClickEvents();
      await this.modelTagBindClickEvents();
    }
  },
  methods: {
    handleCopyApi,
    handleCopyPath,
    handleCopyFake,
    // 给每个 controller 的 tag （展开行的 dom 节点）绑定事件
    async controllerTagBindClickEvents() {
      await this.$nextTick();
      const controllerTagNodeList = [
        ...document.querySelectorAll(".opblock-tag")
      ];
      // 给所有 controller 节点绑定事件，注入 icons
      controllerTagNodeList.forEach(tagNode =>
        tagNode.addEventListener("click", this.controllerTagHandler)
      );

      // 锚点跳转时给当前锚点的 controller 节点注入 icons
      const [openedControllerNode] = controllerTagNodeList.filter(node =>
        node.parentNode.classList.contains("is-open")
      );
      if (!openedControllerNode) return;
      const apiNodeList = [
        ...openedControllerNode.nextSibling.querySelectorAll(".opblock")
      ];
      apiNodeList.forEach(apiNode => {
        apiNode.style.position = "relative";
        this.injectApiIcons(apiNode);
      });
    },
    // 注入 icons
    injectApiIcons(parent) {
      const method = parent.querySelector(".opblock-summary-method")?.innerText;
      const path = parent
        .querySelector(".opblock-summary-path")
        ?.innerText.replace(/\u200B/g, ""); // 替换零宽空白
      const summary = parent.querySelector(".opblock-summary-description")
        ?.innerText;
      if (!method || !path || !summary) return;
      const apiIconsNode = createApiIconsDom(
        path,
        method.toLowerCase(),
        summary
      );
      parent.appendChild(apiIconsNode);
    },
    // 给 controller 绑定事件
    async controllerTagHandler(e) {
      const controllerNode = e.currentTarget.parentNode;
      if (!controllerNode) return;
      await wait(100);
      const apiTagNodeList = [...controllerNode.querySelectorAll(".opblock")];
      apiTagNodeList.forEach(tagNode => {
        tagNode.style.position = "relative";
        this.injectApiIcons(tagNode);
        tagNode.addEventListener("click", this.apiTagHandler);
      });
    },
    // 给某个 api 绑定事件
    apiTagHandler(e) {
      const apiTag = e.currentTarget;
      const method = apiTag.querySelector(".opblock-summary-method")?.innerText;
      const path = apiTag.querySelector(".opblock-summary-path")?.innerText;
      const summary = apiTag.querySelector(".opblock-summary-description")
        ?.innerText;
      if (!method || !path || !summary) return;
      const key = method.toLowerCase() + " " + path + " " + summary;
      state.key = key;
      this.$refs.apiOptions?.assignCurrentApi(key);
    },
    async modelTagBindClickEvents() {
      await this.$nextTick();
      document
        .querySelector(".models")
        ?.firstChild?.addEventListener("click", this.modelTagHandler);
    },
    async modelTagHandler() {
      await wait(100);
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
  height: 50px;
  position: fixed;
  right: 10px;
  bottom: -3px;
  display: flex;
  justify-content: center;
  align-items: center;
  > i {
    font-size: 20px;
    color: #409eff;
    cursor: pointer;
  }
}
.operation-container {
  min-width: 600px;
  display: flex;
  align-items: center;
  > a {
    margin-right: 15px;
  }
}
#extends-app {
  display: flex;
  position: fixed;
  z-index: 100;
  right: 0;
  bottom: 0;
  width: 100%;
  padding: 10px;
  background-color: #f1f1f1;
}

.switch-container {
  display: flex;
  align-items: center;
  margin-right: 20px;
  .text {
    font-weight: bold;
    color: #606266;
    font-size: 14px;
  }
}

.right {
  width: 100% !important;
  margin-right: 20px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .more-setting {
    margin-right: 20px;
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
</style>
