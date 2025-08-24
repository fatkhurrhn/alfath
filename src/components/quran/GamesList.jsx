import React, { useState } from "react";
import { Link } from "react-router-dom";

const surahs = [
  { number: 1, name: "Al-Fatihah", slug: "al-fatihah", verses: 7 },
  { number: 2, name: "Al-Baqarah", slug: "al-baqarah", verses: 286 },
  { number: 3, name: "Ali Imran", slug: "ali-imran", verses: 200 },
  { number: 4, name: "An-Nisa", slug: "an-nisa", verses: 176 },
  { number: 5, name: "Al-Maidah", slug: "al-maidah", verses: 120 },
  { number: 6, name: "Al-An'am", slug: "al-anam", verses: 165 },
  { number: 7, name: "Al-A'raf", slug: "al-araf", verses: 206 },
  { number: 8, name: "Al-Anfal", slug: "al-anfal", verses: 75 },
  { number: 9, name: "At-Taubah", slug: "at-taubah", verses: 129 },
  { number: 10, name: "Yunus", slug: "yunus", verses: 109 },
  { number: 11, name: "Hud", slug: "hud", verses: 123 },
  { number: 12, name: "Yusuf", slug: "yusuf", verses: 111 },
  { number: 13, name: "Ar-Ra'd", slug: "ar-rad", verses: 43 },
  { number: 14, name: "Ibrahim", slug: "ibrahim", verses: 52 },
  { number: 15, name: "Al-Hijr", slug: "al-hijr", verses: 99 },
  { number: 16, name: "An-Nahl", slug: "an-nahl", verses: 128 },
  { number: 17, name: "Al-Isra", slug: "al-isra", verses: 111 },
  { number: 18, name: "Al-Kahf", slug: "al-kahf", verses: 110 },
  { number: 19, name: "Maryam", slug: "maryam", verses: 98 },
  { number: 20, name: "Ta-Ha", slug: "taha", verses: 135 },
  { number: 21, name: "Al-Anbiya", slug: "al-anbiya", verses: 112 },
  { number: 22, name: "Al-Hajj", slug: "al-hajj", verses: 78 },
  { number: 23, name: "Al-Mu'minun", slug: "al-muminun", verses: 118 },
  { number: 24, name: "An-Nur", slug: "an-nur", verses: 64 },
  { number: 25, name: "Al-Furqan", slug: "al-furqan", verses: 77 },
  { number: 26, name: "Asy-Syu'ara", slug: "asy-syuara", verses: 227 },
  { number: 27, name: "An-Naml", slug: "an-naml", verses: 93 },
  { number: 28, name: "Al-Qasas", slug: "al-qasas", verses: 88 },
  { number: 29, name: "Al-Ankabut", slug: "al-ankabut", verses: 69 },
  { number: 30, name: "Ar-Rum", slug: "ar-rum", verses: 60 },
  { number: 31, name: "Luqman", slug: "luqman", verses: 34 },
  { number: 32, name: "As-Sajdah", slug: "as-sajdah", verses: 30 },
  { number: 33, name: "Al-Ahzab", slug: "al-ahzab", verses: 73 },
  { number: 34, name: "Saba", slug: "saba", verses: 54 },
  { number: 35, name: "Fatir", slug: "fatir", verses: 45 },
  { number: 36, name: "Yasin", slug: "yasin", verses: 83 },
  { number: 37, name: "As-Saffat", slug: "as-saffat", verses: 182 },
  { number: 38, name: "Sad", slug: "sad", verses: 88 },
  { number: 39, name: "Az-Zumar", slug: "az-zumar", verses: 75 },
  { number: 40, name: "Ghafir", slug: "ghafir", verses: 85 },
  { number: 41, name: "Fussilat", slug: "fussilat", verses: 54 },
  { number: 42, name: "Asy-Syura", slug: "asy-syura", verses: 53 },
  { number: 43, name: "Az-Zukhruf", slug: "az-zukhruf", verses: 89 },
  { number: 44, name: "Ad-Dukhan", slug: "ad-dukhan", verses: 59 },
  { number: 45, name: "Al-Jasiyah", slug: "al-jasiyah", verses: 37 },
  { number: 46, name: "Al-Ahqaf", slug: "al-ahqaf", verses: 35 },
  { number: 47, name: "Muhammad", slug: "muhammad", verses: 38 },
  { number: 48, name: "Al-Fath", slug: "al-fath", verses: 29 },
  { number: 49, name: "Al-Hujurat", slug: "al-hujurat", verses: 18 },
  { number: 50, name: "Qaf", slug: "qaf", verses: 45 },
  { number: 51, name: "Az-Zariyat", slug: "az-zariyat", verses: 60 },
  { number: 52, name: "At-Tur", slug: "at-tur", verses: 49 },
  { number: 53, name: "An-Najm", slug: "an-najm", verses: 62 },
  { number: 54, name: "Al-Qamar", slug: "al-qamar", verses: 55 },
  { number: 55, name: "Ar-Rahman", slug: "ar-rahman", verses: 78 },
  { number: 56, name: "Al-Waqi'ah", slug: "al-waqiah", verses: 96 },
  { number: 57, name: "Al-Hadid", slug: "al-hadid", verses: 29 },
  { number: 58, name: "Al-Mujadilah", slug: "al-mujadilah", verses: 22 },
  { number: 59, name: "Al-Hasyr", slug: "al-hasyr", verses: 24 },
  { number: 60, name: "Al-Mumtahanah", slug: "al-mumtahanah", verses: 13 },
  { number: 61, name: "As-Saff", slug: "as-saff", verses: 14 },
  { number: 62, name: "Al-Jumu'ah", slug: "al-jumuah", verses: 11 },
  { number: 63, name: "Al-Munafiqun", slug: "al-munafiqun", verses: 11 },
  { number: 64, name: "At-Taghabun", slug: "at-taghabun", verses: 18 },
  { number: 65, name: "At-Talaq", slug: "at-talaq", verses: 12 },
  { number: 66, name: "At-Tahrim", slug: "at-tahrim", verses: 12 },
  { number: 67, name: "Al-Mulk", slug: "al-mulk", verses: 30 },
  { number: 68, name: "Al-Qalam", slug: "al-qalam", verses: 52 },
  { number: 69, name: "Al-Haqqah", slug: "al-haqqah", verses: 52 },
  { number: 70, name: "Al-Ma'arij", slug: "al-maarij", verses: 44 },
  { number: 71, name: "Nuh", slug: "nuh", verses: 28 },
  { number: 72, name: "Al-Jinn", slug: "al-jinn", verses: 28 },
  { number: 73, name: "Al-Muzzammil", slug: "al-muzzammil", verses: 20 },
  { number: 74, name: "Al-Muddaththir", slug: "al-muddaththir", verses: 56 },
  { number: 75, name: "Al-Qiyamah", slug: "al-qiyamah", verses: 40 },
  { number: 76, name: "Al-Insan", slug: "al-insan", verses: 31 },
  { number: 77, name: "Al-Mursalat", slug: "al-mursalat", verses: 50 },
  { number: 78, name: "An-Naba", slug: "an-naba", verses: 40 },
  { number: 79, name: "An-Nazi'at", slug: "an-naziat", verses: 46 },
  { number: 80, name: "Abasa", slug: "abasa", verses: 42 },
  { number: 81, name: "At-Takwir", slug: "at-takwir", verses: 29 },
  { number: 82, name: "Al-Infitar", slug: "al-infitar", verses: 19 },
  { number: 83, name: "Al-Mutaffifin", slug: "al-mutaffifin", verses: 36 },
  { number: 84, name: "Al-Insyiqaq", slug: "al-insyiqaq", verses: 25 },
  { number: 85, name: "Al-Buruj", slug: "al-buruj", verses: 22 },
  { number: 86, name: "At-Tariq", slug: "at-tariq", verses: 17 },
  { number: 87, name: "Al-A'la", slug: "al-ala", verses: 19 },
  { number: 88, name: "Al-Gasyiyah", slug: "al-gasyiyah", verses: 26 },
  { number: 89, name: "Al-Fajr", slug: "al-fajr", verses: 30 },
  { number: 90, name: "Al-Balad", slug: "al-balad", verses: 20 },
  { number: 91, name: "Asy-Syams", slug: "asy-syams", verses: 15 },
  { number: 92, name: "Al-Lail", slug: "al-lail", verses: 21 },
  { number: 93, name: "Ad-Duha", slug: "ad-duha", verses: 11 },
  { number: 94, name: "Asy-Syarh", slug: "asy-syarh", verses: 8 },
  { number: 95, name: "At-Tin", slug: "at-tin", verses: 8 },
  { number: 96, name: "Al-Alaq", slug: "al-alaq", verses: 19 },
  { number: 97, name: "Al-Qadr", slug: "al-qadr", verses: 5 },
  { number: 98, name: "Al-Bayinah", slug: "al-bayinah", verses: 8 },
  { number: 99, name: "Az-Zalzalah", slug: "az-zalzalah", verses: 8 },
  { number: 100, name: "Al-Adiyat", slug: "al-adiyat", verses: 11 },
  { number: 101, name: "Al-Qari'ah", slug: "al-qariah", verses: 11 },
  { number: 102, name: "At-Takatsur", slug: "at-takatsur", verses: 8 },
  { number: 103, name: "Al-Asr", slug: "al-asr", verses: 3 },
  { number: 104, name: "Al-Humazah", slug: "al-humazah", verses: 9 },
  { number: 105, name: "Al-Fil", slug: "al-fil", verses: 5 },
  { number: 106, name: "Quraisy", slug: "quraisy", verses: 4 },
  { number: 107, name: "Al-Ma'un", slug: "al-maun", verses: 7 },
  { number: 108, name: "Al-Kausar", slug: "al-kausar", verses: 3 },
  { number: 109, name: "Al-Kafirun", slug: "al-kafirun", verses: 6 },
  { number: 110, name: "An-Nasr", slug: "an-nasr", verses: 3 },
  { number: 111, name: "Al-Lahab", slug: "al-lahab", verses: 5 },
  { number: 112, name: "Al-Ikhlas", slug: "al-ikhlas", verses: 4 },
  { number: 113, name: "Al-Falaq", slug: "al-falaq", verses: 5 },
  { number: 114, name: "An-Nas", slug: "an-nas", verses: 6 },
];

