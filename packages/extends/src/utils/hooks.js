import { Message } from "element-ui";
import { state } from "@/state";
import ah from "ajax-hook";
import SwaggerParser from "@/libs/json-schema-ref-parser/lib/index";
import { cloneDeep } from "lodash-es";

let ok = false;

const assignState = async (swagger, url) => {
  try {
    if (!swagger.swagger) return;
    ok = true;
    state.swagger = swagger;
    /**补充缺失的 definitions*/
    Object.assign(state.swagger.definitions, {
      List: {
        type: "array"
      }
    });
    state.url = url;
    state.parsedSwagger = await SwaggerParser.dereference(
      cloneDeep(state.swagger)
    );
  } catch (e) {
    console.error(e);
    Message.error("swagger 文档解析失败");
  }
};

// ajax hooks
ah.hookAjax({
  open(_, xhr) {
    setTimeout(async () => {
      let response = {};
      try {
        response = JSON.parse(xhr.response);
      } catch {}
      await assignState(response, xhr.responseURL);
    }, 500);
  }
});

// fetch hooks
window.fetch = new Proxy(fetch, {
  apply(...args) {
    if (ok) return Reflect.apply(...args);
    const response = Reflect.apply(...args);
    response.then(async res => {
      if (res.ok) {
        res.json = new Proxy(res.json, {
          apply(target, response, args) {
            const promise = Reflect.apply(target, response, args);
            promise.then(async data => {
              try {
                const parsedData = JSON.parse(data);
                await assignState(parsedData, response.url);
              } catch {}
            });
            return promise;
          }
        });
        res.text = new Proxy(res.text, {
          apply(target, response, args) {
            const promise = Reflect.apply(target, response, args);
            promise.then(async data => {
              try {
                const parsedData = JSON.parse(data);
                await assignState(parsedData, response.url);
              } catch {}
            });
            return promise;
          }
        });
      }
    });
    return response;
  }
});
