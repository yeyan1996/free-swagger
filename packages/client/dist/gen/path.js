"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genPath = void 0;
const lodash_1 = require("lodash");
const isParsedSchemaObject = (paramsInterface) => Object.keys(paramsInterface).some((key) => typeof paramsInterface[key] !== 'object');
const genParsedSchema = (paramsInterface) => {
    if (!paramsInterface || lodash_1.isEmpty(paramsInterface))
        return '';
    if (isParsedSchemaObject(paramsInterface)) {
        return paramsInterface.type;
    }
    else {
        return `{
    ${Object.entries(paramsInterface)
            .map(([propName, prop]) => `"${propName}"${prop.required ? '' : '?'}: ${prop.type}`)
            .join(',')}
      }`;
    }
};
const genIParams = ({ pathParamsInterface, queryParamsInterface, bodyParamsInterface, method, }) => ({
    IParams: genParsedSchema(method === 'get' ? queryParamsInterface : bodyParamsInterface),
    IPathParams: genParsedSchema(pathParamsInterface),
});
const genPath = (api, templateFunction) => {
    const { IPathParams, IParams } = genIParams(api);
    return templateFunction({
        name: api.name,
        method: api.method,
        url: api.url,
        responseType: api.responseInterface.isBinary ? 'blob' : 'json',
        deprecated: api.deprecated,
        summary: api.summary,
        IResponse: api.responseInterface.type,
        pathParams: Object.keys(api.pathParamsInterface),
        IParams,
        IPathParams,
    });
};
exports.genPath = genPath;
