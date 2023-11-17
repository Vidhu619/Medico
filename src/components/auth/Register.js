import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPasswordConfirmation] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    const user = {
      username:username,
      email: email,
      password: password,
      password1: password1,
    };

    axios
      .post('http://127.0.0.1:8000/storeapi/register', user)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please check your inputs and try again.");
      });
  }

  return (
    <div
      className="login-container"
      style={{
        background: "linear-gradient(to bottom left, #ffffff 0%, #33cccc 100%)",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="col bg-light rounded pt-5 pb-3 col-lg-6 col-md-6 col-sm-8 mt-5 mx-auto input2">
        <h2>Sign up</h2>

        <input
          placeholder="name"
          type="text"
          value={username}
          className="form-control mt-4"
          onChange={(event) => setName(event.target.value)}
        />

        <input
          placeholder="email"
          type="email"
          value={email}
          className="form-control mt-3"
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          placeholder="password"
          type="password"
          value={password}
          className="form-control mt-3"
          onChange={(event) => setPassword(event.target.value)}
        />

        <input
          placeholder="confirmation password"
          type="password"
          value={password1}
          className="form-control mt-3"
          onChange={(event) => setPasswordConfirmation(event.target.value)}
        />
        <br />
        <button
          className="btn btn-success mx-auto d-block"
          onClick={handleRegister}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Register;
