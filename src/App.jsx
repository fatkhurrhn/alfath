import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dzikir from "./pages/dzikir/Dzikir";
import DzikirPagiSugro from "./pages/dzikir/DzikirPagiSugro";
import DzikirSoreSugro from "./pages/dzikir/DzikirSoreSugro";
import JadwalSholat from "./pages/JadwalSholat";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dzikir" element={<Dzikir />} />
        <Route path="/dzikir/pagi-sugro" element={<DzikirPagiSugro />} />
        <Route path="/dzikir/sore-sugro" element={<DzikirSoreSugro />} />
        <Route path="/jadwal-sholat" element={<JadwalSholat />} />

        {/* Catch-all untuk halaman yang tidak ada */}
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
