import { OpenAPIV2 } from "openapi-types";
import {
  schemaToTsType,
  formatGenericInterface,
  ParsedSchemaObject
} from "free-swagger-client";

type ParsedInterfaceProp = Omit<ParsedSchemaObject, "isBinary">;
export interface ParsedInterface {
  [prop: string]: ParsedInterfaceProp;
}
export interface InterfaceCollection {
  [interfaceName: string]: ParsedInterface;
}

const parseInterfaces = (
  definitions?: OpenAPIV2.DefinitionsObject
): InterfaceCollection => {
  if (!definitions) return {};
  const interfaces: InterfaceCollection = {};
  Object.keys(definitions).forEach(definitionKey => {
    // JsonResp<<Dog>>  => JsonResp_Dog
    const formatDefinitionKey = formatGenericInterface(definitionKey);
    interfaces[formatDefinitionKey] = <ParsedInterface>{};
    const { properties, required } = definitions[definitionKey];
    if (!properties) return;
    Object.keys(properties).forEach(propertyKey => {
      const schema = definitions[definitionKey].properties![propertyKey];
      const { imports, type } = schemaToTsType(schema);
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

export { parseInterfaces };
