import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link> | <Link to="/history">History</Link>
      </nav>

      <Routes>
        <Route path="/" element={
          <>
            <Home />
            <History />
          </>
        } />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}
