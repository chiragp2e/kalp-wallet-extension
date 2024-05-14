/* global chrome */
import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) =>{
  const [transactionType,setTransactionType] = useState(null)  
  const [channelName,setchannelName] = useState(null) 
  const [chainCodeName,setchainCodeName] = useState(null)
  const [transactionName,settransactionName] = useState(null)
  const [transactionParams,setTransactionParams] = useState(null)


  const [dappToken,setdappToken] = useState(null)  
  const [dappName,setdappName] = useState(null) 
  const [methodArgs,setmethodArgs] = useState(null)
  const [methodCallId,setmethodCallId] = useState(null)
  const [methodName,setmethodName] = useState(null)

  console.log("nejnjwnj notestate1212")

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
       
  console.log("nejnjwnj notestate 1212")
      
      if (message.type === "FORM_SEND_TO_POPUP") {
          //transactionType,channelName,chainCodeName,transactionName, transactionParams 
          let transactionType = message.content.transactionType;
          let channelName = message.content.channelName;
          let chainCodeName = message.content.chainCodeName;
          let transactionName = message.content.transactionName;
          let transactionParams = message.content.transactionParams;
          let dappToken = message.content.dappToken;

          setTransactionType(transactionType)
          setchannelName(channelName)
          setchainCodeName(chainCodeName)
          settransactionName(transactionName)
          setTransactionParams(transactionParams)
          setdappToken(dappToken)

          console.log("note state received transaction request",transactionType,channelName,chainCodeName,transactionName,transactionParams,dappToken)
        } else if (message.type === "SEND_TO_NOTE_CONTEXT") {
          console.log("connect to wallet request", message)
          let dappToken = message.content.dappToken;
          let dappName = message.content.dappName;
          let methodArgs = message.content.methodArgs;
          let methodCallId = message.content.methodCallId;
          let methodName = message.content.methodName;

          setdappToken(dappToken)
          setdappName(dappName)
          setmethodArgs(methodArgs)
          setmethodCallId(methodCallId)
          setmethodName(methodName)
          console.log("note state received connect to wallet request",dappToken,dappName,methodArgs,methodCallId,methodName)

        }
      });
    return(
        <NoteContext.Provider value={[transactionType,channelName,chainCodeName,transactionName,transactionParams,dappToken,dappName,methodArgs,methodCallId,methodName]}>
        {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;
