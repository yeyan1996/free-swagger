import path from "path";
import os from "os";
import fse from "fs-extra";
import prettier from "prettier";
import { TemplateFunction, jsTemplate, tsTemplate } from "free-swagger-client";
import { Config, ensureExist } from "../utils";
import {
  DEFAULT_CUSTOM_IMPORT_CODE_JS,
  DEFAULT_CUSTOM_IMPORT_CODE_TS
} from "./index";
import { execSync } from "child_process";
const EXPORT_DEFAULT = "export default";

export interface Answer {
  previousSource?: string;
  source?: string;
  cookie: string;
  root?: string;
  customImportCode?: string;
  lang?: "js" | "ts";
  shouldEditTemplate: "y" | "n";
  customImportCodeJs: string;
  customImportCodeTs: string;
  jsTemplate: string;
  tsTemplate: string;
  templateFunction?: TemplateFunction;
  apiChoices: { name: string; checked: boolean }[];
  chooseAll: boolean;
}

class Rc {
  path: string;
  data: Answer;

  constructor() {
    const homedir = os.homedir();
    this.path = path.resolve(homedir, ".free-swaggerrc.js");
    ensureExist(this.path);
    const data = fse.readFileSync(this.path, "utf-8") || "{}";
    // hack: 目的是取出 free-swaggerrc 中的代码片段
    /*eslint-disable*/
    let _obj = {};
    eval(`_obj = ` + data.slice(EXPORT_DEFAULT.length));
    this.data = {
      ...this.getDefaultAnswer(),
      ..._obj
    };
  }
  // 获取 inquirer 默认回答
  getDefaultAnswer(): Answer {
    return {
      source: undefined,
      cookie: "",
      root: `${path.resolve(process.cwd(), "src/api")}`,
      lang: "js",
      shouldEditTemplate: "n",
      customImportCode: "",
      customImportCodeJs: DEFAULT_CUSTOM_IMPORT_CODE_JS,
      customImportCodeTs: DEFAULT_CUSTOM_IMPORT_CODE_TS,
      templateFunction: eval(tsTemplate),
      tsTemplate: tsTemplate,
      jsTemplate: jsTemplate,
      apiChoices: [],
      chooseAll: false
    };
  }
  // 获取默认配置项
  getConfig(): Required<Config> {
    return {
      source: this.data.source!,
      root: this.data.root!,
      lang: this.data.lang!,
      cookie: this.data.cookie!,
      customImportCode: this.data.customImportCode!,
      templateFunction: eval(
        this.data.lang === "ts" ? this.data.tsTemplate : this.data.jsTemplate
      ),
      chooseAll: this.data.chooseAll
    };
  }
  // 合并配置项
  merge(answer: Partial<Answer>): void {
    this.data = { ...this.data, ...answer };
  }
  // 将配置项存储至 rc 文件
  save(): void {
    const data = JSON.stringify(this.data);

    // hack: 由于 JSON.stringify 不能保存函数，这里手动将函数拼接并写入 rc 文件
    // 去除尾部分号，否则会报词法错误
    let templateFunction = this.data.templateFunction
      ?.toString()
      .replace("\n", "")
      .trim();
    if (templateFunction?.endsWith(";")) {
      templateFunction = templateFunction.slice(0, templateFunction.length - 1);
    }
    const dataWithFunction =
      data.slice(0, data.length - 1) +
      "," +
      `templateFunction:${templateFunction}}`;
    const code = prettier.format(`${EXPORT_DEFAULT} ${dataWithFunction}`, {
      parser: "babel"
    });
    fse.writeFileSync(this.path, code);
  }
  // 记录当前 source 和之前的 source
  // 对比两者判断是否需要清空用户选择的 api 缓存记录
  recordHash(newSource?: string): void {
    this.data.previousSource = this.data.source;
    this.data.source = newSource;
  }

  // 是否清空用户选择的 api 缓存记录
  shouldRefreshCache(): boolean {
    return this.data.previousSource !== this.data.source;
  }

  // 重置为默认配置项
  reset(): void {
    this.data = this.getDefaultAnswer();
    this.save();
  }
  show(): void {
    console.log(this.data);
  }
  // 打开编辑器编辑模版
  edit(): void {
    execSync(`code ${this.path}`);
  }
}

export const rc = new Rc();
