// ==UserScript==
// @author  yeyan1996
// @name  swagger-extends
// @namespace  http://tampermonkey.net/
// @description  swagger 油猴脚本扩展工具
// @version  1.0.0

// @include  /swagger/

// ==/UserScript==


// 创建 DOM 节点
function createDom(type, props, style) {
    const dom = document.createElement(type)
    Object.assign(dom, props)
    Object.assign(dom.style, style)
    return dom
}


// 创建 script 标签
function createScripTag(src) {
    document.body.append(createDom("script", {src}));
}

createScripTag("/js/app.df70b185.js")
//  createScripTag("http://localhost:8888/js/app.js") // 本地调试用
