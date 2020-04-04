# free-swagger

![](https://img.shields.io/npm/v/free-swagger)

根据 swagger 文档自动生成 api 文件，真正解放双手的工具

free-swagger 基于 [free-swagger-client](https://www.npmjs.com/package/free-swagger-client)，提供全量生成 api 并写入至项目文件和命令行交互能力

`目前仅支持 OpenApi2 规范的 swagger 文档，3.0 版本请先转为 2.0`

# 快速上手

free-swagger 提供了两种方式使用，上手非常简单

## 全局安装

### npx(推荐)

```shell
npx free-swagger
```

### npm

```shell
npm i free-swagger -g
```

```shell
free-swagger
```

之后需要输入 swagger 源，可以是 url，也可以是本地的 json 文件的相对/绝对路径

![image-20200208153153194](https://tva1.sinaimg.cn/large/0082zybply1gbp11zc8jrj32bo0h842p.jpg)

![image-20200110101830721](https://tva1.sinaimg.cn/large/006tNbRwgy1gar910l84dj30w2042jtc.jpg)

## 详细配置

输出 ts 文件或者编辑模版等进一步功能，需要详细配置

```shell
npx free-swagger --config
```

![image-20200110105633434](https://tva1.sinaimg.cn/large/006tNbRwly1gara4kfyrmj30wq06yadw.jpg)

在运行一次后 free-swagger 会记住用户的配置项，下次启动就无需携带 --config

## 生成 mock 文件

和详细配置 free-swagger 相似，输入 swagger 源，将全量的 mock 数据（json）输出到指定文件夹中，配合其他 mock 工具实现本地 mock

![image-20200404175701656](https://tva1.sinaimg.cn/large/00831rSTly1gdhvyepnt8j32hi0u0u0x.jpg)

![image-20200404180035431](/Users/bytedance/Library/Application Support/typora-user-images/image-20200404180135026.png)

其中还包含了一个 mock.js 文件用于汇总所有 json，这使得 mock 工具只需引入一个 mock.js 即可实现本地 mock（**free-swagger 只输出 mock 文件，不提供本地 mock**）

![image-20200404180216916](https://tva1.sinaimg.cn/large/00831rSTly1gdhw3qqj8cj30pm0ac404.jpg)

## 所有命令

- `--config/-c` 以配置项启动 free-swagger

> npx free-swagger --config

- `--mock/-m` 全量生成 mock 数据

> npx free-swagger --mock

- `--reset/-r` 重置为默认配置

> npx free-swagger --reset

- `--show/-s` 显示当前配置

> npx free-swagger --show

- `--edit/-e` 编辑当前配置

> npx free-swagger --edit

- `--help/-h` output usage information

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

- free-swagger 在生成 api 文件时会让用户选择需要生成哪些 api，以防止可能覆盖用户自定义的 api 文件（默认全选）

![image-20200103174105519](https://tva1.sinaimg.cn/large/006tNbRwgy1gajihbv47tj30uq0c2k2u.jpg)

当生成一次后，free-swagger 同样会记住用户的选择

- **free-swagger 是 node 包，包含 node api，请勿在任何前端页面中使用！**

# API

| 参数             | 说明                                            | 类型                     | 可选值      | 默认值                                         |
| ---------------- | ----------------------------------------------- | ------------------------ | ----------- | ---------------------------------------------- |
| source           | 必选，swagger 源（url/文件路径/json 文件）      | string/json              | -           | -                                              |
| cookie           | 可选，用于给作为 url 的 swagger 源鉴权的 cookie | string                   | -           | -                                              |
| root             | 可选，生成 api 的根路径                         | string                   | -           | 当前路径 + src/api                             |
| customImportCode | 可选，自定义头部代码                            | string                   | -           | "import axios from 'axios'"                    |
| lang             | 可选，生成 api 语言                             | string                   | "js" / "ts" | "js"                                           |
| templateFunction | 可选，模版函数                                  | Function(TemplateConfig) | -           | 返回一个模版，用于自定义代码片段，参考底部示例 |
| chooseAll        | 可选，是否跳过选择 api 的步骤                   | boolean                  | -           | false                                          |

- TemplateConfig

见 [free-swagger-client](https://www.npmjs.com/package/free-swagger-client)

# 默认模版

见 [free-swagger-client](https://www.npmjs.com/package/free-swagger-client)
