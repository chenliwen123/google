chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  chrome.browserAction.getBadgeText({}, (res) => {
    if (res !== "") {
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id,  { cmd: "status", value:true }, function (response) {
				});
			});
    }
  });
});
