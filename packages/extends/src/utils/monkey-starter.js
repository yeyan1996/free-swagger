import { createDom } from "./dom-utils";

const cdnList = [
  "https://unpkg.com/prettier@2.2.1/standalone.js",
  "https://unpkg.com/prettier@2.2.1/parser-babel.js",
  "https://unpkg.com/prettier@2.2.1/parser-typescript.js"
];

export const start = (mountElementId, prepareFns = []) =>
  new Promise(async resolve => {
    document.body.appendChild(createDom("div", { id: mountElementId }));
    await Promise.all(prepareFns.map(fn => fn?.()));
    resolve();
  });

export const injectCdn = () =>
  new Promise(resolve => {
    let count = 0;
    const fragment = document.createDocumentFragment();
    cdnList.forEach(url => {
      const dom = createDom("script", {
        src: url
      });
      dom.onload = () => {
        count++;
        if (count === cdnList.length) {
          resolve();
        }
      };
      fragment.appendChild(dom);
    });
    document.head.appendChild(fragment);
  });
