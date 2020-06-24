"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rc = void 0;
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const prettier_1 = __importDefault(require("prettier"));
const lodash_1 = require("lodash");
const os_2 = require("os");
const free_swagger_client_1 = require("free-swagger-client");
const index_1 = require("./index");
const child_process_1 = require("child_process");
const EXPORT_DEFAULT = 'export default';
class Rc {
    constructor() {
        this.path = path_1.default.resolve(os_1.default.homedir(), '.free-swaggerrc.js');
        fs_extra_1.default.ensureFileSync(this.path);
        const dataContent = fs_extra_1.default.readFileSync(this.path, 'utf-8') || '{}';
        // hack: 目的是取出 free-swaggerrc 中的代码片段
        /*eslint-disable*/
        let _obj = {};
        eval(`_obj = ` + dataContent.replace(new RegExp(`^${EXPORT_DEFAULT}`), ""));
        this.configData = {
            ...this.getDefaultConfigAnswer(),
            ...lodash_1.pick(_obj, Object.keys(this.getDefaultConfigAnswer()))
        };
        this.mockData = {
            ...this.getDefaultMockAnswer(),
            ...lodash_1.pick(_obj, Object.keys(this.getDefaultMockAnswer()))
        };
    }
    // 获取 inquirer 默认回答
    getDefaultConfigAnswer() {
        return {
            previousSource: "",
            source: "",
            cookie: "",
            root: path_1.default.resolve(process.cwd(), "src/api"),
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
    getDefaultMockAnswer() {
        return {
            source: "",
            cookie: "",
            mockRoot: global.__DEV__ ? path_1.default.resolve(__dirname, "../../test/mock/default") : path_1.default.resolve(process.cwd(), "mock"),
            wrap: false,
        };
    }
    // 获取默认配置项
    getConfig() {
        return {
            source: this.configData.source,
            root: this.configData.root,
            lang: this.configData.lang,
            cookie: this.configData.cookie,
            customImportCode: this.configData.lang === "ts" ? this.configData.customImportCodeTs : this.configData.customImportCode,
            templateFunction: eval(this.configData.lang === "ts" ? this.configData.tsTemplate : this.configData.jsTemplate),
            chooseAll: this.configData.chooseAll
        };
    }
    // 合并配置项
    merge(answer) {
        this.configData = lodash_1.mergeWith(this.configData, answer, (old, now) => {
            if (now == null)
                return old;
        });
        // todo mockData 的 source 字段可能和 configData 的 source 字段重合，导致 source 被缓存没有更新
        this.mockData = lodash_1.mergeWith(this.mockData, answer, (old, now) => {
            if (now == null)
                return old;
        });
    }
    // 将配置项存储至 rc 文件
    save() {
        var _a;
        const data = JSON.stringify(lodash_1.mergeWith(this.configData, this.mockData, (old, now) => {
            if (now == null)
                return old;
        }));
        // hack: 由于 JSON.stringify 不能保存函数，这里手动将函数拼接并写入 rc 文件
        // 去除尾部分号，否则会报词法错误
        let templateFunction = (_a = this.configData.templateFunction) === null || _a === void 0 ? void 0 : _a.toString().replace(os_2.EOL, "").trim();
        if (templateFunction === null || templateFunction === void 0 ? void 0 : templateFunction.endsWith(";")) {
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
        this.configData.previousSource = this.configData.source;
        this.configData.source = newSource;
    }
    // 是否清空用户选择的 api 缓存记录
    shouldRefreshCache() {
        return this.configData.previousSource !== this.configData.source;
    }
    // 重置为默认配置项
    reset() {
        this.configData = this.getDefaultConfigAnswer();
        this.mockData = this.getDefaultMockAnswer();
        fs_extra_1.default.unlinkSync(this.path);
        this.save();
    }
    // 查看配置项
    show() {
        console.log(lodash_1.mergeWith(this.configData, this.mockData, (old, now) => {
            if (now == null)
                return old;
        }));
    }
    // 打开编辑器编辑模版
    edit() {
        child_process_1.execSync(`code ${this.path}`);
    }
}
exports.rc = new Rc();
