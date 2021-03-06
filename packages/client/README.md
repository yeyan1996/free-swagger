# free-swagger-client

![Travis (.com)](https://img.shields.io/travis/com/yeyan1996/free-swagger-client)![](https://img.shields.io/npm/v/free-swagger-client)

输入 swagger 文档，返回接口代码片段

free-swagger，free-swagger-cli，free-swagger-extend 都是基于 free-swagger-client 封装的上层插件

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

| 参数             | 说明                        | 类型                     | 可选值      | 默认值                               |
| ---------------- | --------------------------- | ------------------------ | ----------- | ------------------------------------ |
| source           | 必选，swagger 源            | json                     | -           | -                                    |
| lang             | 可选，生成 api 语言         | string                   | "js" / "ts" | "js"                                 |
| templateFunction | 可选，模版函数              | Function(TemplateConfig) | -           | 返回一个模版，用于生成自定义代码片段 |
| jsDoc         | 可选，代码块附加 jsdoc 注释   | boolean                  |  -           | false                                |
| typedef | 可选，代码块附加 js doc typedef | boolean |  | false |
| interface     | 可选，代码块附加 interface | boolean                 |  -          | false                                |
| recursive | 递归解析 jsDoc/interface 的依赖 | boolean | - | false |

- TemplateConfig

| 参数         | 说明                                 | 类型     | 可选值   | 默认值 |
| ------------ | ------------------------------------ | -------- | -------- | ------ |
| url          | 路径                                 | string   | -        | -      |
| summary      | 注释，对应 swagger 源 summary 字段      | string   | -        | -      |
| method       | 接口请求方法                                 | string   | -        | -      |
| name         | 名称，对应 swagger 源 operationId 字段   | string   | -        | -      |
| responseType | 返回值类型                           | string   | 同 axios responseType | -      |
| pathParams   | 路径参数                             | string[] | -        |
| IResponse    | 返回值接口类型                       | string   | -        | -      |
| IQueryParams      | 请求值接口类型（请求参数）                      | string   | -        | -      |
| IBodyParams      | 请求值接口类型（请求体）                      | string   | -        | -      |
| IPathParams  | 路径参数接口类型                     | string   | -        | -      |

# 默认模版

free-swagger-client 基于模版函数来生成最终的 api 代码，用户可以自定义模版函数，来满足不同需求，例如修改请求库名，修改参数位置，修改接口命名等等

以下为 free-swagger-client 提供的默认模版

https://github.com/yeyan1996/free-swagger/blob/master/packages/client/src/default/template.ts

## jsTemplate

```javascript
({
     url,            // 完整路径 {string}
     summary,        // 注释 {string}
     method,         // 请求方法 {string}
     name,           // api 函数名 {string}
     responseType,   // 响应值种类，同 axios {string}
     pathParams,     // 路径参数 {Array<string>}
     IQueryParams,   // 请求查询参数 ts 类型
     IBodyParams,    // 请求体参数 ts 类型
     IPathParams     // 请求路径参数 ts 类型
 }) => {
    /**
      * js 代码模版
    **/ 
      
    // debugger
    // 可通过 debugger 调试模版

    // 处理路径参数 `/pet/{id}` => `/pet/${id}`
    const parsedUrl = url.replace(/{(.*?)}/g, '${$1}');

    // 有 query 和 body 参数
    const multipleParamsCondition = ({ IQueryParams, IBodyParams }) =>
        IQueryParams && IBodyParams

    const firstParamCodeMap = new Map()
        // 只有 query 参数，可能有 path 参数
        .set(
            ({ IQueryParams, IBodyParams }) => IQueryParams && !IBodyParams,
            ({ IQueryParams }) => `params,`
        )
        // 只有 body 参数，可能有 path 参数
        .set(
            ({ IQueryParams, IBodyParams }) => IBodyParams && !IQueryParams,
            ({ IBodyParams }) => `params,`
        )
        // 有 query 和 body 参数，可能有 path 参数
        .set(
            multipleParamsCondition,
            ({ IQueryParams }) => `queryParams,`
        )
        // 没有 query body 参数，有 path 参数
        .set(
            ({ IQueryParams,pathParams,IBodyParams }) => !IBodyParams && !IQueryParams && pathParams.length,
            ({ pathParams, IPathParams }) => '_NOOP,'
        )
        // 只有 path 参数
        .set(
            ({ pathParams }) => pathParams.length,
            ({ pathParams, IPathParams }) =>
                `{${pathParams.join(',')}},`
        )

    const secondParamCodeMap = new Map()
        // 有 path 参数
        .set(
            ({ pathParams }) => pathParams.length,
            ({ pathParams, IPathParams }) =>
                `{${pathParams.join(',')}},`
        )
        // 有 query 和 body 参数，有 path 参数
        .set(multipleParamsCondition, `_NOOP,`)

    const thirdParamCodeMap = new Map()
        // 有 query 和 body 参数，有 path 参数
        .set(
            multipleParamsCondition,
            ({ IBodyParams }) => `bodyParams,`
        )

    const paramCodeMap = new Map()
        .set(multipleParamsCondition, 'queryParams,')
        .set(({ IQueryParams }) => !!IQueryParams, 'params,')

    const dataCodeMap = new Map()
        .set(multipleParamsCondition, 'bodyParams,')
        .set(({ IBodyParams }) => !!IBodyParams, 'params,')

    const createParamCode = (conditionMap, defaultCode = '') => {
        let code = defaultCode
        for (const [condition, codeFunction] of conditionMap.entries()) {
            const res = condition({
                IQueryParams,
                IBodyParams,
                pathParams,
            })
            if (res) {
                code =
                    typeof codeFunction === 'string'
                        ? codeFunction
                        : codeFunction({
                            IQueryParams,
                            IBodyParams,
                            IPathParams,
                            pathParams,
                        })
                break
            }
        }
        return code
    }

    return `
  ${summary ? `// ${summary}` : ""}
  export const ${name} = (
${createParamCode(firstParamCodeMap) /* query | body | NOOP */}
${createParamCode(secondParamCodeMap) /* path | null */}
${createParamCode(thirdParamCodeMap) /* body | null */}
)  => axios.request({
     url: \`${parsedUrl}\`,
     method: "${method}",
     params:${createParamCode(paramCodeMap, '{},')}
     data:${createParamCode(dataCodeMap, '{},')}
     ${responseType === "json" ? "" : `responseType: ${responseType},`}
 })`;
}
```

## tsTemplate

```javascript
({
     url,            // 完整路径 {string}
     summary,        // 注释 {string}
     method,         // 请求方法 {string}
     name,           // api 函数名 {string}
     responseType,   // 响应值种类，同 axios {string}
     pathParams,     // 路径参数 {Array<string>}
     IQueryParams,   // 请求查询参数 ts 类型
     IBodyParams,    // 请求体参数 ts 类型
     IPathParams,     // 请求路径参数 ts 类型
     IResponse,      // 响应参数 ts 类型
 }) => {
    /**
      * ts 代码模版
    **/ 
      
    // debugger
    // 可通过 debugger 调试模版

    // 处理路径参数 `/pet/{id}` => `/pet/${id}`
    const parsedUrl = url.replace(/{(.*?)}/g, '${$1}');

    // 有 query 和 body 参数
    const multipleParamsCondition = ({ IQueryParams, IBodyParams }) =>
        IQueryParams && IBodyParams

    const firstParamCodeMap = new Map()
        // 只有 query 参数，可能有 path 参数
        .set(
            ({ IQueryParams, IBodyParams }) => IQueryParams && !IBodyParams,
            ({ IQueryParams }) => `params: ${IQueryParams},`
        )
        // 只有 body 参数，可能有 path 参数
        .set(
            ({ IQueryParams, IBodyParams }) => IBodyParams && !IQueryParams,
            ({ IBodyParams }) => `params: ${IBodyParams},`
        )
        // 有 query 和 body 参数，可能有 path 参数
        .set(
            multipleParamsCondition,
            ({ IQueryParams }) => `queryParams: ${IQueryParams},`
        )
        // 没有 query body 参数，有 path 参数
        .set(
            ({ IQueryParams,pathParams,IBodyParams }) => !IBodyParams && !IQueryParams && pathParams.length,
            ({ pathParams, IPathParams }) => '_NOOP: {[key:string]: never},'
        )
        // 只有 path 参数
        .set(
            ({ pathParams }) => pathParams.length,
            ({ pathParams, IPathParams }) =>
                `{${pathParams.join(',')}}: ${IPathParams},`
        )

    const secondParamCodeMap = new Map()
        // 有 path 参数
        .set(
            ({ pathParams }) => pathParams.length,
            ({ pathParams, IPathParams }) =>
                `{${pathParams.join(',')}}: ${IPathParams},`
        )
        // 有 query 和 body 参数，有 path 参数
        .set(multipleParamsCondition, `_NOOP:{[key:string]: never},`)

    const thirdParamCodeMap = new Map()
        // 有 query 和 body 参数，有 path 参数
        .set(
            multipleParamsCondition,
            ({ IBodyParams }) => `bodyParams: ${IBodyParams},`
        )

    const paramCodeMap = new Map()
        .set(multipleParamsCondition, 'queryParams,')
        .set(({ IQueryParams }) => !!IQueryParams, 'params,')

    const dataCodeMap = new Map()
        .set(multipleParamsCondition, 'bodyParams,')
        .set(({ IBodyParams }) => !!IBodyParams, 'params,')

    const createParamCode = (conditionMap, defaultCode = '') => {
        let code = defaultCode
        for (const [condition, codeFunction] of conditionMap.entries()) {
            const res = condition({
                IQueryParams,
                IBodyParams,
                pathParams,
            })
            if (res) {
                code =
                    typeof codeFunction === 'string'
                        ? codeFunction
                        : codeFunction({
                            IQueryParams,
                            IBodyParams,
                            IPathParams,
                            pathParams,
                        })
                break
            }
        }
        return code
    }

    return `
  ${summary ? `// ${summary}` : ""}  
  export const ${name} = (
${createParamCode(firstParamCodeMap) /* query | body | NOOP */}
${createParamCode(secondParamCodeMap) /* path | null */}
${createParamCode(thirdParamCodeMap) /* body | null */}
) => axios.request<${IResponse || "any"}>({
     url: \`${parsedUrl}\`,
     method: "${method}",
     params:${createParamCode(paramCodeMap, '{},')}
     data:${createParamCode(dataCodeMap, '{},')}
     ${responseType === "json" ? "" : `responseType: ${responseType},`}
 })`;
}
```
