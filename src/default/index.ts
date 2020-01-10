import { OpenAPIV2 } from "openapi-types";
import { Config, Template } from "../utils";
import { tsTemplate, jsTemplate } from "./template";
import { rc } from "./rc";
import path from "path";

export const DEFAULT_CUSTOM_IMPORT_CODE_TS = `import axios,{ AxiosResponse } from "axios";`;
export const DEFAULT_CUSTOM_IMPORT_CODE_JS = `import axios from "axios";`;

const getDefaultConfig = (config: Config): Omit<Config, "source"> => ({
  root: path.resolve(process.cwd(), "src/api"),
  customImportCode:
    config.lang === "js"
      ? DEFAULT_CUSTOM_IMPORT_CODE_JS
      : DEFAULT_CUSTOM_IMPORT_CODE_TS,
  lang: "js",
  template: jsTemplate
});

export const mergeDefaultConfig = async (
  config: Config | string
): Promise<Config> => {
  let mergedConfig: Config = <Config>{};

  if (typeof config === "string") {
    mergedConfig.source = config;
    rc.recordHash(mergedConfig.source);
  } else {
    mergedConfig = config;
  }

  let template: Template;
  if (mergedConfig.template) {
    template = mergedConfig.template;
  } else if (!mergedConfig.lang) {
    template = jsTemplate;
  } else {
    template = mergedConfig.lang === "ts" ? tsTemplate : jsTemplate;
  }

  return {
    ...getDefaultConfig(mergedConfig),
    template,
    ...(<Config<OpenAPIV2.Document>>mergedConfig)
  };
};
