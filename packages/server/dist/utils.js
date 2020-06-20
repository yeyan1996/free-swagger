"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSwaggerDocument = exports.hasChinese = exports.pascalCase = exports.assertOpenApi2 = exports.isPath = exports.isUrl = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const camelcase_1 = __importDefault(require("camelcase"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const assert_1 = __importDefault(require("assert"));
const isUrl = (url) => typeof url === 'string' && url.startsWith('http');
exports.isUrl = isUrl;
const isPath = (url) => typeof url === 'string' && fs_extra_1.default.existsSync(path_1.default.resolve(process.cwd(), url));
exports.isPath = isPath;
const isSwaggerDocument = (value) => !!value.swagger;
exports.isSwaggerDocument = isSwaggerDocument;
const assertOpenApi2 = (config) => {
    var _a;
    // @ts-ignore
    if ((_a = config.source) === null || _a === void 0 ? void 0 : _a.swagger) {
        // @ts-ignore
        const version = config.source.swagger;
        console.log('openApi version:', chalk_1.default.yellow(version));
        assert_1.default(version.startsWith('2.', 0));
        return true;
    }
    else {
        return false;
    }
};
exports.assertOpenApi2 = assertOpenApi2;
const pascalCase = (str) => camelcase_1.default(str, {
    pascalCase: true,
});
exports.pascalCase = pascalCase;
const hasChinese = (str) => /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(str);
exports.hasChinese = hasChinese;
