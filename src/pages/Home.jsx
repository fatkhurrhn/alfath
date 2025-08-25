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
    // Sembunyikan splash screen setelah 3 detik
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center animate-fade-in">
          <img 
            src="/logo-splash.png" 
            alt="Ihsanly Logo" 
            className="w-32 h-32 mb-0 animate-pulse"
            style={{ 
              animation: 'pulse 2s infinite, scaleIn 1.5s ease-out' 
            }}
          />
          <h1 
            className="text-2xl font-bold mt-1.5 text-gray-800 animate-slide-in"
            style={{ 
              animation: 'slideIn 1s ease-out 0.5s both, fadeIn 1.5s ease-out 0.5s both' 
            }}
          >
            Ihsanly
          </h1>
          <p 
            className="text-gray-600 animate-fade-in"
            style={{ animation: 'fadeIn 1.5s ease-out 1s both' }}
          >
            Daily Muslim
          </p>
        </div>

        {/* Menambahkan CSS untuk animasi */}
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            @keyframes slideIn {
              from { 
                opacity: 0;
                transform: translateY(20px);
              }
              to { 
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes scaleIn {
              0% { 
                opacity: 0;
                transform: scale(0.8);
              }
              70% {
                transform: scale(1.05);
              }
              100% { 
                opacity: 1;
                transform: scale(1);
              }
            }
            
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }
            
            .animate-fade-in {
              animation: fadeIn 1.5s ease-out;
            }
            
            .animate-slide-in {
              animation: slideIn 1s ease-out;
            }
            
            .animate-pulse {
              animation: pulse 2s infinite;
            }
          `}
        </style>
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