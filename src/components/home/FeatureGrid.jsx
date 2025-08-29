import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function FeatureGrid() {
  const [showMore, setShowMore] = useState(false);

  // Menu utama
  const menus = [
    // { label: "Prayer Time", icon: "ri-time-line", link: "/jadwal-sholat" },
    { label: "Al-Quran", icon: "ri-book-2-line", link: "/quran" },
    { label: "Game", icon: "ri-gamepad-line", link: "/game" },
    { label: "Edukasi", icon: "ri-book-shelf-line", link: "/edukasi" },
    { label: "Dzikir", icon: "ri-heart-pulse-line", link: "/dzikir" },
    { label: "Calender", icon: "ri-calendar-line", link: "/kalender" },
    { label: "Tasbih", icon: "ri-heart-2-line", link: "/tasbih" },
    { label: "Prayer Time", icon: "ri-time-line", link: "/jadwal-sholat" },
    { label: "More", icon: "ri-apps-line", action: () => setShowMore(true) },
  ];
  
  // Menu tambahan di modal
  const moreMenus = [
    { label: "Qibla", icon: "ri-compass-3-line", link: "/kiblat" },
    { label: "Hadits", icon: "ri-book-open-line", link: "/hadits" },
    { label: "Asmaul Husna", icon: "ri-star-smile-line", link: "/asmaul-husna" },
    { label: "Doa Harian", icon: "ri-hand-heart-line", link: "/doa-harian" },
    { label: "Puasa Sunnah", icon: "ri-moon-clear-line", link: "/puasa-sunnah" },
    { label: "Kajian", icon: "ri-mic-2-line", link: "/kajian" },
    { label: "Shadaqah Tracker", icon: "ri-hand-coin-line", link: "/shadaqah" },
    { label: "Catatan Amal", icon: "ri-clipboard-line", link: "/amal" },
  ];

  return (
    <div>
      {/* Feature grid utama */}
      <div className="grid grid-cols-4 p-2">
        {menus.map((m, i) => (
          m.action ? (
            <button
              key={i}
              onClick={m.action}
              className="flex flex-col items-center text-center p-1 hover:opacity-80 transition"
            >
              <div className="w-[55px] h-[55px] flex items-center justify-center rounded-[13px] bg-[#f0f1f2]">
                <i className={`${m.icon} text-[22px] text-[#355485]`} />
              </div>
              <p className="text-xs mt-1 mb-2 text-[#44515f]">{m.label}</p>
            </button>
          ) : (
            <Link
              key={i}
              to={m.link}
              className="flex flex-col items-center text-center p-1 hover:opacity-80 transition"
            >
              <div className="w-[55px] h-[55px] flex items-center justify-center rounded-[13px] bg-[#f0f1f2]">
                  <i className={`${m.icon} text-[22px] text-[#355485]`} />
              </div>
              <p className="text-xs mt-1 mb-2 text-[#44515f]">{m.label}</p>
            </Link>
          )
        ))}
      </div>

      {/* Modal More */}
      {showMore && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setShowMore(false)}
          />
          <div className="fixed mb-[50px] bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl shadow-xl max-h-[70vh] overflow-y-auto max-w-xl mx-auto">
            {/* Header Modal */}
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Menu Lainnya</h3>
              <button onClick={() => setShowMore(false)}>
                <i className="ri-close-line text-xl text-gray-500"></i>
              </button>
            </div>

            {/* Grid menu tambahan */}
            <div className="grid grid-cols-4 gap-3 p-4">
              {moreMenus.map((m, i) => (
                <Link
                  key={i}
                  to={m.link}
                  className="flex flex-col items-center text-center hover:opacity-80 transition"
                >
                  <div className="w-[55px] h-[55px] flex items-center justify-center rounded-[13px] bg-[#f0f1f2]">
                    <i className={`${m.icon} text-[22px] text-[#355485]`} />
                  </div>
                  <p className="text-xs mt-1 mb-2 text-[#44515f]">{m.label}</p>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default FeatureGrid
