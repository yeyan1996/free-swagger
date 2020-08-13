# free-swagger

![](https://img.shields.io/npm/v/free-swagger)

free-swagger 基于 [free-swagger-client](https://www.npmjs.com/package/free-swagger-client)，根据 swagger 文档全量生成前端接口代码并写入至项目文件

# 快速上手

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

# 详细配置

输出 ts 文件或者编辑模版等进一步功能，需要详细配置

```shell
npx free-swagger --config
```

![image-20200110105633434](https://tva1.sinaimg.cn/large/006tNbRwly1gara4kfyrmj30wq06yadw.jpg)

在运行一次后 free-swagger 会记住用户的配置项，下次启动就无需携带 --config

# 生成 api 文件

使用 free-swagger 可以自动生成 api 文件

## 项目使用

本地安装 free-swagger，**务必使用 -D 参数防止被 web 打包工具打包**

> npm i free-swagger -D

新建一个 js 脚本，引入 free-swagger 包，传入 swagger url 即可

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
const json = 

freeSwagger({
  source: require("./swagger.json"),
  customImportCode: "import http from './request'", // 假设请求库在 ./request
  lang: "js"
});
```

## API

| 参数             | 说明                                            | 类型                     | 可选值      | 默认值                                         |
| ---------------- | ----------------------------------------------- | ------------------------ | ----------- | ---------------------------------------------- |
| source           | 必选，swagger 源（url/文件路径/json 文件）      | string/json              | -           | -                                              |
| cookie           | 可选，用于给作为 url 的 swagger 源鉴权的 cookie | string                   | -           | -                                              |
| root             | 可选，生成 api 的根路径                         | string                   | -           | 当前路径 + src/api                             |
| customImportCode | 可选，自定义头部代码                            | string                   | -           | "import axios from 'axios'"                    |
| lang             | 可选，生成 api 语言                             | string                   | "js" / "ts" | "js"                                           |
| templateFunction | 可选，模版函数                                  | Function(TemplateConfig) | -           | 返回一个模版，用于自定义代码片段，参考底部示例 |
| chooseAll        | 可选，是否跳过选择 api 的步骤                   | boolean                  | -           | false                                          |
| useJsDoc         | 可选，是否添加 jsdoc 注释                       | boolean                  |             | false                                          |

**TemplateConfig**

见 [free-swagger-client](https://www.npmjs.com/package/free-swagger-client)

## 默认模版

free-swagger 基于内置了默认模版生成 api 代码片段，具体见 [free-swagger-client](https://www.npmjs.com/package/free-swagger-client)

# 生成 mock 文件

除了生成 api，free-swagger 还可以生成 mock 文件

```shell
npx free-swagger --mock
```

和详细配置 free-swagger 步骤相似，输入一个 swagger 源，全量生成 mock 数据（json），配合其他 mock 工具实现本地 mock

![image-20200404175701656](https://tva1.sinaimg.cn/large/00831rSTly1gdhvyepnt8j32hi0u0u0x.jpg)

![](https://tva1.sinaimg.cn/large/00831rSTly1gdhwhmhydqj31fo0u0u0x.jpg)

额外生成了一个 mock.js 文件用于汇总所有 json，这使得 mock 工具只需引入一个 mock.js 即可实现本地 mock

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ge6dlcwtw5j30za0fijtq.jpg)

**注意：free-swagger 只输出 mock 文件，不提供本地 mock 服务**

## 项目使用

本地安装 free-swagger，**务必使用 -D 参数防止被 web 打包工具打包**

> npm i free-swagger -D

新建一个 js 脚本，引入 free-swagger 包，传入 swagger url 即可

```javascript
// swagger-mock.js
const { mock } = require("free-swagger");

mock("https://petstore.swagger.io/v2/swagger.json");
```

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
| mockRoot | 可选，生成 mock 文件的根路径                                 | string      | -      | 当前路径 + mock |
| wrap     | 可选，是否额外包裹一层标准接口返回格式 e.g {code:"200",msg:xxx,data:xxx} | boolean     | -      | false           |
|          |                                                              |             |        |                 |

# 所有命令

- `--config/-c` 以配置项启动 free-swagger

> npx free-swagger --config

- `--mock/-m` 全量生成 mock 文件

> npx free-swagger --mock

- `--reset/-r` 重置为默认配置

> npx free-swagger --reset

- `--show/-s` 显示当前配置

> npx free-swagger --show

- `--edit/-e` 编辑当前配置

> npx free-swagger --edit

- `--help/-h` output usage information

> npx free-swagger --help

# 常见问题

## 文档解析错误，请使用 openApi2 规范的文档

  ![image.png](https://p-vcloud.byteimg.com/tos-cn-i-em5hxbkur4/c3be996f638947ac9fda47cc594994fa~tplv-em5hxbkur4-noop.image?width=1430&height=174)

可能是输入的 swagger 源需要权限访问，所以默认无法访问
为此 free-swagger 提供了 cookie 选项，填入可以访问到对应 swagger 源的 cookie 

![image-20200813131204090](https://tva1.sinaimg.cn/large/007S8ZIlgy1ghp3w6jwgcj31h708ndob.jpg)

或者直接将 swagger 源（json 文件）下载到本地，输入本地路径

## 使用 npm 形式安装后，打包工具报错

free-swagger 是 node 包，包含 node api，请勿在任何前端页面中使用！

## 某些接口的 mock 文件没有生成

不规范的 swagger 文档可能会导致部分 mock 数据丢失，free-swagger 会对他们作出警告

![image-20200813131308925](https://tva1.sinaimg.cn/large/007S8ZIlgy1ghp3x90jy1j31i60egju8.jpg)