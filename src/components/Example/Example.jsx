import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Example = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const hasAccount = localStorage.getItem('password');
    if (hasAccount) {
      navigate('/Login');
    }
  }, [navigate]);

  const createAccount = () => {
    navigate('/Signup');
  };

  const importSeedPhrase = () => {
    navigate('/Importwallet');
  };

  // const containerStyle = {
  //   backgroundColor: '#3f83ab80',
  //   border: '1px solid #0a2fa748',
  //   borderRadius: '8px',
  //   boxShadow: '0 0 10px rgba(0,0,0,.1)',
  //   margin: '0 auto',
  //   maxWidth: '400px',
  //   padding: '80px',
  //   textAlign: 'center'
  // };

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
    position: 'relative',
    top: '6rem',
    left: '5rem',
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
