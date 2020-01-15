import { OpenAPIV2 } from "openapi-types";
import { getResponseType, Response } from "./response";
import { getRequestType, Request } from "./request";
import { uniq } from "lodash";
import { formatUrl, pascalCase } from "free-swagger-client";
import chalk from "chalk";

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
  [controllerName: string]: ApiCollection;
}

export interface ApiCollection {
  [pathName: string]: Api;
}

export interface Api extends Request, Response {
  deprecated: boolean;
  summary: string;
  url: string;
  method: string;
  name: string;
}

const parsePath = (
  name: string,
  url: string,
  // todo 类型优化
  method: string,
  {
    parameters,
    summary = "",
    responses,
    deprecated = false
  }: OpenAPIV2.OperationObject
): Api => {
  // 获取到接口的参数
  const {
    bodyParamsInterface,
    queryParamsInterface,
    pathParamsInterface,
    imports: requestImports
  } = getRequestType(parameters);

  const { responseInterface } = getResponseType(responses);

  return {
    imports: uniq([...requestImports, ...responseInterface.imports]),
    summary,
    deprecated,
    url,
    name,
    method,
    bodyParamsInterface,
    queryParamsInterface,
    pathParamsInterface,
    responseInterface
  };
};

const parsePaths = (paths: OpenAPIV2.PathsObject): Paths => {
  const requestClasses: { [key: string]: ApiCollection } = {};

  Object.entries<OpenAPIV2.PathItemObject>(paths).forEach(([path, apiObj]) => {
    methods.forEach(method => {
      const operationObject = apiObj[method];
      if (!operationObject) return;

      if (!operationObject.operationId) {
        console.log(
          chalk.yellow(
            `${method.toUpperCase()} ${path} 的 operationId 不存在,无法生成该 api`
          )
        );
        return;
      }

      if (!operationObject.tags?.[0]) {
        console.log(
          chalk.yellow(
            `${method.toUpperCase()} ${path} 的 tags 不存在,无法生成该 api`
          )
        );
        return;
      }

      // 获取类名
      const className = pascalCase(operationObject.tags[0]);
      if (!requestClasses[className]) {
        requestClasses[className] = {};
      }
      requestClasses[className][operationObject.operationId] = parsePath(
        operationObject.operationId,
        formatUrl(path),
        method,
        operationObject
      );
    });
  });
  return requestClasses;
};

export { parsePaths, parsePath };
