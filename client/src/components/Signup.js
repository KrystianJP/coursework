import axios from "axios";
import { useState } from "react";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    let body = { username, password, "confirm-password": confirmPassword };

    axios
      .post("/api/signup", body)
      .then((response) => {
        if (!response.data.accessToken) {
          setPassword("");
          setConfirmPassword("");
          setErrors(response.data.errors);
          return;
        }

        localStorage.setItem("token", response.data.accessToken);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error(error.response.data);
      });
  }
  return (
    <div className="page-container">
      <div className="page">
        <h1>Sign Up</h1>
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
          <div className="input-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              value={confirmPassword}
              required={true}
            ></input>
          </div>
          <button className="submit-btn" type="submit">
            Submit
          </button>
          <div className="signup">
            <a href="/login">Log in</a>
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

export default Signup;
