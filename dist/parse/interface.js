"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../client/utils");
const parseInterfaces = (definitions) => {
    if (!definitions)
        return {};
    const interfaces = {};
    Object.keys(definitions).forEach(definitionKey => {
        // JsonResp<<Dog>>  => JsonResp_Dog
        const formatDefinitionKey = utils_1.formatGenericInterface(definitionKey);
        interfaces[formatDefinitionKey] = {};
        const { properties, required } = definitions[definitionKey];
        if (!properties)
            return;
        Object.keys(properties).forEach(propertyKey => {
            const schema = definitions[definitionKey].properties[propertyKey];
            const { imports, type } = utils_1.schemaToTsType(schema);
            interfaces[formatDefinitionKey][propertyKey] = {
                type,
                imports,
                required: required ? required.includes(propertyKey) : false,
                description: schema.description || ""
            };
        });
    });
    return interfaces;
};
exports.parseInterfaces = parseInterfaces;
