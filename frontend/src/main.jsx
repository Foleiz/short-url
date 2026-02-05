import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";
import "./styles.css";

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <nav>
          <Link to="/">หน้าแรก</Link>
          <Link to="/history">ประวัติ</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

