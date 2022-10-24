import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import "./styles.css";

function App() {
  return (
    <Router>
      <Route path="/" element={<Home />} />
    </Router>
  );
}

export default App;
