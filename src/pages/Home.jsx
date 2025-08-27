// src/pages/Home.jsx
import React from "react";

export default function Home() {
  const menus = [
    { label: "Prayer Time", icon: "ri-time-line" },
    { label: "Al-Quran", icon: "ri-book-2-line" },
    { label: "Hadith", icon: "ri-book-open-line" },
    { label: "Dua", icon: "ri-hand-heart-line" },
    { label: "Qibla", icon: "ri-compass-3-line" },
    { label: "Tasbih", icon: "ri-heart-2-line" },
    { label: "Zakat", icon: "ri-money-dollar-circle-line" },
    { label: "Hijri", icon: "ri-calendar-line" },
    { label: "Community", icon: "ri-team-line" },
    { label: "Mosque", icon: "ri-building-4-line" },
    { label: "Kitab", icon: "ri-book-mark-line" },
    { label: "Donate", icon: "ri-hand-coin-line" },
  ];

  const prayers = [
    { name: "Fajr", time: "4:37 AM" },
    { name: "Dhuhr", time: "11:55 AM" },
    { name: "Asr", time: "3:14 PM" },
    { name: "Maghrib", time: "5:53 PM" },
    { name: "Isha", time: "7:03 PM" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#44515f]">
      {/* Topbar Date & Location */}
      <div className="flex justify-between items-center px-4 py-2 border-b text-sm"
        style={{ backgroundColor: "#fcfeff" }}>
        <span className="text-[#355485] font-medium">28 Agustus 2025</span>
        <span className="font-semibold text-[#4f90c6]">Kota Depok</span>
      </div>

      {/* Header (Now Prayer) */}
      <div className="flex justify-between items-center px-4 py-3 border-b"
        style={{ backgroundColor: "#fcfeff" }}>
        <div>
          <p className="font-semibold flex items-center gap-2 text-[#355485]">
            <i className="ri-notification-3-line text-[#4f90c6]"></i>
            Now : Ashar
          </p>
          <p className="font-semibold text-[#44515f]">
            16:14 PM (Start time)
          </p>
          <p className="text-sm" style={{ color: "#6d9bbc" }}>
            1 hour 19.45 min left
          </p>
        </div>
        <img
          src="/img/masjid.jpg"
          alt="Masjid"
          className="w-24 h-24 object-contain"
        />
      </div>

      {/* Prayer times row */}
      <div className="flex justify-around py-3 border-b"
        style={{ backgroundColor: "#fcfeff" }}>
        {prayers.map((p, i) => (
          <div key={i} className="text-center">
            <p className="text-sm font-medium text-[#355485]">{p.name}</p>
            <p className="text-xs text-[#6d9bbc]">{p.time}</p>
          </div>
        ))}
      </div>

      {/* Menu grid */}
      <div className="grid grid-cols-4 gap-4 p-4">
        {menus.map((m, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center p-2 rounded-lg shadow-sm hover:shadow-md"
            style={{ backgroundColor: "#fcfeff", border: "1px solid #cbdde9" }}
          >
            <i className={`${m.icon} text-2xl`} style={{ color: "#4f90c6" }} />
            <p className="text-xs mt-2 text-[#44515f]">{m.label}</p>
          </div>
        ))}
      </div>

      {/* Prayer tracker */}
      <div className="p-4 mt-2 shadow-sm"
        style={{ backgroundColor: "#fcfeff" }}>
        <h2 className="font-semibold mb-2 text-[#355485]">Prayer Tracker</h2>
        <div className="flex gap-2 flex-wrap">
          {prayers.map((p, i) => (
            <button
              key={i}
              className="px-3 py-1 rounded-full text-sm flex items-center gap-1 border"
              style={{
                borderColor: "#a6b0b6",
                backgroundColor: "#f0f1f2",
                color: "#44515f",
              }}
            >
              <i className="ri-alert-line text-red-500"></i> {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Ayah */}
      <div className="mt-3 p-4 shadow-sm"
        style={{ backgroundColor: "#fcfeff" }}>
        <h2 className="font-semibold text-[#355485]">Daily Ayah</h2>
        <p className="text-sm text-[#6d9bbc]">Ayah - 69 : 28</p>
        <p className="text-xl text-right mt-2 text-[#355485]">
          مَا أَغْنَى عَنِّي مَالِيَهْ
        </p>
      </div>
    </div>
  );
}
