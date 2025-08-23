import React, { useEffect } from 'react'
import BottomNav from '../components/BottomNav'
import NavbarWaktuSholat from '../components/NavWaktuSholat'
import PrayerTimeManager from '../components/PrayerTimeManager'

export default function ALQuran() {
  useEffect(() => {
    document.title = "Al Quran - Islamic";
  }, []);
  
  return (
    <div className="min-h-screen">
      <PrayerTimeManager>
        {({ nextPrayer, nextPrayerTime, countdown, selectedCity, handleCitySelect }) => (
          <>
            <NavbarWaktuSholat
              onCitySelect={handleCitySelect}
              nextPrayer={nextPrayer}
              nextPrayerTime={nextPrayerTime}
              countdown={countdown}
              selectedCity={selectedCity}
            />

            {/* tempat isi kontennya */}
            <div className="container mx-auto max-w-xl px-4 md:mb-0 pt-20 mb-[70px] border-x border-gray-200">
              <h1>ini untuk halalaman</h1>
            </div>
          </>
        )}
      </PrayerTimeManager>
      <BottomNav />
    </div>
  )
}

// untuk icon gunain cdn yg udh aku taro di index.html (  <link href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css" rel="stylesheet" /> )dan penggunaannya kaya gini <i class="ri-music-2-line"></i> dst... dan untuk style warna pake perpaduan whith dan gray