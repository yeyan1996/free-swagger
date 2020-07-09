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
    assignCurrentApi(key) {
      state.currentApi = state.options.find(item => item.key === key);
    },
    // 展开一个 api
    async expandApiCollapse({ controller, operationId }) {
      if (state.isNewUi) {
        const controllerDom = document.querySelector(`[title="${controller}"]`);
        if (!controllerDom) return;
        if (!controllerDom.classList.contains("open")) {
          controllerDom.querySelector("* > a").click();
        }
        await this.$nextTick();
        const apiDom = controllerDom.querySelector(
          `[data-hashurl="#/default/${controller}/${operationId}"]`
        );
        apiDom?.click();
      } else {
        try {
          const controllerDOM = document.querySelector(
            `#operations-tag-${controller}`
          );
          if (!controllerDOM) {
            return;
          }
          const controllerDOMOpen = controllerDOM.parentNode.classList.contains(
            "is-open"
          );
          if (!controllerDOMOpen) {
            controllerDOM.click();
          }
          await this.$nextTick();
          const apiDOM = document.querySelector(
            `#operations-${controller}-${operationId}`
          );
          if (!apiDOM) return;
          const apiOpen = apiDOM.classList.contains("is-open");
          if (!apiOpen) {
            apiDOM.firstChild.click();
          }
        } catch {}
      }
    },
    async handleSearch(key) {
      this.assignCurrentApi(key);
      let apiDOM;
      await retry({
        cb: async () => {
          await this.expandApiCollapse(state.currentApi.collection);
          await this.$nextTick();
          state.isNewUi = !window.ui;
          apiDOM = document.querySelector(
            state.isNewUi
              ? // eslint-disable-next-line max-len
                `[data-hashurl="#/default/${state.currentApi.collection.controller}/${state.currentApi.collection.operationId}"]`
              : `#operations-${state.currentApi.collection.controller}-${state.currentApi.collection.operationId}`
          );
          apiDOM?.scrollIntoView({ behavior: "smooth" });
          highlightDOM(apiDOM, "custom-highlight-anime");
        },
        endCondition: () => apiDOM,
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
