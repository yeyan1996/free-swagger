"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const template_1 = require("./template");
const rc_1 = require("./rc");
const path_1 = __importDefault(require("path"));
exports.DEFAULT_CUSTOM_IMPORT_CODE_TS = `import axios,{AxiosResponse} from "axios";`;
exports.DEFAULT_CUSTOM_IMPORT_CODE_JS = `import axios from "axios";`;
const getDefaultConfig = (config) => ({
    root: path_1.default.resolve(process.cwd(), "src/api"),
    customImportCode: config.lang === "js"
        ? exports.DEFAULT_CUSTOM_IMPORT_CODE_JS
        : exports.DEFAULT_CUSTOM_IMPORT_CODE_TS,
    lang: "js",
    template: template_1.jsTemplate
});
exports.mergeDefaultConfig = async (config) => {
    let mergedConfig = {};
    if (typeof config === "string") {
        mergedConfig.source = config;
        rc_1.rc.recordHash(mergedConfig.source);
    }
    else {
        mergedConfig = config;
    }
    let template;
    if (mergedConfig.template) {
        template = mergedConfig.template;
    }
    else if (!mergedConfig.lang) {
        template = template_1.jsTemplate;
    }
    else {
        template = mergedConfig.lang === "ts" ? template_1.tsTemplate : template_1.jsTemplate;
    }
    return {
        ...getDefaultConfig(mergedConfig),
        template,
        ...mergedConfig
    };
};
