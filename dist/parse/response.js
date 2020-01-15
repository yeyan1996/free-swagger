"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const free_swagger_client_1 = require("free-swagger-client");
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
        responseInterface: free_swagger_client_1.schemaToTsType(schema)
    };
};
exports.getResponseType = getResponseType;
