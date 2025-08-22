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
            
          </>
        )}
      </PrayerTimeManager>
      <BottomNav />
    </div>
  )
}
