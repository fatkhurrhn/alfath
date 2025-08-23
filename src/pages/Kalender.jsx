import React, { useEffect } from 'react'
import BottomNav from '../components/BottomNav'
import NavbarWaktuSholat from '../components/NavWaktuSholat'
import PrayerTimeManager from '../components/PrayerTimeManager'
import HybridCalendar from '../components/HybridCalendar'

export default function Home() {
  useEffect(() => {
    document.title = "Kalender - Islamic";
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
              <HybridCalendar/>
            </div>
          </>
        )}
      </PrayerTimeManager>
      <BottomNav />
    </div>
  )
}
