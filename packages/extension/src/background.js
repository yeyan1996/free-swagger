const KEY = "FREE_SWAGGER_EXTENSION";
const { isObject } = require("lodash");

const createIdByTab = (tab) => {
  const { origin, pathname } = new URL(tab.url);
  return `${origin + pathname}`;
};

const findIdByUrl = (url) => {
  if (!url) return "";
  const { origin, pathname } = new URL(url);
  return (
    Object.keys(getMap() ?? {}).find((item) =>
      item.startsWith(origin + pathname)
    ) ?? ""
  );
};

const getMap = () => {
  const map = localStorage.getItem(KEY);
  if (!map) {
    return null;
  }
  try {
    return JSON.parse(map);
  } catch (e) {
    return null;
  }
};

const get = (key) => {
  const map = getMap();
  if (!map) {
    return null;
  }
  if (!key) return map;
  try {
    return map[key];
  } catch (e) {
    return null;
  }
};

const set = (key, val) => {
  const map = getMap();
  const item = isObject(map?.[key]) ? { ...map[key], ...val } : val;
  const newMap = map ? { ...map, [key]: item } : { [key]: val };
  return localStorage.setItem(KEY, JSON.stringify(newMap));
};

const remove = (key) => {
  const map = getMap() ?? {};
  delete map[key];
  return localStorage.setItem(KEY, JSON.stringify(map));
};

const setOpen = (key) => {
  return set(key, { isOpen: true });
};

const setClose = (key) => {
  return remove(key);
};

const iconClick = (tab) => {
  const id = findIdByUrl(tab.url);
  const item = get(id);
  if (!item || !item.isOpen) {
    setOpen(createIdByTab(tab));
  } else {
    setClose(createIdByTab(tab));
  }
  chrome.tabs.reload(tab.id);
};

const updateIcon = (id) => {
  const item = get(id);
  // 开启 icon
  if (item?.isOpen) {
    chrome.browserAction.setIcon({
      path: "https://z3.ax1x.com/2021/08/08/fQE0qs.png",
    });
    return;
  }
  // 关闭 icon
  chrome.browserAction.setIcon({
    path: "https://z3.ax1x.com/2021/08/08/fQEYPf.png",
  });
};

const update = (tab) => {
  const id = findIdByUrl(tab.url);
  updateIcon(id);
  const item = get(id);
  if (!item || !item.isOpen) return;
  chrome.tabs.executeScript({
    code: `
        if(!window.FREE_SWAGGER_EXTENSION_ACTIVE) {
          window.FREE_SWAGGER_EXTENSION_ACTIVE = true
          const url =
            'https://cdn.jsdelivr.net/npm/free-swagger-userscript/dist/userScript.js'
          const script = document.createElement('script')
          script.setAttribute('src', url)
          document.getElementsByTagName('head')[0].appendChild(script)
        }
`,
  });
};

const onActivated = async () => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    ([currentTab]) => {
      return update(currentTab);
    }
  );
};

const onCreated = (tab) => {
  return update(tab);
};
const onUpdated = (tabId, statusObj, tab) => {
  return update(tab);
};

chrome.browserAction.onClicked.removeListener(iconClick);
chrome.browserAction.onClicked.addListener(iconClick);

chrome.tabs.onActivated.removeListener(onActivated);
chrome.tabs.onActivated.addListener(onActivated);

chrome.tabs.onCreated.removeListener(onCreated);
chrome.tabs.onCreated.addListener(onCreated);

chrome.tabs.onUpdated.removeListener(onUpdated);
chrome.tabs.onUpdated.addListener(onUpdated);
