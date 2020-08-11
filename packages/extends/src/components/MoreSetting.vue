<template>
  <div class="more-setting">
    <el-dropdown placement="top">
      <el-button type="primary" size="mini">
        更多配置<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="dialog = true"
          >编辑模版</el-dropdown-item
        >
        <el-dropdown-item>
          <div @click.stop>
            <span class="js-doc-text">JS Doc</span>
            <el-switch
              @change="toggleJsDoc"
              v-model="state.useJsDoc"
              active-text="开"
              inactive-text="关"
            ></el-switch>
          </div>
        </el-dropdown-item>
        <el-dropdown-item @click.native="handleCopyJsDoc()"
          >复制 JS Doc（JS）</el-dropdown-item
        >
        <el-dropdown-item @click.native="handleCopyInterface()"
          >复制 Interface（TS）</el-dropdown-item
        >
        <!--        <el-dropdown-item @click.native="handleCopySchema"-->
        <!--          >复制响应数据schema</el-dropdown-item-->
        <!--        >-->
        <el-dropdown-item
          @click.native="openAllController"
          v-if="!state.isNewUi"
          >展开全部 api</el-dropdown-item
        >
        <el-dropdown-item
          @click.native="closeAllController"
          v-if="!state.isNewUi"
          >收起全部 api</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>

    <el-dialog
      :visible.sync="dialog"
      center
      :modal-append-to-body="false"
      width="1000px"
      title="编辑 snippet 模版"
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="模版语言">
          <el-select v-model="exportLanguage" @change="handleLangChange">
            <el-option label="javascript" value="js"></el-option>
            <el-option label="typescript" value="ts"></el-option>
          </el-select>
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

          <el-button size="small" @click="handleResetJs"
            >重置为默认js模版</el-button
          >
          <el-button size="small" @click="handleResetTs"
            >重置为默认ts模版</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="dialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
import { state } from "@/state";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import { defaults } from "lodash-es";
import {
  handleCopyInterface,
  // handleCopySchema,
  handleCopyJsDoc
} from "../state";

const SUCCESS_CODE = 200;
export default {
  name: "MoreSetting",
  data() {
    return {
      state,
      dialog: false,
      exportLanguage: "js",
      form: {
        jsTemplate: "",
        tsTemplate: ""
      },
      instance: null
    };
  },
  watch: {
    dialog: {
      async handler(now) {
        const { jsTemplate, tsTemplate } = await import("free-swagger-client");
        const form = localStorage.getItem("swagger-extends")
          ? JSON.parse(localStorage.getItem("swagger-extends"))
          : {};
        const mergedForm = defaults(
          form,
          {
            jsTemplate,
            tsTemplate
          },
          (oldVal, newVal) => {
            if (oldVal === "") return newVal;
          }
        );
        // todo 重构 localStorage
        state.useJsDoc = mergedForm.useJsDoc;
        localStorage.setItem("swagger-extends", JSON.stringify(mergedForm));

        if (now) {
          await this.$nextTick();
          this.instance = monaco.editor.create(
            document.querySelector("#textarea"),
            {
              value:
                this.exportLanguage === "js"
                  ? mergedForm.jsTemplate
                  : mergedForm.tsTemplate,
              theme: "vs-dark",
              language: "javascript",
              automaticLayout: true
            }
          );
          this.instance.onDidChangeModelContent(() => {
            this.handleInput(this.instance.getValue());
          });
          this.form = mergedForm;
          this.exportLanguage =
            localStorage.getItem("swagger-extends-lang") ?? "js";
        } else {
          this.instance?.dispose();
        }
      },
      immediate: true
    }
  },
  methods: {
    // handleCopySchema,
    handleCopyJsDoc,
    handleCopyInterface,
    toggleJsDoc(val) {
      const form = JSON.parse(localStorage.getItem("swagger-extends"));
      localStorage.setItem(
        "swagger-extends",
        JSON.stringify({
          ...form,
          useJsDoc: val ?? false
        })
      );
    },
    handleInput(value) {
      if (this.exportLanguage === "js") {
        this.form.jsTemplate = value;
      } else {
        this.form.tsTemplate = value;
      }
    },
    handleLangChange(exportLanguage) {
      const form = JSON.parse(localStorage.getItem("swagger-extends"));
      if (exportLanguage === "js") {
        this.form.jsTemplate = form.jsTemplate;
      } else {
        this.form.tsTemplate = form.tsTemplate;
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
    async handleResetJs() {
      const { jsTemplate } = await import("free-swagger-client");
      this.form.jsTemplate = jsTemplate;
      this.instance?.setValue(jsTemplate);
    },
    async handleResetTs() {
      const { tsTemplate } = await import("free-swagger-client");
      this.form.tsTemplate = tsTemplate;
      this.instance?.setValue(tsTemplate);
    },
    handleLink() {
      window.open(
        "https://www.npmjs.com/package/free-swagger-client",
        "_blank"
      );
    },
    handleSubmit() {
      localStorage.setItem("swagger-extends", JSON.stringify(this.form));
      Message.success("保存成功");
      this.dialog = false;
    }
  }
};
</script>

<style lang="scss" scoped>
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
</style>
