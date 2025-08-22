import React, { useEffect, useState, useCallback } from 'react'
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
            <div className="container mx-auto max-w-5xl px-5 pt-20">
              {/* Ayah Card */}
              <div className="grid grid-cols-1">
                <div className="p-4">
                  <p className="text-2xl text-center text-gray-800 font-uthmani">{randomAyah.arabicText}</p>
                  <div className="text-[11px] text-center text-gray-600 mt-2">
                    <span 
                      className="cursor-pointer hover:text-blue-600 mx-1"
                      onClick={() => setShowTafsir(true)}
                    >
                      [ {randomAyah.surahName} : {randomAyah.ayahNumber} | Tafsir
                    </span>
                    <span className="mx-1">-</span>
                    <span 
                      className="cursor-pointer hover:text-blue-600 mx-1"
                      onClick={() => setShowTranslation(true)}
                    >
                      Terjemah ]
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-[1px] my-4 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 max-w-lg mx-auto"></div>

              {/* jadwal sholat */}
              <div>
                <p className="text-gray-600 text-center mb-2 text-sm">{formattedDate}</p>
                {/* Grid Style */}
                <div className="bg-white rounded-2xl border grid grid-cols-5 p-2">
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