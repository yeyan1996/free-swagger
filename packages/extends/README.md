# free-swagger-extends

根据 swagger 文档自动生成前端接口代码片段

free-swagger-extends 基于 [free-swagger-client](https://www.npmjs.com/package/free-swagger-client) 开发的油猴脚本，增强浏览器端对于 swagger 文档的处理行为

![image-20200710125155851](https://tva1.sinaimg.cn/large/007S8ZIlgy1ggls8qwputj312o0qcgpb.jpg)

下方的操作栏即 free-swagger-extends 提供的扩展能力

# 功能介绍

##  api 搜索

![](./docs/api搜索.gif)

## 复制 api  路径	

![](./docs/复制api路径.gif)

## 生成 api 代码片段

![](./docs/复制代码片段.gif)

## 生成 typescript interface 

![](./docs/生成interface.gif)

## 生成 mock 数据

![](./docs/生成mock数据.gif)

## 展开所有 api 

![](./docs/展开所有api.gif)

# 安装使用

free-swagger-extends 是基于 UserScript 用户脚本拓展插件 (跨平台的浏览器插件)开发的脚本工具. 因此使用前, 我们需要安装浏览器插件 Tampermonkey

## 安装猴油插件

在 chorme 的拓展工具中心搜索关键字 [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)

![image.png](https://p-vcloud.byteimg.com/tos-cn-i-em5hxbkur4/1248c584810d48f3905b09d4f03e7938~tplv-em5hxbkur4-noop.image?width=1200&height=837)

安装完成后, 浏览器状态栏应该会出现一个图标

![img](https://p-vcloud.byteimg.com/tos-cn-i-em5hxbkur4/53e63d9427964256a201939a4dac5fc6~tplv-em5hxbkur4-noop.image?width=552&height=166)

## 安装 free-swagger-extends

安装方式统一为引入 url 安装

脚本地址：https://cdn.jsdelivr.net/npm/free-swagger-extends/dist/userScript.js

具体操作方式如下

![image-20200710132840013](https://tva1.sinaimg.cn/large/007S8ZIlgy1ggltayiltnj30ba0ae0ts.jpg)

![image.png](https://p-vcloud.byteimg.com/tos-cn-i-em5hxbkur4/8e68e32cb4054b33a7094c07b334173d~tplv-em5hxbkur4-noop.image?width=1200&height=363)

![image.png](https://p-vcloud.byteimg.com/tos-cn-i-em5hxbkur4/a3826721ed344fd4881a4808a4d0b89a~tplv-em5hxbkur4-noop.image?width=1200&height=441)

![image-20200710133402091](https://tva1.sinaimg.cn/large/007S8ZIlgy1ggltgig1u1j30zh0lcq6d.jpg)

## 使用

进入包含 `swagger`字段的网页， 你就会发现 Tampermonkey 图标亮了, 有一个小图标表示它在当前网页上注入了一个脚本

![image-20200710141155411](https://tva1.sinaimg.cn/large/007S8ZIlgy1gglujxghr0j31cg00yaa8.jpg)

这时你会在网页下放发现多了一个操作栏, 祝贺您获得了 swagger-ui 的拓展能力.

![image-20200710141538427](https://tva1.sinaimg.cn/large/007S8ZIlgy1gglunsmdorj313a0qi777.jpg)

## 匹配更多网址

油猴脚本通过脚本中 `@include` 字段判断当前网页是否需要注入脚本的

添加 `@include` 字段，可以使得脚本匹配更多网址

![image-20200710141651665](https://tva1.sinaimg.cn/large/007S8ZIlgy1gglup2ejo9j308s0b7jsc.jpg)

![image-20200710141735750](https://tva1.sinaimg.cn/large/007S8ZIlgy1ggluptxa11j30r20hkn0a.jpg)

![image-20200710141815365](https://tva1.sinaimg.cn/large/007S8ZIlgy1ggluqiqt14j30py0ip0vu.jpg)

至此，当访问网址包含 `swagger` / `other-url` 时，就会注入 free-swagger-exntends 脚本

# 编辑模版

free-swagger-extends 基于 free-swagger-client，通过模版生成代码片段

模版使用 axios 作为请求库，生成的代码片段如下

![image-20200710151113242](https://tva1.sinaimg.cn/large/007S8ZIlgy1gglw9mu3i8j30c603r3ys.jpg)

通过编辑模版，可以自定义生成的代码片段，例如将 axios.request 改成 request

![image-20200710151217540](https://tva1.sinaimg.cn/large/007S8ZIlgy1gglwavq4q4j3124056t9h.jpg)

![image-20200710151319940](https://tva1.sinaimg.cn/large/007S8ZIlgy1gglwbxbwtoj30s10jc411.jpg)

![image-20200710151641774](https://tva1.sinaimg.cn/large/007S8ZIlgy1gglwfby4fbj30rm0ix76p.jpg)

模版接受多个参数，可以自由组合成想要的格式，更多技巧参考 [free-swagger-client](https://www.npmjs.com/package/free-swagger-client)
