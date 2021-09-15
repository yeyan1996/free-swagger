# free-swagger-cli

![](https://img.shields.io/npm/v/free-swagger)

free-swagger-cli 基于 [free-swagger](https://www.npmjs.com/package/free-swagger)，提供命令行交互功能，全量生成 api 并写入至项目文件

# 快速上手

## npx(推荐)

```shell
npx free-swagger-cli
```

## npm

```shell
npm i free-swagger-cli -g
```

```shell
free-swagger-cli
```

之后需要输入 swagger 源，可以是 url，也可以是本地的 json 文件的相对/绝对路径

![image-20200208153153194](https://tva1.sinaimg.cn/large/0082zybply1gbp11zc8jrj32bo0h842p.jpg)

![image-20210123144916640](https://tva1.sinaimg.cn/large/008eGmZEly1gmxmpjyhkoj30x005c76c.jpg)

# 详细配置

输出 ts 文件或者编辑模版等高级功能，需要详细配置

```shell
npx free-swagger-cli --config
```

![image-20200110105633434](https://tva1.sinaimg.cn/large/006tNbRwly1gara4kfyrmj30wq06yadw.jpg)

在运行一次后 free-swagger-cli 会记住用户上一次的配置项

# 默认模版

free-swagger 基于内置了默认模版函数，用于生成 api 代码片段，详细参数见 [free-swagger-core](https://www.npmjs.com/package/free-swagger-core)

# 生成 mock 文件

除了生成 api，free-swagger-cli 还可以生成 mock 文件

```shell
npx free-swagger-cli --mock
```

和详细配置 free-swagger-cli 步骤相似，输入一个 swagger 源，全量生成 mock 数据（json），配合其他 mock 工具实现本地 mock

![image-20200404175701656](https://tva1.sinaimg.cn/large/00831rSTly1gdhvyepnt8j32hi0u0u0x.jpg)

![](https://tva1.sinaimg.cn/large/00831rSTly1gdhwhmhydqj31fo0u0u0x.jpg)

额外生成了一个 mock.js 文件用于汇总所有 json，这使得 mock 工具只需引入一个 mock.js 即可实现本地 mock

![](https://tva1.sinaimg.cn/large/007S8ZIlly1ge6dlcwtw5j30za0fijtq.jpg)

**注意：free-swagger-cli 只输出 mock 文件，不提供本地 mock 服务**

# 所有命令

- `--config/-c` 以配置项启动 free-swagger-cli

> npx free-swagger-cli --config

- `--mock/-m` 全量生成 mock 文件

> npx free-swagger-cli --mock

- `--reset/-r` 重置为默认配置

> npx free-swagger-cli --reset

- `--show/-s` 显示当前配置

> npx free-swagger-cli --show

- `--edit/-e` 编辑当前配置

> npx free-swagger-cli --edit

- `--help/-h` output usage information

> npx free-swagger-cli --help

# 常见问题

## 文档解析错误，请使用 openApi2 规范的文档

  ![image.png](https://p-vcloud.byteimg.com/tos-cn-i-em5hxbkur4/c3be996f638947ac9fda47cc594994fa~tplv-em5hxbkur4-noop.image?width=1430&height=174)

可能是输入的 swagger 源需要权限访问，所以默认无法访问
为此 free-swagger 提供了 cookie 选项，填入可以访问到对应 swagger 源的 cookie 

![image-20200813131204090](https://tva1.sinaimg.cn/large/007S8ZIlgy1ghp3w6jwgcj31h708ndob.jpg)

或者直接将 swagger 源（json 文件）下载到本地，输入本地路径

## 某些接口的 mock 文件没有生成

不规范的 swagger 文档可能会导致部分 mock 数据丢失，free-swagger 会对他们作出警告

![image-20200813131308925](https://tva1.sinaimg.cn/large/007S8ZIlgy1ghp3x90jy1j31i60egju8.jpg)
