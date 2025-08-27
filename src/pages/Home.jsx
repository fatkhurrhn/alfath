import React, { useEffect, useState } from "react";
import LandingPage from "../components/LandingPage"; // buat desktop
import BottomNav from "../components/BottomNav";
import { Link } from "react-router-dom";

export default function Home() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // update ketika resize
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // kalau desktop → LandingPage
  if (isDesktop) {
    return <LandingPage />;
  }

  // kalau mobile → tampilan app
  const menus = [
    { label: "Prayer Time", icon: "ri-time-line" },
    { label: "Al-Quran", icon: "ri-book-2-line" },
    { label: "Hadith", icon: "ri-book-open-line" },
    { label: "Dua", icon: "ri-hand-heart-line" },
    { label: "Qibla", icon: "ri-compass-3-line" },
    { label: "Tasbih", icon: "ri-heart-2-line" },
    { label: "Zakat", icon: "ri-money-dollar-circle-line" },
    { label: "More", icon: "ri-apps-line" },
  ];

  const prayers = [
    { name: "Fajr", time: "4:37 AM" },
    { name: "Dhuhr", time: "11:55 AM" },
    { name: "Asr", time: "3:14 PM" },
    { name: "Maghrib", time: "5:53 PM" },
    { name: "Isha", time: "7:03 PM" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#44515f] pb-24">
      {/* Topbar Date & Location */}
      <div className="flex justify-between pt-4 items-center px-4 py-2 text-sm bg-[#fcfeff]">
        <span className="text-[#355485] font-medium">28 Agustus 2025</span>
        <span className="font-semibold text-[#4f90c6]">Kota Depok</span>
      </div>

      {/* Header (Now Prayer) */}
      <div className="flex justify-between items-center px-5 py-3 border-b bg-[#fcfeff]">
        <div className="space-y-[-4px]">
          <div className="w-[30px] h-[30px] flex items-center mb-2 justify-center rounded-[5px] bg-[#355485]">
            <i className="ri-notification-3-line text-white text-md"></i>
          </div>

          <p className="font-normal pt-1 text-[#355485]">Now : Ashar</p>

          <p className="font-semibold text-[25px] text-[#44515f]">
            16:14 <span className="text-[10px]">AM (start time)</span>
          </p>

          <p className="text-sm text-[#6d9bbc]">
            1 hour 19<span className="text-[10px]">.45</span> min left
          </p>

          <p className="text-[13px]">"Hamasah"</p>
        </div>

        <img
          src="/img/masjid.jpg"
          alt="Masjid"
          className="w-[150px] h-[150px] object-contain"
        />
      </div>

      {/* Prayer times row */}
      <div className="flex justify-around py-3 px-2 border-b bg-[#fcfeff]">
        {prayers.map((p, i) => (
          <div key={i} className="text-center flex flex-col items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#355485] mb-0.5"></span>
            <p className="text-sm font-medium text-[#355485]">{p.name}</p>
            <p className="text-xs text-[#6d9bbc]">{p.time}</p>
          </div>
        ))}
      </div>

      {/* Menu grid */}
      <div className="grid grid-cols-4 p-2">
        {menus.map((m, i) => (
          <div key={i} className="flex flex-col items-center text-center p-1">
            <div className="w-[55px] h-[55px] flex items-center justify-center rounded-[13px] bg-[#f0f1f2]">
              <i className={`${m.icon} text-[22px] text-[#4f90c6]`} />
            </div>
            <p className="text-xs mt-1 mb-2 text-[#44515f]">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Quran Reminder */}
      <div className="p-4 shadow-sm bg-[#fcfeff]">
        <div className="bg-[#355485] rounded-xl p-5 text-white shadow-md">
          <h2 className="text-lg font-semibold mb-1">Ingat Baca Qur'an</h2>
          <p className="text-sm opacity-90 mb-4">
            Luangkan waktumu sebentar untuk membaca Al-Qur'an hari ini.
          </p>
          <div className="flex items-center space-x-3">
            <Link
              to="/quran"
              className="px-4 py-2 bg-white text-[#355485] font-medium text-sm rounded-lg shadow hover:bg-[#f0f1f2] transition"
            >
              Baca Sekarang
            </Link>
            <button className="px-4 py-2 border border-white/70 text-white font-medium text-sm rounded-lg hover:bg-white/10 transition">
              Nanti
            </button>
          </div>
        </div>
      </div>

      {/* News Islamic */}
      <div className="p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-[#355485]">News Islamic</h2>
          <Link to="/news">
            <i className="ri-arrow-right-s-line text-xl text-[#6d9bbc]"></i>
          </Link>
        </div>

        <Link
          to="/artikel-1"
          className="flex items-center bg-white shadow-sm border-y border-gray-200 py-3"
        >
          {/* Kiri: tag + title + date */}
          <div className="flex-1 px-1">
            <span className="inline-block px-2 py-0.5 bg-[#cbdde9] text-[#355485] text-[11px] font-medium rounded mb-2">
              Tafsir
            </span>
            <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-1 line-clamp-2">
              Tafsir kepimpinan Nabi Sulaiman: mendengar dan menghargai suara rakyat kecil
            </h3>
            <p className="text-xs text-[#6d9bbc]">Selasa, 27 Agustus 2025</p>
          </div>

          {/* Kanan: thumbnail */}
          <div className="w-[75px] h-[75px] flex-shrink-0 mr-1">
            <img
              src="https://i.pinimg.com/736x/84/5b/11/845b1193e5cd04b5c065df25925d13ce.jpg"
              alt="thumbnail"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
