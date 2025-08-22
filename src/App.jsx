import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dzikir from "./pages/dzikir/Dzikir";
import DzikirPagiSugro from "./pages/dzikir/DzikirPagiSugro";
import DzikirSoreSugro from "./pages/dzikir/DzikirSoreSugro";
import JadwalSholat from "./pages/JadwalSholat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dzikir" element={<Dzikir />} />
        <Route path="/dzikir/pagi-sugro" element={<DzikirPagiSugro />} />
        <Route path="/dzikir/sore-sugro" element={<DzikirSoreSugro />} />
        <Route path="/jadwal-sholat" element={<JadwalSholat />} />
      </Routes>
    </Router>
  );
}

export default App;
