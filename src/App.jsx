import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dzikir from "./pages/dzikir/Dzikir";
import DzikirPagiSugro from "./pages/dzikir/DzikirPagiSugro";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dzikir" element={<Dzikir />} />
        <Route path="/dzikir/pagi-sugro" element={<DzikirPagiSugro />} />
      </Routes>
    </Router>
  );
}

export default App;
