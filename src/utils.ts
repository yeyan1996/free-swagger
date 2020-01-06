import { OpenAPIV2 } from "openapi-types";
import prettier from "prettier";
import camelcase from "camelcase";
import fse from "fs-extra";
import path from "path";
import chalk from "chalk";

export interface Config<T = string | OpenAPIV2.Document> {
  source: T;
  root?: string;
  template?: Template;
  customImportCode?: string;
  lang?: "js" | "ts";
  chooseAll?: boolean; // 测试用
}

export interface Template {
  (config: TemplateConfig): string;
}

export interface TemplateConfig {
  url: string;
  summary: string;
  method: string;
  name: string;
  responseType: string;
  deprecated: boolean;
  IResponse: string;
  IParams: string;
  IPathParams: string;
}

export interface ParsedSchemaObject {
  type: string;
  imports: string[];
  required: boolean;
  description: string;
  isBinary: boolean;
}

export type ParsedSchema =
  | {
      [key: string]: ParsedSchemaObject;
    }
  | ParsedSchemaObject;

const isUrl = (url: string | OpenAPIV2.Document): url is string =>
  typeof url === "string" && url.startsWith("http");
const isPath = (url: string | OpenAPIV2.Document): url is string =>
  typeof url === "string" && fse.existsSync(path.resolve(process.cwd(), url));
const curlyBracketReg = /{((?:.|\r?\n)+?)}/g;
const specialCharactersReg = /[`~!@#$%^&*()_+<>«»?:"{},./;'[\]]/g;
const TYPE_MAP: { [key: string]: string } = {
  boolean: "boolean",
  bool: "boolean",
  Boolean: "boolean",
  Int64: "number",
  integer: "number",
  number: "number",
  string: "string",
  file: "Blob",
  formData: "FormData"
};

// "/pet/{petId}" -> "/pet/${arguments[1].petId}"
// "/pet/{map.id}" -> "/pet/${arguments[1]["map.id"]}"
// 目前默认第二个参数为 pathParams
const formatUrl = (path: string): string =>
  path.replace(curlyBracketReg, (_, $1) =>
    specialCharactersReg.test($1)
      ? `\${arguments[1]['${$1}']}`
      : `\${arguments[1].${$1}}`
  );

// 格式化含有泛型的接口
// Animal<Dog> -> Animal_Dog
// Map<string,string> -> Map_string_string
const formatGenericInterface = (definitionClassName: string): string => {
  let res = definitionClassName.replace(specialCharactersReg, "_");
  // 清空尾部的分割符号 _
  while (res.endsWith("_")) {
    res = res.slice(0, -1);
  }
  return res;
};

// 获取 $ref 指向的类型
const getRef = (ref: OpenAPIV2.ReferenceObject["$ref"]): string => {
  const propType = ref.slice(ref.lastIndexOf("/") + 1);
  return formatGenericInterface(propType);
};

const isRef = (schema?: any): schema is OpenAPIV2.ReferenceObject =>
  schema && !!schema.$ref;

// 找到 schema 对应的 Ts 类型 & 找到需要导入的 interface 名
const schemaToTsType = (
  schema?: OpenAPIV2.SchemaObject
): ParsedSchemaObject => {
  if (!schema)
    return {
      type: "any",
      imports: [],
      isBinary: false,
      required: false,
      description: ""
    };
  const imports: string[] = [];

  const recursive = (schema: OpenAPIV2.SchemaObject): string => {
    if (schema.$ref) {
      const ref = getRef(schema.$ref);
      imports.push(ref);
      return ref;
    }
    if (!schema.type) return "any";

    if (schema.type === "array" && schema.items) {
      return `${recursive(schema.items)}[]`;
    }
    // todo 对 object 的响应 schema 做处理
    if (schema.type === "object") {
      let type = "";
      if (!schema.properties) return "object";
      Object.keys(schema.properties).forEach(key => {
        type += schema.properties ? recursive(schema.properties[key]) : "";
      });
      return type;
    }
    if (schema.enum) {
      return schema.enum.map(value => `"${value}"`).join(" | ");
    }

    // 极小情况下的容错
    if (Array.isArray(schema.type)) {
      return JSON.stringify(schema.type);
    }
    // 基本类型
    return TYPE_MAP[schema.type];
  };

  return {
    type: recursive(schema),
    imports,
    isBinary: schema.type === "file",
    required: false,
    description: ""
  };
};

const formatCode = (code: string, lang?: "ts" | "js"): string =>
  prettier.format(code, {
    printWidth: 120,
    tabWidth: 2,
    parser: lang === "js" ? "babel" : "typescript",
    trailingComma: "none",
    jsxBracketSameLine: false
  });

const ensureExist = async (path: string, isDir = false): Promise<void> => {
  if (!fse.existsSync(path)) {
    if (isDir) {
      await fse.mkdir(path);
    } else {
      await fse.writeFile(path, "");
    }
  }
};

const pascalCase = (str: string): string =>
  camelcase(str, {
    pascalCase: true
  });

const isOpenApi2 = (config: Config): config is Config<OpenAPIV2.Document> => {
  if (typeof config.source === "string") {
    return false;
  }
  const version = config.source.swagger;
  console.log("openApi version:", chalk.yellow(version));
  return version.startsWith("2.", 0);
};

export {
  formatGenericInterface,
  getRef,
  isRef,
  formatUrl,
  schemaToTsType,
  formatCode,
  ensureExist,
  pascalCase,
  isUrl,
  isPath,
  isOpenApi2,
  TYPE_MAP
};
