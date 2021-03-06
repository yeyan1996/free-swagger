<template>
  <div class="more-setting">
    <el-dropdown placement="top">
      <el-button size="mini" plain>
        <div class="flex items-center">
          <svg-icon name="setting" class="text-16"></svg-icon>
          <span class="ml-3">更多配置</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <div class="top-area">
          <template v-if="state.storage.currentLanguage === 'js'">
            <div @click.stop class="switch">
              <span class="js-doc-text normal">代码块 JS Doc</span>
              <el-switch
                v-model="state.storage.jsDoc"
                active-text="开"
                inactive-text="关"
              ></el-switch>
            </div>
            <div @click.stop class="switch">
              <span class="js-doc-text normal">代码块 JS Doc typedef</span>
              <el-switch
                v-model="state.storage.typedef"
                @change="handleToggleRecursive"
                active-text="开"
                inactive-text="关"
              ></el-switch>
            </div>
            <div @click.stop class="switch">
              <span class="js-doc-text normal">递归复制依赖</span>
              <el-switch
                v-model="state.storage.recursive"
                :disabled="!state.storage.typedef"
                active-text="开"
                inactive-text="关"
              ></el-switch>
            </div>
            <el-dropdown-item
              @click.native="handleCopyJsDocTypeDef()"
              class="normal"
            >
              复制全量 JS Doc typedef
            </el-dropdown-item>
          </template>
          <template v-else>
            <div @click.stop class="switch">
              <span class="js-doc-text normal">代码块 Interface</span>
              <el-switch
                v-model="state.storage.interface"
                @change="handleToggleRecursive"
                active-text="开"
                inactive-text="关"
              ></el-switch>
            </div>
            <div @click.stop class="switch">
              <span class="js-doc-text normal">递归复制依赖</span>
              <el-switch
                v-model="state.storage.recursive"
                :disabled="!state.storage.interface"
                active-text="开"
                inactive-text="关"
              ></el-switch>
            </div>
            <el-dropdown-item
              @click.native="handleCopyInterface()"
              class="normal"
            >
              复制全量 Interface
            </el-dropdown-item>
          </template>
        </div>
        <el-dropdown-item @click.native="dialog = true"
          >编辑模版</el-dropdown-item
        >

        <!--        <el-dropdown-item @click.native="handleCopySchema"-->
        <!--          >复制响应数据schema</el-dropdown-item-->
        <!--        >-->
        <!--        <el-dropdown-item-->
        <!--          @click.native="openAllController"-->
        <!--          v-if="!state.isNewUi"-->
        <!--          >展开全部 api</el-dropdown-item-->
        <!--        >-->
        <!--        <el-dropdown-item-->
        <!--          @click.native="closeAllController"-->
        <!--          v-if="!state.isNewUi"-->
        <!--          >收起全部 api</el-dropdown-item-->
        <!--        >-->
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog
      :visible.sync="dialog"
      center
      :modal-append-to-body="false"
      width="1000px"
      title="编辑代码块模版"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="模版语言">
          <div class="flex justify-between">
            <el-select
              v-model="state.storage.exportLanguage"
              @change="handleLangChange"
            >
              <el-option label="javascript" value="js"></el-option>
              <el-option label="typescript" value="ts"></el-option>
            </el-select>

            <el-button
              size="small"
              @click="handleResetTemplate"
              type="warning"
              plain
              >重置为默认模版</el-button
            >
          </div>
        </el-form-item>
        <el-form-item>
          <span slot="label">
            <el-tooltip effect="light" placement="left-start">
              <el-link slot="content" @click="handleLink"
                >https://www.npmjs.com/package/free-swagger-client</el-link
              >
              <i class="el-icon-question"></i>
            </el-tooltip>
            模版</span
          >
          <!--代码编辑器-->
          <div id="textarea"></div>
        </el-form-item>
        <el-form-item>
          <div class="btn-container">
            <el-button @click="dialog = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">保存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
import { state } from "@/state";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";

