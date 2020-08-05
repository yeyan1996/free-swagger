import Vue from "vue";
import { Message } from "element-ui";
import { copyMessage } from "@/utils/dom-utils";

export const state = new Vue({
  data: {
    isTypescript: localStorage.getItem("swagger-extends-lang")
      ? localStorage.getItem("swagger-extends-lang") === "ts"
      : false,
    url: "",
    dialog: false,
    key: "",
    currentApi: {
      key: "",
      path: "",
      method: "",
      collection: {
        controller: {},
        operationId: ""
      }
    },
    isNewUi: false,
    domLoaded: false, // swagger 文档 dom 渲染完毕
    swagger: null,
    parsedSwagger: null
  },
  computed: {
    options() {
      if (!this.swagger) return [];
      const options = [];
      const sortOptions = [];
      const paths = this.swagger.paths;
      const tags = this.swagger.tags;
      Object.keys(paths).forEach(path => {
        Object.keys(paths[path]).forEach(method => {
          const { tags, summary, description, operationId } = paths[path][
            method
          ];
          options.push({
            path,
            method,
            key: `${method} ${path} ${summary}`,
            tag: tags[0],
            collection: {
              controller: tags[0],
              summary,
              description,
              operationId
            }
          });
        });
      });
      // 根据 Tags 排序
      tags.forEach(tagItem => {
        let index;
        do {
          index = options.findIndex(
            optionItem => optionItem.tag === tagItem.name
          );
          if (index < 0) return;
          sortOptions.push(options[index]);
          options.splice(index, 1);
        } while (index >= 0);
      });
      return sortOptions;
    }
  }
});

export const handleCopyApi = async (
  path = state.currentApi.path,
  method = state.currentApi.method,
  source = state.swagger
) => {
  const { jsTemplate, default: freeSwaggerClient } = await import(
    "free-swagger-client"
  );

  try {
    if (!path) {
      throw new Error();
    }

    let template = jsTemplate;
    let lang = "js";
    const isTypescript =
      localStorage.getItem("swagger-extends-lang") === "ts" || false;
    const form = localStorage.getItem("swagger-extends")
      ? JSON.parse(localStorage.getItem("swagger-extends"))
      : null;
    if (form) {
      template = isTypescript ? form.tsTemplate : form.jsTemplate;
      lang = isTypescript ? "ts" : "js";
    }
    const codeFragment = freeSwaggerClient(
      {
        source,
        templateFunction: eval(template),
        lang
      },
      path,
      method
    );
    copyMessage(codeFragment);
  } catch (e) {
    Message.error("复制失败，请检查选择的 api 或模版");
    console.log(e);
  }
};

export const handleCopyPath = async (
  path = state.currentApi.path,
  method = state.currentApi.method
) => {
  try {
    // /pet/{petId}/uploadImage -> /pet/:petId/uploadImage
    const formattedPath = path.replace(/{(.*?)}/g, ":$1");
    copyMessage(`"${method.toUpperCase()} ${formattedPath}"`);
  } catch (e) {
    Message.error("复制失败，请检查选择的 api 或模版");
    console.log(e);
  }
};

export const handleCopyFake = async (
  path = state.currentApi.path,
  method = state.currentApi.method,
  parsedSwagger = state.parsedSwagger
) => {
  const SUCCESS_CODE = "200";
  const { option, generate } = await import("json-schema-faker");
  option({
    useExamplesValue: true,
    useDefaultValue: true,
    alwaysFakeOptionals: true,
    refDepthMax: 2,
    maxItems: 1,
    failOnInvalidTypes: false
  });
  try {
    let mockSchema;
    const schema =
      parsedSwagger.paths[path][method].responses?.[SUCCESS_CODE]?.schema;

    if (schema) {
      mockSchema = generate(schema);
      if (mockSchema.code) mockSchema.code = SUCCESS_CODE;
    } else {
      mockSchema = {
        code: SUCCESS_CODE,
        msg: "xxx",
        data: {}
      };
    }
    copyMessage(mockSchema);
  } catch (e) {
    console.log(e);
    Message.error("复制失败，请检查选择的 api 或模版");
  }
};

export const handleCopyInterface = async (
  source = state.swagger,
  interfaceName = null
) => {
  const { compileInterfaces } = await import("free-swagger-client");
  try {
    const code = compileInterfaces(source, interfaceName);
    copyMessage(code);
  } catch (e) {
    console.log(e);
    Message.error("复制失败，请检查选择的 api 或模版");
  }
};
