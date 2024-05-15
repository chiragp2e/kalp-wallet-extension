/* global chrome */
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Network,
  evaluateTransaction,
  evaluateBalance,
  submitTransaction,
} from "test-kalp-wallet-package";
import noteContext from "../../context/noteContext";

// import "../../css/Asset.css";

export default () => {
  
  const [response, setResponse] = useState("");
  const [id, setId] = useState(null);
  const [assetDigest, setAssetDigest] = useState(null);
  const [fresponse, setFResponse] = useState("");

  const [dappToken, setdappToken1] = useState("");
  const [channelName, setchannelName1] = useState("");
  const [chainCodeName1, setchainCodeName1] = useState("");
  const [transactionNameBalance, settransactionNameBalance] = useState("");
  const [transactionParams, settransactionParams] = useState("");

  const navigate = useNavigate();
  const CHANNEL_NAME = "kalp";
  const CHAINCODE_NAME = "myipr";
  const TRANSACTION_NAME = "IsMinted";

  //

  const a = useContext(noteContext);
  console.log("notecontencg   a", a);
  useEffect(() => {
    setchannelName1(a[1]);
    setchainCodeName1(a[2]);
    settransactionNameBalance(a[3]);
    settransactionParams(a[4]);
    setdappToken1(a[5])
  }, []);
  console.log("notecontencg new  a", a);

  const cert = localStorage.getItem("cert");
  const privateKeyString = localStorage.getItem("privateKey");
  const enrollmentID = localStorage.getItem("enrollmentId");

  const backSign = () => {
    navigate("/HomePage");
  };


    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log(`Message is ${message.type}`, message);
      if (message.type === `WRITE_TRANSACTION_BACKGROUND:${message.content.dappToken}`) {
        console.log(`Listening to READ_TRANSACTION`);

        // Extract transactionType from message.content
        let transactionType = message.content;
        console.log(`TransactionType: ${JSON.stringify(transactionType)}`);

        const channelName1 = transactionType.methodArgs[0];
        const chainCodeName1 = transactionType.methodArgs[1];
        const transactionNameBalance = transactionType.methodArgs[2];
        const transactionParams = transactionType.methodArgs[3];

        setchannelName1(channelName1);
        setchainCodeName1(chainCodeName1);
        settransactionNameBalance(transactionNameBalance);
        settransactionParams(transactionParams);
        setdappToken1(message.content.dappToken)
        sendResponse?.("it's a sucess");
        return true;
      }
    });
  useEffect(() => {
    console.log(`respons is ${fresponse}`);
  }, [fresponse]);

  const setringData = async () => {
    try {
      //console.log(`get gaurav setringData `)
      const enrollmentID = localStorage.getItem("enrollmentId");
      // const enrollmentID = {
      //   as: "do",
      // };
      const privateKeyString = localStorage.getItem("privateKey");
      const cert = localStorage.getItem("cert");
      const assetId1 = "Assetgaurav604";
      //info that is provided by Dapp user
      const channelName = CHANNEL_NAME;
      const chainCodeName = CHAINCODE_NAME;
      const transactionName = TRANSACTION_NAME;
      const transactionParams = [assetId1, "ASSET-MYIPR"];

      const channelName1 = "kalp";
      const chainCodeName1 = "kalpacc";
      const transactionNameBalance = "GetBalanceForAccount";
      const transactionParamsBalance = [enrollmentID];
      //console.log(`get gaurav evaluate `)

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
      console.log(
        `get gaurav evaluate balance ${enrollmentID} ${privateKeyString} ${cert} ${channelName1} ${chainCodeName1} ${transactionNameBalance} ${transactionParamsBalance} `
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

  // async function temp(rsult) {
  //   setFResponse(rsult);
  // }
  console.log(`respons is ${fresponse}`);

  async function submit() {
    try {
      console.log(`channelName1 :${channelName}`);
      console.log(`chainCodeName1 ${chainCodeName1}`);
      console.log(`transactionNameBalance ${transactionNameBalance}`);
      console.log(`transactionParams ${transactionParams}`);
      console.log(`transaction data:1`);
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
      console.log(`transaction data2.1: ${makeTransaction}`);
      chrome.runtime.sendMessage({
        type: `TRANSACTION_ID:${dappToken}`,
        message: {
          transactionId: makeTransaction,
          error: ""
        },
      })
    } catch (error) {
      console.log(`error: ${JSON.stringify(error)}`, error);
      chrome.runtime.sendMessage({
        type: `TRANSACTION_ID:${dappToken}`,
        message: {
          transactionId: "",
          error: `${error}`
        },
      })
      throw error(error);
    }
  }
  useEffect(() => {
    //

    // setId(assetId);
    // setAssetDigest(assetDigests);

    //
    setringData();

    // setFResponse("kalp");
    // console.log(`respons is ${fresponse}`);

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "FORM_SEND_TO_POPUP") {
        console.log("message reciverd in asset.js");
      }
    });
  }, []);

  return (
    <>
      <div className="mb-3">
        <h1>Transaction</h1>
      </div>
      <div className="card" style={{ width: "20rem" }}>
        <div className="card-body">
          <h5 className="card-title">Transaction Details: </h5>
          <h6 className="card-subtitle mb-2 text-body-secondary">{response}</h6>
          <p className="card-text">Your Channel Name: {channelName}</p>
          <p className="card-text">Your Chaincode Name: {chainCodeName1}</p>
          <p className="card-text">Your Transaction Name Balance: {transactionNameBalance}</p>
          <p className="card-text">Your Transaction Params: {transactionParams}</p>
        </div>
      </div>

      <div className="mb-3" style={{ margin: "10px" }}>
        <button
          type="button"
          className="btn btn-outline-danger mr-2"
          onClick={backSign}
          style={{ margin: "20px  10px" }}
        >
          GO BACK
        </button>
        <button
          type="button"
          className="btn btn-outline-success ml-2"
          onClick={submit}
          style={{ margin: "20px  25px" }}
        >
          Sign Transaction
        </button>
      </div>
    </>
  );
};