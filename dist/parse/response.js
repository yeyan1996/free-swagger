"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const SUCCESS_CODE = 200;
const getResponseType = (responses) => {
    if (!responses[SUCCESS_CODE]) {
        return {
            responseInterface: {
                type: "",
                imports: [],
                required: false,
                description: "",
                isBinary: false
            }
        };
    }
    const { schema } = responses[SUCCESS_CODE];
    return {
        responseInterface: utils_1.schemaToTsType(schema)
    };
};
exports.getResponseType = getResponseType;
