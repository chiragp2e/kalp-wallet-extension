import 'libs/polyfills';
import React from 'react';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import NoteState from "./context/NoteState";
import Signup from "./components/Signup";
import ReactDOM from 'react-dom';
import {connectToWalletListner} from "kalp-wallet-pkg";


const root = document.createElement('div');
const shadow = root.attachShadow({ mode: 'open' });
function sendMessageToDapp(type, data) {
  window.postMessage({ type: type, payload: data }, "*");
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "FROM_BACKGROUND") {
    console.log("Received message in content script:", message.data);
    window.postMessage({ type: "FROM_EXTENSION", message: message.data }, "*");
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "FROM_BACKGROUND_ASSET_CREATED") {
    console.log("Received message in content script:", message.data);
    window.postMessage(
      {
        type: "FROM_EXTENSION_ASSET",
        message: `New asset created: ${message.data}`,
      },
      "*"
    );
  }
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SIMPLE_MESSAGE") {
    console.log("Received message in background script:", message);
  }
});
chrome.runtime.onMessage.addListener((message) => {
  if (message.jsonrpc && message.method) {
    console.log("Received request from DApp:", message); // Log for debugging
    if (message.method === "eth_requestAccounts") {
      // Simulate provider response (replace with actual provider communication logic)
      const response = {
        jsonrpc: "2.0",
        id: message.id,
        result: ["account1", "account2"], // Example accounts (replace with actual logic)
      };
      window.postMessage(response, message.source);
    }
  }
});
async function handleEvent(event) {
  if (event.source === window && event.data.type === "OPEN_WALLET") {
    await chrome.runtime.sendMessage({ type: "SEND_TO_POPUP" });
  } else if (event.source === window && event.data.type === "FORM_DATA") {
    //transactionType,channelName,chainCodeName,transactionName, transactionParams
    const transactionType = event.data.transactionType;
    const channelName = event.data.channelName;
    const chainCodeName = event.data.chainCodeName;
    const transactionName = event.data.transactionName;
    const transactionParams = event.data.transactionParams;

    console.log(
      "content script received transaction request",
      transactionType,
      channelName,
      chainCodeName,
      transactionName,
      transactionParams
    );
    // Use Promise.all to open the wallet and send the data simultaneously
    await Promise.all([
      chrome.runtime.sendMessage({
        type: "FORM_SEND_TO_POPUP",
        content: {
          transactionType,
          channelName,
          chainCodeName,
          transactionName,
          transactionParams,
        },
      }),
      chrome.runtime.sendMessage({ type: "SEND_TO_POPUP" }),
    ]);
  }
}

const handleRegisterDAppIDProvider = async (event) => {
  const functionInfo = JSON.parse(event.detail);
  var dappId = functionInfo.dappId;
  window.addEventListener(`kalp:${dappId}`, handleKalpWalletProvider);
};

window.addEventListener("kalp:registerDappID", handleRegisterDAppIDProvider);


function sendMessageToFrontend() {
  window.postMessage(
    { type: "kalp_wallet", message: "Kalp Wallet message" },
    "*"
  );
}
sendMessageToFrontend();

chrome.runtime.sendMessage({
  type: "messageFromContentScript", // This defines the type of message
  data: "This is a message from the content script!", // This is the data you want to send
});
window.addEventListener("message", handleEvent);

connectToWalletListner();
const styleContainer = document.createElement('div');
const appContainer = document.createElement('div');

shadow.appendChild(styleContainer);
shadow.appendChild(appContainer);

document.body.appendChild(root);

const App = () => {
  return (
    <>
    </>
  );
};

ReactDOM.render(<App />, appContainer);