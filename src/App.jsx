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
import DetailPerSurah from "./pages/alquran/DetailPerSurah";
import DetailPerJuz from "./pages/alquran/DetailPerJuz";


import QuranPage from './components/QuranPage';
import Tess from './components/Home';
import HomeQuran from "./pages/alquran/HomeQuran";
import TebakAyat from "./pages/alquran/game/TebakAyat";
import Games from "./pages/alquran/Games";
import History from "./pages/History";

import Juz30 from "./pages/alquran/game/sambungayat/Juz30";
import Juz1 from "./pages/alquran/game/sambungayat/Juz1";
import Juz29 from "./pages/alquran/game/sambungayat/Juz29";
import Juz28 from "./pages/alquran/game/sambungayat/Juz28";
import Juz27 from "./pages/alquran/game/sambungayat/Juz27";
import Juz2 from "./pages/alquran/game/sambungayat/Juz2";
import Juz3 from "./pages/alquran/game/sambungayat/Juz3";
import Juz5 from "./pages/alquran/game/sambungayat/Juz5";
import Juz4 from "./pages/alquran/game/sambungayat/Juz4";
import Juz26 from "./pages/alquran/game/sambungayat/Juz26";
import Juz25 from "./pages/alquran/game/sambungayat/Juz25";

// import Surah67 from "./pages/alquran/game/sambungayat/Surah67";
import SurahSambungAyat from "./pages/alquran/game/sambungayat/Surah67";
import DetailVideo from "./pages/DetailVideo";

function App() {
  return (
    <Router>
      <AutoToTop />
      <Routes>
        <Route path="/tess" element={<Tess />} />
        <Route path="/page/:pageNumber" element={<QuranPage />} />

        <Route path="/" element={<Home />} />
        <Route path="/detail/video/:id" element={<DetailVideo />} />
        <Route path="/dzikir" element={<Dzikir />} />
        <Route path="/dzikir/almasurat" element={<Almasurat />} />
        <Route path="/dzikir/almasurat/pagi" element={<DzikirPagiSugro />} />
        <Route path="/dzikir/almasurat/petang" element={<DzikirPetangSugro />} />
        <Route path="/jadwal-sholat" element={<JadwalSholat />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/tes" element={<Tes />} />
        <Route path="/quran/games/tebak-ayat" element={<TebakAyat />} />
        <Route path="/kalender" element={<Kalender />} />
        <Route path="/quran" element={<HomeQuran />} />
        <Route path="/quran/:tab?" element={<HomeQuran />} />
        <Route path="/quran/juz/:id" element={<DetailPerJuz />} />
        <Route path="/quran/surah/:id" element={<DetailPerSurah />} />
        <Route path="/quran/surah/:id/:verseNumber" element={<DetailPerSurah />} />

        {/* Route Games */}
        <Route path="/game" element={<Games />} />
        <Route path="/history" element={<History />} />
        <Route path="/game/sambung-ayat/juz/1" element={<Juz1 />} />
        <Route path="/game/sambung-ayat/juz/2" element={<Juz2 />} />
        <Route path="/game/sambung-ayat/juz/3" element={<Juz3 />} />
        <Route path="/game/sambung-ayat/juz/4" element={<Juz4 />} />
        <Route path="/game/sambung-ayat/juz/5" element={<Juz5 />} />
        <Route path="/game/sambung-ayat/juz/25" element={<Juz25 />} />
        <Route path="/game/sambung-ayat/juz/26" element={<Juz26 />} />
        <Route path="/game/sambung-ayat/juz/27" element={<Juz27 />} />
        <Route path="/game/sambung-ayat/juz/28" element={<Juz28 />} />
        <Route path="/game/sambung-ayat/juz/29" element={<Juz29 />} />
        <Route path="/game/sambung-ayat/juz/30" element={<Juz30 />} />

        <Route path="/game/sambung-ayat/surah/:surahNumber" element={<SurahSambungAyat />} />
        {/* Catch-all untuk halaman yang tidak ada */}
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
