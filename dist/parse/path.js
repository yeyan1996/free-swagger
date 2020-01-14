"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = require("./response");
const request_1 = require("./request");
const lodash_1 = require("lodash");
const utils_1 = require("../utils");
const chalk_1 = __importDefault(require("chalk"));
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
const parsePath = (name, url, 
// todo 类型优化
method, { parameters, summary = "", responses, deprecated = false }) => {
    // 获取到接口的参数
    const { bodyParamsInterface, queryParamsInterface, pathParamsInterface, imports: requestImports } = request_1.getRequestType(parameters);
    const { responseInterface } = response_1.getResponseType(responses);
    return {
        imports: lodash_1.uniq([...requestImports, ...responseInterface.imports]),
        summary,
        deprecated,
        url,
        name,
        method,
        bodyParamsInterface,
        queryParamsInterface,
        pathParamsInterface,
        responseInterface
    };
};
exports.parsePath = parsePath;
const parsePaths = (paths) => {
    const requestClasses = {};
    Object.entries(paths).forEach(([path, apiObj]) => {
        methods.forEach(method => {
            var _a;
            const operationObject = apiObj[method];
            if (!operationObject)
                return;
            if (!operationObject.operationId) {
                console.log(chalk_1.default.yellow(`${method.toUpperCase()} ${path} 的 operationId 不存在,无法生成该 api`));
                return;
            }
            if (!((_a = operationObject.tags) === null || _a === void 0 ? void 0 : _a[0])) {
                console.log(chalk_1.default.yellow(`${method.toUpperCase()} ${path} 的 tags 不存在,无法生成该 api`));
                return;
            }
            // 获取类名
            const className = utils_1.pascalCase(operationObject.tags[0]);
            if (!requestClasses[className]) {
                requestClasses[className] = {};
            }
            requestClasses[className][operationObject.operationId] = parsePath(operationObject.operationId, utils_1.formatUrl(path), method, operationObject);
        });
    });
    return requestClasses;
};
exports.parsePaths = parsePaths;
