const KEY = "FREE_SWAGGER_CHROME";

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
  const newMap = map ? { ...map, [key]: val } : { [key]: val };
  return localStorage.setItem(KEY, JSON.stringify(newMap));
};

const setOpen = (key) => {
  return set(key, { isOpen: true });
};

const setClose = (key) => {
  return set(key, { isOpen: false });
};

const iconClick = (tab) => {
  const item = get(tab.id);
  if (!item || !item.isOpen) {
    setOpen(tab.id);
  } else {
    setClose(tab.id);
  }
  chrome.tabs.reload(tab.id);
};

const setIcon = ({ tabId }) => {
  if (!tabId) return;
  const item = get(tabId);
  // 开启 icon
  if (item?.isOpen)
    return chrome.browserAction.setIcon({
      path: "https://z3.ax1x.com/2021/08/08/fQE0qs.png",
    });
  // 关闭 icon
  chrome.browserAction.setIcon({
    path: "https://z3.ax1x.com/2021/08/08/fQEYPf.png",
  });
};

chrome.runtime.onMessage.addListener((request, sender) => {
  setIcon({ tabId: sender.tab.id });
  console.log("request", request);
  console.log("sender", sender);
  if (request.type === "SIGN_CONNECT") {
    const item = get(sender.tab.id);
    console.log("item", item);
    if (!item || !item.isOpen) return;
    chrome.tabs.executeScript({
      code: `
        console.log('free-swagger-chrome start')
        const url =
          'https://cdn.jsdelivr.net/npm/free-swagger-extends/dist/userScript.js'
        const script = document.createElement('script')
        script.setAttribute('src', url)
        document.getElementsByTagName('head')[0].appendChild(script)
`,
    });
  }
});

chrome.browserAction.onClicked.removeListener(iconClick);
chrome.browserAction.onClicked.addListener(iconClick);

chrome.tabs.onActivated.removeListener(setIcon);
chrome.tabs.onActivated.addListener(setIcon);
