"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const prettier_1 = __importDefault(require("prettier"));
const template_1 = require("./template");
class Rc {
    constructor() {
        const homedir = os_1.default.homedir();
        this.path = path_1.default.resolve(homedir, ".free-swaggerrc");
        const data = fs_extra_1.default.readFileSync(this.path, "utf-8") || "{}";
        this.data = { ...this.getDefault(), ...JSON.parse(data) };
    }
    getDefault() {
        return {
            source: undefined,
            root: `${path_1.default.resolve(process.cwd(), "src/api")}`,
            lang: "js",
            shouldEditTemplate: "n",
            customImportCode: `import axios from "axios";`,
            template: template_1.tsTemplate,
            tsTemplate: `${template_1.tsTemplate}`,
            jsTemplate: `${template_1.jsTemplate}`,
            apiChoices: []
        };
    }
    merge(answer) {
        this.data = { ...this.data, ...answer };
    }
    // 生成本次输入的所有回答并存储进 rc
    save() {
        fs_extra_1.default.writeFileSync(this.path, prettier_1.default.format(JSON.stringify(this.data), {
            parser: "json"
        }));
    }
    // 记录当前 source 和之前的 source
    // 对比两者判断是否需要清空用户选择的 api 缓存记录
    recordHash(newSource) {
        this.data.previousSource = this.data.source;
        this.data.source = newSource;
    }
    refreshCache() {
        return this.data.previousSource !== this.data.source;
    }
}
exports.rc = new Rc();
