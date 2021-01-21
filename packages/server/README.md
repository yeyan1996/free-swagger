# free-swagger

![](https://img.shields.io/npm/v/free-swagger)

free-swagger 基于 [free-swagger-client](https://www.npmjs.com/package/free-swagger-client)，提供 api，根据 swagger 文档全量生成前端接口代码并写入至项目文件


# 安装

> npm i free-swagger -D

务必使用 -D 参数作为开发依赖，防止被 web 打包工具打包

# 生成 api 文件

## 项目使用

```javascript
// swagger.js
const freeSwagger = require("free-swagger");

freeSwagger("https://petstore.swagger.io/v2/swagger.json");
```

参数为 swagger 源，可以是 url，也可以是本地的 json 文件的相对/绝对路径

![image-20200208153153194](https://tva1.sinaimg.cn/large/0082zybply1gbp11zc8jrj32bo0h842p.jpg)

之后在 nodejs 中运行当前脚本

```
node swagger.js
```

或者绑定为 npm script

```
// package.json
"swagger": "node swagger.js"
```

```
npm run swagger
```

还可以接收一个对象，进行详细配置

```javascript
// swagger.js
const freeSwagger = require("free-swagger");
const json = 

freeSwagger({
  source: require("./swagger.json"),
  customImportCode: "import http from './request'", // 假设请求库在 ./request
  lang: "js"
});
```

## API

| 参数             | 说明                                            | 类型                      | 可选值      | 默认值                                         |
| ---------------- | ----------------------------------------------- | ------------------------- | ----------- | ---------------------------------------------- |
| source           | 必选，swagger 源（url/文件路径/json 文件）      | string/json               | -           | -                                              |
| cookie           | 可选，用于给作为 url 的 swagger 源鉴权的 cookie | string                    | -           | -                                              |
| root             | 可选，生成 api 的根路径                         | string                    | -           | 当前路径 + "/src/api"                             |
| customImportCode | 可选，自定义头部代码                            | string                    | -           | "import axios from 'axios'"                    |
| lang             | 可选，生成 api 语言                             | string                    | "js" / "ts" | "js"                                           |
| templateFunction | 可选，模版函数                                  | (TemplateConfig):  string | -           | 返回一个模版，用于自定义代码片段，参考底部示例 |
| filename         | 可选，生成 api 的文件名                         | (name:string): string     |             | name 为当前 swagger 中标注的 controller 名     |
| useJsDoc         | 可选，是否添加 jsdoc 注释                       | boolean                   |             | false                                          |
|                  |                                                 |                           |             |                                                |

**TemplateConfig**

见 [free-swagger-client](https://www.npmjs.com/package/free-swagger-client)

## 默认模版

free-swagger 基于内置了默认模版用于生成 api 代码片段，具体见 [free-swagger-client](https://www.npmjs.com/package/free-swagger-client)


# 生成 mock 文件

除了生成 api，free-swagger 还可以生成 mock 文件

输入一个 swagger 源，全量生成 mock 数据（json），配合其他 mock 工具实现本地 mock

![](https://tva1.sinaimg.cn/large/00831rSTly1gdhwhmhydqj31fo0u0u0x.jpg)

额外生成了一个 mock.js 文件用于汇总所有 json，这使得 mock 工具只需引入一个 mock.js 即可实现本地 mock

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ge6dlcwtw5j30za0fijtq.jpg)

**注意：free-swagger 只输出 mock 文件，不提供本地 mock 服务**

## 项目使用

```javascript
// swagger-mock.js
const { mock } = require("free-swagger");

mock("https://petstore.swagger.io/v2/swagger.json");
```

和生成 api 相同，传入 swagger 源

之后在 nodejs 中运行当前脚本

```
node swagger-mock.js
```

或者绑定为 npm script

```
// package.json
"mock": "node swagger-mock.js"
```

```
npm run mock
```

mock 功能同样支持详细配置

```javascript
// swagger-mock.js
const { mock } = require("free-swagger");

mock({
  source: require("./swagger.json"),
  wrap:true
});
```

## API

| 参数     | 说明                                                         | 类型        | 可选值 | 默认值          |
| -------- | ------------------------------------------------------------ | ----------- | ------ | --------------- |
| source   | 必选，swagger 源（url/文件路径/json 文件）                   | string/json | -      | -               |
| cookie   | 可选，用于给作为 url 的 swagger 源鉴权的 cookie              | string      | -      | -               |
| mockRoot | 可选，生成 mock 文件的根路径                                 | string      | -      | 当前路径 + "/mock" |
| wrap     | 可选，是否额外包裹一层标准接口返回格式 e.g {code:"200",msg:xxx,data:xxx} | boolean     | -      | false           |
|          |                                                              |             |        |                 |

# 常见问题

## 文档解析错误，请使用 openApi2 规范的文档

  ![image.png](https://p-vcloud.byteimg.com/tos-cn-i-em5hxbkur4/c3be996f638947ac9fda47cc594994fa~tplv-em5hxbkur4-noop.image?width=1430&height=174)

可能是输入的 swagger 源需要权限访问，所以默认无法访问
为此 free-swagger 提供了 cookie 选项，输入可以访问到对应 swagger 源的 cookie 

或者直接将 swagger 源下载到本地，输入本地路径/ json文件

## 使用 npm 形式安装后，打包工具报错

free-swagger 是 node 包，包含 node api，请勿在任何前端页面中使用！

## 某些接口的 mock 文件没有生成

不规范的 swagger 文档可能会导致部分 mock 数据丢失，free-swagger 会对他们作出警告

![image-20200813131308925](https://tva1.sinaimg.cn/large/007S8ZIlgy1ghp3x90jy1j31i60egju8.jpg)
