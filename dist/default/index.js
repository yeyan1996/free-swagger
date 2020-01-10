"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const template_1 = require("./template");
const rc_1 = require("./rc");
const path_1 = __importDefault(require("path"));
const DEFAULT = {
    root: path_1.default.resolve(process.cwd(), "src/api"),
    customImportCode: `import axios from "axios";`,
    lang: "js",
    template: template_1.jsTemplate
};
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
        ...DEFAULT,
        template,
        ...mergedConfig
    };
};