import {
  // handleCopySchema,
  handleCopyInterface,
  handleCopyJsDocTypeDef
} from "../state";
import { jsTemplate, tsTemplate } from "free-swagger-client";

const SUCCESS_CODE = 200;
export default {
  name: "MoreSetting",
  data() {
    return {
      state,
      dialog: false,
      instance: null,
      form: {
        jsTemplate: "",
        tsTemplate: ""
      }
    };
  },
  watch: {
    dialog: {
      async handler(now) {
        if (now) {
          await this.$nextTick();
          this.instance = monaco.editor.create(
            document.querySelector("#textarea"),
            {
              value:
                state.storage.exportLanguage === "js"
                  ? state.storage.jsTemplate
                  : state.storage.tsTemplate,
              theme: "vs-dark",
              language: "javascript",
              automaticLayout: true
            }
          );
          this.instance.onDidChangeModelContent(() => {
            this.handleInput(this.instance.getValue());
          });
          this.form.jsTemplate = state.storage.jsTemplate;
          this.form.tsTemplate = state.storage.tsTemplate;
        } else {
          this.instance?.dispose();
        }
      },
      immediate: true
    }
  },
  methods: {
    // handleCopySchema,
    handleCopyJsDocTypeDef,
    handleCopyInterface,
    handleToggleRecursive(val) {
      if (!val) {
        state.storage.recursive = false;
      }
    },
    handleInput(value) {
      if (state.storage.exportLanguage === "js") {
        this.form.jsTemplate = value;
      } else {
        this.form.tsTemplate = value;
      }
    },
    handleLangChange(exportLanguage) {
      if (exportLanguage === "js") {
        this.form.jsTemplate = state.storage.jsTemplate;
      } else {
        this.form.tsTemplate = state.storage.tsTemplate;
      }
      this.instance?.setValue(
        exportLanguage === "js" ? this.form.jsTemplate : this.form.tsTemplate
      );
    },
    openAllController() {
      if (state.isNewUi) {
        return Message.error("新 swagger ui 无法使用该功能");
      }
      const blockList = document.querySelectorAll(
        ".opblock-tag-section:not(.is-open)"
      );
      blockList.forEach(block => block.firstChild.click());
    },
    closeAllController() {
      if (state.isNewUi) {
        return Message.error("新 swagger ui 无法使用该功能");
      }
      const blockList = document.querySelectorAll(
        ".opblock-tag-section.is-open"
      );
      blockList.forEach(block => block.firstChild.click());
    },
    async handleResetTemplate() {
      if (state.storage.exportLanguage === "js") {
        this.form.jsTemplate = jsTemplate;
        this.instance?.setValue(jsTemplate);
      } else {
        this.form.tsTemplate = tsTemplate;
        this.instance?.setValue(tsTemplate);
      }
    },
    handleLink() {
      window.open(
        "https://www.npmjs.com/package/free-swagger-client",
        "_blank"
      );
    },
    handleSubmit() {
      state.storage.jsTemplate = this.form.jsTemplate;
      state.storage.tsTemplate = this.form.tsTemplate;
      Message.success("保存成功");
      this.dialog = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.normal {
  font-size: 14px;
}
.more-setting {
  display: inline-block;
}
.el-icon-question {
  &:hover {
    cursor: pointer;
    color: #409eff;
  }
}
#textarea {
  height: 400px;
}

.js-doc-text {
  margin-right: 10px;
}

::v-deep .el-switch__label * {
  line-height: initial;
}

.mt-20 {
  margin-top: 20px;
}

.top-area {
  color: #606266;
  margin-bottom: 10px;
  border-bottom: 1px solid #dee0e3;
  > div {
    cursor: default;
    display: flex;
    line-height: 35px;
    align-items: center;
    justify-content: space-between;
  }
  .title {
    font-size: 14px;
    padding: 0 20px;
  }
  .switch {
    padding: 0 20px;
  }
}
.btn-container {
  display: flex;
  justify-content: center;
  margin-right: 70px;
  .el-button {
    width: 135px;
  }
}
</style>
