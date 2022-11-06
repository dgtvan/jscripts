chrome.browserAction.onClicked.addListener(function() {
  var win = window.open(chrome.extension.getURL('index.html')); 
});

chrome.contextMenus.create({
  id: 'save',
  title: 'Save',//chrome.i18n.getMessage('openContextMenuTitle'),
  contexts: ['link'],
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  chrome.tabs.sendMessage(tab.id, {type: "chrome.contextMenus.onClicked", data: {info: info, tab: tab}}, function(response) {
    // console.log(response);
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (sender.tab) {
    if (request.type == MESSAGE_TYPES.TABS_INSERT_CSS) {
      var data = request.data;
      chrome.tabs.insertCSS(sender.tab.id, data.details, function(results) {
        sendResponse(results)
      });

      return true
    }
    else if (request.type == MESSAGE_TYPES.TABS_EXECUTE_SCRIPT) {
      var data = request.data;
      chrome.tabs.executeScript(sender.tab.id, data.details, function(results) {
        sendResponse(results)
      });

      return true
    }
  };
});
// chrome.tabs.onUpdated.addListener.addListener(function(tab) {
//   chrome.tabs.sendMessage(tab.id, {type: "", data: {tab: tab}}, function(response) {
//     // console.log(response);
//   });
// });