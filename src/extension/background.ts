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
const x = 444;

console.log('init2')

// chrome.webNavigation.onCompleted.addListener(() => {
//   chrome.tabs.query({ active: true, currentWindow: true }, ([{ id }]) => {
//     if (id) {
//       // chrome.pageAction.show(id);
//
//     }
//   });
// }, { url: [{ urlMatches: '*' }] });

/*// Отслеживаем изменения, можно удалить
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. ' +
      'Old value was "%s", new value is "%s".',
      key,
      namespace,
      storageChange.oldValue,
      storageChange.newValue);
  }
});*/
