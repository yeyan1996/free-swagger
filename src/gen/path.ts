import { formatCode } from "../utils";
import { genPath } from "free-swagger-client";
import { ApiCollection } from "../parse/path";
import { Config } from "../utils";
import { uniq, isEmpty } from "lodash";

const RELATIVE_PATH = "./interface"; // interface 的相对路径

const genDisabledCode = (lang: "ts" | "js"): string =>
  lang === "ts"
    ? `// @ts-nocheck \n/* eslint-disable */\n`
    : "/* eslint-disable */\n";

const genImportInterfaceCode = (apiCollection: ApiCollection): string => {
  const importsInterface = uniq(
    Object.keys(apiCollection)
      .map(key => apiCollection[key])
      .reduce<string[]>((acc, cur) => [...acc, ...cur.imports], [])
  );
  if (isEmpty(importsInterface)) return "";
  return `import {${importsInterface.join(",")}} from "${RELATIVE_PATH}";`;
};

// 生成单个 ts 文件中的所有 api
const genPaths = (
  apiCollection: ApiCollection,
  config: Required<Config>
): string => {
  let code = "";

  code += genDisabledCode(config.lang);
  code += config.lang === "ts" ? genImportInterfaceCode(apiCollection) : "";
  code += config.customImportCode;
  code += Object.values(apiCollection)
    .map(api => genPath(api, config.template))
    .reduce((acc, cur) => acc + cur);

  return formatCode(config.lang)(code);
};

export { genPaths };
