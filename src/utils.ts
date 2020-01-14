import { OpenAPIV2 } from "openapi-types";
import fse from "fs-extra";
import path from "path";
import chalk from "chalk";

export interface Config<T = string | OpenAPIV2.Document> {
  source: T;
  root?: string;
  template?: Template;
  customImportCode?: string;
  lang?: "js" | "ts";
  chooseAll?: boolean;
}

export interface Template {
  (config: TemplateConfig): string;
}

export interface TemplateConfig {
  url: string;
  summary: string;
  method: string;
  name: string;
  responseType: string;
  deprecated: boolean;
  IResponse: string;
  IParams: string;
  IPathParams: string;
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

export { ensureExist, isUrl, isPath, isOpenApi2 };
