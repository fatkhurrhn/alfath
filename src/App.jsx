import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dzikir from "./pages/dzikir/Dzikir";
import DzikirPagiSugro from "./pages/dzikir/almasurat/PagiSugro";
import DzikirPetangSugro from "./pages/dzikir/almasurat/PetangSugro";
import JadwalSholat from "./pages/JadwalSholat";
import NotFound from "./pages/NotFound";
import Almasurat from "./pages/dzikir/almasurat/Almasurat";
import Donate from "./pages/Donate";
import AutoToTop from "./components/AutoToTop";
import Tes from "./pages/Tes";
import Kalender from "./pages/Kalender";
import ALQuran from "./pages/alquran/HomeQuran";
import DetailSurah from "./pages/alquran/DetailPerSurah";
import DetailPerJuz from "./pages/alquran/DetailPerJuz";


import QuranPage from './components/QuranPage';
import Tess from './components/Home';

function App() {
  return (
    <Router>
      <AutoToTop />
      <Routes>
        <Route path="/tess" element={<Tess />} />
        <Route path="/page/:pageNumber" element={<QuranPage />} />

        <Route path="/" element={<Home />} />
        <Route path="/dzikir" element={<Dzikir />} />
        <Route path="/dzikir/almasurat" element={<Almasurat />} />
        <Route path="/dzikir/almasurat/pagi" element={<DzikirPagiSugro />} />
        <Route path="/dzikir/almasurat/petang" element={<DzikirPetangSugro />} />
        <Route path="/jadwal-sholat" element={<JadwalSholat />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/tes" element={<Tes />} />
        <Route path="/kalender" element={<Kalender />} />
        <Route path="/quran" element={<ALQuran />} />
        <Route path="/quran/surah/:id" element={<DetailSurah />} />
        <Route path="/quran/juz/:id" element={<DetailPerJuz />} />

        {/* Catch-all untuk halaman yang tidak ada */}
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
