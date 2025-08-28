import React from 'react'
import { Link } from 'react-router-dom'

function FeatureGrid() {
  // Daftar menu + link tujuan
  const menus = [
    { label: "Prayer Time", icon: "ri-time-line", link: "/jadwal-sholat" },
    { label: "Al-Quran", icon: "ri-book-2-line", link: "/quran" },
    { label: "Game", icon: "ri-gamepad-line", link: "/game" },
    { label: "Dua", icon: "ri-hand-heart-line", link: "/dzikir" },
    { label: "Qibla", icon: "ri-compass-3-line", link: "/qiblat" },
    { label: "Tasbih", icon: "ri-heart-2-line", link: "/tasbih" },
    { label: "Zakat", icon: "ri-money-dollar-circle-line", link: "/zakat" },
    { label: "More", icon: "ri-apps-line", link: "/more" },
  ];

  return (
    <div>
      {/* Feature grid */}
      <div className="grid grid-cols-4 p-2">
        {menus.map((m, i) => (
          <Link
            key={i}
            to={m.link}
            className="flex flex-col items-center text-center p-1 hover:opacity-80 transition"
          >
            <div className="w-[55px] h-[55px] flex items-center justify-center rounded-[13px] bg-[#f0f1f2]">
              <i className={`${m.icon} text-[22px] text-[#4f90c6]`} />
            </div>
            <p className="text-xs mt-1 mb-2 text-[#44515f]">{m.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default FeatureGrid
