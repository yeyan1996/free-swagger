import { Message } from "element-ui";

export function createDom(type, props, style) {
  const dom = document.createElement(type);
  Object.assign(dom, props);
  Object.assign(dom.style, style);
  return dom;
}

function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}

export function highlightDOM(el, highlightClass, timeout = 3000) {
  if (!isElement(el)) {
    return;
  }
  const lastId = el.getAttribute("__t");
  if (lastId) {
    clearTimeout(lastId);
    el.setAttribute("__t", "");
  }
  if (!el.classList.contains(highlightClass)) {
    el.classList.add(highlightClass);
  }
  const timeId = setTimeout(() => {
    el.classList.remove(highlightClass);
    el.setAttribute("__t", "");
  }, timeout);
  el.setAttribute("__t", timeId);
}

export const copyMessage = message => {
  if (!message) {
    throw new Error("无内容");
  }
  if (typeof message === "object") {
    message = JSON.stringify(message);
  }
  const input = document.createElement("textarea");
  input.id = "fake-input";
  input.value = message;
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  Message.success("复制成功");
  document.body.removeChild(input);
};
