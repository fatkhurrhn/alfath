import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dzikir from "./pages/dzikir/Dzikir";
import DzikirPagiSugro from "./pages/dzikir/almasurat/PagiSugro";
import DzikirPetangSugro from "./pages/dzikir/almasurat/PetangSugro";
import JadwalSholat from "./pages/islamic/JadwalSholat";
import Almasurat from "./pages/dzikir/Almasurat";
import Donate from "./pages/Donate";
import AutoToTop from "./components/AutoToTop";
import Tes from "./pages/Tes";
import Kalender from "./pages/islamic/Kalender";
import DetailPerSurah from "./pages/alquran/DetailPerSurah";
import DetailPerJuz from "./pages/alquran/DetailPerJuz";


import QuranPage from './components/QuranPage';
import Tess from './components/Home';
import HomeQuran from "./pages/alquran/HomeQuran";
import TebakAyat from "./pages/game/TebakAyat";
import Games from "./pages/game/GameHome";
import History from "./pages/game/History";

import Juz30 from "./pages/game/sambungayat/Juz30";
import Juz1 from "./pages/game/sambungayat/Juz1";
import Juz29 from "./pages/game/sambungayat/Juz29";
import Juz28 from "./pages/game/sambungayat/Juz28";
import Juz27 from "./pages/game/sambungayat/Juz27";
import Juz2 from "./pages/game/sambungayat/Juz2";
import Juz3 from "./pages/game/sambungayat/Juz3";
import Juz5 from "./pages/game/sambungayat/Juz5";
import Juz4 from "./pages/game/sambungayat/Juz4";
import Juz26 from "./pages/game/sambungayat/Juz26";
import Juz25 from "./pages/game/sambungayat/Juz25";

import SAS67 from "./pages/game/sambungayat/Surah67";

import DetailVideo from "./pages/vidmotivasi/DetailVideo";
import VideoList from "./pages/vidmotivasi/VideoList";
import StoryThur from "./pages/vidmotivasi/StoryThur";
import NewsListe from "./pages/news/NewsList";
import NewsDetail from "./pages/news/NewsDetail";
import Kiblat from "./pages/islamic/Kiblat";
import QuotesList from "./pages/quotes/QuotesList";
import QuotesAdd from "./pages/quotes/QuotesAdd";
import EdukasiHome from "./pages/edukasi/EdukasiHome";
import ComingSoon from "./pages/maintenance/ComingSoon";
import SettingHome from "./pages/settings/SettingHome";
import SelfDevHome from "./pages/selfdev/SelfDevHome";
import DoaList from "./pages/doa/DoaList";

function App() {
  return (
    <Router>
      <AutoToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tes" element={<Tes />} />
        <Route path="/tess" element={<Tess />} />

        <Route path="/donate" element={<Donate />} />
        <Route path="/kiblat" element={<Kiblat />} />
        <Route path="/kalender" element={<Kalender />} />
        <Route path="/jadwal-sholat" element={<JadwalSholat />} />

        <Route path="/selfdev" element={<SelfDevHome />} />

        <Route path="/doa" element={<DoaList />} />
        
        <Route path="/edukasi" element={<EdukasiHome />} />

        <Route path="/settings" element={<SettingHome />} />

        <Route path="/news" element={<NewsListe />} />
        <Route path="/news/:id" element={<NewsDetail />} />

        <Route path="/dzikir" element={<Dzikir />} />
        <Route path="/dzikir/almasurat" element={<Almasurat />} />
        <Route path="/dzikir/almasurat/pagi" element={<DzikirPagiSugro />} />
        <Route path="/dzikir/almasurat/petang" element={<DzikirPetangSugro />} />

        <Route path="/quotes" element={<QuotesList />} />
        <Route path="/quotes/add" element={<QuotesAdd />} />

        <Route path="/video" element={<VideoList />} />
        <Route path="/detail/video/:id" element={<DetailVideo />} />
        <Route path="/profile/storythur" element={<StoryThur />} />

        <Route path="/quran" element={<HomeQuran />} />
        <Route path="/page/:pageNumber" element={<QuranPage />} />
        <Route path="/quran/:tab?" element={<HomeQuran />} />
        <Route path="/quran/juz/:id" element={<DetailPerJuz />} />
        <Route path="/quran/surah/:id" element={<DetailPerSurah />} />
        <Route path="/quran/surah/:id/:verseNumber" element={<DetailPerSurah />} />

        {/* Route Games */}
        <Route path="/game" element={<Games />} />
        <Route path="/history" element={<History />} />

        <Route path="/game/tebak-ayat" element={<TebakAyat />} />

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

        <Route path="/game/sambung-ayat/surah/:surahNumber" element={<SAS67 />} />

        {/* Catch-all untuk halaman yang tidak ada */}
        <Route path="/comingsoon" element={<ComingSoon />} />
        <Route path="*" element={<Navigate to="/comingsoon" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
