import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import {
  Network,
  createCsr,
  getEnrollmentId,
  getKeyPairFromSeedPhrase,
  getSecret,
  enrollCsr,
} from 'kalp-wallet-extension-pkg';

export default function ImportSeedphrase() {
  const [seedphrase, setSeedphrase] = useState(''); // State for seedphrase input
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState(''); // State for error message
  const navigate = useNavigate(); // For navigation

  console.log('new seedphrase started');
  const handleChange = event => {
    setSeedphrase(event.target.value);
    setErrorMessage(''); // Clear any previous error message on input change
  };

  async function backPage() {
    navigate('/');
  }

  const handleSubmit = async event => {
    event.preventDefault(); // Prevent default form submission behavior

    const words = seedphrase.trim().split(' ');
    console.log('words', words);
    if (words.length !== 12) {
      setErrorMessage('Seedphrase must contain exactly 12 words.');
    } else {
      console.log(`seedphrase is :${seedphrase}`);
      // Handle valid seedphrase (security note: DO NOT store seedphrase in browser storage)
      console.log('Seedphrase:', words); // Log for debugging purposes (remove in production)
      const { pemPublicKey, pemPrivateKey } = await getKeyPairFromSeedPhrase(seedphrase);
      console.log(`public is ${pemPublicKey}`);
      console.log(`private is ${pemPrivateKey}`);
      const enrollmentID = await getEnrollmentId(pemPublicKey);
      console.log(`enrollmentID is :${enrollmentID}`);
      const createCSRKey = createCsr(enrollmentID, pemPrivateKey, pemPublicKey);
      console.log(`createCSRKey is :${createCSRKey}`);

      
      const endpoint = 'https://dev-userreg-gov.p2eppl.com/v1/pki/isuserregistered';
      const headers = {
        Authorization: 'f5b1aca0717e01d0dbca408d281e9e5145250acb146ff9f0844d53e95aab30b5',
      };
      const body = {
        enrollmentid: enrollmentID,
        channel: 'kalpstagenet',
      };
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const jsonData = await response.json();
        const finalResponse = JSON.stringify(jsonData);
        console.log(`error :${finalResponse}`);
        setMessage(finalResponse);
        setTimeout(()=>{
          navigate('/');
        },3000)
        
      }
      
      const jsonData = await response.json();
      const finalResponse = JSON.stringify(jsonData);
      console.log(`response from isenrollmentid : ${finalResponse}`);

      const userSecret = await getSecret(enrollmentID);
      console.log(`secret is :${userSecret}`);

      const certificate = await enrollCsr(Network.Stagenet, enrollmentID, userSecret, createCSRKey);
      console.log(`Certificate: ${certificate}`);
      localStorage.setItem('enrollmentId', enrollmentID);
      localStorage.setItem('csr', createCSRKey);
      localStorage.setItem('privateKey', pemPrivateKey);
      localStorage.setItem('publicKey', pemPublicKey);
      localStorage.setItem('cert', certificate);
      navigate('/Signup'); // Navigate to the homepage
    }
  };

  // Inline styles
  const containerStyle = {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,.1)',
    margin: '20px auto',
    maxWidth: '500px',
    padding: '20px',
    position: 'relative',
    top: ' 5rem',
    height: '14rem',
  };

  const labelStyle = {
    fontWeight: 'bold',
  };

  const textareaStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    borderColor: '#ced4da',
  };

  const buttonStyle = {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    cursor: 'pointer',
    borderRadius: '4px',
    border: 'none',
  };

  const errorStyle = {
    color: '#dc3545',
    marginTop: '10px',
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="seedphrase" style={labelStyle}>
            Enter your Seedphrase
          </label>
          <textarea
            style={textareaStyle}
            id="seedphrase"
            rows="3"
            value={seedphrase}
            onChange={handleChange}
            placeholder="Enter your 12-word seedphrase (separated by spaces)"
          />
          {errorMessage && <div style={errorStyle}>{errorMessage}</div>}
        </div>
        <button type="submit" style={buttonStyle}>
          Submit
        </button>
        <button style={buttonStyle} onClick={backPage}>
          Cancel
        </button>
        <div>{message}</div>
      </form>
    </div>
  );
}
