#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import freeSwagger, { compile } from "../main";
import { Answer, rc } from "../default/rc";
import { source } from "./questions";

const arg = process.argv[2];

(async (): Promise<void> => {
  console.log(11111111, arg);
  if (!arg) {
    console.log(2);
    const answer: { source: string } = await inquirer.prompt([source]);
    await freeSwagger(answer.source);
  }
  if (arg === "-c" || arg == "--config") {
    console.log(3);
    const { data: defaultAnswer } = rc;
    // 获取用户回答
    const answer: Omit<
      Answer,
      "tsTemplate" | "jsTemplate"
    > = await inquirer.prompt([
      source,
      {
        name: "root",
        message: "输入导出 api 的根路径",
        default: defaultAnswer.root,
        validate: (input): boolean | string =>
          input ? true : "请输入 api 根路径"
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
        when: ({ shouldEditTemplate }): boolean => shouldEditTemplate === "y",
        validate: (input, answer): boolean => {
          if (!answer) return false;
          rc.merge(
            answer.lang === "ts" ? { tsTemplate: input } : { jsTemplate: input }
          );
          return true;
        },
        default: (answer: Answer): string =>
          answer.lang === "ts"
            ? defaultAnswer.tsTemplate
            : defaultAnswer.jsTemplate
      },
      {
        name: "customImportCode",
        message: `输入自定义头语句(${chalk.magenta("自定义请求库路径")})`,
        default: defaultAnswer.customImportCode,
        validate: (input): boolean | string =>
          input ? true : "请输入默认头语句"
      }
    ]);
    rc.merge(answer);
    rc.save();

    // 合并默认模版
    answer.template = eval(
      answer.lang === "ts" ? defaultAnswer.tsTemplate : defaultAnswer.jsTemplate
    );
    await compile({
      source: answer.source!,
      root: answer.root,
      lang: answer.lang,
      customImportCode: answer.customImportCode,
      template: answer.template
    });
  }
  console.log(4);
})();
console.log(5);
