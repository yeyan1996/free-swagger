(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-50742046"],{"2d3e":function(e,a,r){"use strict";r("a4d3"),r("e01a"),r("99af"),r("4de4"),r("7db0"),r("c740"),r("4160"),r("caad"),r("a15b"),r("d81d"),r("45fc"),r("b0c0"),r("7a82"),r("b64b"),r("ac1f"),r("2532"),r("1276"),r("2ca0"),r("159b");var n=r("278c"),t=r("6374");Object.defineProperty(a,"__esModule",{value:!0}),a.formatGenericInterface=a.flatInterfaceName=a.parseInterface=a.parseInterfaceName=a.buildInInterfaces=void 0;var _=r("fff2"),o=r("792e"),s=["T","U","V"],c={Map:{name:"Map",formatName:"JavaMap",code:"\n   export type JavaMap<T extends string | symbol | number, U> = Record<T, U>\n  ",jsDocCode:"\n/**\n * @typedef {object} JavaMap\n **/"},List:{name:"List",formatName:"JavaList",code:"\n   export type JavaList<T> = Array<T>\n  ",jsDocCode:"\n/**\n * @typedef {Array} JavaList\n **/"}};a.buildInInterfaces=c;var i=function(e){var a,r=[],n="",o=function(e){return Object.keys(_.SPECIAL_CHARACTERS_MAP_OPEN).includes(e)},s=function(e){return Object.keys(_.SPECIAL_CHARACTERS_MAP_CLOSE).includes(e)},c=t(e.split(""));try{for(c.s();!(a=c.n()).done;){var i=a.value;if(o(i))r.push(n),n="",r.push(i);else if(","===i)n&&(r.push(n),n="");else if(s(i)){n&&(r.push(n),n="");var u=void 0,p=[];while(!o(u)&&r.length>0)u=r.pop(),"string"!==typeof u||o(u)?o(u)||p.unshift(u):p.unshift({name:u,formatName:u});if(r.length){var m=r.pop();"string"===typeof m&&r.push({name:m,formatName:m,generics:p})}if(1===r.length)return r[0]}else n+=i}}catch(d){c.e(d)}finally{c.f()}return{name:n,formatName:n}};a.parseInterfaceName=i;var u=function e(a){return a.generics?"".concat(a.formatName,"<").concat(a.generics.map((function(a){return e(a)})).join(","),">"):a.formatName},p=function(e){var a=[];return _.traverseTree(i(e),(function(e){a.push(e.name)})),a};a.flatInterfaceName=p;var m=function(e,a){return Object.keys(e).filter((function(e){return e.startsWith(a)})).some((function(e){var r=p(e),t=n(r,1),_=t[0];return a===_}))},d=function(e){return c[e]?c[e].formatName:_.TYPE_MAP[e]?_.TYPE_MAP[e]:e},f=function(e){var a=i(e);return _.traverseTree(a,(function(e){e.formatName=d(e.name)})),u(a)};a.formatGenericInterface=f;var l=function(e,a){var r={};return Object.keys(e).forEach((function(n){var t=e[n],o=_.schemaToTsType(t),s=o.imports,c=o.type,i=o.formatType,u=o.ref;r[n]={type:c,formatType:i,ref:u,imports:s,required:(null===a||void 0===a?void 0:a.includes(n))||!1,description:t.description||""}})),r},P=function(e,a){var r,n=[],t=Object.keys(e),o=function(e){return _.TYPE_MAP[e]};return null===(r=a.generics)||void 0===r||r.forEach((function(a){if(o(a.name)){var r=t.findIndex((function(r){return e[r].type===a.name}));if(r<0)return;n.push(t[r])}else if("List"===a.name){var s=t.findIndex((function(r){var n,t,o,s;return null!==(s="array"===e[r].type&&_.extractInterfaceNameByRef(null!==(t=null===(n=e[r].items)||void 0===n?void 0:n.$ref)&&void 0!==t?t:"")===(null===(o=a.generics)||void 0===o?void 0:o[0].name))&&void 0!==s?s:""}));if(s<0)return;n.push(t[s])}else{var c=t.findIndex((function(r){var n,t,o;return _.extractInterfaceNameByRef(null!==(n=e[r].$ref)&&void 0!==n?n:"")===a.name||_.extractInterfaceNameByRef(null!==(o=null===(t=e[r].items)||void 0===t?void 0:t.$ref)&&void 0!==o?o:"")===a.name}));if(c<0)return;n.push(t[c])}})),n},y=function(e,a,r){var n=o.clone(l(e,r));return a.forEach((function(a,t){n[a]={type:e[a].type,formatType:"array"===e[a].type?"".concat(s[t],"[]"):s[t],ref:n[a].ref,imports:[],required:(null===r||void 0===r?void 0:r.includes(a))||!1,description:e[a].description||""}})),n},E=function(e,a,r){var n,t,o;if(!e[a])throw new Error("can not find ".concat(a," in definitions"));var u=i(a),p=e[a],f=p.properties,l=p.allOf,E=p.required,I=c[u.name];if(I)return Object.assign({code:"interface"===r?I.code:I.jsDocCode},u);var h=null!==(t=null===(n=null===l||void 0===l?void 0:l.find((function(e){return e.type})))||void 0===n?void 0:n.properties)&&void 0!==t?t:f;return h?((null===(o=u.generics)||void 0===o?void 0:o.length)?_.traverseTree(u,(function(a){var n,t,_=c[a.name];if(_)a.code="interface"===r?_.code:_.jsDocCode;else if(e[a.name]){var o=e[a.name],i=o.properties,p=o.required;if(!i)return;a.props=y(i,P(i,u),p)}else m(e,a.name)&&(a.props=y(h,P(h,u),E));a.formatName="".concat(d(a.name)).concat((null===(n=a.generics)||void 0===n?void 0:n.length)?"<".concat(null===(t=a.generics)||void 0===t?void 0:t.map((function(e,a){return s[a]})).join(","),">"):"")})):u.props=y(h,[],E),u):Object.assign({code:"export type ".concat(a," = ").concat(_.schemaToTsType(e[a]).formatType)},u)};a.parseInterface=E},"32fc":function(e,a,r){"use strict";r("99af"),r("a15b"),r("d81d"),r("45fc"),r("b0c0"),r("7a82"),r("4fad"),r("b64b");var n=r("278c"),t=r("7037");Object.defineProperty(a,"__esModule",{value:!0}),a.genIParams=a.isParsedSchemaObject=a.genPath=void 0;var _=r("792e"),o=function(e){return Object.keys(e).some((function(a){return"object"!==t(e[a])}))};a.isParsedSchemaObject=o;var s=function(e){return!e||_.isEmpty(e)?"":o(e)?e.formatType:"{\n    ".concat(Object.entries(e).map((function(e){var a=n(e,2),r=a[0],t=a[1];return'\n          "'.concat(r,'"').concat(t.required?"":"?",": ").concat(t.formatType)})).join(","),"\n      }")},c=function(e){var a=e.pathParamsInterface,r=e.queryParamsInterface,n=e.bodyParamsInterface;return{IQueryParams:s(r),IBodyParams:s(n),IPathParams:s(a)}};a.genIParams=c;var i=function(e,a){var r=c(e),n=r.IPathParams,t=r.IBodyParams,_=r.IQueryParams;return a.templateFunction({name:e.name,method:e.method,url:e.url,responseType:e.responseInterface.isBinary?"blob":"json",deprecated:e.deprecated,summary:a.useJsDoc&&"js"===a.lang?"":e.summary,IResponse:e.responseInterface.formatType,pathParams:Object.keys(e.pathParamsInterface),IQueryParams:_,IBodyParams:t,IPathParams:n})};a.genPath=i},"37b8":function(e,a,r){"use strict";r("99af"),r("4de4"),r("13d5"),r("b0c0"),r("4ec9"),r("7a82"),r("b64b"),r("d3b7"),r("07ac"),r("3ca3"),r("498a"),r("ddb0"),Object.defineProperty(a,"__esModule",{value:!0}),a.compileInterfaces=a.compileInterface=void 0;var n=r("2d3e"),t=r("fff2"),_=r("f55f"),o=r("caf7"),s=r("95a9"),c=function e(a){var r=a.source,o=a.interfaceName,c=a.contextMap,i=a.compileType,u=void 0===i?"interface":i;if(!r.definitions[o])return"";var p=n.parseInterface(r.definitions,o,u),m="";try{return t.traverseTree(p,(function(a){c.has(a.name)||(c.set(a.name,a),a.code?m+="".concat("interface"===u?t.formatCode("ts")(_.genInterface(a)):s.genJsDocTypeDef(a),"\n"):!t.TYPE_MAP[a.name]&&a.props&&(m+=Object.values(a.props).filter((function(e){return e.ref})).reduce((function(a,n){return"".concat(a+e({source:r,interfaceName:n.ref,contextMap:c,compileType:u}))}),""),m+="".concat("interface"===u?t.formatCode("ts")(_.genInterface(a)):s.genJsDocTypeDef(a),"\n")))})),m}catch(d){return console.warn("".concat("interface"===u?"interfaceName":"jsDoc",": ").concat(o," 生成失败，检查是否符合 swagger 规范")),console.warn(d),"// ".concat("interface"===u?"interfaceName":"jsDoc",": ").concat(o," 生成失败，检查是否符合 swagger 规范\n    \n")}};a.compileInterface=c;var i=function(e){var a=e.source,r=e.interfaceName,n=e.compileType,_=void 0===n?"interface":n;if(!a.definitions)return"";if(r){var s=new Map;return c({source:a,interfaceName:r,compileType:_,contextMap:s})}var i=new Map,u=Object.keys(a.definitions).reduce((function(e,r){return e+c({source:a,interfaceName:r,contextMap:i,compileType:_})}),"");return"interface"===_?t.formatCode("ts")("".concat(o.DEFAULT_HEAD_INTERFACE,"\n").concat(u)).trim():"".concat(o.DEFAULT_HEAD_JS_DOC_TYPES,"\n").concat(u).trim()};a.compileInterfaces=i},"3b29":function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"state",(function(){return state})),__webpack_require__.d(__webpack_exports__,"handleCopyApi",(function(){return handleCopyApi})),__webpack_require__.d(__webpack_exports__,"handleCopyPath",(function(){return handleCopyPath})),__webpack_require__.d(__webpack_exports__,"handleCopyFake",(function(){return handleCopyFake})),__webpack_require__.d(__webpack_exports__,"handleCopyInterface",(function(){return handleCopyInterface})),__webpack_require__.d(__webpack_exports__,"handleCopyJsDoc",(function(){return handleCopyJsDoc})),__webpack_require__.d(__webpack_exports__,"handleCopySchema",(function(){return handleCopySchema}));var core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("a4d3"),core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(core_js_modules_es_symbol_js__WEBPACK_IMPORTED_MODULE_0__),core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("e01a"),core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(core_js_modules_es_symbol_description_js__WEBPACK_IMPORTED_MODULE_1__),core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("99af"),core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_2__),core_js_modules_es_array_find_index_js__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("c740"),core_js_modules_es_array_find_index_js__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(core_js_modules_es_array_find_index_js__WEBPACK_IMPORTED_MODULE_3__),core_js_modules_es_array_for_each_js__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("4160"),core_js_modules_es_array_for_each_js__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(core_js_modules_es_array_for_each_js__WEBPACK_IMPORTED_MODULE_4__),core_js_modules_es_array_splice_js__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("a434"),core_js_modules_es_array_splice_js__WEBPACK_IMPORTED_MODULE_5___default=__webpack_require__.n(core_js_modules_es_array_splice_js__WEBPACK_IMPORTED_MODULE_5__),core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("b0c0"),core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_6___default=__webpack_require__.n(core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_6__),core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("b64b"),core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_7___default=__webpack_require__.n(core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_7__),core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("ac1f"),core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_8___default=__webpack_require__.n(core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_8__),core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("5319"),core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_9___default=__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_9__),core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("159b"),core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_10___default=__webpack_require__.n(core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_10__),element_ui_lib_theme_chalk_message_css__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__("0fb7"),element_ui_lib_theme_chalk_message_css__WEBPACK_IMPORTED_MODULE_11___default=__webpack_require__.n(element_ui_lib_theme_chalk_message_css__WEBPACK_IMPORTED_MODULE_11__),element_ui_lib_theme_chalk_base_css__WEBPACK_IMPORTED_MODULE_12__=__webpack_require__("450d"),element_ui_lib_theme_chalk_base_css__WEBPACK_IMPORTED_MODULE_12___default=__webpack_require__.n(element_ui_lib_theme_chalk_base_css__WEBPACK_IMPORTED_MODULE_12__),element_ui_lib_message__WEBPACK_IMPORTED_MODULE_13__=__webpack_require__("f529"),element_ui_lib_message__WEBPACK_IMPORTED_MODULE_13___default=__webpack_require__.n(element_ui_lib_message__WEBPACK_IMPORTED_MODULE_13__),vue__WEBPACK_IMPORTED_MODULE_14__=__webpack_require__("2b0e"),_utils_dom_utils__WEBPACK_IMPORTED_MODULE_15__=__webpack_require__("4f0c"),lodash_es__WEBPACK_IMPORTED_MODULE_16__=__webpack_require__("e247"),free_swagger_client__WEBPACK_IMPORTED_MODULE_17__=__webpack_require__("95a9"),free_swagger_client__WEBPACK_IMPORTED_MODULE_17___default=__webpack_require__.n(free_swagger_client__WEBPACK_IMPORTED_MODULE_17__),json_schema_faker__WEBPACK_IMPORTED_MODULE_18__=__webpack_require__("e08d"),json_schema_faker__WEBPACK_IMPORTED_MODULE_18___default=__webpack_require__.n(json_schema_faker__WEBPACK_IMPORTED_MODULE_18__),STORAGE_KEY="SWAGGER-EXTENDS",SUCCESS_CODE="200",state=new vue__WEBPACK_IMPORTED_MODULE_14__["default"]({data:function(){return{url:"",dialog:!1,key:"",currentApi:{key:"",path:"",method:"",collection:{controller:{},operationId:""}},storage:{jsTemplate:free_swagger_client__WEBPACK_IMPORTED_MODULE_17__["jsTemplate"],tsTemplate:free_swagger_client__WEBPACK_IMPORTED_MODULE_17__["tsTemplate"],useJsDoc:!1,useInterface:!1,exportLanguage:"js",currentLanguage:"js"},isNewUi:!1,domLoaded:!1,swagger:null,parsedSwagger:null}},computed:{options:function(){if(!this.swagger)return[];var e=[],a=[],r=this.swagger.paths,n=this.swagger.tags;return Object.keys(r).forEach((function(a){Object.keys(r[a]).forEach((function(n){var t=r[a][n],_=t.tags,o=t.summary,s=t.description,c=t.operationId;e.push({path:a,method:n,key:"".concat(n," ").concat(a," ").concat(o),tag:_[_.length-1],collection:{controller:_[_.length-1],summary:o,description:s,operationId:c}})}))})),n.forEach((function(r){var n;do{if(n=e.findIndex((function(e){return e.tag===r.name})),n<0)return;a.push(e[n]),e.splice(n,1)}while(n>=0)})),a}},watch:{storage:{handler:function(e){localStorage.setItem(STORAGE_KEY,JSON.stringify(e))},deep:!0}},created:function(){var e=localStorage.getItem(STORAGE_KEY)?JSON.parse(localStorage.getItem(STORAGE_KEY)):{};this.storage=Object(lodash_es__WEBPACK_IMPORTED_MODULE_16__["a"])(e,this.storage,(function(e,a){if(""===e)return a}))}}),handleCopyApi=function handleCopyApi(){var path=arguments.length>0&&void 0!==arguments[0]?arguments[0]:state.currentApi.path,method=arguments.length>1&&void 0!==arguments[1]?arguments[1]:state.currentApi.method,source=arguments.length>2&&void 0!==arguments[2]?arguments[2]:state.swagger;try{if(!path)throw new Error;var storage=state.storage,codeFragment=free_swagger_client__WEBPACK_IMPORTED_MODULE_17___default()({source:source,lang:storage.currentLanguage,useJsDoc:storage.useJsDoc,useInterface:storage.useInterface,templateFunction:eval("js"===storage.currentLanguage?storage.jsTemplate:storage.tsTemplate)},path,method);Object(_utils_dom_utils__WEBPACK_IMPORTED_MODULE_15__["a"])(codeFragment)}catch(e){element_ui_lib_message__WEBPACK_IMPORTED_MODULE_13___default.a.error("复制失败，请检查选择的 api 或模版"),console.log(e)}},handleCopyPath=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:state.currentApi.path,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:state.currentApi.method;try{var r=e.replace(/{(.*?)}/g,":$1");Object(_utils_dom_utils__WEBPACK_IMPORTED_MODULE_15__["a"])('"'.concat(a.toUpperCase()," ").concat(r,'"'))}catch(n){element_ui_lib_message__WEBPACK_IMPORTED_MODULE_13___default.a.error("复制失败，请检查选择的 api 或模版"),console.log(n)}},handleCopyFake=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:state.currentApi.path,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:state.currentApi.method,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:state.parsedSwagger;Object(json_schema_faker__WEBPACK_IMPORTED_MODULE_18__["option"])({useExamplesValue:!0,useDefaultValue:!0,alwaysFakeOptionals:!0,refDepthMax:2,maxItems:1,failOnInvalidTypes:!1});try{var n,t,_,o=null===(n=r.paths[e][a].responses)||void 0===n||null===(t=n[SUCCESS_CODE])||void 0===t?void 0:t.schema;o?(_=Object(json_schema_faker__WEBPACK_IMPORTED_MODULE_18__["generate"])(o),_.code&&(_.code=SUCCESS_CODE)):_={code:SUCCESS_CODE,msg:"xxx",data:{}},Object(_utils_dom_utils__WEBPACK_IMPORTED_MODULE_15__["a"])(_)}catch(s){console.log(s),element_ui_lib_message__WEBPACK_IMPORTED_MODULE_13___default.a.error("复制失败，请检查选择的 api 或模版")}},handleCopyInterface=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:state.swagger,a=arguments.length>1?arguments[1]:void 0;try{var r,n=a&&(null===(r=Object(free_swagger_client__WEBPACK_IMPORTED_MODULE_17__["parseInterfaceName"])(a).generics)||void 0===r?void 0:r.length);if(n)return void element_ui_lib_message__WEBPACK_IMPORTED_MODULE_13___default.a.warning("复制失败，interface 片段会丢失上下文，请选择复制 interface");var t=Object(free_swagger_client__WEBPACK_IMPORTED_MODULE_17__["compileInterfaces"])({source:e,interfaceName:a});Object(_utils_dom_utils__WEBPACK_IMPORTED_MODULE_15__["a"])(t)}catch(_){console.log(_),element_ui_lib_message__WEBPACK_IMPORTED_MODULE_13___default.a.error("复制失败，请检查选择的 api")}},handleCopyJsDoc=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:state.swagger,a=arguments.length>1?arguments[1]:void 0;try{var r=Object(free_swagger_client__WEBPACK_IMPORTED_MODULE_17__["compileJsDocTypeDefs"])({source:e,interfaceName:a});Object(_utils_dom_utils__WEBPACK_IMPORTED_MODULE_15__["a"])(r)}catch(n){console.log(n),element_ui_lib_message__WEBPACK_IMPORTED_MODULE_13___default.a.error("复制失败，请检查选择的 api")}},handleCopySchema=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:state.currentApi.path,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:state.currentApi.method,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:state.parsedSwagger;try{var n=r.paths[e][a].responses[SUCCESS_CODE].schema;Object(_utils_dom_utils__WEBPACK_IMPORTED_MODULE_15__["a"])(n)}catch(t){console.log(t),element_ui_lib_message__WEBPACK_IMPORTED_MODULE_13___default.a.error("复制失败，请检查选择的 api 或模版")}}},4:function(e,a){},"59ae":function(e,a,r){"use strict";r("99af"),r("7a82");var n=r("448a");Object.defineProperty(a,"__esModule",{value:!0}),a.parsePath=void 0;var t=r("8e80"),_=r("d0f0"),o=r("792e"),s=function(e,a,r,s){var c=s.parameters,i=s.summary,u=void 0===i?"":i,p=s.responses,m=s.deprecated,d=void 0!==m&&m,f=_.getRequestType(c),l=f.bodyParamsInterface,P=f.queryParamsInterface,y=f.pathParamsInterface,E=f.imports,I=t.getResponseType(p),h=I.responseInterface;return{imports:o.uniq([].concat(n(E),n(h.imports))),summary:u,deprecated:d,url:a,name:e,method:r,bodyParamsInterface:l,queryParamsInterface:P,pathParamsInterface:y,responseInterface:h}};a.parsePath=s},"8e80":function(e,a,r){"use strict";r("7a82"),Object.defineProperty(a,"__esModule",{value:!0}),a.getResponseType=void 0;var n=r("fff2"),t=200,_=function(e){if(!e[t])return{responseInterface:{ref:"",type:"",formatType:"",imports:[],required:!1,description:"",isBinary:!1}};var a=e[t].schema;return{responseInterface:n.schemaToTsType(a)}};a.getResponseType=_},"95a9":function(e,a,r){"use strict";r("99af"),r("b8bf"),r("7a82");var n=this&&this.__createBinding||(Object.create?function(e,a,r,n){void 0===n&&(n=r),Object.defineProperty(e,n,{enumerable:!0,get:function(){return a[r]}})}:function(e,a,r,n){void 0===n&&(n=r),e[n]=a[r]}),t=this&&this.__exportStar||function(e,a){for(var r in e)"default"===r||a.hasOwnProperty(r)||n(a,e,r)};Object.defineProperty(a,"__esModule",{value:!0}),a.compileJsDocTypeDefs=a.compileInterfaces=void 0;var _=r("caf7"),o=r("37b8");Object.defineProperty(a,"compileInterfaces",{enumerable:!0,get:function(){return o.compileInterfaces}});var s=r("f295");Object.defineProperty(a,"compileJsDocTypeDefs",{enumerable:!0,get:function(){return s.compileJsDocTypeDefs}});var c=r("d4e6"),i=function(e,a,r){var n=!a||!r;if(n)return"";var t=_.mergeDefaultParams(e),o=c.compilePath(t,a,r),s=o.jsDocCode,i=o.code,u=o.queryInterfaceCode,p=o.bodyInterfaceCode,m=o.pathInterfaceCode,d=o.responseInterfaceCode;return(e.useJsDoc&&"js"===e.lang?s:"")+(e.useInterface&&"ts"===e.lang?"".concat(u+p+m,"\n").concat(d):"")+i};a["default"]=i,t(r("a4e5"),a),t(r("fff2"),a),t(r("32fc"),a),t(r("f45f"),a),t(r("59ae"),a),t(r("2d3e"),a)},a4e5:function(e,a,r){"use strict";r("7a82"),Object.defineProperty(a,"__esModule",{value:!0}),a.tsTemplate=a.jsTemplate=void 0,a.jsTemplate="({\n  url,            // 完整路径 {string}\n  summary,        // 注释 {string}\n  method,         // 请求方法 {string}\n  name,           // api 函数名 {string}\n  responseType,   // 响应值种类，同 axios {string}\n  pathParams,     // 路径参数 {Array<string>}\n  IQueryParams,   // 请求查询参数 ts 类型\n  IBodyParams,    // 请求体参数 ts 类型\n  IPathParams     // 请求路径参数 ts 类型\n}) => {\n  // js template\n\n  // 处理路径参数 `/pet/{id}` => `/pet/${id}`\n const parsedUrl = url.replace(/{(.*?)}/g, '${$1}'); \n\n  // 有 query 和 body 参数\n const multipleParamsCondition = ({ IQueryParams, IBodyParams }) =>\n    IQueryParams && IBodyParams\n    \n  const firstParamCodeMap = new Map()\n    // 只有 query 参数，可能有 path 参数\n    .set(\n      ({ IQueryParams, IBodyParams }) => IQueryParams && !IBodyParams,\n       `params,`\n    )\n    // 只有 body 参数，可能有 path 参数\n    .set(\n      ({ IQueryParams, IBodyParams }) => IBodyParams && !IQueryParams,\n       `params,`\n    )\n    // 有 query 和 body 参数，可能有 path 参数\n    .set(\n      multipleParamsCondition,\n      () => `queryParams,`\n    )\n     // 没有 query body 参数，有 path 参数\n    .set(\n      ({ IQueryParams,pathParams,IBodyParams }) => !IBodyParams && !IQueryParams && pathParams.length,\n      '_NOOP,'\n    )  \n    // 只有 path 参数\n    .set(\n      ({ pathParams }) => pathParams.length,\n      ({ pathParams }) =>\n        `{${pathParams.join(',')}},`\n    )\n    \n  const secondParamCodeMap = new Map()\n    // 有 path 参数\n    .set(\n      ({ pathParams }) => pathParams.length,\n      ({ pathParams }) =>\n        `{${pathParams.join(',')}},`\n    )\n    // 有 query 和 body 参数，有 path 参数\n    .set(multipleParamsCondition, `_NOOP,`)\n    \n  const thirdParamCodeMap = new Map()\n    // 有 query 和 body 参数，有 path 参数\n    .set(\n      multipleParamsCondition,\n      `bodyParams,`\n    )\n    \n  const paramCodeMap = new Map()\n    .set(multipleParamsCondition, 'queryParams,')\n    .set(({ IQueryParams }) => !!IQueryParams, 'params,')\n    \n  const dataCodeMap = new Map()\n    .set(multipleParamsCondition, 'bodyParams,')\n    .set(({ IBodyParams }) => !!IBodyParams, 'params,')\n\n  const createParamCode = (conditionMap, defaultCode = '') => {\n    let code = defaultCode\n    for (const [condition, codeFunction] of conditionMap.entries()) {\n      const res = condition({\n        IQueryParams,\n        IBodyParams,\n        pathParams,\n      })\n      if (res) {\n        code =\n          typeof codeFunction === 'string'\n            ? codeFunction\n            : codeFunction({\n                IQueryParams,\n                IBodyParams,\n                IPathParams,\n                pathParams,\n              })\n        break\n      }\n    }\n    return code\n  }\n \n  return `\n  ${summary ? `// ${summary}` : \"\"}\n  export const ${name} = (\n    ${createParamCode(firstParamCodeMap) /* query | body | NOOP */}\n    ${createParamCode(secondParamCodeMap) /* path | null */}\n    ${createParamCode(thirdParamCodeMap) /* body | null */}\n)  => axios.request({\n         url: \\`${parsedUrl}\\`,\n         method: \"${method}\",\n         params:${createParamCode(paramCodeMap, '{},')}\n         data:${createParamCode(dataCodeMap, '{},')}\n         ${responseType === \"json\" ? \"\" : `responseType: ${responseType},`}\n })`;\n}\n",a.tsTemplate="({\n  url,            // 完整路径 {string}\n  summary,        // 注释 {string}\n  method,         // 请求方法 {string}\n  name,           // api 函数名 {string}\n  responseType,   // 响应值种类，同 axios {string}\n  pathParams,     // 路径参数 {Array<string>}\n  IQueryParams,   // 请求查询参数 ts 类型\n  IBodyParams,    // 请求体参数 ts 类型\n  IPathParams,     // 请求路径参数 ts 类型\n  IResponse,      // 响应参数 ts 类型\n}) => {\n  // ts template\n\n  // 处理路径参数 `/pet/{id}` => `/pet/${id}`\n const parsedUrl = url.replace(/{(.*?)}/g, '${$1}'); \n \n // 有 query 和 body 参数\n const multipleParamsCondition = ({ IQueryParams, IBodyParams }) =>\n    IQueryParams && IBodyParams\n    \n  const firstParamCodeMap = new Map()\n    // 只有 query 参数，可能有 path 参数\n    .set(\n      ({ IQueryParams, IBodyParams }) => IQueryParams && !IBodyParams,\n      ({ IQueryParams }) => `params: ${IQueryParams},`\n    )\n    // 只有 body 参数，可能有 path 参数\n    .set(\n      ({ IQueryParams, IBodyParams }) => IBodyParams && !IQueryParams,\n      ({ IBodyParams }) => `params: ${IBodyParams},`\n    )\n    // 有 query 和 body 参数，可能有 path 参数\n    .set(\n      multipleParamsCondition,\n      ({ IQueryParams }) => `queryParams: ${IQueryParams},`\n    )\n    // 没有 query body 参数，有 path 参数\n    .set(\n      ({ IQueryParams,pathParams,IBodyParams }) => !IBodyParams && !IQueryParams && pathParams.length,\n      '_NOOP: Record<string,never>,'\n    )\n     // 只有 path 参数\n    .set(\n      ({ pathParams }) => pathParams.length,\n      ({ pathParams, IPathParams }) =>\n        `{${pathParams.join(',')}}: ${IPathParams},`\n    )\n    \n  const secondParamCodeMap = new Map()\n    // 有 path 参数\n    .set(\n      ({ pathParams }) => pathParams.length,\n      ({ pathParams, IPathParams }) =>\n        `{${pathParams.join(',')}}: ${IPathParams},`\n    )\n    // 有 query 和 body 参数，有 path 参数\n    .set(multipleParamsCondition, `_NOOP:{[key:string]: never},`)\n    \n  const thirdParamCodeMap = new Map()\n    // 有 query 和 body 参数，有 path 参数\n    .set(\n      multipleParamsCondition,\n      ({ IBodyParams }) => `bodyParams: ${IBodyParams},`\n    )\n    \n  const paramCodeMap = new Map()\n    .set(multipleParamsCondition, 'queryParams,')\n    .set(({ IQueryParams }) => !!IQueryParams, 'params,')\n    \n  const dataCodeMap = new Map()\n    .set(multipleParamsCondition, 'bodyParams,')\n    .set(({ IBodyParams }) => !!IBodyParams, 'params,')\n\n  const createParamCode = (conditionMap, defaultCode = '') => {\n    let code = defaultCode\n    for (const [condition, codeFunction] of conditionMap.entries()) {\n      const res = condition({\n        IQueryParams,\n        IBodyParams,\n        pathParams,\n      })\n      if (res) {\n        code =\n          typeof codeFunction === 'string'\n            ? codeFunction\n            : codeFunction({\n                IQueryParams,\n                IBodyParams,\n                IPathParams,\n                pathParams,\n              })\n        break\n      }\n    }\n    return code\n  }\n \n  return `\n  ${summary ? `// ${summary}` : \"\"}\n  export const ${name} = (\n    ${createParamCode(firstParamCodeMap) /* query | body | NOOP */}\n    ${createParamCode(secondParamCodeMap) /* path | null */}\n    ${createParamCode(thirdParamCodeMap) /* body | null */}\n) => axios.request<${IResponse || \"any\"}>({\n         url: \\`${parsedUrl}\\`,\n         method: \"${method}\",\n         params:${createParamCode(paramCodeMap, '{},')}\n         data:${createParamCode(dataCodeMap, '{},')}\n         ${responseType === \"json\" ? \"\" : `responseType: ${responseType},`}\n })`;\n}\n"},caf7:function(module,exports,__webpack_require__){"use strict";__webpack_require__("7a82"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.DEFAULT_HEAD_JS_DOC_TYPES=exports.DEFAULT_HEAD_INTERFACE=exports.mergeDefaultParams=void 0;var template_1=__webpack_require__("a4e5");exports.mergeDefaultParams=function(config){return Object.assign({useJsDoc:!1,useInterface:!1,lang:"js",templateFunction:eval(template_1.jsTemplate)},config)},exports.DEFAULT_HEAD_INTERFACE="/* eslint-disable */\n// @ts-nocheck\n// generated by free-swagger-client\n// @see https://www.npmjs.com/package/free-swagger-client\n",exports.DEFAULT_HEAD_JS_DOC_TYPES="// generated by free-swagger-client\n// @see https://www.npmjs.com/package/free-swagger-client\n"},d0f0:function(e,a,r){"use strict";r("a4d3"),r("e01a"),r("4160"),r("45fc"),r("b0c0"),r("7a82"),r("159b");var n=r("448a");Object.defineProperty(a,"__esModule",{value:!0}),a.getRequestType=void 0;var t=r("fff2"),_=function(e,a){var r=[],_=e.type,o="",s=!1,c="";if(e.schema||e.items){var i=t.schemaToTsType(e.schema||e.items);_=i.type,c=i.ref,o=i.formatType,s=!!i.isBinary,r.push.apply(r,n(i.imports)),a.push.apply(a,n(i.imports))}else o=t.TYPE_MAP[e.type];return{type:_,ref:c,formatType:o,imports:r,isBinary:s,description:e.description||"",required:e.required||!1}},o=function(e){if(!e||e.some(t.isRef))return{imports:[],pathParamsInterface:{},queryParamsInterface:{},bodyParamsInterface:{}};var a={},r={},n={},o=[];return e.forEach((function(e){switch(e["in"]){case"path":a[e.name]=_(e,o);break;case"query":r[e.name]=_(e,o);break;case"formData":n={type:e.type,formatType:"FormData",imports:[],ref:"",isBinary:!0,description:"",required:!0};break;case"body":n=_(e,o);break;default:return}})),{imports:o,pathParamsInterface:a,bodyParamsInterface:n,queryParamsInterface:r}};a.getRequestType=o},d4e6:function(e,a,r){"use strict";r("99af"),r("4ec9"),r("7a82"),r("d3b7"),r("3ca3"),r("ddb0"),Object.defineProperty(a,"__esModule",{value:!0}),a.compilePath=void 0;var n=r("95a9"),t=r("37b8"),_=r("792e"),o=function(e,a,r){var o=e.source,s=o.definitions,c=o.paths,i=o.basePath,u=c[a][r].operationId;if(!u)throw new Error("can not find name ".concat(u));var p=n.parsePath(u,"".concat(i).concat(a),r,c[a][r]),m=n.formatCode(e.lang)(n.genPath(p,e)),d=n.genJsDoc(p),f=_.isString(p.queryParamsInterface.type)?p.queryParamsInterface.type:"",l=_.isString(p.bodyParamsInterface.type)?p.bodyParamsInterface.type:"",P=_.isString(p.pathParamsInterface.type)?p.pathParamsInterface.type:"",y=_.isString(p.responseInterface.type)?p.responseInterface.type:"",E=new Map,I=s[f]?t.compileInterface({source:e.source,interfaceName:f,contextMap:E}):"",h=s[l]?t.compileInterface({source:e.source,interfaceName:l,contextMap:E}):"",b=s[P]?t.compileInterface({source:e.source,interfaceName:P,contextMap:E}):"",g=s[y]?t.compileInterface({source:e.source,interfaceName:y,contextMap:E}):"";return{code:m,jsDocCode:d,parsedApi:p,queryInterfaceCode:I,bodyInterfaceCode:h,pathInterfaceCode:b,responseInterfaceCode:g}};a.compilePath=o},f295:function(e,a,r){"use strict";r("7a82"),Object.defineProperty(a,"__esModule",{value:!0}),a.compileJsDocTypeDef=a.compileJsDocTypeDefs=void 0;var n=r("37b8"),t=function(e){var a=e.source,r=e.interfaceName,t=e.contextMap;return n.compileInterface({source:a,interfaceName:r,contextMap:t,compileType:"jsDoc"})};a.compileJsDocTypeDef=t;var _=function(e){var a=e.source,r=e.interfaceName;return n.compileInterfaces({source:a,interfaceName:r,compileType:"jsDoc"})};a.compileJsDocTypeDefs=_},f45f:function(e,a,r){"use strict";r("a4d3"),r("e01a"),r("99af"),r("a15b"),r("d81d"),r("b0c0"),r("4ec9"),r("7a82"),r("4fad"),r("b64b"),r("d3b7"),r("3ca3"),r("ddb0");var n=r("6374"),t=r("278c");Object.defineProperty(a,"__esModule",{value:!0}),a.genJsDoc=a.genJsDocTypeDef=void 0;var _=r("95a9"),o=r("792e"),s=function(e){var a=e.name,r=e.props,n=e.code;return n||"\n/**\n * @typedef {\n *   {\n".concat(r&&Object.entries(r).map((function(e){var a=t(e,2),r=a[0],n=a[1];return" *     '".concat(r,"': ").concat(n.formatType,"\n")})).join("")," *   }\n * } ").concat(a,"\n**/\n")};a.genJsDocTypeDef=s;var c=function(e){return!e||o.isEmpty(e)?"":_.isParsedSchemaObject(e)?e.formatType:"{\n    ".concat(Object.entries(e).map((function(e,a){var r=t(e,2),n=r[0],_=r[1];return"".concat(0!==a?"    ":"",'"').concat(n,'": ').concat(_.formatType)})).join("\n"),"\n}")},i=function(e){var a=e.pathParamsInterface,r=e.queryParamsInterface,n=e.bodyParamsInterface;return{IQueryParams:c(r),IBodyParams:c(n),IPathParams:c(a)}},u=function(e){var a=i(e),r=a.IBodyParams,_=a.IQueryParams,o=a.IPathParams,s=o?"\n * @param {Object} pathParams\n".concat(Object.entries(e.pathParamsInterface).map((function(e){var a=t(e,2),r=a[0],n=a[1];return" * @param {".concat(n.formatType,"} pathParams.").concat(r," ").concat(n.description?"-".concat(n.description):"")})).join("\n")):"",c=function(e){var a=e.IQueryParams,r=e.IBodyParams;return a&&r},u=(new Map).set((function(e){var a=e.IQueryParams,r=e.IBodyParams;return a&&!r}),(function(e){var a=e.IQueryParams,r=e.queryDescription;return"\n * @param {".concat(a,"} params ").concat(r)})).set((function(e){var a=e.IQueryParams,r=e.IBodyParams;return r&&!a}),(function(e){var a=e.IBodyParams,r=e.bodyDescription;return"\n * @param {".concat(a,"} params ").concat(r)})).set(c,(function(e){var a=e.IQueryParams,r=e.queryDescription;return"\n * @param {".concat(a,"} queryParams ").concat(r)})).set((function(e){var a=e.IQueryParams,r=e.pathParams,n=e.IBodyParams;return!n&&!a&&r.length}),"\n * @param {Object} _NOOP -never").set((function(e){var a=e.pathParams;return a.length}),(function(){return s})),p=(new Map).set((function(e){var a=e.pathParams;return a.length}),(function(){return s})).set(c,"\n * @param {Object} _NOOP -never"),m=(new Map).set(c,(function(e){var a=e.IBodyParams,r=e.bodyDescription;return"\n * @param {".concat(a,"} bodyParams ").concat(r)})),d=function(a){var s,c=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",i=c,u=n(a.entries());try{for(u.s();!(s=u.n()).done;){var p=t(s.value,2),m=p[0],d=p[1],f=e.queryParamsInterface.description?"-".concat(e.queryParamsInterface.description):"",l=e.bodyParamsInterface.description?"-".concat(e.bodyParamsInterface.description):"",P=Object.keys(e.pathParamsInterface),y=m({IQueryParams:_,IBodyParams:r,pathParams:P});if(y){i="string"===typeof d?d:d({IQueryParams:_,IBodyParams:r,IPathParams:o,pathParams:P,queryDescription:f,bodyDescription:l});break}}}catch(E){u.e(E)}finally{u.f()}return i};return"\n/** ".concat(e.deprecated?"\n * @deprecated":"","\n * @description ").concat(e.summary," ").concat(d(u)," ").concat(d(p)," ").concat(d(m)," \n**/\n")};a.genJsDoc=u},f55f:function(e,a,r){"use strict";r("a4d3"),r("e01a"),r("99af"),r("d81d"),r("7a82"),r("4fad");var n=r("278c");Object.defineProperty(a,"__esModule",{value:!0}),a.genInterface=void 0;var t=function(e){var a=e.formatName,r=e.props,t=e.code;return t||"export interface ".concat(a," {\n        ").concat(r&&Object.entries(r).map((function(e){var a=n(e,2),r=a[0],t=a[1];return"".concat(t.description?"\n// ".concat(t.description):"","\n            '").concat(r,"' ").concat(t.required?"":"?",": ").concat(t.formatType,"\n            ")})),"\n      }")};a.genInterface=t},fff2:function(e,a,r){"use strict";r("4de4"),r("4160"),r("caad"),r("277d"),r("a15b"),r("baa5"),r("d81d"),r("fb6a"),r("7a82"),r("b64b"),r("07ac"),r("2532"),r("159b");var n=r("448a"),t=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(a,"__esModule",{value:!0}),a.SPECIAL_CHARACTERS_MAP_CLOSE=a.SPECIAL_CHARACTERS_MAP_OPEN=a.TYPE_MAP=a.traverseTree=a.schemaToTsType=a.isRef=a.extractInterfaceNameByRef=a.getRef=a.formatGenericInterface=a.formatCode=void 0;var _=t(r("24bc")),o=t(r("5b18")),s=t(r("cc89")),c=r("2d3e");Object.defineProperty(a,"formatGenericInterface",{enumerable:!0,get:function(){return c.formatGenericInterface}});var i=/^\w*$/,u={"«":"<","[":"<","{":"<","<":"<"};a.SPECIAL_CHARACTERS_MAP_OPEN=u;var p={"»":">","]":">","}":">",">":">"};a.SPECIAL_CHARACTERS_MAP_CLOSE=p;var m={boolean:"boolean",bool:"boolean",Boolean:"boolean",long:"number",double:"number",Int64:"number",integer:"number",number:"number",string:"string",bigdecimal:"string",LocalDate:"string",file:"Blob",formData:"FormData",Void:"void",object:"object",array:"Array<any>"};a.TYPE_MAP=m;var d=function e(a,r){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"generics",t=a,_=0,o=function(a,r){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"generics";r(a,_,t),_++,a[n]&&a[n].forEach((function(a){e(a,r,n)}))};o(a,r,n)};a.traverseTree=d;var f=function(e){return e.slice(e.lastIndexOf("/")+1)};a.extractInterfaceNameByRef=f;var l=function(e){var a=f(e);return c.formatGenericInterface(a)};a.getRef=l;var P=function(e){return e&&!!e.$ref};a.isRef=P;var y=function(e){var a;if(!e)return{type:"any",ref:"",formatType:"any",imports:[],isBinary:!1,required:!1,description:""};var r=[],t=function e(a){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if(a.$ref){if(!t)return f(a.$ref);var _=l(a.$ref);return r.push.apply(r,n(c.flatInterfaceName(_).filter((function(e){return!Object.values(m).includes(e)})).filter((function(e){return i.test(e)})).map((function(e){return c.buildInInterfaces[e]?c.buildInInterfaces[e].formatName:e})))),_}if(!a.type)return"any";if(Array.isArray(a.type))return JSON.stringify(a.type);if(!t)return a.type;if("array"===a.type&&a.items)return a.items["enum"]?"(".concat(e(a.items,t),")[]"):"".concat(e(a.items,t),"[]");if("object"===a.type){var o="";return a.properties?(Object.keys(a.properties).forEach((function(r){o+=a.properties?e(a.properties[r],t):""})),o):"object"}return a["enum"]?a["enum"].map((function(e){return'"'.concat(e,'"')})).join(" | "):m[a.type]},_="";return"array"===e.type&&(null===(a=e.items)||void 0===a?void 0:a.$ref)?_=f(e.items.$ref):e.$ref&&(_=f(e.$ref)),{type:t(e,!1),formatType:t(e),ref:_,imports:r,isBinary:"file"===e.type,required:!1,description:""}};a.schemaToTsType=y;var E=function(e){return function(a){return _["default"].format(a,{plugins:[s["default"],o["default"]],printWidth:120,tabWidth:2,parser:"ts"===e?"typescript":"babel",trailingComma:"none"})}};a.formatCode=E}}]);