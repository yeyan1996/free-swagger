"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const utils_1 = require("../utils");
const rc_1 = require("../default/rc");
exports.source = {
    name: "source",
    message: `输入 swagger 源(${chalk_1.default.magenta("url/path")})`,
    default: rc_1.rc.data.source,
    validate: (input) => {
        if (!input)
            return "请输入 swagger 源";
        if (utils_1.isUrl(input) || utils_1.isPath(input)) {
            return true;
        }
        return "输入的路径不合法或不存在";
    }
};
