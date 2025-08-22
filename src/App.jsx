import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dzikir from "./pages/dzikir/Dzikir";
import DzikirPagiSugro from "./pages/dzikir/almasurat/PagiSugro";
import DzikirPetangSugro from "./pages/dzikir/almasurat/PetangSugro";
import JadwalSholat from "./pages/JadwalSholat";
import NotFound from "./pages/NotFound";
import Almasurat from "./pages/dzikir/almasurat/Almasurat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dzikir" element={<Dzikir />} />
        <Route path="/dzikir/almasurat" element={<Almasurat />} />
        <Route path="/dzikir/almasurat/pagi" element={<DzikirPagiSugro />} />
        <Route path="/dzikir/almasurat/petang" element={<DzikirPetangSugro />} />
        <Route path="/jadwal-sholat" element={<JadwalSholat />} />

        {/* Catch-all untuk halaman yang tidak ada */}
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
