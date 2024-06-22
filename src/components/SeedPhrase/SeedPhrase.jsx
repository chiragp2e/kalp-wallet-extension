import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Network,
  registerAndEnrollUser,
  createCsr,
  getEnrollmentId,
  getKeyPairFromSeedPhrase,
  getSeedPhrase,
} from 'test-kalp-wallet-package';

export default function SeedPhrase() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState('');
  const [seedPhrase, setSeedPhrase] = useState(''); // Replace with actual seed phrase

  async function keyPair() {
    const seed = await getSeedPhrase();
    console.log(`seed is ${seed}`);
    setSeedPhrase(seed);
    const { pemPublicKey, pemPrivateKey } = await getKeyPairFromSeedPhrase(seed);
    localStorage.setItem('privateKey', pemPrivateKey);
    localStorage.setItem('publicKey', pemPublicKey);
  }
  useEffect(() => {
    keyPair();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(seedPhrase)
      .then(() => {
        setMessage('Seed phrase copied to clipboard');
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      })
      .catch(err => {
        console.error('Failed to copy seed phrase: ', err);
        setMessage('Failed to copy seed phrase');
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      });
  };
  const handleNext = () => {
    navigate('/Signup'); // Replace with your actual next page route
  };

  const handleCancel = () => {
    navigate('/');
  };

  const containerStyle = {
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    margin: '0 auto',
    maxWidth: '400px',
    padding: '20px',
    textAlign: 'center',
    position: 'relative',
    top: '4rem',
    height: '21rem',
  };

  const seedPhraseStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '20px',
    backgroundColor: '#fff',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#3498dbd0',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    margin: '10px',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
  };

  return (
    <div style={containerStyle}>
      <h2>Seed Phrase</h2>
      <div style={seedPhraseStyle}>{seedPhrase}</div>
      <button style={buttonStyle} onClick={copyToClipboard}>
        Copy Seed Phrase
      </button>
      <div>{message}</div>

      <div style={buttonContainerStyle}>
        <button style={buttonStyle} onClick={handleCancel}>
          Cancel
        </button>
        <button style={buttonStyle} onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}
