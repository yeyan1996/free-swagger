browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("request", request);
  console.log("sender", sender);
  console.log("sendResponse", sendResponse);
  console.log("Hello from the background");
  browser.tabs.executeScript({
    code: ``,
  });
});
