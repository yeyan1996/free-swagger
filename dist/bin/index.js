#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const main_1 = __importStar(require("../main"));
const rc_1 = require("../default/rc");
const questions_1 = require("./questions");
const arg = process.argv[2];
(async () => {
    console.log(11111111, arg);
    if (!arg) {
        console.log(2);
        const answer = await inquirer_1.default.prompt([questions_1.source]);
        await main_1.default(answer.source);
    }
    if (arg === "-c" || arg == "--config") {
        console.log(3);
        const { data: defaultAnswer } = rc_1.rc;
        // 获取用户回答
        const answer = await inquirer_1.default.prompt([
            questions_1.source,
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
                validate: (input) => input ? true : "请输入默认头语句"
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
    }
    console.log(4);
})();
console.log(5);
