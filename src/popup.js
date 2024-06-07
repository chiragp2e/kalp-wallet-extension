import 'libs/polyfills';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import Box from 'components/Box';
import Example from 'components/Example';
import defaultTheme from 'themes/default';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import NoteState from "./context/NoteState";
import Signup from "./components/Signup";

import Asset from "./components/Asset";
import Login from "./components/Login";
import HomePage from "./components/HomePage";
import Permission from "./components/Permission";
import TransactionLogin from './components/TransactionLogin';

const Popup = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box width="200px" padding={3}>
        
        <NoteState>
        <Router>
          <Routes>
            <Route exact path="/" element={<Example />} />
            <Route exact path="/Signup" element={<Signup />} />
            {/* <Route exact path="/Seedphrase" element={<Seedphrase />} />
            <Route exact path="/Importwallet" element={<Importwallet />} /> */}
            <Route exact path="/Login" element={<Login />} />
            <Route exact path="/TransLogin" element={<TransactionLogin />} />
            <Route exact path="/HomePage" element={<HomePage />} />
            <Route exact path="/Asset" element={<Asset />} />
            <Route exact path="/Permission" element={<Permission />} />
          </Routes>
        </Router>
      </NoteState>
      </Box>
    </ThemeProvider>
  );
};

const root = document.createElement('div');
document.body.appendChild(root);

ReactDOM.render(<Popup />, root);
