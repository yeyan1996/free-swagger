"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../client/utils");
const lodash_1 = require("lodash");
const RELATIVE_PATH = "./interface"; // interface 的相对路径
// 只要有一个属性值不是对象就断言当前对象类型为 ParsedSchemaObject
const isParsedSchemaObject = (paramsInterface) => Object.keys(paramsInterface).some(
// @ts-ignore
key => typeof paramsInterface[key] !== "object");
const genParsedSchema = (paramsInterface) => {
    if (!paramsInterface || lodash_1.isEmpty(paramsInterface))
        return "";
    if (isParsedSchemaObject(paramsInterface)) {
        return paramsInterface.type;
    }
    else {
        return `{
    ${Object.entries(paramsInterface)
            .map(([propName, prop]) => `"${propName}"${prop.required ? "" : "?"}: ${prop.type}`)
            .join(",")}
      }`;
    }
};
const genDisabledCode = (config) => config.lang === "ts"
    ? `// @ts-nocheck \n/* eslint-disable */\n`
    : "/* eslint-disable */\n";
const genIParams = ({ pathParamsInterface, queryParamsInterface, bodyParamsInterface, method }) => ({
    IParams: genParsedSchema(method === "get" ? queryParamsInterface : bodyParamsInterface),
    IPathParams: genParsedSchema(pathParamsInterface)
});
const genImportInterfaceCode = (apiCollection) => {
    const importsInterface = lodash_1.uniq(Object.keys(apiCollection)
        .map(key => apiCollection[key])
        .reduce((acc, cur) => [...acc, ...cur.imports], []));
    if (lodash_1.isEmpty(importsInterface))
        return "";
    return `import {${importsInterface.join(",")}} from "${RELATIVE_PATH}";`;
};
const genPath = (api, config) => {
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
exports.genPath = genPath;
// 生成单个 ts 文件中的所有 api
const genPaths = (apiCollection, config) => {
    let code = "";
    code += genDisabledCode(config);
    code += config.lang === "ts" ? genImportInterfaceCode(apiCollection) : "";
    code += config.customImportCode;
    code += Object.values(apiCollection)
        .map(api => genPath(api, config))
        .reduce((acc, cur) => acc + cur);
    return utils_1.formatCode(code, config.lang);
};
exports.genPaths = genPaths;
