import { Config, ParsedSchemaObject, ParsedSchema } from "../utils";
import { uniq, isEmpty } from "lodash";
import { formatCode } from "../utils";
import { Api, ApiCollection } from "../parse/path";

const RELATIVE_PATH = "./interface"; // interface 的相对路径

// 只要有一个属性值不是对象就断言当前对象类型为 ParsedSchemaObject
const isParsedSchemaObject = (
  paramsInterface: ParsedSchema
): paramsInterface is ParsedSchemaObject =>
  Object.keys(paramsInterface).some(
    // @ts-ignore
    key => typeof paramsInterface[key] !== "object"
  );

const genParsedSchema = (paramsInterface?: ParsedSchema): string => {
  if (!paramsInterface || isEmpty(paramsInterface)) return "";

  if (isParsedSchemaObject(paramsInterface)) {
    return paramsInterface.type;
  } else {
    return `{
    ${Object.entries(paramsInterface)
      .map(
        ([propName, prop]) =>
          `"${propName}"${prop.required ? "" : "?"}: ${prop.type}`
      )
      .join(",")}
      }`;
  }
};

const genDisabledCode = (config: Config): string =>
  config.lang === "ts"
    ? `// @ts-nocheck \n/* eslint-disable */\n`
    : "/* eslint-disable */\n";

const genIParams = ({
  pathParamsInterface,
  queryParamsInterface,
  bodyParamsInterface,
  method
}: Api): { IPathParams: string; IParams: string } => ({
  IParams: genParsedSchema(
    method === "get" ? queryParamsInterface : bodyParamsInterface
  ),
  IPathParams: genParsedSchema(pathParamsInterface)
});

const genImportInterfaceCode = (apiCollection: ApiCollection): string => {
  const importsInterface = uniq(
    Object.keys(apiCollection)
      .map(key => apiCollection[key])
      .reduce<string[]>((acc, cur) => [...acc, ...cur.imports], [])
  );
  if (isEmpty(importsInterface)) return "";
  return `import {${importsInterface.join(",")}} from "${RELATIVE_PATH}";`;
};

const genPath = (api: Api, config: Required<Config>): string => {
  const { IPathParams, IParams } = genIParams(api);
  return config.template({
    name: api.name,
    method: api.method,
    url: api.url,
    responseType: api.responseInterface.isBinary ? "blob" : "json",
    deprecated: api.deprecated,
    summary: api.summary,
    IResponse: api.responseInterface.type,
    IParams,
    IPathParams
  });
};

// 生成单个 ts 文件中的所有 api
const genPaths = (
  apiCollection: ApiCollection,
  config: Required<Config>
): string => {
  let code = "";

  code += genDisabledCode(config);
  code += config.lang === "ts" ? genImportInterfaceCode(apiCollection) : "";
  code += config.customImportCode;
  code += Object.values(apiCollection)
    .map(api => genPath(api, config))
    .reduce((acc, cur) => acc + cur);

  return formatCode(code, config.lang);
};

export { genPaths, genPath };
