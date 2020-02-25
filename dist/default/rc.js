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
const child_process_1 = require("child_process");
const EXPORT_DEFAULT = "export default";
class Rc {
    constructor() {
        const homedir = os_1.default.homedir();
        this.path = path_1.default.resolve(homedir, ".free-swaggerrc.js");
        utils_1.ensureExist(this.path);
        const data = fs_extra_1.default.readFileSync(this.path, "utf-8") || "{}";
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
    getDefaultAnswer() {
        return {
            source: undefined,
            cookie: "",
            root: `${path_1.default.resolve(process.cwd(), "src/api")}`,
            lang: "js",
            shouldEditTemplate: "n",
            customImportCode: "",
            customImportCodeJs: index_1.DEFAULT_CUSTOM_IMPORT_CODE_JS,
            customImportCodeTs: index_1.DEFAULT_CUSTOM_IMPORT_CODE_TS,
            templateFunction: eval(free_swagger_client_1.tsTemplate),
            tsTemplate: free_swagger_client_1.tsTemplate,
            jsTemplate: free_swagger_client_1.jsTemplate,
            apiChoices: [],
            chooseAll: false
        };
    }
    // 获取默认配置项
    getConfig() {
        return {
            source: this.data.source,
            root: this.data.root,
            lang: this.data.lang,
            cookie: this.data.cookie,
            customImportCode: this.data.customImportCode,
            templateFunction: eval(this.data.lang === "ts" ? this.data.tsTemplate : this.data.jsTemplate),
            chooseAll: this.data.chooseAll
        };
    }
    // 合并配置项
    merge(answer) {
        this.data = { ...this.data, ...answer };
    }
    // 将配置项存储至 rc 文件
    save() {
        var _a, _b;
        const data = JSON.stringify(this.data);
        // hack: 由于 JSON.stringify 不能保存函数，这里手动将函数拼接并写入 rc 文件
        // 去除尾部分号，否则会报词法错误
        let templateFunction = (_a = this.data.templateFunction) === null || _a === void 0 ? void 0 : _a.toString().replace("\n", "").trim();
        if ((_b = templateFunction) === null || _b === void 0 ? void 0 : _b.endsWith(";")) {
            templateFunction = templateFunction.slice(0, templateFunction.length - 1);
        }
        const dataWithFunction = data.slice(0, data.length - 1) +
            "," +
            `templateFunction:${templateFunction}}`;
        const code = prettier_1.default.format(`${EXPORT_DEFAULT} ${dataWithFunction}`, {
            parser: "babel"
        });
        fs_extra_1.default.writeFileSync(this.path, code);
    }
    // 记录当前 source 和之前的 source
    // 对比两者判断是否需要清空用户选择的 api 缓存记录
    recordHash(newSource) {
        this.data.previousSource = this.data.source;
        this.data.source = newSource;
    }
    // 是否清空用户选择的 api 缓存记录
    shouldRefreshCache() {
        return this.data.previousSource !== this.data.source;
    }
    // 重置为默认配置项
    reset() {
        this.data = this.getDefaultAnswer();
        this.save();
    }
    show() {
        console.log(this.data);
    }
    // 打开编辑器编辑模版
    edit() {
        child_process_1.execSync(`code ${this.path}`);
    }
}
exports.rc = new Rc();
