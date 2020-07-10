# free-swagger-client

![Travis (.com)](https://img.shields.io/travis/com/yeyan1996/free-swagger-client)![](https://img.shields.io/npm/v/free-swagger-client)

根据 swagger 文档自动生成 api 代码片段

`目前仅支持 OpenApi2 规范的 swagger 文档，3.0 版本请先转为 2.0`

# 快速上手

```javascript
import freeSwaggerClient from "free-swagger-client";

const code = freeSwaggerClient(config, url, method);
console.log(code);

`
// 增加属性
export const addUsingPOST = params =>
  axios.request({
    url: "/attribute/add",
    method: "post",
    responseType: "json",
    params: {},
    data: params
  });
`;
```

# API

| 参数   | 说明   | 类型   | 可选值 | 默认值 |
| ------ | ------ | ------ | ------ | ------ |
| config | 配置项 | Config | -      | -      |
| url    | -      | string | -      | -      |
| method | -      | string | -      | -      |

- Config

| 参数             | 说明                | 类型                     | 可选值      | 默认值                               |
| ---------------- | ------------------- | ------------------------ | ----------- | ------------------------------------ |
| source           | 必选，swagger 源    | json                     | -           | -                                    |
| lang             | 可选，生成 api 语言 | string                   | "js" / "ts" | "js"                                 |
| templateFunction | 可选，模版函数      | Function(TemplateConfig) | -           | 返回一个模版，用于生成自定义代码片段 |

- TemplateConfig

| 参数         | 说明                                 | 类型     | 可选值   | 默认值 |
| ------------ | ------------------------------------ | -------- | -------- | ------ |
| url          | 路径                                 | string   | -        | -      |
| summary      | 注释，对应 swagger 源 summary        | string   | -        | -      |
| method       | 方法                                 | string   | -        | -      |
| name         | 名称，对应 swagger 源 operationId    | string   | -        | -      |
| deprecated   | 是否废弃，对应 swagger 源 deprecated | boolean  | -        | -      |
| responseType | 返回值类型                           | string   | 同 axios | -      |
| pathParams   | 路径参数                             | string[] | -        |
| IResponse    | 返回值接口类型                       | string   | -        | -      |
| IParams      | 请求值接口类型                       | string   | -        | -      |
| IPathParams  | 路径参数接口类型                     | string   | -        | -      |

# 默认模版

当导出语言为 js 时，默认 templateFunction 如下

```javascript
({
  url,
  summary,
  method,
  name,
  responseType,
  deprecated,
  pathParams,
  IParams,
  IPathParams
}) => {
  // 处理路径参数
  // `/pet/{id}` => `/pet/${id}`
  const parsedUrl = url.replace(/{(.*?)}/g, "${$1}");

  return `
  ${deprecated ? `/**deprecated*/` : ""}
  ${summary ? `// ${summary}` : ""}
  export const ${name} = (params,${
    pathParams.length ? `{${pathParams.join(",")}}` : ""
  }) => axios.request({
     url: \`${parsedUrl}\`, 
     method: "${method}",
     params:${`\${method === "get" ? IParams ? "params," : "{}," : "{},"}`}
     data:${`\${method === "get" ? "{}," : IParams ? "params," : "{},"}`}
     ${responseType === "json" ? "" : `responseType: ${responseType}`}
 })`;
};
```

当导出语言为 ts 时，默认 templateFunction 如下

```javascript
({
  url,
  summary,
  method,
  name,
  responseType,
  deprecated,
  pathParams,
  IResponse,
  IParams,
  IPathParams
}) => {
  // 处理路径参数
  // `/pet/{id}` => `/pet/${id}`
  const parsedUrl = url.replace(/{(.*?)}/g, "${$1}");

  return `
  ${deprecated ? `/**deprecated*/` : ""}
  ${summary ? `// ${summary}` : ""}  
  export const ${name} = (${
    IParams
      ? `params: ${IParams},`
      : IPathParams
      ? "params:{[key:string]: never},"
      : ""
  }${
    pathParams.length ? `{${pathParams.join(",")}} : ${IPathParams}` : ""
  }) => axios.request<${IResponse || "any"},AxiosResponse<${IResponse ||
    "any"}>>({
     url: \`${parsedUrl}\`, 
     method: "${method}",  
     params:${`\${method === "get" ? IParams ? "params," : "{}," : "{},"}`}
     data:${`\${method === "get" ? "{}," : IParams ? "params," : "{},"}`}
     ${responseType === "json" ? "" : `responseType: ${responseType}`}
 })`;
};
```
