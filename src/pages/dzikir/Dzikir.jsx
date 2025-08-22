import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../../components/BottomNav';
import NavbarWaktuSholat from '../../components/NavWaktuSholat';
import PrayerTimeManager from '../../components/PrayerTimeManager';
import ScrollToTop from '../../components/ScrollToTop';

export default function Home() {
  useEffect(() => {
    document.title = "Dzikir - Islamic";
  }, []);

  // Ambil jam sekarang
  const now = new Date();
  const hour = now.getHours();

  // Tentukan rekomendasi dzikir berdasarkan jam
  let recommended = {
    title: 'Dzikir Harian',
    desc: 'Dzikir kapan saja, di mana saja',
    icon: 'ri-heart-pulse-line',
    color: 'text-teal-500',
    to: '/dzikir/harian',
  };

  if (hour >= 4 && hour < 10) {
    recommended = {
      title: 'Dzikir Pagi',
      desc: 'Subhanallah, Alhamdulillah, Allahu Akbar 33x',
      icon: 'ri-sun-line',
      color: 'text-yellow-500',
      to: '/dzikir/pagi-sugro',
    };
  } else if (hour >= 16 && hour < 20) {
    recommended = {
      title: 'Dzikir Sore / Petang',
      desc: 'Dzikir menjelang malam, penuh berkah',
      icon: 'ri-moon-line',
      color: 'text-indigo-500',
      to: '/dzikir/sore-sugro',
    };
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <ScrollToTop />

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

            {/* Konten Utama */}
            <div className="container mx-auto px-4 pt-24">

              {/* === REKOMENDASI DZIKIR HARIAN === */}
              <section className="py-8 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl mb-10">
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">✨ Rekomendasi Waktu Ini</h2>
                  <Link
                    to={recommended.to}
                    className="flex items-center p-5 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow transition-shadow duration-200"
                  >
                    <div className={`text-4xl ${recommended.color} flex-shrink-0`}>
                      <i className={recommended.icon}></i>
                    </div>
                    <div className="ml-5 text-left">
                      <h3 className="text-lg font-medium text-gray-800">{recommended.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{recommended.desc}</p>
                    </div>
                    <div className="ml-auto text-gray-400">
                      <i className="ri-arrow-right-s-line text-2xl"></i>
                    </div>
                  </Link>
                </div>
              </section>

              {/* === MENU DZIKIR === */}
              <section className="mb-0 max-w-5xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Dzikir Harian</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  <Link
                    to="/dzikir/pagi-petang"
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="text-3xl text-purple-500 mb-3">
                      <i className="ri-time-line"></i>
                    </div>
                    <h3 className="text-base font-medium text-gray-800 mb-1">Al-Ma'surat</h3>
                    <p className="text-gray-500 text-xs">Dzikir pagi & petang waktu penuh berkah</p>
                  </Link>
                  <Link
                    to="/dzikir/setelah-shalat"
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="text-3xl text-yellow-500 mb-3">
                      <i className="ri-sun-line"></i>
                    </div>
                    <h3 className="text-base font-medium text-gray-800 mb-1">Setelah Shalat</h3>
                    <p className="text-gray-500 text-xs">Dzikir setelah selesai shalat</p>
                  </Link>
                  <Link
                    to="/dzikir/sebelum-tidur"
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="text-3xl text-blue-500 mb-3">
                      <i className="ri-moon-line"></i>
                    </div>
                    <h3 className="text-base font-medium text-gray-800 mb-1">Sebelum Tidur</h3>
                    <p className="text-gray-500 text-xs">Dzikir malam & doa tidur</p>
                  </Link>
                  <Link
                    to="/dzikir/harian"
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="text-3xl text-teal-500 mb-3">
                      <i className="ri-heart-pulse-line"></i>
                    </div>
                    <h3 className="text-base font-medium text-gray-800 mb-1">Dzikir Harian</h3>
                    <p className="text-gray-500 text-xs">Setiap saat, kapan saja dan di mana saja</p>
                  </Link>
                  <Link
                    to="/dzikir/aktivitas"
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="text-3xl text-pink-500 mb-3">
                      <i className="ri-hand-heart-line"></i>
                    </div>
                    <h3 className="text-base font-medium text-gray-800 mb-1">Saat Aktivitas</h3>
                    <p className="text-gray-500 text-xs">Makan, masuk rumah, dll</p>
                  </Link>
                  <Link
                    to="/dzikir/setelah-adzan"
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="text-3xl text-indigo-500 mb-3">
                      <i className="ri-volume-up-line"></i>
                    </div>
                    <h3 className="text-base font-medium text-gray-800 mb-1">Setelah Adzan</h3>
                    <p className="text-gray-500 text-xs">Doa setelah panggilan shalat</p>
                  </Link>
                  <Link
                    to="/dzikir/istighfar"
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="text-3xl text-emerald-500 mb-3">
                      <i className="ri-refresh-line"></i>
                    </div>
                    <h3 className="text-base font-medium text-gray-800 mb-1">Istighfar & Taubat</h3>
                    <p className="text-gray-500 text-xs">Memohon ampunan Allah</p>
                  </Link>

                </div>
              </section>
            </div>
          </>
        )}
      </PrayerTimeManager>
      <BottomNav />
    </div>
  );
}