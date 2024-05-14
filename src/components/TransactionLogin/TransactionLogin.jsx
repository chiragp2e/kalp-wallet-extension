/* global chrome */
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import "../../css/Login.css";
import bcrypt from "bcryptjs";


export default () => {
    console.log("hello login")
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const storedPassword = localStorage.getItem("password");
    const publicCertificate = localStorage.getItem("cert");
    const handlePasswordChange = (event) => {
      setPassword(event.target.value);
    };
    const handleLoginClick = async () => {
      const isMatch = await bcrypt.compare(password, storedPassword);
      console.log(`match: ${isMatch}` )
      try {
        if (!password) {
          setErrorMessage("Please enter your password.");
          return;
        }
        if (!storedPassword) {
          setErrorMessage("No password stored. Please sign up first.");
          return;
        }
        if (isMatch) {
          // navigate("/HomePage");
          navigate("/Asset");
        }
        else {
          setErrorMessage("Incorrect password. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage("An error occurred while logging in.");
      }
    };
  
    return (
      <>
        <div className="mb-3">
          <h1>Wallet</h1>
          <div className="mb-3">
            <h2>Login</h2>
            <div className="mb-3">
              <label for="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                value={password}
                defaultFunction1
                onChange={handlePasswordChange}
                required
              />
            </div>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <div className="d-flex justify-content-center align-items-center">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleLoginClick}
              >
                {" "}
                Login
              </button>
            </div>
          </div>
        </div>
      </>
    );
};


