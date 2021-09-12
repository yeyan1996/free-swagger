import { Message } from "element-ui";
import ah from "ajax-hook";
import SwaggerParser from "@apidevtools/json-schema-ref-parser";
import { cloneDeep } from "lodash-es";
import { wait } from "@/utils/index";
import youngParse from "./youngParse";

let ok = false;

export const assignSwagger = async (swagger, url) => {
  const { state } = await import("@/state");
  try {
    if (!swagger?.swagger) return;
    ok = true;
    state.swagger = swagger;
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
      await wait();
      try {
        if (typeof xhr.response !== "string") return;
        await assignSwagger(youngParse(xhr.response), xhr.responseURL);
      } catch (err) {
        console.error(err);
        console.error(`JSON.parse 发生错误，请检查 json 是否规范：`);
        console.log(xhr.response);
      }
    }, 500);
  }
});

// fetch hooks
window.fetch = new Proxy(fetch, {
  apply(...args) {
    if (ok) return Reflect.apply(...args);
    const response = Reflect.apply(...args);
    response
      .then(async res => {
        if (res.ok) {
          const apply = (target, response, args) => {
            const promise = Reflect.apply(target, response, args);
            promise.then(async data => {
              try {
                if (typeof data !== "string") return;
                await assignSwagger(youngParse(data), response.url);
              } catch (err) {
                console.error(err);
                console.error(`JSON.parse 发生错误，请检查 json 是否规范：`);
                console.log(data);
              }
            });
            return promise;
          };
          res.json = new Proxy(res.json, {
            apply
          });
          res.text = new Proxy(res.text, {
            apply
          });
        }
      })
      .catch(err => console.error(err));
    return response;
  }
});
