#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";
import path from "path";
import fse from "fs-extra";
import commander from "commander";
import { Answer, rc } from "../default/rc";
import { source } from "./questions";
import freeSwagger from "../main";

const packageJsonPath = path.resolve(__dirname, "../../package.json");
const pkg = JSON.parse(fse.readFileSync(packageJsonPath, "utf-8")); // package.json

commander
  .version(pkg.version)
  .usage("")
  .option("-r --reset", "rest config", () => {
    rc.reset();
    console.log(chalk.green("重置配置项成功"));
    return;
  })
  .option("-s --show", "show config", () => {
    console.log(rc.data);
    return;
  })
  .option("-c, --config", "launch free-swagger under config mode", async () => {
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
        default: (answer: Answer): string =>
          answer.lang === "ts"
            ? defaultAnswer.customImportCodeTs
            : defaultAnswer.customImportCodeJs,
        validate: (input): boolean | string =>
          input ? true : "请输入默认头语句"
      }
    ]);
    rc.merge(answer);
    rc.save();
    await freeSwagger.compile(rc.getConfig());
  })
  // 默认启动
  .action(async command => {
    if (command.rawArgs[2]) return;
    const answer: { source: string } = await inquirer.prompt([source]);
    rc.merge(answer);
    rc.save();
    await freeSwagger.compile(rc.getConfig());
    return;
  })
  .parse(process.argv);
