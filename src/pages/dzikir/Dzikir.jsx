import React from 'react';
import { Link } from 'react-router-dom';
import ScrollToTop from '../../components/ScrollToTop';
import Navbar from '../../components/TopNavbar';
import Footer from '../../components/Footer';
import BottomNav from '../../components/BottomNav';

export default function Dzikir() {
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
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <ScrollToTop />

      {/* === HERO === */}
      <section className="bg-white border-b border-gray-200 pt-20 pb-10 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Dzikir Harian</h1>
          <p className="text-gray-600 mt-3 text-lg">Pilih dzikir sesuai waktu dan kebutuhanmu</p>
        </div>
      </section>

      {/* === REKOMENDASI HARIAN (Dinamis) === */}
      <section className="py-8 px-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto">
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

      {/* === MENU DZIKIR (2-2-3-4 Responsif) === */}
      <section className="flex-1 px-6 py-10 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Semua Dzikir</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">

          {/* 1. Setelah Shalat */}
          <Link
            to="/dzikir/setelah-shalat"
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-200"
          >
            <div className="text-3xl text-yellow-500 mb-3">
              <i className="ri-sun-line"></i>
            </div>
            <h3 className="text-base font-medium text-gray-800 mb-1">Setelah Shalat</h3>
            <p className="text-gray-500 text-xs">Dzikir usai shalat fardhu</p>
          </Link>

          {/* 2. Sebelum Tidur */}
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

          {/* 3. Pagi & Petang */}
          <Link
            to="/dzikir/pagi-petang"
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-200"
          >
            <div className="text-3xl text-purple-500 mb-3">
              <i class="ri-time-line"></i>
            </div>
            <h3 className="text-base font-medium text-gray-800 mb-1">Pagi & Petang</h3>
            <p className="text-gray-500 text-xs">Waktu penuh berkah</p>
          </Link>

          {/* 4. Dzikir Harian */}
          <Link
            to="/dzikir/harian"
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-200"
          >
            <div className="text-3xl text-teal-500 mb-3">
              <i className="ri-heart-pulse-line"></i>
            </div>
            <h3 className="text-base font-medium text-gray-800 mb-1">Dzikir Harian</h3>
            <p className="text-gray-500 text-xs">Setiap saat, di mana saja</p>
          </Link>

          {/* 5. Saat Aktivitas */}
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

          {/* 6. Setelah Adzan */}
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

          {/* 7. Istighfar & Taubat */}
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

          {/* 8. Dzikir Pagi-Sore (untuk akses cepat) */}
          <Link
            to="/dzikir/pagi-sugro"
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-200 opacity-90 hover:opacity-100"
          >
            <div className="text-3xl text-orange-500 mb-3">
              <i className="ri-sun-fill"></i>
            </div>
            <h3 className="text-base font-medium text-gray-800 mb-1">Pagi Sugro</h3>
            <p className="text-gray-500 text-xs">Dzikir pagi harian</p>
          </Link>

        </div>
      </section>
      <BottomNav/>
      <Footer />
    </div>
  );
}