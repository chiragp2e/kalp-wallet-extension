/* global chrome */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import {
  Network,
  registerAndEnrollUser,
  createCsr,
  getEnrollmentId,
  getKeyPairFromSeedPhrase,
  getSeedPhrase,
} from "test-kalp-wallet-package";

export default () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const saltRounds = 10;

  async function keyPair() {
    const seed = await getSeedPhrase();
    console.log(`seed is ${seed}`);
    const { pemPublicKey, pemPrivateKey } = await getKeyPairFromSeedPhrase(seed);
    console.log(`public is ${pemPublicKey}`);
    console.log(`private is ${pemPrivateKey}`);
    const enrollmentID = await getEnrollmentId(pemPublicKey);
    console.log("EnrollmentId:", enrollmentID);
    const createCSRKey = createCsr(enrollmentID, pemPrivateKey, pemPublicKey);
    //const getRegister = await register(enrollmentID, createCSRKey);

    //console.log(`pubcert : ${getRegister}`);

    localStorage.setItem("enrollmentId", enrollmentID);
    localStorage.setItem("csr", createCSRKey);
    localStorage.setItem("privateKey", pemPrivateKey);
    localStorage.setItem("publicKey", pemPublicKey);
    console.log("Public Key in PEM format:", pemPublicKey);
    console.log("Private Key in PEM format:", pemPrivateKey);
    console.log("Enrollment Id:", enrollmentID);
    console.log("csr:", createCSRKey);
  }

  
  const callAPI = async () => {
    try {
      await keyPair();
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log(`final encrypt password is :${hashedPassword}`);
      localStorage.setItem("password", hashedPassword);
      const enrollmentID = localStorage.getItem("enrollmentId");
      const createCSRKey = localStorage.getItem("csr");
      console.log(`enrollment id is :${enrollmentID} and csr:${createCSRKey}`);
      const certificate = await registerAndEnrollUser(Network.Stagenet, enrollmentID, createCSRKey);
      console.log(`registerAndEnrollUser data :${certificate}`);
      localStorage.setItem("cert", certificate);
      navigate("/Permission");
    } catch (error) {
      throw Error(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

    if (!password.trim()) {
      setErrorMessage("Please enter a password.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (!password.match(passwordRegex)) {
      setErrorMessage(
        "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, and 1 special character."
      );
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    } else {
      if (localStorage.getItem("publicCertificate")) {
        console.log("right inside");
        async function createPassword() {
          const salt = await bcrypt.genSalt(saltRounds);
          const hashedPassword = await bcrypt.hash(password, salt);
          console.log(`final encrypt password is :${hashedPassword}`);
          localStorage.setItem("Password", hashedPassword);
          navigate("/Login");
        }
        createPassword();
      } else {
        console.log("example usage call");
        callAPI();
        console.log("call api");
      }
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  return (
      <div className="mb-3">
        <h1>Sign up</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword2" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword2"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          {errorMessage &&
            errorMessage.split("\n").map((error, index) => (
              <p key={index} className="error">
                {error}
              </p>
            ))}
        </form>
      </div>
  );
}
