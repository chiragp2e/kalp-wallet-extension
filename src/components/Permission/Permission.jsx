/* global chrome */
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import noteContext from "../../context/noteContext";

export default () => {
  
    const navigate = useNavigate();
  const a = useContext(noteContext);
  const [dappName,setdappName] = useState(null) 
  
  useEffect(() => {
    setdappName(a[6])
  }, []);
  console.log("notecontext", a)
  const handleClick1 = () => {
    console.log("Button 1 clicked");
    chrome.runtime.sendMessage({
      type: `GIVE_PERMISSION:${a[5]}`,
      message: {
         dappToken: a[5],
       dappName: a[6],
       methodArgs: a[7],
      methodCallId: a[8],
      methodName: a[9],
      permission: "YES"
      },
    })

    localStorage.setItem(`${dappName}_token`, a[5])
        navigate("/HomePage");

    
    // Add your logic for button 1 here
  };
 
  const handleClick2 = () => {
    chrome.runtime.sendMessage({
      type: `GIVE_PERMISSION:${a[5]}`,
      message: {
         dappToken: a[5],
       dappName: a[6],
       methodArgs: a[7],
      methodCallId: a[8],
      methodName: a[9],
      permission: "NO"
      },
    })
    console.log("Button 2 clicked");
    navigate("/HomePage");

    
    // Add your logic for button 2 here
  };
 
  return (
    <div>
      <div>hello world {dappName}</div>
      <button onClick={handleClick1}>Yes</button>
      <button onClick={handleClick2}>No</button>
    </div>
  );

};


