import { OpenAPIV2 } from "openapi-types";
import { pascalCase, parsePath, Api } from "free-swagger-client";
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
        path,
        method,
        operationObject
      );
    });
  });
  return requestClasses;
};

export { parsePaths, parsePath };
