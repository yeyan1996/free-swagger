"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const prettier_1 = __importDefault(require("prettier"));
const free_swagger_client_1 = require("free-swagger-client");
const utils_1 = require("../utils");
const index_1 = require("./index");
class Rc {
    constructor() {
        const homedir = os_1.default.homedir();
        this.path = path_1.default.resolve(homedir, ".free-swaggerrc");
        utils_1.ensureExist(this.path);
        const data = fs_extra_1.default.readFileSync(this.path, "utf-8") || "{}";
        this.data = Object.assign(Object.assign({}, this.getDefaultAnswer()), JSON.parse(data));
    }
    getDefaultAnswer() {
        return {
            source: undefined,
            root: `${path_1.default.resolve(process.cwd(), "src/api")}`,
            lang: "js",
            shouldEditTemplate: "n",
            customImportCode: index_1.DEFAULT_CUSTOM_IMPORT_CODE_JS,
            customImportCodeJs: index_1.DEFAULT_CUSTOM_IMPORT_CODE_JS,
            customImportCodeTs: index_1.DEFAULT_CUSTOM_IMPORT_CODE_TS,
            templateFunction: eval(free_swagger_client_1.tsTemplate),
            tsTemplate: free_swagger_client_1.tsTemplate,
            jsTemplate: free_swagger_client_1.jsTemplate,
            apiChoices: [],
            chooseAll: false
        };
    }
    getConfig() {
        return {
            source: this.data.source,
            root: this.data.root,
            lang: this.data.lang,
            customImportCode: this.data.customImportCode,
            // 合并默认模版
            templateFunction: eval(this.data.lang === "ts" ? this.data.tsTemplate : this.data.jsTemplate),
            chooseAll: this.data.chooseAll
        };
    }
    merge(answer) {
        this.data = Object.assign(Object.assign({}, this.data), answer);
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
    reset() {
        this.data = this.getDefaultAnswer();
        this.save();
    }
    show() {
        console.log(this.data);
    }
}
exports.rc = new Rc();
