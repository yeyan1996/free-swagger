import path from "path";
import os from "os";
import fse from "fs-extra";
import prettier from "prettier";
import { TemplateFunction, jsTemplate, tsTemplate } from "free-swagger-client";
import { Config } from "../utils";
import {
  DEFAULT_CUSTOM_IMPORT_CODE_JS,
  DEFAULT_CUSTOM_IMPORT_CODE_TS
} from "./index";

export interface Answer {
  previousSource?: string;
  source?: string;
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
    this.path = path.resolve(homedir, ".free-swaggerrc");
    const data = fse.readFileSync(this.path, "utf-8") || "{}";
    this.data = { ...this.getDefaultAnswer(), ...JSON.parse(data) };
  }
  getDefaultAnswer(): Answer {
    return {
      source: undefined,
      root: `${path.resolve(process.cwd(), "src/api")}`,
      lang: "js",
      shouldEditTemplate: "n",
      customImportCode: DEFAULT_CUSTOM_IMPORT_CODE_JS,
      customImportCodeJs: DEFAULT_CUSTOM_IMPORT_CODE_JS,
      customImportCodeTs: DEFAULT_CUSTOM_IMPORT_CODE_TS,
      templateFunction: eval(tsTemplate),
      tsTemplate: tsTemplate,
      jsTemplate: jsTemplate,
      apiChoices: [],
      chooseAll: false
    };
  }
  getConfig(): Required<Config> {
    return {
      source: this.data.source!,
      root: this.data.root!,
      lang: this.data.lang!,
      customImportCode: this.data.customImportCode!,
      // 合并默认模版
      templateFunction: eval(
        this.data.lang === "ts" ? this.data.tsTemplate : this.data.jsTemplate
      ),
      chooseAll: this.data.chooseAll
    };
  }
  merge(answer: Partial<Answer>): void {
    this.data = { ...this.data, ...answer };
  }
  // 生成本次输入的所有回答并存储进 rc
  save(): void {
    fse.writeFileSync(
      this.path,
      prettier.format(JSON.stringify(this.data), {
        parser: "json"
      })
    );
  }
  // 记录当前 source 和之前的 source
  // 对比两者判断是否需要清空用户选择的 api 缓存记录
  recordHash(newSource?: string): void {
    this.data.previousSource = this.data.source;
    this.data.source = newSource;
  }
  refreshCache(): boolean {
    return this.data.previousSource !== this.data.source;
  }
  reset(): void {
    this.data = this.getDefaultAnswer();
    this.save();
  }
}

export const rc = new Rc();
