# free-swagger-extension

根据 swagger 文档自动生成前端接口代码片段

free-swagger-extension 基于 [free-swagger-core](https://www.npmjs.com/package/free-swagger-core) 开发的 chrome 浏览器插件，增强浏览器端对于 swagger 文档的处理行为

![image-20200710125155851](https://tva1.sinaimg.cn/large/007S8ZIlgy1ggls8qwputj312o0qcgpb.jpg)

下方的操作栏即 free-swagger-extension 提供的扩展能力

# 功能介绍

##  api 搜索


![](../userscript/docs/api搜索.gif)

## 复制 api 代码片段

![](../userscript/docs/复制代码片段.gif)

## 复制/递归复制 interface/typedef

![](../userscript/docs/复制interface.gif)

## 复制 api  路径

![](../userscript/docs/复制api路径.gif)

## 复制 mock 数据

![](../userscript/docs/生成mock数据.gif)

## 复制全量 typedef

![](../userscript/docs/生成jsDoc.gif)

## 复制全量 interface

![](../userscript/docs/生成interface.gif)


# 安装

安装地址：https://chrome.google.com/webstore/detail/free-swagger/nlkadjfidjolpabkgoampncncbffbllk?hl=zh-CN

![image-20210909155022801](https://tva1.sinaimg.cn/large/008i3skNly1guafdp37xuj61ni0iuwfz02.jpg)

安装后，在需要应用插件的 swagger 文档里，点击右上角 free-swagger 的图标

![image-20210909155257618](https://tva1.sinaimg.cn/large/008i3skNly1guafgcfz96j60f004g3yp02.jpg)

这时你会在网页下放发现多了一个操作栏,并且 free-swagger 图标被激活，祝贺您获得了 swagger-ui 的拓展能力

![image-20200710141538427](https://tva1.sinaimg.cn/large/007S8ZIlgy1gglunsmdorj313a0qi777.jpg)

再次点击图标即可关闭插件功能

# 编辑模版

free-swagger-extension 基于 free-swagger-core，通过模版生成代码片段

默认使用 axios 作为模版，生成的代码片段如下

![image-20200710151113242](https://tva1.sinaimg.cn/large/007S8ZIlgy1gglw9mu3i8j30c603r3ys.jpg)

通过编辑模版，可以自定义生成的代码片段，通过改变入参位置、切换请求库名来适配任意请求库的结构

例如将 axios.request 改成 request，示例如下

![image-20210320170732104](https://tva1.sinaimg.cn/large/008eGmZEly1goqhen1j98j32jk0cgdin.jpg)

![image-20210320170350749](https://tva1.sinaimg.cn/large/008eGmZEly1goqhasp1hsj31a30u0q9u.jpg)

模版函数接受多个参数，可以自由组合成想要的代码片段，详细使用方式参考 [free-swagger-core](https://www.npmjs.com/package/free-swagger-core)
