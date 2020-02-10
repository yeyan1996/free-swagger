"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const camelcase_1 = __importDefault(require("camelcase"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const isUrl = (url) => typeof url === "string" && url.startsWith("http");
exports.isUrl = isUrl;
const isPath = (url) => typeof url === "string" && fs_extra_1.default.existsSync(path_1.default.resolve(process.cwd(), url));
exports.isPath = isPath;
const ensureExist = (path, isDir = false) => {
    if (!fs_extra_1.default.existsSync(path)) {
        if (isDir) {
            fs_extra_1.default.mkdirSync(path, { recursive: true });
        }
        else {
            fs_extra_1.default.writeFileSync(path, "");
        }
    }
};
exports.ensureExist = ensureExist;
const isOpenApi2 = (config) => {
    if (typeof config.source === "string") {
        return false;
    }
    const version = config.source.swagger;
    console.log("openApi version:", chalk_1.default.yellow(version));
    return version.startsWith("2.", 0);
};
exports.isOpenApi2 = isOpenApi2;
const pascalCase = (str) => camelcase_1.default(str, {
    pascalCase: true
});
exports.pascalCase = pascalCase;
