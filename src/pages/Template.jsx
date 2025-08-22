import React, { useEffect } from 'react'
import BottomNav from '../components/BottomNav'
import NavbarWaktuSholat from '../components/NavWaktuSholat'
import PrayerTimeManager from '../components/PrayerTimeManager'

export default function Home() {
  useEffect(() => {
    document.title = "Home - Fatkhurrhn";
  }, []);
  
  return (
    <div className="min-h-screen pb-20">
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
            <div className="container mx-auto max-w-5xl mx-auto px-5 pt-24">
              <h1>ini untuk halalaman</h1>
            </div>
          </>
        )}
      </PrayerTimeManager>
      <BottomNav />
    </div>
  )
}