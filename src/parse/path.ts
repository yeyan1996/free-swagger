import { OpenAPIV2 } from "openapi-types";
import { getResponseType, Response } from "./response";
import { getRequestType, Request } from "./request";
import { uniq } from "lodash";
import { formatUrl, pascalCase } from "../utils";

type Methods = [
  "get",
  "put",
  "post",
  "del",
  "delete",
  "options",
  "head",
  "patch"
];
const methods: Methods = [
  "get",
  "put",
  "post",
  "del",
  "delete",
  "options",
  "head",
  "patch"
];

export interface Paths {
  [key: string]: ApiCollection;
}

export interface ApiCollection {
  [key: string]: Api;
}

export interface Api extends Request, Response {
  deprecated: boolean;
  summary: string;
  url: string;
  method: string;
}

const parsePaths = (paths: OpenAPIV2.PathsObject): Paths => {
  const requestClasses: { [key: string]: ApiCollection } = {};

  Object.entries<OpenAPIV2.PathItemObject>(paths).forEach(([path, apiObj]) => {
    const url = formatUrl(path);
    methods.forEach(method => {
      if (!apiObj[method]) return;
      const {
        parameters,
        tags = [],
        summary = "",
        operationId,
        responses,
        deprecated = false
      } = apiObj[method]!;
      if (!operationId || !tags[0]) return;

      // 获取类名
      const className = pascalCase(tags[0]);
      if (!requestClasses[className]) {
        requestClasses[className] = {};
      }
      // 获取到接口的参数
      const {
        bodyParamsInterface,
        queryParamsInterface,
        pathParamsInterface,
        imports: requestImports
      } = getRequestType(parameters);

      const { responseInterface } = getResponseType(responses);

      requestClasses[className][operationId] = {
        imports: uniq([...requestImports, ...responseInterface.imports]),
        summary,
        deprecated,
        url,
        method,
        bodyParamsInterface,
        queryParamsInterface,
        pathParamsInterface,
        responseInterface
      };
    });
  });
  return requestClasses;
};

export { parsePaths };
