// src/pages/Home.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import PrayerTimeManager from '../components/PrayerTimeManager'
import Donate from '../components/Donate'
import NavbarWaktuSholat from '../components/NavWaktuSholat'

// Import komponen-komponen home
import DateDisplay from '../components/home/DateDisplay'
import AyahOfTheDay from '../components/home/AyahOfTheDay'
import PrayerReminder from '../components/home/PrayerReminder'
import PrayerSchedule from '../components/home/PrayerSchedule'
import IslamicTips from '../components/home/IslamicTips'
import QuranReminder from '../components/home/QuranReminder'
import QuickMenu from '../components/home/QuickMenu'
import IslamicCalendar from '../components/home/IslamicCalendar'
import Recommendations from '../components/home/Recommendations'
import NewsSection from '../components/home/NewsSection'
import FeatureGrid from '../components/home/FeatureGrid'

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Sembunyikan splash screen setelah 2 detik
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 25000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <img 
            src="/logo.png" 
            alt="Ihsanly Logo" 
            className="w-32 h-32 mb-[-3px]"
          />
          <h1 className="text-2xl font-bold text-gray-800">Ihsanly</h1>
          <p className="text-gray-600">Daily Muslim</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-1 bg-gray-50">
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

            <div className="container mx-auto max-w-xl px-4 md:mb-0 mb-[70px] border-x border-gray-200 pt-2">
              {/* Salam & waktu */}
              <DateDisplay />

              {/* Ayat acak */}
              <AyahOfTheDay />

              <FeatureGrid />

              {/* Pengingat Sholat */}
              <PrayerReminder nextPrayer={nextPrayer} />

              {/* Jadwal Sholat */}
              <PrayerSchedule
                prayerTimes={prayerTimes}
                nextPrayer={nextPrayer}
                selectedCity={selectedCity}
              />

              {/* Tips Islami */}
              <IslamicTips />

              {/* Reminder Baca Quran */}
              <QuranReminder />

              {/* Quick menu */}
              <QuickMenu />

              {/* Kalender Islam */}
              <IslamicCalendar />

              {/* Rekomendasi */}
              <Recommendations />

              {/* News Islamic */}
              <NewsSection />

              {/* Donate */}
              <Donate />
            </div>
          </>
        )}
      </PrayerTimeManager>
      <BottomNav />
    </div>
  )
}