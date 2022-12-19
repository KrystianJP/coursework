import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Test from "./components/Test";
import "./styles.css";
import axios from "axios";
import React, { Component } from "react";

class App extends Component {
  constructor() {
    super();
    this.state = { username: "", token: "", busy: true, dropdown: false };
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.loginOrLogout = this.loginOrLogout.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    // getting token from local storage if it exists
    const tokenFromStorage = localStorage.getItem("token");
    if (tokenFromStorage) {
      // if token exists, set token to the one in local storage
      this.setState({ token: tokenFromStorage });
    } else {
      // reset token in case old one is saved
      this.setState({ token: "" });
    }

    if (tokenFromStorage) {
      let config = {
        headers: {
          Authorization: "Bearer " + tokenFromStorage,
        },
      };
      axios
        .get("/api/user", config)
        .then((response) => {
          this.setState({ username: response.data.username, busy: false });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      this.setState({ busy: false });
    }
  }

  logOut() {
    axios
      .delete("/api/logout")
      .then(() => {
        this.setState({ token: "" });
        localStorage.setItem("token", "");
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error(error);
      });
  }

  loginOrLogout(token) {
    if (!token) {
      return (
        <a className="login" href="/login">
          Log in
        </a>
      );
    } else {
      return (
        <div>
          <button className="login" onClick={this.toggleDropdown}>
            {this.state.username}
          </button>
          {this.state.dropdown ? (
            <div className="logout-dropdown">
              <button className="dropdown-logout" onClick={this.logOut}>
                Log out
              </button>
            </div>
          ) : null}
        </div>
      );
    }
  }

  toggleDropdown(e) {
    e.stopPropagation();
    if (!this.state.dropdown) {
      this.setState({ dropdown: true });
    } else {
      this.setState({ dropdown: false });
    }
  }

  render() {
    if (!this.state.busy) {
      return (
        <Router>
          <header onClick={() => this.setState({ dropdown: false })}>
            <a className="logo" href="/">
              <span className="material-symbols-outlined">home</span>
              To Do List
            </a>
            {this.loginOrLogout(this.state.token)}
          </header>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<Test />} />

            <Route
              path="/login"
              element={
                !this.state.token ? <Login /> : <Navigate replace to="/" />
              }
            />
            <Route
              path="/signup"
              element={
                !this.state.token ? <Signup /> : <Navigate replace to="/" />
              }
            />
          </Routes>
        </Router>
      );
    }
  }
}

export default App;
