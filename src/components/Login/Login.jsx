/* global chrome */
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

export default () => {
  console.log('hello login');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const storedPassword = localStorage.getItem('password');
  const publicCertificate = localStorage.getItem('cert');
  const handlePasswordChange = event => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    chrome.storage.local.get('isAuthenticated', result => {
      console.log('isAuthenticated :', result.isAuthenticated);
      setIsAuthenticated(result.isAuthenticated);
      // if (!result.isAuthenticated) {
      //   console.log('not register yet 1:', isAuthenticated);
      // } else if (isAuthenticated) {
      //   console.log('isAuthenticated in else :', isAuthenticated);
      if (result.isAuthenticated == true) {
        console.log('inside true');
        navigate('/HomePage');
      } else {
        console.log('not register yet 2:', result.isAuthenticated);
      }
      // }
    });
  }, []);

  const handleLoginClick = async () => {
    const isMatch = await bcrypt.compare(password, storedPassword);
    console.log(`match: ${isMatch}`);
    try {
      if (!password) {
        setErrorMessage('Please enter your password.');
        return;
      }
      if (!storedPassword) {
        setErrorMessage('No password stored. Please sign up first.');
        return;
      }
      if (isMatch) {
        chrome.storage.local.set({ isAuthenticated: true }, () => {
          console.log('isAuthenticated activate');
        });
        navigate('/Permission');
      } else {
        setErrorMessage('Incorrect password. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while logging in.');
    }
  };

  // Define CSS styles as JavaScript objects
  const containerStyle = {
    border: '1px solid #0a2fa748',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,.1)',
    margin: '0 auto',
    maxWidth: '400px',
    padding: '80px',
    textAlign: 'center', // Center align text
    position: ' relative',
    width: '10rem',
    height: '18rem',
  };

  const loginFormStyle = {
    textAlign: 'center',
  };

  const formGroupStyle = {
    marginBottom: '20px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    color: '#777',
    // color: rgb(36 32 32);
    position: 'relative',
    top: '1rem',
    fontSize: '1.5rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    border: '1px solid #ccc',
    borderRadius: '4px',
    position: 'relative',
    left: '-3rem',
    top: '2rem',
    width: '16rem',
  };

  const errorStyle = {
    color: '#c0392b',
    marginTop: '10px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#3498dbd0',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    position: 'relative',
    width: '9rem',
    top: '2rem',
  };

  return (
    <>
      <div className="container" style={containerStyle}>
        <h1>LOGIN</h1>
        <div className="login-form" style={loginFormStyle}>
          <div className="form-group mb-3" style={formGroupStyle}>
            <label htmlFor="exampleInputPassword1" className="form-label" style={labelStyle}>
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              value={password}
              onChange={handlePasswordChange}
              required
              style={inputStyle}
            />
          </div>
          {errorMessage && (
            <p className="error" style={errorStyle}>
              {errorMessage}
            </p>
          )}
          <div className="d-flex justify-content-center align-items-center">
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleLoginClick}
              style={buttonStyle}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
