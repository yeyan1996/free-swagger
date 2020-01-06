#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const main_1 = require("../main");
const utils_1 = require("../utils");
const rc_1 = require("../default/rc");
(async () => {
    const { data: defaultAnswer } = rc_1.rc;
    // 获取用户回答
    const answer = await inquirer_1.default.prompt([
        {
            name: "source",
            message: `输入 swagger 路径(${chalk_1.default.magenta("url/path")})`,
            default: defaultAnswer.source,
            validate: (input) => {
                if (!input)
                    return "请输入 swagger 路径";
                if (utils_1.isUrl(input) || utils_1.isPath(input)) {
                    return true;
                }
                return "输入的路径不合法";
            }
        },
        {
            name: "root",
            message: "输入导出 api 的根路径",
            default: defaultAnswer.root,
            validate: (input) => input ? true : "请输入 api 根路径"
        },
        {
            name: "lang",
            type: "list",
            message: "选择导出 api 的语言",
            default: defaultAnswer.lang,
            choices: ["ts", "js"]
        },
        {
            name: "shouldEditTemplate",
            type: "list",
            default: "n",
            choices: ["y", "n"],
            message: "是否需要编辑模版"
        },
        {
            name: "template",
            type: "editor",
            message: "输入模版",
            when: ({ shouldEditTemplate }) => shouldEditTemplate === "y",
            validate: (input, answer) => {
                if (!answer)
                    return false;
                rc_1.rc.merge(answer.lang === "ts" ? { tsTemplate: input } : { jsTemplate: input });
                return true;
            },
            default: (answer) => answer.lang === "ts"
                ? defaultAnswer.tsTemplate
                : defaultAnswer.jsTemplate
        },
        {
            name: "customImportCode",
            message: `输入自定义头语句(${chalk_1.default.magenta("自定义请求库路径")})`,
            default: defaultAnswer.customImportCode,
            validate: (input) => (input ? true : "请输入默认头语句")
        }
    ]);
    rc_1.rc.merge(answer);
    rc_1.rc.save();
    // 合并默认模版
    answer.template = eval(answer.lang === "ts" ? defaultAnswer.tsTemplate : defaultAnswer.jsTemplate);
    await main_1.compile({
        source: answer.source,
        root: answer.root,
        lang: answer.lang,
        customImportCode: answer.customImportCode,
        template: answer.template
    });
})();
