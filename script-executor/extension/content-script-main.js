// Load script from storage, and execute
Extension = (function () {
  function Extension() {}

  Extension.prototype.addScript = function (src) {
    var s = document.createElement('script');
    s.src = src;
    document.body.appendChild(s);
  };

  Extension.prototype.onReadyComplete = null;
  Extension.prototype.insertCSS = function (details, callback) {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.TABS_INSERT_CSS, 
      data: {
        details: details
      }
    }, callback);
  };

  Extension.prototype.executeScript = function (details, callback) {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.TABS_EXECUTE_SCRIPT, 
      data: {
        details: details
      }
    }, callback);
  };
  Extension.prototype.executeScriptFromURL = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = function () {
      this.executeScript({
          code: xhr.responseText
        }, callback);
    }.bind(this);
    xhr.send();
  };
  return new Extension();
})();

chrome.storage.local.get('script', function (data) {
  var __script = data['script'];
  if (__script) {
    Extension.executeScript({
        code: __script
    });
  }

  var __interval = setInterval(function () {
    if (document.readyState == 'complete') {
      clearInterval(__interval);
      if (Extension.onReadyComplete) {
        Extension.onReadyComplete();
      }
    }
  }, 500);
});

