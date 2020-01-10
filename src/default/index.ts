import { OpenAPIV2 } from "openapi-types";
import { Config, Template } from "../utils";
import { tsTemplate, jsTemplate } from "./template";
import { rc } from "./rc";
import path from "path";

const DEFAULT: Omit<Config, "source"> = {
  root: path.resolve(process.cwd(), "src/api"),
  customImportCode: `import axios from "axios";`,
  lang: "js",
  template: jsTemplate
};

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
    ...DEFAULT,
    template,
    ...(<Config<OpenAPIV2.Document>>mergedConfig)
  };
};
