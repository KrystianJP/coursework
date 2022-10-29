import { useState } from "react";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    let body = { username, password };

    axios
      .post("/api/login", body)
      .then((response) => {
        if (!response.data.accessToken) {
          setErrors([response.data.message]);
          setPassword("");
          return;
        }
        localStorage.setItem("token", response.data.accessToken);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error(error);
      });
  }
  return (
    <div className="page-container">
      <div className="page">
        <h1>Log In</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              required={true}
            ></input>
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              required={true}
            ></input>
          </div>
          <button className="submit-btn" type="submit">
            Submit
          </button>
          <div className="signup">
            <a href="/signup">Sign up</a>
          </div>
        </form>
        <ul className="errors-list">
          {errors.map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Login;
