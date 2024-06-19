/* global chrome */
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import noteContext from "../../context/noteContext";

const Example = () => {
  const navigate = useNavigate();
  const a = useContext(noteContext);
  const [dappName, setDappName] = useState(null);

  useEffect(() => {
    setDappName(a[6]);
  }, [a]);

  console.log("notecontext", a);

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
        permission: "YES",
      },
    });

    localStorage.setItem(`${dappName}_token`, a[5]);
    navigate("/HomePage");
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
        permission: "NO",
      },
    });
    console.log("Button 2 clicked");
    navigate("/HomePage");
  };

  const containerStyle = {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,.1)',
    maxWidth: '500px',
    margin: '0 auto',
    marginTop: '50px',
    textAlign: 'center',
    position: 'relative',
    height: '19rem',
    width: '18rem',
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

  const headingStyle = {
    fontSize: '24px',
    marginBottom: '20px',
  };

  return (
    <div style={containerStyle}>
      <div style={headingStyle}>Hello World {dappName}</div>
      <button style={buttonStyle} onClick={handleClick1}>
        Yes
      </button>
      <button style={buttonStyle} onClick={handleClick2}>
        No
      </button>
    </div>
  );
};

export default Example;
