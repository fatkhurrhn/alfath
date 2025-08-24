// src/pages/Home.jsx
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import PrayerTimeManager from '../components/PrayerTimeManager'
import Donate from '../components/Donate'
import NavbarWaktuSholat from '../components/NavWaktuSholat'

// Import komponen-komponen home
import DateDisplay from '../components/home/DateDisplay'
import AyahOfTheDay from '../components/home/AyahOfTheDay'
import HadithSection from '../components/home/HadithSection'
import PrayerReminder from '../components/home/PrayerReminder'
import PrayerSchedule from '../components/home/PrayerSchedule'
import IslamicTips from '../components/home/IslamicTips'
import QuranReminder from '../components/home/QuranReminder'
import QuickMenu from '../components/home/QuickMenu'
import IslamicCalendar from '../components/home/IslamicCalendar'
import Recommendations from '../components/home/Recommendations'
import NewsSection from '../components/home/NewsSection'

export default function Home() {
  // Set judul halaman
  useEffect(() => {
    document.title = "Islamic App";
  }, []);

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

              {/* Hadits & Quotes */}
              <HadithSection />

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