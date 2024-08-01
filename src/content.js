import 'libs/polyfills';
import React from 'react';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import NoteState from "./context/NoteState";
import Signup from "./components/Signup";
import ReactDOM from 'react-dom';
import {connectToWalletListner} from "kalp-wallet-extension-pkg";

connectToWalletListner();

//diconnect demo
// contentScript.js

async function handleEvent(event) {
  console.log("handle event start");
  if (event.source === window && event.data.type === "DISCONNECT_WALLET") {
    console.log("handle event middle");
    await chrome.runtime.sendMessage({ type: "DISCONNECT_WALLET" });
  }
  console.log("handle event end");
}
// handleEvent();
window.addEventListener("message", handleEvent);



const styleContainer = document.createElement('div');
const appContainer = document.createElement('div');

// shadow.appendChild(styleContainer);
// shadow.appendChild(appContainer);

document.body.appendChild(root);

const App = () => {
  return (
    <>
    </>
  );
};

ReactDOM.render(<App />, appContainer);