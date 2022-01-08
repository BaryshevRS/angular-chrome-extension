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

// chrome.webNavigation.onCompleted.addListener(() => {
//   chrome.tabs.query({ active: true, currentWindow: true }, ([{ id }]) => {
//     if (id) {
//       // chrome.pageAction.show(id);
//
//     }
//   });
// }, { url: [{ urlMatches: '*' }] });

// Отслеживаем изменения
const storageHandler = function(changes: any, namespace: any) {
  for (var key in changes) {
    var storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. ' +
      'Old value was "%s", new value is "%s".',
      key,
      JSON.stringify(changes),
      storageChange.oldValue,
      storageChange.newValue);
  }
}
chrome.storage.onChanged.addListener(storageHandler);

// chrome.storage.onChanged.removeListener(storageHandler);
