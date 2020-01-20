import { OpenAPIV2 } from "openapi-types";
import { Template, tsTemplate, jsTemplate } from "free-swagger-client";
import { Config } from "../utils";
import { rc } from "./rc";
import path from "path";

export const DEFAULT_CUSTOM_IMPORT_CODE_TS = `import axios,{ AxiosResponse } from "axios";`;
export const DEFAULT_CUSTOM_IMPORT_CODE_JS = `import axios from "axios";`;

const getDefaultConfig = (
  config: Config
): Required<Omit<Config, "source">> => ({
  root: path.resolve(process.cwd(), "src/api"),
  customImportCode:
    config.lang === "ts"
      ? DEFAULT_CUSTOM_IMPORT_CODE_TS
      : DEFAULT_CUSTOM_IMPORT_CODE_JS,
  lang: "js",
  template: jsTemplate,
  chooseAll: false
});

export const mergeDefaultConfig = async (
  config: Config | string
): Promise<Required<Config>> => {
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
