import { OpenAPIV2 } from "openapi-types";
import { isRef, schemaToTsType, TYPE_MAP } from "../client/utils";
import { ParsedSchemaObject, ParsedSchema } from "../client/utils";

export interface Request {
  pathParamsInterface: ParsedSchema;
  queryParamsInterface: ParsedSchema;
  bodyParamsInterface: ParsedSchema;
  imports: string[];
}

const parseParameter = (
  parameter: OpenAPIV2.Parameter,
  parametersImports: string[]
): ParsedSchemaObject => {
  const imports: string[] = [];
  let type = "";
  let isBinary = false;
  // 引用类型
  if (parameter.schema || parameter.items) {
    const parsedSchemaObject = schemaToTsType(
      parameter.schema || parameter.items
    );
    type = parsedSchemaObject.type;
    isBinary = parsedSchemaObject.isBinary;
    imports.push(...parsedSchemaObject.imports);
    parametersImports.push(...parsedSchemaObject.imports);
  } else {
    type = TYPE_MAP[parameter.type]; // 基本类型
  }
  return {
    type,
    imports,
    isBinary,
    description: parameter.description || "",
    required: parameter.required || false
  };
};

const getRequestType = (paramsSchema?: OpenAPIV2.Parameters): Request => {
  if (!paramsSchema || paramsSchema.some(isRef))
    return {
      imports: [],
      pathParamsInterface: {},
      queryParamsInterface: {},
      bodyParamsInterface: {}
    };

  const pathParamsInterface: { [key: string]: ParsedSchemaObject } = {};
  const queryParamsInterface: { [key: string]: ParsedSchemaObject } = {};
  let bodyParamsInterface: ParsedSchemaObject = <ParsedSchemaObject>{};
  const imports: string[] = [];

  (<OpenAPIV2.Parameter[]>paramsSchema).forEach(parameter => {
    // 引用类型定义
    switch (parameter.in) {
      case "path":
        pathParamsInterface[parameter.name] = parseParameter(
          parameter,
          imports
        );
        break;
      case "query":
        queryParamsInterface[parameter.name] = parseParameter(
          parameter,
          imports
        );
        break;
      case "formData":
        bodyParamsInterface = {
          type: "FormData",
          imports: [],
          isBinary: true,
          description: "",
          required: true
        };
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

export { getRequestType };
