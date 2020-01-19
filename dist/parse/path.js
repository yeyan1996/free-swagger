"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const free_swagger_client_1 = require("free-swagger-client");
exports.parsePath = free_swagger_client_1.parsePath;
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
            const className = free_swagger_client_1.pascalCase(operationObject.tags[0]);
            if (!requestClasses[className]) {
                requestClasses[className] = {};
            }
            requestClasses[className][operationObject.operationId] = free_swagger_client_1.parsePath(operationObject.operationId, path, method, operationObject);
        });
    });
    return requestClasses;
};
exports.parsePaths = parsePaths;
