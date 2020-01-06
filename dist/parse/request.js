"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const parseParameter = (parameter, parametersImports) => {
    const imports = [];
    let type = "";
    let isBinary = false;
    // 引用类型
    if (parameter.schema || parameter.items) {
        const parsedSchemaObject = utils_1.schemaToTsType(parameter.schema || parameter.items);
        type = parsedSchemaObject.type;
        isBinary = parsedSchemaObject.isBinary;
        imports.push(...parsedSchemaObject.imports);
        parametersImports.push(...parsedSchemaObject.imports);
    }
    else {
        type = utils_1.TYPE_MAP[parameter.type]; // 基本类型
    }
    return {
        type,
        imports,
        isBinary,
        description: parameter.description || "",
        required: parameter.required || false
    };
};
const getRequestType = (paramsSchema) => {
    if (!paramsSchema || paramsSchema.some(utils_1.isRef))
        return {
            imports: [],
            pathParamsInterface: {},
            queryParamsInterface: {},
            bodyParamsInterface: {}
        };
    const pathParamsInterface = {};
    const queryParamsInterface = {};
    let bodyParamsInterface = {};
    const imports = [];
    paramsSchema.forEach(parameter => {
        // 引用类型定义
        switch (parameter.in) {
            case "path":
                pathParamsInterface[parameter.name] = parseParameter(parameter, imports);
                break;
            case "query":
                queryParamsInterface[parameter.name] = parseParameter(parameter, imports);
                break;
            case "body":
                bodyParamsInterface = parseParameter(parameter, imports);
                break;
        }
    });
    return {
        imports,
        pathParamsInterface,
        bodyParamsInterface,
        queryParamsInterface
    };
};
exports.getRequestType = getRequestType;
