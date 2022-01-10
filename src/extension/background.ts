/// <reference types="chrome"/>

const ANGULAR_HTML_URL = "/index.html";

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function ({reason}) {
  if (reason === "install") {
    chrome.tabs.create({
      url: chrome.runtime.getURL(ANGULAR_HTML_URL + '/#/welcome')
    });
  }
});

// chrome.tabs.onActivated.addListener(function({tabId}) {
//   chrome.tabs.query({active: true, currentWindow: true},function(tabs) {
//     if (tabs[0].id === tabId) {
//       chrome.tabs.sendMessage(tabId, {payload: tabId}, function(response) {});
//     }
//   });
// });

