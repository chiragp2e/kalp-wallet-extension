import 'libs/polyfills';
import React from 'react';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import NoteState from "./context/NoteState";
import Signup from "./components/Signup";
import ReactDOM from 'react-dom';
import {connectToWalletListner} from "kalp-wallet-extension-pkg";

connectToWalletListner();
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