const juzList = Array.from({ length: 30 }, (_, i) => i + 1);

const games = [
  { id: 1, slug: "tebak-ayat", name: "Tebak Ayat", icon: "ri-question-answer-line", modes: ["surah", "juz"] },
  { id: 2, slug: "sambung-ayat", name: "Sambung Ayat", icon: "ri-link-m", modes: ["surah", "juz"] },
  { id: 3, slug: "tebak-surah", name: "Tebak Surah", icon: "ri-book-2-line", modes: [] },
  { id: 4, slug: "tebak-arti-surah", name: "Tebak Arti Surah", icon: "ri-translate-2", modes: [] },
  { id: 5, slug: "tebak-juz", name: "Tebak Juz", icon: "ri-numbers-line", modes: [] },
  { id: 6, slug: "tebak-tempat-turun", name: "Tebak Tempat Turun", icon: "ri-map-pin-line", modes: [] },
];

const GamesList = () => {
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState({});
  const [selectedLetter] = useState(null);

  // Pisahkan game dengan mode dan tanpa mode
  const gamesWithModes = games.filter(game => game.modes.length > 0);
  const gamesWithoutModes = games.filter(game => game.modes.length === 0);

  return (
    <div className="p-2 pb-2 bg-gray-50 min-h-screen">

      {/* Game dengan mode (Tebak Ayat & Sambung Ayat) */}
      <div className="space-y-3 mb-6 pt-2">
        {gamesWithModes.map((game) => {
          const filteredSurahs = surahs.filter((s) =>
            (search[game.id] || "")
              ? s.name.toLowerCase().includes(search[game.id].toLowerCase())
              : true
          );

          return (
            <div
              key={game.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              {/* Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setExpanded(expanded === game.id ? null : game.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <i className={`${game.icon} text-lg text-gray-700`}></i>
                  </div>
                  <h3 className="font-medium text-gray-800">{game.name}</h3>
                </div>
                <i
                  className={`ri-arrow-down-s-line text-gray-500 transition-transform ${
                    expanded === game.id ? "rotate-180" : ""
                  }`}
                ></i>
              </div>

              {/* Content */}
              <div
                className={`transition-all duration-300 ${
                  expanded === game.id ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <div className="p-4 space-y-5 border-t border-gray-100">
                  {/* Per Surah */}
                  {game.modes.includes("surah") && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2 text-sm">
                        <i className="ri-book-open-line text-gray-500"></i>
                        Pilih Surah
                      </h4>

                      {/* Search bar */}
                      <div className="relative mb-3">
                        <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input
                          type="text"
                          placeholder="Cari surah..."
                          value={search[game.id] || ""}
                          onChange={(e) =>
                            setSearch({ ...search, [game.id]: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-gray-50"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                        {filteredSurahs
                          .filter(surah => !selectedLetter || surah.name.startsWith(selectedLetter))
                          .map((surah) => (
                            <Link
                              key={surah.number}
                              to={`/quran/games/${game.slug}/surah/${surah.slug}`}
                              className="p-2.5 text-sm bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 flex flex-col border border-gray-200"
                            >
                              <span className="font-medium text-gray-800 ">{surah.name}</span>
                              <span className="text-xs text-gray-500 mt-1">{surah.verses} ayat</span>
                            </Link>
                          ))
                        }
                        
                        {filteredSurahs.filter(surah => !selectedLetter || surah.name.startsWith(selectedLetter)).length === 0 && (
                          <div className="col-span-2 text-center py-4">
                            <i className="ri-search-eye-line text-2xl text-gray-300 mb-2"></i>
                            <p className="text-xs text-gray-400">Surah tidak ditemukan</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Per Juz */}
                  {game.modes.includes("juz") && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2 text-sm">
                        <i className="ri-file-list-2-line text-gray-500"></i>
                        Pilih Juz
                      </h4>
                      <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-2 scrollbar-hide">
                        {juzList.map((juz) => (
                          <Link
                            key={juz}
                            to={`/quran/games/${game.slug}/juz/${juz}`}
                            className="px-2 py-2 text-sm text-center bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200 text-gray-800"
                          >
                            Juz {juz}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Game tanpa mode (langsung ke link game) */}
      <div className="mb-4">
        <h2 className="font-medium text-gray-700 mb-3 text-sm uppercase tracking-wide">Game Lainnya</h2>
        <div className="grid grid-cols-2 gap-3">
          {gamesWithoutModes.map((game) => (
            <Link
              key={game.id}
              to={`/quran/games/${game.slug}`}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md flex flex-col items-center justify-center text-center h-32"
            >
              <div className="p-2 bg-gray-100 rounded-lg mb-2">
                <i className={`${game.icon} text-lg text-gray-700`}></i>
              </div>
              <h3 className="font-medium text-gray-800 text-sm">{game.name}</h3>
              <p className="text-xs text-gray-500 mt-1">Mulai Game</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamesList;