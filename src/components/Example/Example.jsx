import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Example = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'PERMISSION_GRANTED') {
        console.log('Received message from background regarding permission script:');
        navigate('/HomePage');
      }
    });
    const hasAccount = localStorage.getItem('password');
    if (hasAccount) {
      navigate('/Login');
    }
  }, [navigate]);

  const createAccount = () => {
    navigate('/SeedPhrase');
  };

  const importSeedPhrase = () => {
    navigate('/ImportSeedphrase');
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#3498dbd0',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    margin: '10px 0',
    position: 'relative',
    top: '3rem',
    left: '5rem',
    position: 'relative',
    top: '6rem',
    left: '5rem',
  };
  const buttonStyle2 = {
    padding: '10px 20px',
    backgroundColor: '#3498dbd0',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    margin: '10px 0',
    position: 'relative',
    top: '6rem',
    left: '5rem',
  };
  const heading1 = {
    color: '#333',
    position: 'relative',
    top: '6rem',
    right: '-7rem',
  };

  const errorStyle = {
    color: '#c0392b',
    marginTop: '10px',
  };

  return (
    <div>
      <h1 style={heading1}>Welcome</h1>
      {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
      <button style={buttonStyle} onClick={createAccount}>
        Create new Wallet
      </button>
      <button style={buttonStyle2} onClick={importSeedPhrase}>
        Import existing wallets
      </button>
    </div>
  );
};

export default Example;
