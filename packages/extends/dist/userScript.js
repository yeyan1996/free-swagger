// ==UserScript==
// @author  yeyan1996
// @name  free-swagger-extends
// @namespace  http://tampermonkey.net/
// @description  swagger 油猴脚本扩展工具
// @version  2.7.1

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

createScripTag("https://cdn.jsdelivr.net/npm/free-swagger-extends/dist/js/app.72e1522d.js")
//  createScripTag("http://localhost:8888/js/app.js") // 本地调试用
