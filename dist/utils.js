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
const fs_extra_1 = __importDefault(require("fs-extra"));
const camelcase_1 = __importDefault(require("camelcase"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const standalone_1 = __importDefault(require("prettier/standalone"));
const parser_babylon_1 = __importDefault(require("prettier/parser-babylon"));
const parser_typescript_1 = __importDefault(require("prettier/parser-typescript"));
const isUrl = (url) => typeof url === "string" && url.startsWith("http");
exports.isUrl = isUrl;
const isPath = (url) => typeof url === "string" && fs_extra_1.default.existsSync(path_1.default.resolve(process.cwd(), url));
exports.isPath = isPath;
const ensureExist = (path, isDir = false) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fs_extra_1.default.existsSync(path)) {
        if (isDir) {
            fs_extra_1.default.mkdirSync(path, { recursive: true });
        }
        else {
            yield fs_extra_1.default.writeFile(path, "");
        }
    }
});
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
const formatCode = (lang) => (code) => standalone_1.default.format(code, {
    plugins: [parser_babylon_1.default, parser_typescript_1.default],
    printWidth: 120,
    tabWidth: 2,
    parser: lang === "js" ? "babel" : "typescript",
    trailingComma: "none",
    jsxBracketSameLine: false
});
exports.formatCode = formatCode;
const pascalCase = (str) => camelcase_1.default(str, {
    pascalCase: true
});
exports.pascalCase = pascalCase;
