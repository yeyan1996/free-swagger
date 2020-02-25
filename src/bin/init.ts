import inquirer from "inquirer";
import chalk from "chalk";
import path from "path";
import fse from "fs-extra";
import commander from "commander";
import { isUrl } from "../utils";
import { Answer, rc } from "../default/rc";
import { source } from "./questions";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const freeSwagger = require("../main");

export function init(cb?: Function): void {
  const packageJsonPath = path.resolve(__dirname, "../../package.json");
  const pkg = JSON.parse(fse.readFileSync(packageJsonPath, "utf-8")); // package.json

  commander
    .version(pkg.version)
    .usage("")
    .option("-r --reset", "重置为默认配置", () => {
      rc.reset();
      console.log(chalk.green("重置配置项成功"));
    })
    .option("-s --show", "显示当前配置", () => {
      rc.show();
    })
    .option("-e --edit", "修改当前配置", () => {
      rc.edit();
    })
    .option("-c, --config", "以配置项启动 free-swagger", async () => {
      const { data: defaultAnswer } = rc;
      // 获取用户回答
      const answer: Omit<
        Answer,
        "tsTemplate" | "jsTemplate"
      > = await inquirer.prompt([
        source,
        {
          name: "cookie",
          message: `输入用于鉴权的 cookie(${chalk.magenta(
            "swagger 源不需要鉴权则置空"
          )})`,
          when: ({ source }): boolean => isUrl(source!),
          default: defaultAnswer.cookie
        },
        {
          name: "root",
          message: "输入导出 api 的根路径",
          default: defaultAnswer.root,
          validate: (input): boolean | string => !!input || "请输入 api 根路径"
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
          name: "templateFunction",
          type: "editor",
          message: "输入模版函数",
          when: ({ shouldEditTemplate }): boolean => shouldEditTemplate === "y",
          validate: (input, answer): boolean => {
            if (!answer) return false;
            rc.merge(
              answer.lang === "ts"
                ? { tsTemplate: input }
                : { jsTemplate: input }
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
            defaultAnswer.customImportCode ||
            (answer.lang === "ts"
              ? defaultAnswer.customImportCodeTs
              : defaultAnswer.customImportCodeJs),
          validate: (input): boolean | string => !!input || "请输入默认头语句"
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
      cb?.();
      return;
    })
    .allowUnknownOption()
    .parse(process.argv);
}
