import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Almasurat from "./pages/Almasurat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/almasurat" element={<Almasurat />} />
      </Routes>
    </Router>
  );
}

export default App;
