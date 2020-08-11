<template>
  <el-select
    class="search"
    size="mini"
    placeholder="请选择 api"
    filterable
    v-model="state.key"
    @change="handleSearch"
  >
    <el-option
      v-for="(item, index) in state.options"
      :key="index"
      :value="item.key"
    >
      <div class="option-container">
        <div
          :class="[
            'label',
            {
              'light-green': item.method === 'patch',
              pink: item.method === 'options',
              purple: item.method === 'head',
              green: item.method === 'get',
              blue: item.method === 'post',
              yellow: item.method === 'put',
              red: item.method === 'delete'
            }
          ]"
        >
          {{ item.method }}
        </div>
        <div class="path">{{ item.path }}</div>
        <div class="summary">{{ item.collection.summary }}</div>
      </div></el-option
    >
  </el-select>
</template>

<script>
import { state } from "@/state";
import { highlightDOM } from "@/utils/dom-utils";
import { retry } from "@/utils";

export default {
  name: "ApiOptions",
  data: () => ({
    state
  }),
  watch: {
    "state.options"(now) {
      if (!now.length) return;
      state.key = now[0].key;
      this.handleSearch(state.key);
    }
  },
  methods: {
    findControllerDom({ isNewUi, controller }) {
      const selector = isNewUi
        ? `[title="${controller}"]`
        : `#operations-tag-${controller}`;
      return document.querySelector(selector);
    },
    findApiDom({ controllerDom, isNewUi, operationId }) {
      const selector = isNewUi
        ? `[data-hashurl$="${operationId}"]`
        : `[id$="${operationId}"]`;
      return isNewUi
        ? controllerDom.querySelector(selector)
        : controllerDom.parentNode.querySelector(selector);
    },
    openControllerDom(controllerDom, isNewUi) {
      const isOpen = isNewUi
        ? controllerDom.classList.contains("open")
        : controllerDom.parentNode.classList.contains("is-open");
      if (isOpen) return;
      if (isNewUi) {
        controllerDom.querySelector("* > a").click();
      } else {
        controllerDom.click();
      }
    },
    clickApiDom(apiDom, isNewUi) {
      if (isNewUi) {
        apiDom.click();
      } else {
        apiDom.classList.contains("is-open") || apiDom.firstChild.click();
      }
    },

    assignCurrentApi(key) {
      state.currentApi = state.options.find(item => item.key === key);
    },
    // 展开一个 api
    async expandApiCollapse({ controller, operationId }) {
      const controllerDom = this.findControllerDom({
        isNewUi: state.isNewUi,
        controller
      });
      if (!controllerDom) return false;
      this.openControllerDom(controllerDom, state.isNewUi);
      await this.$nextTick();
      const apiDom = this.findApiDom({
        isNewUi: state.isNewUi,
        controllerDom,
        operationId
      });
      if (!apiDom) return false;
      this.clickApiDom(apiDom);
      return { apiDom, controllerDom };
    },
    async handleSearch(key) {
      this.assignCurrentApi(key);
      let apiDom;
      await retry({
        cb: async () => {
          const { controller, operationId } = state.currentApi.collection;
          const res = await this.expandApiCollapse({ controller, operationId });
          await this.$nextTick();
          state.isNewUi = !window.ui;
          if (res) {
            apiDom = res.apiDom;
            apiDom.scrollIntoView({ behavior: "smooth" });
            highlightDOM(apiDom, "custom-highlight-anime");
          }
        },
        endCondition: () => apiDom,
        retryNumber: 10,
        success: () => {
          state.domLoaded = true;
        },
        error: () => console.error("Error: 请输入 dom 节点")
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.shallow-yellow {
  background: #fff7eeb0;
}
.option-container {
  display: flex;
  .summary {
    color: #808080a6;
    margin-left: 10px;
  }
  .label {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 70px;
    padding-left: 20px;
  }
  .light-green {
    color: #1ce3c3;
  }
  .red {
    color: #ff3f45;
  }
  .purple {
    color: #941af9;
  }
  .pink {
    color: pink;
  }
  .yellow {
    color: #ffa142;
  }
  .green {
    color: #67c23a;
  }
  .blue {
    color: #409eff;
  }
  .added {
    position: absolute;
    left: 20px;
  }
  .path {
    margin-left: 10px;
    width: 400px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.search {
  width: 400px;
  margin-right: 12px;
}
</style>
