
import styled from 'styled-components';
import Box from 'components/Box';
import Logo from 'assets/icons/logo.svg';
import Button from '@mui/material/Button';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Example = styled.div`
  color: ${props => props.theme.palette.primary};
  font-size: 20px;
  text-align: center;
`;

export default () => {
  const greeting = chrome.i18n.getMessage('greeting');
  const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    console.log("hello logi")
    useEffect(() => {
    console.log("hello login passw")

        const hasAccount = localStorage.getItem('password');
        if (hasAccount) {
            navigate('/Login');
        }
    }, []);

    const createAccount = () => {
        navigate('/Signup');
    };
    const importSeedPhrase = () => {
        // navigate('/Importwallet');
    };

  return (
    <Example>
  <Box display="flex" flexDirection="column" alignItems="center">
    <div>
      <Logo width="50px" height="50px" />
      {greeting}
    </div>
    <div className="my-2 m-3">
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <Button variant="contained" className="btn btn-primary mb-2" onClick={createAccount}>
        Create new Wallet
      </Button>
      <Button variant="contained" className="btn btn-primary mb-2" onClick={importSeedPhrase}>
        Import existing wallet
      </Button>
    </div>
  </Box>
</Example>

  );
};


