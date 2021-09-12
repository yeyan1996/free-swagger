// ==UserScript==
// @author  yeyan1996
// @name  free-swagger-userscript
// @namespace  http://tampermonkey.net/
// @description  free-swagger for tampermonkey
// @version  5.1.0

// @include  /swagger
// @include  /doc.html

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

createScripTag("https://cdn.jsdelivr.net/npm/free-swagger-userscript/dist/js/app.ae2d4fd5.js")
//  createScripTag("http://localhost:8888/js/app.js") // 本地调试用
