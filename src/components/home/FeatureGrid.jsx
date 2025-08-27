import React from 'react'

function FeatureGrid() {
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
  return (
    <div>
      {/* Feature grid */}
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
    </div>
  )
}

export default FeatureGrid
