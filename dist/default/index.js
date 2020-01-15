"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const template_1 = require("./template");
const rc_1 = require("./rc");
const path_1 = __importDefault(require("path"));
exports.DEFAULT_CUSTOM_IMPORT_CODE_TS = `import axios,{ AxiosResponse } from "axios";`;
exports.DEFAULT_CUSTOM_IMPORT_CODE_JS = `import axios from "axios";`;
const getDefaultConfig = (config) => ({
    root: path_1.default.resolve(process.cwd(), "src/api"),
    customImportCode: config.lang === "ts"
        ? exports.DEFAULT_CUSTOM_IMPORT_CODE_TS
        : exports.DEFAULT_CUSTOM_IMPORT_CODE_JS,
    lang: "js",
    template: template_1.jsTemplate,
    chooseAll: false
});
exports.mergeDefaultConfig = (config) => __awaiter(void 0, void 0, void 0, function* () {
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
    return Object.assign(Object.assign(Object.assign({}, getDefaultConfig(mergedConfig)), { template }), mergedConfig);
});
