let switchdom = document.getElementById("switch");

chrome.browserAction.getBadgeText({}, (res) => {
  if (res !== "") {
    switchdom.checked = true;
  }
});

switchdom.onchange = function () {
  if (switchdom.checked) {
    chrome.browserAction.setBadgeText({ text: "ON" });
  } else {
    chrome.browserAction.setBadgeText({ text: "" });
  }
  sendMessageToContentScript(
    { cmd: "switch", value: switchdom.checked }
  );
};

function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      if (callback) callback(response);
    });
  });
}

