import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setuser } from "../../store/authslice";
import { useNavigate } from "react-router-dom";


function Login() {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  function loginuser() {
    // Define the credentials for admin and regular user
    const adminUsername = "adminvidhu";
    const adminPassword = "adminvidhu";
    const userUsername = "username";
    const userPassword = "password";

    if (username === adminUsername && password === adminPassword) {
      // Admin login
      axios
        .post('http://127.0.0.1:8000/storeapi/login', { username, password })
        .then((response) => {
          const user = {
            username: adminUsername,
            token: response.data.token, // Use the token from the server response
          };
          console.log("Admin user logged in. Token:", user.token);
          dispatch(setuser(user));
          navigate('/aboutus');
        })
        .catch((error) => {
          console.error("Error during admin login:", error);
          alert("Error while logging in.");
        });
    } else if (username ===  userUsername && password === userPassword) {
      // Regular user login
      axios
        .post('http://127.0.0.1:8000/storeapi/login', { username, password })
        .then((response) => {
          const user = {
            username,
            token: response.data.token, // Use the token from the server response
          };
          console.log("Regular user logged in. Token:", user.token);
          dispatch(setuser(user));
          navigate('/app');
        })
        .catch((error) => {
          console.error("Error during regular user login:", error);
          alert("Error while logging in.");
        });
    } else {
      alert("Invalid username or password. Please try again.");
    }
  }

  return (
    <div className="login-container" style={{ background: "linear-gradient(to bottom left, #ffffff 0%, #33cccc 100%)", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <div className="col col-lg-4 col-md-3 col-sm-6 bg-light mx-auto d-block  rounded">
        <h2 className=" mb-5">Log In</h2>
        <label>Username:</label>
        <input
          placeholder="Username"
          value={username}
          className="form-control"
          type="text"
          onChange={(event) => setusername(event.target.value)}
        />
        <label className="mt-3">Password:</label>
        <input
          placeholder="Password"
          value={password}
          className="form-control mb-4"
          type="password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <button className="btn btn-success mb-4 mx-auto d-block" onClick={loginuser}>Log in</button>
      </div>
      <div className="col col-1 mt-5 mx-auto d-block">
         {/* <button className="btn btn-outline-dark float-left" onClick={Register}>Sign up</button>  */}
      </div>
    </div>
  );
}

export default Login;
