(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7c74e686"],{"047c":function(e,t,n){var a=n("3546");"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var r=n("499e").default;r("5d9a6cfa",a,!0,{sourceMap:!1,shadowMode:!1})},"10b5":function(e,t,n){var a=n("24fb");t=a(!1),t.push([e.i,".more-setting[data-v-4828ba9c]{display:inline-block}.el-icon-question[data-v-4828ba9c]:hover{cursor:pointer;color:#409eff}#textarea[data-v-4828ba9c]{height:400px}.js-doc-text[data-v-4828ba9c]{margin-right:10px}[data-v-4828ba9c] .el-switch__label *{line-height:normal}",""]),e.exports=t},3546:function(e,t,n){var a=n("24fb");t=a(!1),t.push([e.i,".shallow-yellow[data-v-7552c5e4]{background:rgba(255,247,238,.69)}.option-container[data-v-7552c5e4]{display:flex}.option-container .summary[data-v-7552c5e4]{color:hsla(0,0%,50.2%,.65);margin-left:10px}.option-container .label[data-v-7552c5e4]{display:flex;justify-content:center;align-items:center;width:70px;padding-left:20px}.option-container .light-green[data-v-7552c5e4]{color:#1ce3c3}.option-container .red[data-v-7552c5e4]{color:#ff3f45}.option-container .purple[data-v-7552c5e4]{color:#941af9}.option-container .pink[data-v-7552c5e4]{color:pink}.option-container .yellow[data-v-7552c5e4]{color:#ffa142}.option-container .green[data-v-7552c5e4]{color:#67c23a}.option-container .blue[data-v-7552c5e4]{color:#409eff}.option-container .added[data-v-7552c5e4]{position:absolute;left:20px}.option-container .path[data-v-7552c5e4]{margin-left:10px;width:400px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.search[data-v-7552c5e4]{width:400px;margin-right:12px}",""]),e.exports=t},"3dfd":function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.collapse?n("div",{staticClass:"collapse",on:{click:function(t){e.collapse=!e.collapse}}},[n("i",{staticClass:"el-icon-setting"})]):n("div",{attrs:{id:"extends-app"}},[n("api-options",{ref:"apiOptions"}),n("div",{staticClass:"operation-container"},[n("el-link",{attrs:{underline:!1},on:{click:function(t){return e.handleCopyPath()}}},[e._v("复制url")]),n("el-link",{attrs:{underline:!1},on:{click:function(t){return e.handleCopyApi()}}},[e._v("复制snippet")]),n("el-link",{attrs:{underline:!1},on:{click:function(t){return e.handleCopyFake()}}},[e._v("复制模拟数据")]),n("div",{staticClass:"switch-container"},[n("span",{staticClass:"text"},[e._v("语言：")]),n("el-switch",{attrs:{"active-value":"ts","inactive-value":"js","active-color":"#409eff","inactive-color":"#ecac0f","active-text":"TS","inactive-text":"JS"},model:{value:e.state.storage.currentLanguage,callback:function(t){e.$set(e.state.storage,"currentLanguage",t)},expression:"state.storage.currentLanguage"}})],1)],1),n("div",{staticClass:"collapse"},[n("div",{staticClass:"right"},[n("more-setting",{staticClass:"more-setting"})],1),n("i",{staticClass:"el-icon-caret-left",on:{click:function(t){e.collapse=!e.collapse}}})])],1)},r=[],o=(n("4de4"),n("7db0"),n("4160"),n("ac1f"),n("5319"),n("159b"),n("3835")),i=n("2909"),s=(n("96cf"),n("1da1")),c=n("ed08"),l=n("3b29"),p=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"more-setting"},[n("el-dropdown",{attrs:{placement:"top"}},[n("el-button",{attrs:{type:"primary",size:"mini"}},[e._v(" 更多配置"),n("i",{staticClass:"el-icon-arrow-down el-icon--right"})]),n("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[n("el-dropdown-item",{nativeOn:{click:function(t){e.dialog=!0}}},[e._v("编辑模版")]),n("el-dropdown-item",[n("div",{on:{click:function(e){e.stopPropagation()}}},[n("span",{staticClass:"js-doc-text"},[e._v("JS Doc")]),n("el-switch",{attrs:{"active-text":"开","inactive-text":"关"},model:{value:e.state.storage.useJsDoc,callback:function(t){e.$set(e.state.storage,"useJsDoc",t)},expression:"state.storage.useJsDoc"}})],1)]),n("el-dropdown-item",{nativeOn:{click:function(t){return e.handleCopyJsDoc()}}},[e._v("复制 JS Doc（JS）")]),n("el-dropdown-item",{nativeOn:{click:function(t){return e.handleCopyInterface()}}},[e._v("复制 Interface（TS）")]),e.state.isNewUi?e._e():n("el-dropdown-item",{nativeOn:{click:function(t){return e.openAllController(t)}}},[e._v("展开全部 api")]),e.state.isNewUi?e._e():n("el-dropdown-item",{nativeOn:{click:function(t){return e.closeAllController(t)}}},[e._v("收起全部 api")])],1)],1),n("el-dialog",{attrs:{visible:e.dialog,center:"","modal-append-to-body":!1,width:"1000px",title:"编辑 snippet 模版"},on:{"update:visible":function(t){e.dialog=t}}},[n("el-form",{attrs:{model:e.form,"label-width":"80px"}},[n("el-form-item",{attrs:{label:"模版语言"}},[n("el-select",{on:{change:e.handleLangChange},model:{value:e.state.storage.exportLanguage,callback:function(t){e.$set(e.state.storage,"exportLanguage",t)},expression:"state.storage.exportLanguage"}},[n("el-option",{attrs:{label:"javascript",value:"js"}}),n("el-option",{attrs:{label:"typescript",value:"ts"}})],1)],1),n("el-form-item",[n("span",{attrs:{slot:"label"},slot:"label"},[n("el-tooltip",{attrs:{effect:"light",placement:"left-start"}},[n("el-link",{attrs:{slot:"content"},on:{click:e.handleLink},slot:"content"},[e._v("https://www.npmjs.com/package/free-swagger-client")]),n("i",{staticClass:"el-icon-question"})],1),e._v(" 模版")],1),n("div",{attrs:{id:"textarea"}}),n("el-button",{attrs:{size:"small",disabled:"js"!==e.state.storage.exportLanguage},on:{click:e.handleResetJs}},[e._v("重置为默认js模版")]),n("el-button",{attrs:{size:"small",disabled:"ts"!==e.state.storage.exportLanguage},on:{click:e.handleResetTs}},[e._v("重置为默认ts模版")])],1),n("el-form-item",[n("el-button",{attrs:{type:"primary"},on:{click:e.handleSubmit}},[e._v("保存")]),n("el-button",{on:{click:function(t){e.dialog=!1}}},[e._v("取消")])],1)],1)],1)],1)},u=[],d=(n("0fb7"),n("450d"),n("f529")),f=n.n(d),h=n("f33e"),m=(n("7257"),n("95a9")),v={name:"MoreSetting",data:function(){return{state:l["state"],dialog:!1,instance:null,form:{jsTemplate:"",tsTemplate:""}}},watch:{dialog:{handler:function(e){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function n(){var a;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(!e){n.next=9;break}return n.next=3,t.$nextTick();case 3:t.instance=h["a"].create(document.querySelector("#textarea"),{value:"js"===l["state"].storage.exportLanguage?l["state"].storage.jsTemplate:l["state"].storage.tsTemplate,theme:"vs-dark",language:"javascript",automaticLayout:!0}),t.instance.onDidChangeModelContent((function(){t.handleInput(t.instance.getValue())})),t.form.jsTemplate=l["state"].storage.jsTemplate,t.form.tsTemplate=l["state"].storage.tsTemplate,n.next=10;break;case 9:null===(a=t.instance)||void 0===a||a.dispose();case 10:case"end":return n.stop()}}),n)})))()},immediate:!0}},methods:{handleCopyJsDoc:l["handleCopyJsDoc"],handleCopyInterface:l["handleCopyInterface"],handleInput:function(e){"js"===l["state"].storage.exportLanguage?this.form.jsTemplate=e:this.form.tsTemplate=e},handleLangChange:function(e){var t;"js"===e?this.form.jsTemplate=l["state"].storage.jsTemplate:this.form.tsTemplate=l["state"].storage.tsTemplate,null===(t=this.instance)||void 0===t||t.setValue("js"===e?this.form.jsTemplate:this.form.tsTemplate)},openAllController:function(){if(l["state"].isNewUi)return f.a.error("新 swagger ui 无法使用该功能");var e=document.querySelectorAll(".opblock-tag-section:not(.is-open)");e.forEach((function(e){return e.firstChild.click()}))},closeAllController:function(){if(l["state"].isNewUi)return f.a.error("新 swagger ui 无法使用该功能");var e=document.querySelectorAll(".opblock-tag-section.is-open");e.forEach((function(e){return e.firstChild.click()}))},handleResetJs:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:e.form.jsTemplate=m["jsTemplate"],null===(n=e.instance)||void 0===n||n.setValue(m["jsTemplate"]);case 2:case"end":return t.stop()}}),t)})))()},handleResetTs:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:e.form.tsTemplate=m["tsTemplate"],null===(n=e.instance)||void 0===n||n.setValue(m["tsTemplate"]);case 2:case"end":return t.stop()}}),t)})))()},handleLink:function(){window.open("https://www.npmjs.com/package/free-swagger-client","_blank")},handleSubmit:function(){l["state"].storage.jsTemplate=this.form.jsTemplate,l["state"].storage.tsTemplate=this.form.tsTemplate,f.a.success("保存成功"),this.dialog=!1}}},g=v,b=(n("dbe7"),n("2877")),x=Object(b["a"])(g,p,u,!1,null,"4828ba9c",null),w=x.exports,k=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("el-select",{staticClass:"search",attrs:{size:"mini",placeholder:"请选择 api",filterable:""},on:{change:e.handleSearch},model:{value:e.state.key,callback:function(t){e.$set(e.state,"key",t)},expression:"state.key"}},e._l(e.state.options,(function(t,a){return n("el-option",{key:a,attrs:{value:t.key},on:{change:function(t){return e.handleCopyApi()}}},[n("div",{staticClass:"option-container"},[n("div",{class:["label",{"light-green":"patch"===t.method,pink:"options"===t.method,purple:"head"===t.method,green:"get"===t.method,blue:"post"===t.method,yellow:"put"===t.method,red:"delete"===t.method}]},[e._v(" "+e._s(t.method)+" ")]),n("div",{staticClass:"path"},[e._v(e._s(t.path))]),n("div",{staticClass:"summary"},[e._v(e._s(t.collection.summary))])])])})),1)},y=[],C=n("4f0c"),j={name:"ApiOptions",data:function(){return{state:l["state"]}},watch:{"state.options":function(e){e.length&&(l["state"].key=e[0].key,this.handleSearch(l["state"].key))}},methods:{handleCopyApi:l["handleCopyApi"],findControllerDom:function(e){var t=e.isNewUi,n=e.controller,a=t?'[title="'.concat(n,'"]'):"#operations-tag-".concat(n);return document.querySelector(a)},findApiDom:function(e){var t=e.controllerDom,n=e.isNewUi,a=e.operationId,r=n?'[data-hashurl$="'.concat(a,'"]'):'[id$="'.concat(a,'"]');return n?t.querySelector(r):t.parentNode.querySelector(r)},openControllerDom:function(e,t){var n=t?e.classList.contains("open"):e.parentNode.classList.contains("is-open");n||(t?e.querySelector("* > a").click():e.click())},clickApiDom:function(e,t){t?e.click():e.classList.contains("is-open")||e.firstChild.click()},expandApiCollapse:function(e){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function n(){var a,r,o,i;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(a=e.controller,r=e.operationId,o=t.findControllerDom({isNewUi:l["state"].isNewUi,controller:a}),o){n.next=4;break}return n.abrupt("return",!1);case 4:return t.openControllerDom(o,l["state"].isNewUi),n.next=7,t.$nextTick();case 7:if(i=t.findApiDom({isNewUi:l["state"].isNewUi,controllerDom:o,operationId:r}),i){n.next=10;break}return n.abrupt("return",!1);case 10:return t.clickApiDom(i),n.abrupt("return",{apiDom:i,controllerDom:o});case 12:case"end":return n.stop()}}),n)})))()},handleSearch:function(e){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function n(){var a;return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return l["state"].currentApi=l["state"].options.find((function(t){return t.key===e})),Object(l["handleCopyApi"])(l["state"].currentApi.path,l["state"].currentApi.method,l["state"].swagger),n.next=4,Object(c["a"])({cb:function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(){var n,r,o,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return n=l["state"].currentApi.collection,r=n.controller,o=n.operationId,e.next=3,t.expandApiCollapse({controller:r,operationId:o});case 3:return i=e.sent,e.next=6,t.$nextTick();case 6:l["state"].isNewUi=!window.ui,i&&(a=i.apiDom,a.scrollIntoView({behavior:"smooth"}),Object(C["c"])(a,"custom-highlight-anime"));case 8:case"end":return e.stop()}}),e)})));function n(){return e.apply(this,arguments)}return n}(),endCondition:function(){return a},retryNumber:10,success:function(){l["state"].domLoaded=!0},error:function(){return console.error("Error: 请输入 dom 节点")}});case 4:case"end":return n.stop()}}),n)})))()}}},T=j,_=(n("902e"),Object(b["a"])(T,k,y,!1,null,"7552c5e4",null)),A=_.exports,S=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"api-icons"},[n("el-tooltip",{attrs:{content:"复制url"}},[n("svg-icon",{staticClass:"url",attrs:{name:"url"},on:{click:function(t){return e.handleCopyPath(e.path,e.method)}}})],1),n("el-tooltip",{attrs:{content:"复制snippet"}},[n("svg-icon",{staticClass:"snippet",attrs:{name:"snippet"},on:{click:function(t){return e.handleCopyApi(e.path,e.method)}}})],1),n("el-tooltip",{attrs:{content:"复制模拟数据"}},[n("span",{staticClass:"mock",on:{click:function(t){return e.handleCopyFake(e.path,e.method)}}},[e._v("mock")])])],1)},O=[],L={name:"ApiIcons",props:{path:{type:String,required:!0},method:{type:String,required:!0},summary:{type:String,required:!0}},methods:{handleCopyPath:l["handleCopyPath"],handleCopyApi:l["handleCopyApi"],handleCopyFake:l["handleCopyFake"]}},N=L,R=(n("9a80"),Object(b["a"])(N,S,O,!1,null,"2bde9f82",null)),q=R.exports,D=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("el-tooltip",{attrs:{content:"复制interface"}},[n("svg-icon",{attrs:{name:"ts"},on:{click:function(t){return e.handleCopyInterface(e.state.swagger,e.interfaceName)}}})],1)},I=[],$={name:"InterfaceIcon",props:{interfaceName:{type:String,required:!0}},data:function(){return{state:l["state"]}},methods:{handleCopyInterface:l["handleCopyInterface"]}},E=$,F=(n("5460"),Object(b["a"])(E,D,I,!1,null,"3a139dd0",null)),M=F.exports,U=n("2b0e"),J=U["default"].extend(M),z=U["default"].extend(q),P=function(e){var t=new J({propsData:{interfaceName:e}}).$mount();return t.$el},V=function(e,t,n){var a=new z({propsData:{path:e,method:t,summary:n}}).$mount();return a.$el},H={name:"app",components:{MoreSetting:w,ApiOptions:A},data:function(){return{state:l["state"],collapse:!1}},watch:{"state.domLoaded":function(e){var t=this;return Object(s["a"])(regeneratorRuntime.mark((function n(){return regeneratorRuntime.wrap((function(n){while(1)switch(n.prev=n.next){case 0:if(e){n.next=2;break}return n.abrupt("return");case 2:if(!l["state"].isNewUi){n.next=7;break}return n.next=5,t.injectForController(void 0,!0);case 5:n.next=11;break;case 7:return n.next=9,t.bindClickEventForController();case 9:return n.next=11,t.bindClickEventForModel();case 11:case"end":return n.stop()}}),n)})))()}},methods:{handleCopyApi:l["handleCopyApi"],handleCopyPath:l["handleCopyPath"],handleCopyFake:l["handleCopyFake"],bindClickEventForController:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){var n,a,r,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,Object(c["b"])();case 2:return n=Object(i["a"])(document.querySelectorAll(".opblock-tag")),n.forEach((function(t){return t.addEventListener("click",(function(t){e.injectForController(t.currentTarget)}))})),a=n.filter((function(e){return e.parentNode.classList.contains("is-open")})),r=Object(o["a"])(a,1),s=r[0],t.next=7,e.injectForController(s);case 7:case"end":return t.stop()}}),t)})))()},injectForController:function(e){var t=arguments,n=this;return Object(s["a"])(regeneratorRuntime.mark((function a(){var r,o;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(r=t.length>1&&void 0!==t[1]&&t[1],e||r){a.next=3;break}return a.abrupt("return");case 3:return a.next=5,Object(c["b"])(0);case 5:o=r?Object(i["a"])(document.querySelectorAll("li.menuLi")):Object(i["a"])(e.nextSibling.querySelectorAll(".opblock")),o.forEach((function(e){l["state"].isNewUi||n.injectApiIconsForApiNode(e),n.bindClickApiHandlerForApiNode(e,l["state"].isNewUi)}));case 7:case"end":return a.stop()}}),a)})))()},injectApiIconsForApiNode:function(e){var t,n,a;e.style.position="relative";var r=null===(t=e.querySelector(".opblock-summary-method"))||void 0===t?void 0:t.innerText,o=null===(n=e.querySelector(".opblock-summary-path"))||void 0===n?void 0:n.innerText.replace(/\u200B/g,""),i=null===(a=e.querySelector(".opblock-summary-description"))||void 0===a?void 0:a.innerText;if(r&&o&&i){var s=V(o,r.toLowerCase(),i);e.appendChild(s)}},bindClickApiHandlerForApiNode:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];e.addEventListener("click",(function(e){var n=e.currentTarget;if(t){var a,r=null===(a=n.querySelector(".menu-url"))||void 0===a?void 0:a.innerText,o=l["state"].options.find((function(e){return e.collection.summary===r}));if(!o)return;l["state"].currentApi=o,l["state"].key=l["state"].currentApi.key}else{var i,s,c,p=null===(i=n.querySelector(".opblock-summary-method"))||void 0===i?void 0:i.innerText,u=null===(s=n.querySelector(".opblock-summary-path"))||void 0===s?void 0:s.innerText,d=null===(c=n.querySelector(".opblock-summary-description"))||void 0===c?void 0:c.innerText;if(!p||!u||!d)return;var f=p.toLowerCase()+" "+u+" "+d;l["state"].key=f,l["state"].currentApi=l["state"].options.find((function(e){return e.key===f}))}}))},bindClickEventForModel:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){var n,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.$nextTick();case 2:null===(n=document.querySelector(".models"))||void 0===n||null===(a=n.firstChild)||void 0===a||a.addEventListener("click",e.modelTagHandler);case 3:case"end":return t.stop()}}),t)})))()},modelTagHandler:function(){return Object(s["a"])(regeneratorRuntime.mark((function e(){var t;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,Object(c["b"])(0);case 2:t=Object(i["a"])(document.querySelectorAll(".model-container")),t.forEach((function(e){e.style.position="relative";var t=P(e.innerText);e.appendChild(t)}));case 4:case"end":return e.stop()}}),e)})))()}}},B=H,G=(n("430e"),Object(b["a"])(B,a,r,!1,null,"129186e2",null));t["default"]=G.exports},"430e":function(e,t,n){"use strict";var a=n("b291"),r=n.n(a);r.a},"526f":function(e,t,n){var a=n("24fb");t=a(!1),t.push([e.i,".collapse[data-v-129186e2]{height:50px;position:fixed;right:10px;bottom:-3px;display:flex;justify-content:center;align-items:center}.collapse>i[data-v-129186e2]{font-size:20px;color:#409eff;cursor:pointer}.operation-container[data-v-129186e2]{min-width:600px;display:flex;align-items:center}.operation-container>a[data-v-129186e2]{margin-right:15px}#extends-app[data-v-129186e2]{display:flex;position:fixed;z-index:100;right:0;bottom:0;width:100%;padding:10px;background-color:#f1f1f1}.switch-container[data-v-129186e2]{display:flex;align-items:center;margin-right:20px}.switch-container .text[data-v-129186e2]{font-weight:700;color:#606266;font-size:14px}.right[data-v-129186e2]{width:100%!important;height:100%;display:flex;justify-content:space-between;align-items:center}.right[data-v-129186e2],.right .more-setting[data-v-129186e2]{margin-right:20px}[data-v-129186e2] .el-switch__label *{line-height:normal}[data-v-129186e2] .el-switch__label--left{color:#ffa142!important}[data-v-129186e2] .el-switch__label--right{color:#409eff!important}",""]),e.exports=t},5460:function(e,t,n){"use strict";var a=n("b328"),r=n.n(a);r.a},"902e":function(e,t,n){"use strict";var a=n("047c"),r=n.n(a);r.a},"9a80":function(e,t,n){"use strict";var a=n("f30c"),r=n.n(a);r.a},b291:function(e,t,n){var a=n("526f");"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var r=n("499e").default;r("b1ab867a",a,!0,{sourceMap:!1,shadowMode:!1})},b328:function(e,t,n){var a=n("b611");"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var r=n("499e").default;r("11fadc14",a,!0,{sourceMap:!1,shadowMode:!1})},b611:function(e,t,n){var a=n("24fb");t=a(!1),t.push([e.i,".svg-icon[data-v-3a139dd0]{font-size:22px;position:absolute;right:20px;top:20px}",""]),e.exports=t},cbf2:function(e,t,n){var a=n("10b5");"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var r=n("499e").default;r("647115bc",a,!0,{sourceMap:!1,shadowMode:!1})},dbe7:function(e,t,n){"use strict";var a=n("cbf2"),r=n.n(a);r.a},f30c:function(e,t,n){var a=n("ff0c");"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var r=n("499e").default;r("2d1dc29f",a,!0,{sourceMap:!1,shadowMode:!1})},ff0c:function(e,t,n){var a=n("24fb");t=a(!1),t.push([e.i,".api-icons[data-v-2bde9f82]{position:absolute;top:11px;right:55px;width:160px;display:flex;justify-content:space-between;align-items:center}.svg-icon[data-v-2bde9f82]{font-size:20px}.url[data-v-2bde9f82]{font-size:16px}.mock[data-v-2bde9f82]{cursor:pointer}",""]),e.exports=t}}]);