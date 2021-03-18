import Vue from "vue";
import { Message } from "element-ui";
import { copyMessage } from "@/utils/dom-utils";
import { defaults } from "lodash-es";
import {
  default as freeSwaggerClient,
  jsTemplate,
  tsTemplate,
  compileInterfaces,
  compileJsDocTypedefs
} from "free-swagger-client";
import { option, generate } from "json-schema-faker";

const STORAGE_KEY = "SWAGGER-EXTENDS";
const SUCCESS_CODE = "200";

export const state = new Vue({
  data() {
    return {
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
      storage: {
        jsTemplate,
        tsTemplate,
        jsDoc: true,
        interface: false,
        typedef: false,
        recursive: false,
        exportLanguage: "js",
        currentLanguage: "js"
      },
      isNewUi: false,
      domLoaded: false, // swagger 文档 dom 渲染完毕
      swagger: null,
      parsedSwagger: null // 解析所有 ref 后的 swagger 对象
    };
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
            tag: tags[tags.length - 1],
            collection: {
              controller: tags[tags.length - 1],
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
  },
  watch: {
    storage: {
      handler(newVal) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal));
      },
      deep: true
    }
  },
  created() {
    const storage = localStorage.getItem(STORAGE_KEY)
      ? JSON.parse(localStorage.getItem(STORAGE_KEY))
      : {};

    this.storage = defaults(storage, this.storage, (oldVal, newVal) => {
      if (oldVal === "") return newVal;
    });
  }
});

export const handleCopyType = (
  path = state.currentApi.path,
  method = state.currentApi.method,
  source = state.swagger
) => {
  try {
    if (!path) {
      throw new Error();
    }
    const storage = state.storage;
    const codeFragment = freeSwaggerClient(
      {
        source,
        lang: storage.currentLanguage,
        jsDoc: storage.jsDoc,
        typedef: true,
        interface: true,
        recursive: storage.recursive,
        templateFunction: eval(
          storage.currentLanguage === "js"
            ? storage.jsTemplate
            : storage.tsTemplate
        )
      },
      path,
      method
    );
    if (!codeFragment) {
      Message.warning("没有可生成的类型代码");
      return;
    }
    copyMessage(codeFragment);
  } catch (e) {
    Message.error("复制失败，请检查选择的 api 或模版");
    console.log(e);
  }
};

export const handleCopyApi = (
  path = state.currentApi.path,
  method = state.currentApi.method,
  source = state.swagger
) => {
  try {
    if (!path) {
      throw new Error();
    }
    const storage = state.storage;
    const codeFragment = freeSwaggerClient(
      {
        source,
        lang: storage.currentLanguage,
        jsDoc: storage.jsDoc,
        templateFunction: eval(
          storage.currentLanguage === "js"
            ? storage.jsTemplate
            : storage.tsTemplate
        )
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

export const handleCopyPath = (
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

export const handleCopyFake = (
  path = state.currentApi.path,
  method = state.currentApi.method,
  parsedSwagger = state.parsedSwagger
) => {
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

export const handleCopyInterface = (source = state.swagger, interfaceName) => {
  try {
    const { code } = compileInterfaces({ source, interfaceName });
    copyMessage(code);
  } catch (e) {
    console.log(e);
    Message.error("复制失败，请检查选择的 api");
  }
};

export const handleCopyJsDocTypeDef = (
  source = state.swagger,
  interfaceName
) => {
  try {
    const { code } = compileJsDocTypedefs({ source, interfaceName });
    copyMessage(code);
  } catch (e) {
    console.log(e);
    Message.error("复制失败，请检查选择的 api");
  }
};

export const handleCopySchema = (
  path = state.currentApi.path,
  method = state.currentApi.method,
  parsedSwagger = state.parsedSwagger
) => {
  try {
    const { schema } = parsedSwagger.paths[path][method].responses[
      SUCCESS_CODE
    ];
    copyMessage(schema);
  } catch (e) {
    console.log(e);
    Message.error("复制失败，请检查选择的 api 或模版");
  }
};
