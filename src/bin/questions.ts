import chalk from "chalk";
import { isPath, isUrl } from "../utils";
import { rc } from "../default/rc";

export const source = {
  name: "source",
  message: `输入 swagger 路径(${chalk.magenta("url/path")})`,
  default: rc.data.source,
  validate: (input: string): boolean | string => {
    if (!input) return "请输入 swagger 路径";
    if (isUrl(input) || isPath(input)) {
      return true;
    }
    return "输入的路径不合法或不存在";
  }
};
