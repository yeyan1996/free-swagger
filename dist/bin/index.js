#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = __importDefault(require("commander"));
const main_1 = require("../main");
const rc_1 = require("../default/rc");
const questions_1 = require("./questions");
commander_1.default
    .option("-c, --config")
    .option("-r --reset")
    .action(async (command) => {
    if (command.reset) {
        rc_1.rc.reset();
        console.log(chalk_1.default.green("重置配置项成功"));
        return;
    }
    if (!command.config) {
        const answer = await inquirer_1.default.prompt([questions_1.source]);
        rc_1.rc.merge(answer);
        rc_1.rc.save();
        await main_1.compile(rc_1.rc.getConfig());
        return;
    }
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
    await main_1.compile(rc_1.rc.getConfig());
})
    .parse(process.argv);
