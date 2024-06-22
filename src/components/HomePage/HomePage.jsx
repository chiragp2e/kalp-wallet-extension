/* global chrome */
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { evaluateTransaction, Network } from 'test-kalp-wallet-package';

const HomePage = () => {
  const [alert, setAlert] = useState('Connected');
  const [responseMessage, setResponseMessage] = useState('No asset Created');
  const [gasAmount, setGasAmount] = useState(null);
  const navigate = useNavigate();

  const setAlertFunction = () => {
    setAlert('Disconnected');
    localStorage.removeItem('key');
    navigate('/Login');
  };

  // const enrollmentId = localStorage.getItem("enrollmentId");
  // window.sendMessageToBackground("POPUP_TO_BACKGROUND", enrollmentId);

  console.log('from frontend incoming');

  // Set gas amount
  function updateGasAmount() {
    const gasFees = 1;
    setGasAmount(gasFees);
  }

  const handleCreateAsset = async () => {
    const itemsCreated = JSON.parse(localStorage.getItem('assets')) || [];
    console.log('All Items Created:', itemsCreated);
    const formattedItems = itemsCreated.map((item, index) => `${index + 1}) ${item}`);
    setResponseMessage(formattedItems.join('<br />'));
  };

  //testing for window.event
  const setringData = async (
    channelName1,
    chainCodeName1,
    transactionNameBalance,
    transactionParams
  ) => {
    try {
      const enrollmentID = localStorage.getItem('enrollmentId');
      const privateKeyString = localStorage.getItem('privateKey');
      const cert = localStorage.getItem('cert');
      // const channelName1 = "kalp";
      // const chainCodeName1 = "kalpacc";
      // const transactionNameBalance = "GetBalanceForAccount";
      const transactionParamsBalance = transactionParams;
      console.log(`Desired value in : ${(channelName1, chainCodeName1, transactionNameBalance)}`);
      const balance1 = await evaluateTransaction(
        Network.Stagenet,
        enrollmentID,
        privateKeyString,
        cert,
        channelName1,
        chainCodeName1,
        transactionNameBalance,
        transactionParamsBalance
      );
      console.log(`evaluateTransactionBalance is:${balance1}`, balance1);
      return balance1;
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    updateGasAmount();
    handleCreateAsset();

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log(`Message is 12311331`, message);
      if (message.type === `READ_TRANSACTION_BACKGROUND:${message.content.dappToken}`) {
        console.log(`Listening to READ_TRANSACTION_BACKGROUND`);
        let transactionType = message.content;
        console.log(
          `TransactionType: ${JSON.stringify(transactionType)}`,
          transactionType.methodArgs[0]
        );

        // Extract the first element from methodArgs array
        const channelName1 = transactionType.methodArgs[0];
        const chainCodeName1 = transactionType.methodArgs[1];
        const transactionNameBalance = transactionType.methodArgs[2];
        const transactionParams = transactionType.methodArgs[3];
        // Log the desired value to the console
        console.log(
          `Desired value:`,
          channelName1,
          chainCodeName1,
          transactionNameBalance,
          transactionParams
        );

        async function run() {
          const balance = await setringData(
            channelName1,
            chainCodeName1,
            transactionNameBalance,
            transactionParams
          );
          console.log(`setringData :${balance}`);
          sendResponse?.(balance);
        }
        run();
        return true;
      } else if (message.type === 'WRITE_TRANSACTION') {
        navigate('/Asset');
      } else if (message.type === 'FORM_SEND_TO_POPUP') {
        navigate('/Asset');
      }
    });
  }, []);

  const downloadJSON = () => {
    const enrollmentId = localStorage.getItem('enrollmentId');
    const privateKey = localStorage.getItem('privateKey');
    const iv = localStorage.getItem('iv');
    const csr = localStorage.getItem('csr');
    const key = localStorage.getItem('key');
    const secret = localStorage.getItem('secret');
    const publicCertificate = localStorage.getItem('publicCertificate');
    const assets = localStorage.getItem('assets');
    const data = {
      enrollmentId: enrollmentId,
      privateKey: privateKey,
      iv: iv,
      csr: csr,
      key: key,
      publicCertificate: publicCertificate,
      secret: secret,
      assets: assets,
    };

    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'data.json');

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const signOut = () => {
    // Implement sign out logic
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    paddingTop: '20vh',
  };

  const tableStyle = {
    backgroundColor: 'white',
    borderSpacing: '2rem',
  };

  const tdStyle1 = {
    padding: '1rem',
    fontSize: '1.2rem',
    border: '1px solid black',
    position: 'relative',
    left: '-2rem',
    top: '-8rem',
  };

  const tdStyle2 = {
    padding: '1rem',
    fontSize: '1.2rem',
    border: '1px solid black',
    position: 'relative',
    top: '-8rem',
    left: '1rem',
  };

  const cardStyle = {
    width: '20rem',
    height: '12rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    top: '-9rem',
    left: '0rem',
  };

  const buttonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const Heading1 = {
    margin: '10px 6rem',
    position: 'relative',
    left: '4rem',
    top: '-2rem',
  };

  return (
    <div className="mb-3">
      <div
        className="form-check form-switch"
        style={{ position: 'absolute', top: '10px', left: '10px' }}
      >
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="flexSwitchCheckChecked"
          checked
          onClick={setAlertFunction}
        />
        <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
          {alert}
        </label>
      </div>

      <button onClick={downloadJSON} style={buttonStyle}>
        Export Data
      </button>

      <button onClick={signOut} style={{ ...buttonStyle, right: '120px' }}>
        Sign Out
      </button>

      <div style={containerStyle}>
        <h1 style={Heading1}>Kalp Wallet</h1>
        <div>
          <div style={{ marginBottom: '2rem', marginTop: '5rem' }}>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={tdStyle1}>Account Balance</td>
                  <td style={tdStyle2}>{gasAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="card" style={cardStyle}>
            <div className="card-body">
              <h5 className="card-title">Total asset</h5>
              <h6
                className="card-subtitle mb-2 text-body-secondary"
                dangerouslySetInnerHTML={{ __html: responseMessage }}
              ></h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
