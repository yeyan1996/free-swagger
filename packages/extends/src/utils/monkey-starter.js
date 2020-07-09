import { createDom } from "./dom-utils";

const cdnList = [
  "https://sf16-eacdn-tos.pstatp.com/obj/eaoffice/prettier/standalone.js",
  "https://sf16-eacdn-tos.pstatp.com/obj/eaoffice/prettier/parser-babylon.js",
  "https://sf16-eacdn-tos.pstatp.com/obj/eaoffice/prettier/parser-typescript.js"
];

export const start = (mountElementId, prepareFns = []) =>
  new Promise(async resolve => {
    document.body.appendChild(createDom("div", { id: mountElementId }));
    await Promise.all(prepareFns.map(fn => fn?.()));
    resolve();
  });

export const onload = () =>
  new Promise(resolve => {
    window.addEventListener("load", () => {
      resolve();
    });
  });

export const injectCdn = () => {
  const fragment = document.createDocumentFragment();
  cdnList.forEach(url => {
    fragment.appendChild(
      createDom("script", {
        src: url
      })
    );
  });
  document.head.appendChild(fragment);
};
