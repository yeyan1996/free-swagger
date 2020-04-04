import inquirer from "inquirer";
import { ParsedPaths } from "./parse/path";
import { rc, Answer } from "./default/rc";

const createChoices = (paths: ParsedPaths): Answer["apiChoices"] => {
  const chooseAll = Object.keys(paths).map(name => ({
    name,
    checked: true
  }));
  const apiChoices = rc.data.apiChoices;
  if (!apiChoices.length || rc.shouldRefreshCache()) return chooseAll;

  // 根据之前的缓存设置选项
  return Object.keys(paths).map(name => {
    const choice = apiChoices.find(choice => choice.name === name);
    const checked = choice ? choice.checked : true;
    return {
      name,
      checked
    };
  });
};

export const chooseApi = async (paths: ParsedPaths): Promise<string[]> => {
  const { choosePaths } = await inquirer.prompt([
    {
      name: "choosePaths",
      message: "选择需要新生成的 api 文件",
      type: "checkbox",
      pageSize: 20,
      choices: createChoices(paths),
      validate(answer): boolean | string {
        if (answer.length < 1) {
          return "至少选择一个 api 文件生成";
        }
        rc.merge({
          apiChoices: Object.keys(paths).map(name => ({
            name,
            checked: answer.includes(name)
          }))
        });
        rc.save();
        return true;
      }
    }
  ]);
  return choosePaths;
};
