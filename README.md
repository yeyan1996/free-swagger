# free-swagger

![](https://img.shields.io/npm/v/free-swagger)

根据 swagger 文档自动生成 api 文件，真正解放双手的工具

free-swagger 基于 [free-swagger-client](https://www.npmjs.com/package/free-swagger-client)，提供全量生成 api 并写入至项目文件和命令行交互能力

`目前仅支持 OpenApi2 规范的 swagger 文档，3.0 版本请先转为 2.0`

# 快速上手

free-swagger 提供了两种方式使用，上手非常简单

## 全局安装

### npx(推荐)

```
npx free-swagger
```

### npm

```
npm i free-swagger -g
```

```
free-swagger
```

之后需要输入 swagger 源，可以是 url，也可以是本地的 json 文件的相对/绝对路径

![image-20200208153153194](https://tva1.sinaimg.cn/large/0082zybply1gbp11zc8jrj32bo0h842p.jpg)

![image-20200110101830721](https://tva1.sinaimg.cn/large/006tNbRwgy1gar910l84dj30w2042jtc.jpg)

## 其他命令

- `--config/-c` 可以进行详细配置

> npx free-swagger --config

![image-20200110105633434](https://tva1.sinaimg.cn/large/006tNbRwly1gara4kfyrmj30wq06yadw.jpg)

在运行一次后 free-swagger 会记住用户的配置项，下次启动就无需携带 --config

- `--reset/-r` 重置为默认配置

> npx free-swagger --reset

- `--show/-s` 显示当前配置

> npx free-swagger --show

- `--edit/-e` 编辑配置

> npx free-swagger --edit

- `--help/-h` 查询命令

> npx free-swagger --help

## 项目安装

> npm i free-swagger -D

随后新建一个 js 脚本，引入 free-swagger 包，传入 swagger url 即可

```javascript
// swagger.js
const freeSwagger = require("free-swagger");

freeSwagger("https://petstore.swagger.io/v2/swagger.json");
```

之后在 nodejs 中运行当前脚本

```
node api.js
```

或者绑定为 npm script

```
// package.json
"swagger": "node api.js"
```

```
npm run swagger
```

如果需要进一步的配置，则需要传入一个对象

```javascript
// swagger.js
const freeSwagger = require("free-swagger");
const json = require("./swagger.json");

freeSwagger({
  source: json,
  customImportCode: "import http from './request'", // 假设请求库在 ./request
  lang: "js"
});
```

# 提醒

1. free-swagger 在生成 api 文件时会让用户选择需要生成哪些 api，以防止可能覆盖用户自定义的 api 文件（默认全选）

![image-20200103174105519](https://tva1.sinaimg.cn/large/006tNbRwgy1gajihbv47tj30uq0c2k2u.jpg)

当生成一次后，free-swagger 同样会记住用户的选择

2. **free-swagger 是 node 包，包含 node api，请勿在任何前端页面中使用！**

# API

| 参数             | 说明                                 | 类型                     | 可选值      | 默认值                                         |
| ---------------- | ------------------------------------ | ------------------------ | ----------- | ---------------------------------------------- |
| source           | swagger 源（url/文件路径/json 文件） | string/json              | -           | -                                              |
| root             | 生成 api 的根路径                    | string                   | -           | 当前路径 + src/api                             |
| customImportCode | 自定义头部代码                       | string                   | -           | "import axios from 'axios'"                    |
| lang             | 生成 api 语言                        | string                   | "js" / "ts" | "js"                                           |
| templateFunction | 模版函数                             | Function(TemplateConfig) | -           | 返回一个模版，用于自定义代码片段，参考底部示例 |
| chooseAll        | 是否跳过选择 api 的步骤              | boolean                  | -           | false                                          |

TemplateConfig

| 参数         | 说明                                   | 类型     | 可选值   | 默认值 |
| ------------ | -------------------------------------- | -------- | -------- | ------ |
| url          | 路径                                   | string   | -        | -      |
| summary      | 注释，对应 swagger 文档 summary        | string   | -        | -      |
| method       | 方法                                   | string   | -        | -      |
| name         | 名称，对应 swagger 文档 operationId    | string   | -        | -      |
| deprecated   | 是否废弃，对应 swagger 文档 deprecated | boolean  | -        | -      |
| responseType | 返回值类型                             | string   | 同 axios | -      |
| pathParams   | 路径参数                               | string[] | -        | -      |
| IResponse    | 返回值接口类型                         | string   | -        | -      |
| IParams      | 请求值接口类型                         | string   | -        | -      |
| IPathParams  | 路径参数接口类型                       | string   | -        | -      |

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
 const parsedUrl = url.replace(/{(.*?)}/g, '${$1}'); 

  return `
  ${deprecated ? `/**deprecated*/` : ""}
  ${summary ? `// ${summary}` : ""}
  export const ${name} = (params,${
    pathParams.length ? `{${pathParams.join(",")}}` : ""
  }) => axios.request({
     url: \`${parsedUrl}\`, 
     method: "${method}",
     params:${`${method === "get" ? "params," : "{},"}`}
     data:${`${method === "get" ? "{}," : "params,"}`}
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
  const parsedUrl = url.replace(/{(.*?)}/g, '${$1}'); 

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
    pathParams.length ? `{${pathParams.join(",")}} = ${IPathParams}` : ""
  }) => axios.request<${IResponse || "any"},AxiosResponse<${IResponse ||
    "any"}>>({
     url: \`${parsedUrl}\`, 
     method: "${method}",  
     params:${`${method === "get" ? "params," : "{},"}`}
     data:${`${method === "get" ? "{}," : "params,"}`}
     ${responseType === "json" ? "" : `responseType: ${responseType}`}
 })`;
};
```
