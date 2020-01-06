"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("./response");
const request_1 = require("./request");
const lodash_1 = require("lodash");
const utils_1 = require("../utils");
const methods = [
    "get",
    "put",
    "post",
    "del",
    "delete",
    "options",
    "head",
    "patch"
];
const parsePaths = (paths) => {
    const requestClasses = {};
    Object.entries(paths).forEach(([path, apiObj]) => {
        const url = utils_1.formatUrl(path);
        methods.forEach(method => {
            if (!apiObj[method])
                return;
            const { parameters, tags = [], summary = "", operationId, responses, deprecated = false } = apiObj[method];
            if (!operationId || !tags[0])
                return;
            // 获取类名
            const className = utils_1.pascalCase(tags[0]);
            if (!requestClasses[className]) {
                requestClasses[className] = {};
            }
            // 获取到接口的参数
            const { bodyParamsInterface, queryParamsInterface, pathParamsInterface, imports: requestImports } = request_1.getRequestType(parameters);
            const { responseInterface } = response_1.getResponseType(responses);
            requestClasses[className][operationId] = {
                imports: lodash_1.uniq([...requestImports, ...responseInterface.imports]),
                summary,
                deprecated,
                url,
                method,
                bodyParamsInterface,
                queryParamsInterface,
                pathParamsInterface,
                responseInterface
            };
        });
    });
    return requestClasses;
};
exports.parsePaths = parsePaths;
