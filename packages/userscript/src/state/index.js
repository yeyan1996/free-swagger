import Vue from "vue";
import { Message } from "element-ui";
import { copyMessage } from "@/utils/dom-utils";
import { defaults, flattenDeep, groupBy } from "lodash-es";
import {
  default as freeSwaggerCore,
  jsTemplate,
  tsTemplate,
  compileInterfaces,
  compileJsDocTypedefs
} from "free-swagger-core";
import { retry } from "@/utils";
import { option, generate } from "json-schema-faker";

const STORAGE_KEY = "SWAGGER-USERSCRIPT";
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
      isNewUi: null,
      swagger: null,
      parsedSwagger: null // 解析所有 ref 后的 swagger 对象
    };
  },
  computed: {
    options() {
      if (!this.swagger) return [];
      const options = [];
      const paths = this.swagger.paths;
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
      // 根据 Tags 分组排序
      return flattenDeep(Object.values(groupBy(options, o => o.tag)));
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

    retry({
      cb: () => {
        // 新 UI（bytedance only）
        if (window.SwaggerBootstrapUi) {
          this.isNewUi = true;
        } else if (window.ui) {
          // 老 UI
          this.isNewUi = false;
        }
      },
      endCondition: () => this.isNewUi != null
    });
  }
});

// 复制单个接口的所有 interface/typedef
export const handleCopyType = async (
  path = state.currentApi.path,
  method = state.currentApi.method,
  source = state.swagger
) => {
  try {
    if (!path) {
      throw new Error("请选择 path");
    }
    const storage = state.storage;
    const isJS = storage.currentLanguage === "js";
    const isTS = storage.currentLanguage === "ts";

    const codeFragment = await freeSwaggerCore(
      {
        source,
        lang: storage.currentLanguage,
        jsDoc: storage.jsDoc,
        typedef: isJS,
        interface: isTS,
        recursive: storage.recursive,
        templateFunction: eval(isJS ? storage.jsTemplate : storage.tsTemplate)
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
    Message.error("复制失败：请检查选择的 api 或模版");
    console.log(e);
  }
};

export const handleCopyApi = async (
  path = state.currentApi.path,
  method = state.currentApi.method,
  source = state.swagger
) => {
  try {
    if (!path) {
      throw new Error();
    }
    const storage = state.storage;
    const codeFragment = await freeSwaggerCore(
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
    Message.error("复制失败：请检查选择的 api 或模版");
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
    copyMessage(`"${formattedPath}" /* ${method.toUpperCase()} */`);
  } catch (e) {
    Message.error("复制失败：请检查选择的 api 或模版");
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
        msg: "ok",
        data: {}
      };
    }
    copyMessage(mockSchema);
  } catch (e) {
    console.log(e);
    Message.error("复制失败：请检查选择的 api 或模版");
  }
};

// 复制全量/单个 interface
export const handleCopyInterface = async (
  source = state.swagger,
  url = state.url,
  interfaceName
) => {
  try {
    const { code } = await compileInterfaces({ source, interfaceName, url });
    copyMessage(code);
  } catch (e) {
    console.log(e);
    Message.error("复制失败：请检查选择的 api");
  }
};

// 复制全量/单个 typedef
export const handleCopyJsDocTypeDef = async (
  source = state.swagger,
  url = state.url,
  interfaceName
) => {
  try {
    const { code } = await compileJsDocTypedefs({ source, interfaceName, url });
    copyMessage(code);
  } catch (e) {
    console.log(e);
    Message.error("复制失败：请检查选择的 api");
  }
};

// 写入磁盘
export const handleWriteToDisk = async (
  path = state.currentApi.path,
  method = state.currentApi.method,
  source = state.swagger
) => {
  try {
    if (!path) {
      throw new Error();
    }

    if (!window.showOpenFilePicker) {
      return Message.error(
        "该浏览器不支持showOpenFilePicker, 检查是否是https，建议使用：chrome >= 116、Edge >= 115、Opera >=101 版本"
      );
    }

    const storage = state.storage;
    const codeFragment = await freeSwaggerCore(
      {
        source,
        lang: storage.currentLanguage,
        jsDoc: storage.jsDoc,
        templateFunction: eval(
          storage.currentLanguage === "js"
            ? storage.jsTemplate
            : storage.tsTemplate
        ),
      },
      path,
      method
    );
    const [fileHandle] = await window.showOpenFilePicker({
      multiple: false,
    });

    const contentFile = await fileHandle.getFile();

    const orgFileText = await contentFile.text();

    const writableStream = await fileHandle.createWritable();

    await writableStream.write(orgFileText + "\n" + codeFragment);

    await writableStream.close();

    Message.success("写入磁盘成功");
  } catch (e) {
    Message.error("写入磁盘失败");
  }
};