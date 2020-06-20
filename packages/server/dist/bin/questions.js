"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookie = exports.source = void 0;
const chalk_1 = __importDefault(require("chalk"));
const utils_1 = require("../utils");
const rc_1 = require("../default/rc");
exports.source = {
    name: 'source',
    message: `输入 swagger 源(${chalk_1.default.magenta('url/path')})`,
    default: rc_1.rc.configData.source,
    validate: (input) => {
        if (!input)
            return '请输入 swagger 源';
        if (utils_1.isUrl(input) || utils_1.isPath(input)) {
            return true;
        }
        return '输入的路径不合法或不存在';
    },
};
exports.cookie = {
    name: 'cookie',
    message: `输入用于鉴权的cookie(${chalk_1.default.magenta('swagger源不需要鉴权则置空 e.g SESSION=xxx')})`,
    when: ({ source }) => utils_1.isUrl(source),
    default: rc_1.rc.configData.cookie,
};
