import { OpenAPIV2 } from "openapi-types";
import { Template } from "free-swagger-client";
import fse from "fs-extra";
import camelcase from "camelcase";
import path from "path";
import chalk from "chalk";
import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babylon";
import parserTypescript from "prettier/parser-typescript";

export interface Config<T = string | OpenAPIV2.Document> {
  source: T;
  root?: string;
  template?: Template;
  customImportCode?: string;
  lang?: "js" | "ts";
  chooseAll?: boolean;
}

const isUrl = (url: string | OpenAPIV2.Document): url is string =>
  typeof url === "string" && url.startsWith("http");
const isPath = (url: string | OpenAPIV2.Document): url is string =>
  typeof url === "string" && fse.existsSync(path.resolve(process.cwd(), url));

const ensureExist = async (path: string, isDir = false): Promise<void> => {
  if (!fse.existsSync(path)) {
    if (isDir) {
      fse.mkdirSync(path, { recursive: true });
    } else {
      await fse.writeFile(path, "");
    }
  }
};

const isOpenApi2 = (config: Config): config is Config<OpenAPIV2.Document> => {
  if (typeof config.source === "string") {
    return false;
  }
  const version = config.source.swagger;
  console.log("openApi version:", chalk.yellow(version));
  return version.startsWith("2.", 0);
};

const formatCode = (lang: "js" | "ts") => (code: string): string =>
  prettier.format(code, {
    plugins: [parserBabel, parserTypescript],
    printWidth: 120,
    tabWidth: 2,
    parser: lang === "js" ? "babel" : "typescript",
    trailingComma: "none",
    jsxBracketSameLine: false
  });

const pascalCase = (str: string): string =>
  camelcase(str, {
    pascalCase: true
  });

export { ensureExist, isUrl, isPath, isOpenApi2, formatCode, pascalCase };
