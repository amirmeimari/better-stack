let toggle = true;

chrome.browserAction.onClicked.addListener((tab) => {
  toggle = !toggle;  
  chrome.browserAction.setIcon({path: (toggle ? "icons/icon_16x16.png" : "icons/icon_16x16.png")});
  chrome.tabs.sendMessage(tab.id, toggle);
});

chrome.runtime.onMessage.addListener((request, sender, callback) => {
  if (request.reload) callback(toggle);
});
