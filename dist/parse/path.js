"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const free_swagger_client_1 = require("free-swagger-client");
exports.parsePath = free_swagger_client_1.parsePath;
const utils_1 = require("../utils");
const chalk_1 = __importDefault(require("chalk"));
exports.methods = [
    "get",
    "put",
    "post",
    "del",
    "delete",
    "options",
    "head",
    "patch"
];
const parsePaths = (swagger) => {
    const requestClasses = {};
    Object.entries(swagger.paths).forEach(([path, pathItemObject]) => {
        exports.methods.forEach((method) => {
            var _a;
            const operationObject = pathItemObject[method];
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
            // 含有中文则使用 description 作为文件名
            let controllerName = "";
            if (utils_1.hasChinese(operationObject.tags[0])) {
                const tag = swagger.tags.find((tag) => tag.name === operationObject.tags[0]);
                if (!tag)
                    return;
                controllerName = tag.description
                    ? utils_1.pascalCase(tag.description)
                    : tag.name;
            }
            else {
                controllerName = utils_1.pascalCase(operationObject.tags[0]);
            }
            if (!requestClasses[controllerName]) {
                requestClasses[controllerName] = {};
            }
            requestClasses[controllerName][operationObject.operationId] = free_swagger_client_1.parsePath(operationObject.operationId, path, method, operationObject);
        });
    });
    return requestClasses;
};
exports.parsePaths = parsePaths;
