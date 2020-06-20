"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePath = void 0;
const response_1 = require("./response");
const request_1 = require("./request");
const lodash_1 = require("lodash");
const parsePath = (name, url, method, { parameters, summary = '', responses, deprecated = false, }) => {
    const { bodyParamsInterface, queryParamsInterface, pathParamsInterface, imports: requestImports, } = request_1.getRequestType(parameters);
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
        responseInterface,
    };
};
exports.parsePath = parsePath;
