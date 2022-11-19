import axios from "axios";
import React, { Component } from "react";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      confirmPassword: "",
      errors: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updateConfirmPassword = this.updateConfirmPassword.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    let body = {
      username: this.state.username,
      password: this.state.password,
      "confirm-password": this.state.confirmPassword,
    };

    axios
      .post("/api/signup", body)
      .then((response) => {
        if (!response.data.accessToken) {
          this.setState({
            password: "",
            confirmPassword: "",
            errors: response.data.errors,
          });
          return;
        }

        localStorage.setItem("token", response.data.accessToken);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error(error.response.data);
      });
  }

  updateUsername(value) {
    this.setState({ username: value });
  }
  updatePassword(value) {
    this.setState({ password: value });
  }
  updateConfirmPassword(value) {
    this.setState({ confirmPassword: value });
  }

  render() {
    return (
      <div className="page-container">
        <div className="page">
          <h1>Sign Up</h1>
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
            <div className="input-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                onChange={(e) => {
                  this.updateConfirmPassword(e.target.value);
                }}
                value={this.state.confirmPassword}
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
            {this.state.errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Signup;
