import React from 'react'
import BottomNav from '../components/BottomNav'
import Footer from '../components/Footer'
import NavbarWaktuSholat from '../components/NavWaktuSholat'
import PrayerTimeManager from '../components/PrayerTimeManager'

export default function Home() {
  return (
    <div className="min-h-screen pb-20">
      <PrayerTimeManager>
        {({nextPrayer, nextPrayerTime, countdown, selectedCity, handleCitySelect }) => (
          <>
            <NavbarWaktuSholat
              onCitySelect={handleCitySelect}
              nextPrayer={nextPrayer}
              nextPrayerTime={nextPrayerTime}
              countdown={countdown}
              selectedCity={selectedCity}
            />

            {/* tempat isi kontennya */}
            <div className="container mx-auto px-4 pt-24">
              <h1>ini untuk isi halalaman</h1>
            </div>
          </>
        )}
      </PrayerTimeManager>
      <BottomNav />
      <Footer/>
    </div>
  )
}