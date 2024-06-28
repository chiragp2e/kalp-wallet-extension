/* global chrome */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import {
  Network,
  registerAndEnrollUser,
  createCsr,
  getEnrollmentId,
  getKeyPairFromSeedPhrase,
  getSeedPhrase,
} from 'kalp-wallet-extension-pkg';

const Example = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const saltRounds = 10;

  async function keyPair() {
    const pemPrivateKey = localStorage.getItem('privateKey');
    const pemPublicKey = localStorage.getItem('publicKey');
    const enrollmentID = await getEnrollmentId(pemPublicKey);
    console.log('EnrollmentId:', enrollmentID);
    const createCSRKey = createCsr(enrollmentID, pemPrivateKey, pemPublicKey);
    localStorage.setItem('enrollmentId', enrollmentID);
    localStorage.setItem('csr', createCSRKey);
    console.log('Public Key in PEM format:', pemPublicKey);
    console.log('Private Key in PEM format:', pemPrivateKey);
    console.log('Enrollment Id:', enrollmentID);
    console.log('csr:', createCSRKey);
  }

  const callAPI = async () => {
    try {
      await keyPair();
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log(`final encrypt password is :${hashedPassword}`);
      localStorage.setItem('password', hashedPassword);
      const enrollmentID = localStorage.getItem('enrollmentId');
      const createCSRKey = localStorage.getItem('csr');
      console.log(`enrollment id is :${enrollmentID} and csr:${createCSRKey}`);
      const certificate = await registerAndEnrollUser(Network.Stagenet, enrollmentID, createCSRKey);
      console.log(`registerAndEnrollUser data :${certificate}`);
      localStorage.setItem('cert', certificate);
      navigate('/Permission');
    } catch (error) {
      throw Error(error);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

    if (!password.trim()) {
      setErrorMessage('Please enter a password.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (!password.match(passwordRegex)) {
      setErrorMessage(
        'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, and 1 special character.'
      );
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    } else {
      if (localStorage.getItem('cert')) {
        console.log('right inside');
        async function createPassword() {
          const salt = await bcrypt.genSalt(saltRounds);
          const hashedPassword = await bcrypt.hash(password, salt);
          console.log(`final encrypt password is :${hashedPassword}`);
          localStorage.setItem('password', hashedPassword);
          navigate('/HomePage');
        }
        createPassword();
      } else {
        console.log('example usage call');
        callAPI();
        console.log('call api');
      }
    }
  };

  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = event => {
    setConfirmPassword(event.target.value);
  };

  const containerStyle = {
    backgroundColor: '#f8f9fa',
    padding: '21px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,.1)',
    maxWidth: '500px',
    margin: '0 auto',
    marginTop: '36px',
    textAlign: 'center',
    position: 'relative',
    left: '1rem',
    height: '21rem',
    width: '15rem',
  };

  const formGroupStyle = {
    marginBottom: '20px',
  };

  const formLabelStyle = {
    display: 'block',
    marginBottom: '5px',
    color: '#777',
  };

  const formControlStyle = {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '4px',
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
  };

  const errorStyle = {
    color: '#c0392b',
    marginTop: '10px',
  };

  return (
    <div style={containerStyle}>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label htmlFor="exampleInputPassword1" style={formLabelStyle}>
            Password
          </label>
          <input
            type="password"
            style={formControlStyle}
            id="exampleInputPassword1"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <div style={formGroupStyle}>
          <label htmlFor="exampleInputPassword2" style={formLabelStyle}>
            Confirm Password
          </label>
          <input
            type="password"
            style={formControlStyle}
            id="exampleInputPassword2"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
          />
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <button type="submit" style={buttonStyle}>
            Submit
          </button>
        </div>
        {errorMessage &&
          errorMessage.split('\n').map((error, index) => (
            <p key={index} style={errorStyle}>
              {error}
            </p>
          ))}
      </form>
    </div>
  );
};

export default Example;
