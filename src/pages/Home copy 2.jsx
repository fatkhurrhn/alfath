import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import NavbarWaktuSholat from '../components/NavWaktuSholat'
import PrayerTimeManager from '../components/PrayerTimeManager'
import Donate from '../components/Donate'

// Fallback ayah data in case of errors
const FALLBACK_AYAH = {
  surahNumber: 112,
  surahName: "Al-Ikhlas",
  ayahNumber: 1,
  arabicText: "قُلْ هُوَ اللّٰهُ اَحَدٌۚ",
  translation: "Katakanlah (Muhammad), 'Dialah Allah, Yang Maha Esa.'",
  tafsir: "Allah menyuruh Nabi Muhammad menjawab pertanyaan tentang sifat Tuhannya"
}

export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [randomAyah, setRandomAyah] = useState(FALLBACK_AYAH);
  const [showTafsir, setShowTafsir] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [greeting, setGreeting] = useState("");

  // Set greeting based on time of day
  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Selamat Pagi");
    } else if (hour >= 12 && hour < 15) {
      setGreeting("Selamat Siang");
    } else if (hour >= 15 && hour < 19) {
      setGreeting("Selamat Sore");
    } else {
      setGreeting("Selamat Malam");
    }
  }, [currentTime]);

  // Memoized function to fetch random ayah
  const getRandomAyah = useCallback(async () => {
    try {
      const randomSurah = Math.floor(Math.random() * 114) + 1;
      const response = await fetch(`/data/surah/${randomSurah}.json`);

      if (!response.ok) throw new Error('Failed to fetch surah');

      const surahData = await response.json();
      const surah = surahData[randomSurah.toString()];
      const totalAyah = parseInt(surah.number_of_ayah);
      const randomAyahNumber = Math.floor(Math.random() * totalAyah) + 1;

      setRandomAyah({
        surahNumber: surah.number,
        surahName: surah.name_latin,
        ayahNumber: randomAyahNumber,
        arabicText: surah.text[randomAyahNumber.toString()],
        translation: surah.translations.id.text[randomAyahNumber.toString()],
        tafsir: surah.tafsir.id.kemenag.text[randomAyahNumber.toString()]
      });
    } catch (error) {
      console.error("Error fetching random ayah:", error);
      setRandomAyah(FALLBACK_AYAH);
    }
  }, []);

  useEffect(() => {
    document.title = "Home - Islamic";
    getRandomAyah(); // Fetch random ayah on component mount

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [getRandomAyah]);

  // Format tanggal & jam
  const formattedDate = currentTime.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="min-h-screen pb-20 bg-white">
      <PrayerTimeManager>
        {({ nextPrayer, nextPrayerTime, countdown, selectedCity, handleCitySelect, prayerTimes }) => (
          <>
            <NavbarWaktuSholat
              onCitySelect={handleCitySelect}
              nextPrayer={nextPrayer}
              nextPrayerTime={nextPrayerTime}
              countdown={countdown}
              selectedCity={selectedCity}
            />

            {/* Konten utama */}
            <div className="container mx-auto max-w-5xl px-4 pt-20 pb-16">
              {/* Header dengan Salam dan Waktu */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{greeting}</h1>
                <p className="text-gray-600 text-sm mt-1">{formattedDate}</p>
                <p className="text-3xl font-semibold text-gray-800 mt-2">{formattedTime}</p>
              </div>

              {/* Ayah Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 mb-6 shadow-sm">
                <p className="text-2xl text-center text-gray-800 font-uthmani leading-loose">{randomAyah.arabicText}</p>
                <div className="text-xs text-center text-gray-600 mt-3">
                  <span 
                    className="cursor-pointer hover:text-blue-600 mx-1 px-2 py-1 bg-white rounded-full shadow-sm"
                    onClick={() => setShowTafsir(true)}
                  >
                    {randomAyah.surahName} : {randomAyah.ayahNumber} | Tafsir
                  </span>
                  <span 
                    className="cursor-pointer hover:text-blue-600 mx-1 px-2 py-1 bg-white rounded-full shadow-sm"
                    onClick={() => setShowTranslation(true)}
                  >
                    Terjemah
                  </span>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                <Link to="/quran" className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl text-green-500 mb-1">📖</div>
                  <span className="text-xs text-center text-gray-700">Al-Quran</span>
                </Link>
                <Link to="/dzikir" className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl text-blue-500 mb-1">📿</div>
                  <span className="text-xs text-center text-gray-700">Dzikir</span>
                </Link>
                <Link to="/doa" className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl text-purple-500 mb-1">🙏</div>
                  <span className="text-xs text-center text-gray-700">Doa</span>
                </Link>
                <Link to="/kiblat" className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl text-yellow-500 mb-1">🕋</div>
                  <span className="text-xs text-center text-gray-700">Kiblat</span>
                </Link>
              </div>

              {/* Jadwal Sholat */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-800">Jadwal Sholat</h2>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {selectedCity || "Pilih Kota"}
                  </span>
                </div>
                
                <div className="bg-white rounded-2xl border p-3 shadow-sm">
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { name: "Subuh", time: prayerTimes?.Subuh },
                      { name: "Dzuhur", time: prayerTimes?.Dzuhur },
                      { name: "Ashar", time: prayerTimes?.Ashar },
                      { name: "Maghrib", time: prayerTimes?.Maghrib },
                      { name: "Isya", time: prayerTimes?.Isya },
                    ].map((prayer) => (
                      <div
                        key={prayer.name}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition ${nextPrayer === prayer.name ? "bg-blue-50 border border-blue-400" : ""}`}
                      >
                        <span className="text-xs font-medium text-gray-700">{prayer.name}</span>
                        <span
                          className={`text-sm font-semibold ${nextPrayer === prayer.name ? "text-blue-600" : "text-gray-800"}`}
                        >
                          {prayer.time || "-"}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Countdown to next prayer */}
                  <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-600">Menuju {nextPrayer}</p>
                    <p className="text-sm font-semibold text-blue-600">{countdown}</p>
                  </div>
                </div>
              </div>

              {/* Featured Content */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Rekomendasi Untukmu</h2>
                <div className="grid grid-cols-2 gap-3">
                  <Link to="/dzikir/pagi" className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center">
                      <div className="text-2xl text-yellow-500 mr-2">🌅</div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">Dzikir Pagi</h3>
                        <p className="text-xs text-gray-600">Baca sekarang</p>
                      </div>
                    </div>
                  </Link>
                  <Link to="/doa/harian" className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center">
                      <div className="text-2xl text-green-500 mr-2">📖</div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">Doa Harian</h3>
                        <p className="text-xs text-gray-600">Doa sehari-hari</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              <Donate />
            </div>

            {/* Modal Tafsir */}
            {showTafsir && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">
                      Tafsir {randomAyah.surahName} Ayat {randomAyah.ayahNumber}
                    </h3>
                    <button
                      className="text-gray-500 hover:text-gray-700 text-xl"
                      onClick={() => setShowTafsir(false)}
                    >
                      &times;
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm text-justify">{randomAyah.tafsir}</p>
                </div>
              </div>
            )}

            {/* Modal Terjemah */}
            {showTranslation && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">
                      Terjemah {randomAyah.surahName} Ayat {randomAyah.ayahNumber}
                    </h3>
                    <button
                      className="text-gray-500 hover:text-gray-700 text-xl"
                      onClick={() => setShowTranslation(false)}
                    >
                      &times;
                    </button>
                  </div>
                  <p className="text-xl text-center text-gray-800 font-uthmani mb-4">{randomAyah.arabicText}</p>
                  <p className="text-gray-700 text-sm text-justify">"{randomAyah.translation}"</p>
                </div>
              </div>
            )}
          </>
        )}
      </PrayerTimeManager>
      <BottomNav />
    </div>
  )
}