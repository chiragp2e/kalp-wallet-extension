// messageHandler.js
function sendMessageToBackground(type, data) {
    chrome.runtime.sendMessage({ type, data });
  }
  function addMessageListenerFromBackground(callback) {
    chrome.runtime.onMessage.addListener(callback);
}


window.addMessageListenerFromBackground = addMessageListenerFromBackground;
window.sendMessageToBackground = sendMessageToBackground;