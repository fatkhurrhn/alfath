import React, { useEffect, useState } from 'react'
import BottomNav from '../components/BottomNav'
import NavbarWaktuSholat from '../components/NavWaktuSholat'
import PrayerTimeManager from '../components/PrayerTimeManager'
import Donate from '../components/Donate'
export default function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    document.title = "Home - Islamic";

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format tanggal & jam
  const formattedDate = currentTime.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
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
            <div className="container mx-auto max-w-5xl px-5 pt-24">
              <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                Jadwal Sholat Hari Ini
              </h1>
              <p className="text-gray-600 text-center mb-8">
                {formattedDate}
              </p>

              {/* List Style */}
              <div className="bg-white rounded-2xl border divide-y divide-gray-200">
                {[
                  { name: "Subuh", time: prayerTimes?.Subuh },
                  { name: "Dzuhur", time: prayerTimes?.Dzuhur },
                  { name: "Ashar", time: prayerTimes?.Ashar },
                  { name: "Maghrib", time: prayerTimes?.Maghrib },
                  { name: "Isya", time: prayerTimes?.Isya },
                ].map((prayer) => (
                  <div
                    key={prayer.name}
                    className={`flex items-center justify-between px-6 py-4 transition 
                      ${nextPrayer === prayer.name ? "bg-blue-50 border-l-4 border-blue-500" : ""}
                    `}
                  >
                    <span className="text-lg font-medium text-gray-800">
                      {prayer.name}
                    </span>
                    <span
                      className={`text-lg font-semibold 
                        ${nextPrayer === prayer.name ? "text-blue-600" : "text-gray-700"}
                      `}
                    >
                      {prayer.time || "-"}
                    </span>
                  </div>
                ))}
              </div>
              <Donate/>
            </div>
          </>
        )}
      </PrayerTimeManager>
      <BottomNav />
    </div>
  )
}
