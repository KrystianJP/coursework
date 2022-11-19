import React, { Component } from "react";
import axios from "axios";

class Login extends Component {
  constructor() {
    super();
    this.state = { username: "", password: "", errors: [] };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    let body = { username: this.state.username, password: this.state.password };

    axios
      .post("/api/login", body)
      .then((response) => {
        if (!response.data.accessToken) {
          this.setState({ password: "", errors: [response.data.message] });
          return;
        }
        localStorage.setItem("token", response.data.accessToken);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error(error);
      });
  }

  updateUsername(value) {
    this.setState({ username: value });
  }
  updatePassword(value) {
    this.setState({ password: value });
  }

  render() {
    return (
      <div className="page-container">
        <div className="page">
          <h1>Log In</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                onChange={(e) => {
                  this.updateUsername(e.target.value);
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
                  this.updatePassword(e.target.value);
                }}
                value={this.state.password}
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
            {this.state.errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Login;
