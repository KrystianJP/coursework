import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Test from "./components/Test";
import "./styles.css";
import axios from "axios";

function App() {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(true);
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    // getting token from local storage if it exists
    const tokenFromStorage = localStorage.getItem("token");
    if (tokenFromStorage) {
      // if token exists, set token to the one in local storage
      setToken(tokenFromStorage);
    } else {
      // reset token in case old one is saved
      setToken("");
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
          console.log(response);
          setUsername(response.data.username);
          setBusy(false);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setBusy(false);
    }
  }, []);

  function logOut() {
    axios
      .delete("/api/logout")
      .then((response) => {
        setToken("");
        localStorage.setItem("token", "");
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function loginOrLogout(token) {
    if (!token) {
      return (
        <a className="login" href="/login">
          Log in
        </a>
      );
    } else {
      return (
        <div>
          <button className="login" onClick={toggleDropdown}>
            {username}
          </button>
          {dropdown ? (
            <div className="logout-dropdown">
              <button className="dropdown-logout" onClick={logOut}>
                Log out
              </button>
            </div>
          ) : null}
        </div>
      );
    }
  }

  function toggleDropdown(e) {
    e.stopPropagation();
    if (!dropdown) {
      setDropdown(true);
    } else {
      setDropdown(false);
    }
  }

  if (!busy) {
    return (
      <Router>
        <header onClick={() => setDropdown(false)}>
          <a className="logo" href="/">
            <span className="material-symbols-outlined">home</span>
            To Do List
          </a>
          {loginOrLogout(token)}
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />

          <Route
            path="/login"
            element={!token ? <Login /> : <Navigate replace to="/" />}
          />
          <Route
            path="/signup"
            element={!token ? <Signup /> : <Navigate replace to="/" />}
          />
        </Routes>
      </Router>
    );
  }
}

export default App;
