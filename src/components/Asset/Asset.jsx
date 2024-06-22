import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Network,
  evaluateTransaction,
  evaluateBalance,
  submitTransaction,
} from 'test-kalp-wallet-package';
import noteContext from '../../context/noteContext';

export default function Transaction() {
  const [response, setResponse] = useState('');
  const [id, setId] = useState(null);
  const [assetDigest, setAssetDigest] = useState(null);
  const [fresponse, setFResponse] = useState('');

  const [dappToken, setdappToken1] = useState('');
  const [channelName, setchannelName1] = useState('');
  const [chainCodeName1, setchainCodeName1] = useState('');
  const [transactionNameBalance, settransactionNameBalance] = useState('');
  const [transactionParams, settransactionParams] = useState('');

  const navigate = useNavigate();
  const CHANNEL_NAME = 'kalp';
  const CHAINCODE_NAME = 'myipr';
  const TRANSACTION_NAME = 'IsMinted';

  const a = useContext(noteContext);
  useEffect(() => {
    setchannelName1(a[1]);
    setchainCodeName1(a[2]);
    settransactionNameBalance(a[3]);
    settransactionParams(a[4]);
    setdappToken1(a[5]);
  }, [a]);

  const cert = localStorage.getItem('cert');
  const privateKeyString = localStorage.getItem('privateKey');
  const enrollmentID = localStorage.getItem('enrollmentId');

  const backSign = () => {
    navigate('/HomePage');
  };

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === `WRITE_TRANSACTION_BACKGROUND:${message.content.dappToken}`) {
      let transactionType = message.content;

      const channelName1 = transactionType.methodArgs[0];
      const chainCodeName1 = transactionType.methodArgs[1];
      const transactionNameBalance = transactionType.methodArgs[2];
      const transactionParams = transactionType.methodArgs[3];

      setchannelName1(channelName1);
      setchainCodeName1(chainCodeName1);
      settransactionNameBalance(transactionNameBalance);
      settransactionParams(transactionParams);
      setdappToken1(message.content.dappToken);
      sendResponse?.("it's a success");
      return true;
    }
  });

  const setringData = async () => {
    try {
      const enrollmentID = localStorage.getItem('enrollmentId');
      const privateKeyString = localStorage.getItem('privateKey');
      const cert = localStorage.getItem('cert');
      const assetId1 = 'Assetgaurav604';

      const channelName = CHANNEL_NAME;
      const chainCodeName = CHAINCODE_NAME;
      const transactionName = TRANSACTION_NAME;
      const transactionParams = [assetId1, 'ASSET-MYIPR'];

      const channelName1 = 'kalp';
      const chainCodeName1 = 'kalpacc';
      const transactionNameBalance = 'GetBalanceForAccount';
      const transactionParamsBalance = [enrollmentID];

      const balance = await evaluateTransaction(
        Network.Stagenet,
        enrollmentID,
        privateKeyString,
        cert,
        channelName,
        chainCodeName,
        transactionName,
        transactionParams
      );

      const balance1 = await evaluateBalance(
        Network.Stagenet,
        enrollmentID,
        privateKeyString,
        cert,
        channelName1,
        chainCodeName1,
        transactionNameBalance,
        transactionParamsBalance
      );
      console.log(`evaluateTransactionBalance is:${balance1}`);
      console.log(`evaluateTransactionBalance is:${balance}`);
    } catch (error) {
      throw error(error.message);
    }
  };

  async function submit() {
    try {
      const makeTransaction = await submitTransaction(
        Network.Stagenet,
        enrollmentID,
        privateKeyString,
        cert,
        channelName,
        chainCodeName1,
        transactionNameBalance,
        transactionParams
      );

      chrome.runtime.sendMessage({
        type: `TRANSACTION_ID:${dappToken}`,
        message: {
          transactionId: makeTransaction,
          error: '',
        },
      });
      setTimeout(() => {
        navigate('/HomePage');
      }, 2000);
    } catch (error) {
      console.log(`error: ${JSON.stringify(error)}`, error);
      chrome.runtime.sendMessage({
        type: `TRANSACTION_ID:${dappToken}`,
        message: {
          transactionId: '',
          error: `${error}`,
        },
      });
      setTimeout(() => {
        navigate('/HomePage');
      }, 2000);
      throw error(error);
    }
  }

  useEffect(() => {
    setringData();

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'FORM_SEND_TO_POPUP') {
        console.log('message received in asset.js');
      }
    });
  }, []);

  const cardStyle = {
    width: '20rem',
    wordWrap: 'break-word',
  };

  const cardBodyStyle = {
    padding: '1rem',
    border: '1px solid black',
  };

  const cardTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
  };

  const cardSubtitleStyle = {
    marginBottom: '1rem',
    color: 'gray',
  };

  const cardTextStyle = {
    fontSize: '1rem',
    wordWrap: 'break-word',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#3498dbd0',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    margin: '10px 10px',
  };

  return (
    <>
      <div className="mb-3">
        <h1>Transaction</h1>
      </div>
      <div className="card" style={cardStyle}>
        <div className="card-body" style={cardBodyStyle}>
          <h5 className="card-title" style={cardTitleStyle}>
            Transaction Details:
          </h5>
          <h6 className="card-subtitle mb-2 text-body-secondary" style={cardSubtitleStyle}>
            {response}
          </h6>
          <p className="card-text" style={cardTextStyle}>
            Your Channel Name: {channelName}
          </p>
          <p className="card-text" style={cardTextStyle}>
            Your Chaincode Name: {chainCodeName1}
          </p>
          <p className="card-text" style={cardTextStyle}>
            Your Transaction Name Balance: {transactionNameBalance}
          </p>
          <div>
            <p className="card-text" style={cardTextStyle}>
              Your Transaction Params: {transactionParams}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <button
          type="button"
          className="btn btn-outline-danger mr-2"
          onClick={backSign}
          style={buttonStyle}
        >
          GO BACK
        </button>
        <button
          type="button"
          className="btn btn-outline-success ml-2"
          onClick={submit}
          style={buttonStyle}
        >
          Sign Transaction
        </button>
      </div>
    </>
  );
}
