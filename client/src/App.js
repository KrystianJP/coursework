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
import ProjectAdd from "./components/ProjectAdd";
import TaskAdd from "./components/TaskAdd";
import "./styles.css";
import axios from "axios";
import React, { Component } from "react";
import TaskEdit from "./components/TaskEdit";

class App extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      token: "",
      busy: true,
      dropdown: false,
      lightTheme: false,
    };
    this.lightColours = {
      background: "rgb(255, 255, 255)",
      text: "rgb(40, 40, 40)",
      linkHoverBg: "rgb(220, 220, 220)",
    };
    this.darkColours = {
      background: "rgb(40,40,40)",
      text: "rgb(255,255,255)",
      linkHoverBg: "rgb(100,100,100)",
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.loginOrLogout = this.loginOrLogout.bind(this);
    this.logOut = this.logOut.bind(this);
    this.changeTheme = this.changeTheme.bind(this);
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
          this.setState({
            username: response.data.username,
            busy: false,
          });
          axios
            .get("/api/user/theme", config)
            .then((response) => {
              this.makeTheme(
                response.data.lightTheme ? this.lightColours : this.darkColours,
              );
              this.setState({ lightTheme: response.data.lightTheme });
            })
            .catch((error) => {
              console.error(error.response.data);
            });
          // to change the theme to the user's preferred one
        })
        .catch((error) => {
          console.error(error.response.data);
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
        console.error(error.response.data);
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

  makeTheme(theme) {
    document.documentElement.style.setProperty(
      "--background",
      theme.background,
    );
    document.documentElement.style.setProperty("--text", theme.text);
    document.documentElement.style.setProperty(
      "--link-hover-bg",
      theme.linkHoverBg,
    );
  }

  changeTheme(light) {
    let colourScheme;
    if (light) {
      this.setState({ lightTheme: false });
      colourScheme = this.darkColours;
    } else {
      this.setState({ lightTheme: true });
      colourScheme = this.lightColours;
    }
    this.makeTheme(colourScheme);

    // making request to route to update user's preference
    let config = {
      headers: {
        Authorization: "Bearer " + this.state.token,
      },
    };
    axios.get("/api/user/switch-theme", config).catch((error) => {
      console.error(error.response.data);
    });
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <span
                className="material-symbols-outlined theme-btn"
                onClick={() => {
                  this.changeTheme(this.state.lightTheme);
                }}
              >
                {this.state.lightTheme ? "light_mode" : "dark_mode"}
              </span>
              {this.loginOrLogout(this.state.token)}
            </div>
          </header>
          <Routes>
            <Route
              path="/"
              element={
                this.state.token ? (
                  <Home token={this.state.token} />
                ) : (
                  <Navigate replace to="/login" />
                )
              }
            />
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
            <Route
              path="/project/add"
              element={
                this.state.token ? (
                  <ProjectAdd token={this.state.token} />
                ) : (
                  <Navigate replace to="/" />
                )
              }
            />
            <Route
              path="/task/add/*"
              element={
                this.state.token ? (
                  <TaskAdd token={this.state.token} />
                ) : (
                  <Navigate replace to="/" />
                )
              }
            />
            <Route
              path="task/edit/*"
              element={
                this.state.token ? (
                  <TaskEdit token={this.state.token} />
                ) : (
                  <Navigate replace to="/" />
                )
              }
            />
          </Routes>
        </Router>
      );
    }
  }
}

export default App;
