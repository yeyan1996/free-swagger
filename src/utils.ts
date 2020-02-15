import { OpenAPIV2 } from "openapi-types";
import {  ConfigClient } from "free-swagger-client";
import fse from "fs-extra";
import camelcase from "camelcase";
import path from "path";
import chalk from "chalk";

export interface Config<T = string | OpenAPIV2.Document>
  extends Omit<ConfigClient, "source"> {
  source: T;
  root?: string;
  customImportCode?: string;
  chooseAll?: boolean;
}

const isUrl = (url: string | OpenAPIV2.Document): url is string =>
  typeof url === "string" && url.startsWith("http");
const isPath = (url: string | OpenAPIV2.Document): url is string =>
  typeof url === "string" && fse.existsSync(path.resolve(process.cwd(), url));

const ensureExist = (path: string, isDir = false): void => {
  if (!fse.existsSync(path)) {
    if (isDir) {
      fse.mkdirSync(path, { recursive: true });
    } else {
      fse.writeFileSync(path, "");
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

const pascalCase = (str: string): string =>
  camelcase(str, {
    pascalCase: true
  });

export { ensureExist, isUrl, isPath, isOpenApi2, pascalCase };
