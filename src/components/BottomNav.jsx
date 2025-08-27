import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const navItems = [
    { path: "/", icon: "ri-home-4-line", activeIcon: "ri-home-4-fill", label: "Home" },
    { path: "/dzikir", icon: "ri-heart-pulse-line", activeIcon: "ri-heart-pulse-fill", label: "Dzikir" },
    { path: "/quran", icon: "ri-book-open-line", activeIcon: "ri-book-open-fill", label: "ALQuran" },
    { path: "/kalender", icon: "ri-calendar-line", activeIcon: "ri-calendar-fill", label: "Kalender" },
    { path: "/more", icon: "ri-apps-line", activeIcon: "ri-apps-fill", label: "More" },
  ];

  const MAIN_PREFIXES = navItems.map((i) => i.path).filter((p) => p !== "/");

  const normalizedPathname = (() => {
    const p = location.pathname.replace(/\/+$/, "");
    return p === "" ? "/" : p;
  })();

  const getActivePath = (pathname) => {
    if (pathname === "/") return "/";
    const matched = MAIN_PREFIXES.find((p) => p !== "/more" && pathname.startsWith(p));
    return matched || "/more";
  };

  const activePath = getActivePath(normalizedPathname);

  const moreMenus = [
    { path: "/jadwal-sholat", label: "Jadwal Sholat", icon: "ri-calendar-todo-line" },
    { path: "/sholawat", label: "Sholawat", icon: "ri-music-2-line" },
    { path: "/asmaul-husna", label: "Asmaul Husna", icon: "ri-star-smile-line" },
    { path: "/adab-tidur", label: "Adab Tidur", icon: "ri-hotel-bed-line" },
    { path: "/kisah-nabi", label: "Kisah Nabi", icon: "ri-book-read-line" },
    { path: "/hadits", label: "Hadits", icon: "ri-book-2-line" },
    { path: "/tasbih-digital", label: "Tasbih Digital", icon: "ri-donut-chart-line" },
    { path: "/kalkulator-zakat", label: "Kalkulator Zakat", icon: "ri-calculator-line" },
    { path: "/puasa-sunnah", label: "Puasa Sunnah", icon: "ri-sun-line" },
    { path: "/artikel-islami", label: "Artikel Islami", icon: "ri-article-line" },
  ];

  return (
    <>
      {/* Bottom Nav */}
      <div className="fixed max-w-xl mx-auto bottom-0 left-0 right-0 z-50 bg-[#fcfeff] shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-5 h-14">
          {navItems.map((item) => {
            const isActive = item.path === activePath;

            if (item.path === "/more") {
              return (
                <button
                  key={item.path}
                  onClick={() => setIsMoreOpen(true)}
                  className="flex flex-col items-center justify-center text-[11px] w-full"
                >
                  <i
                    className={`${isActive ? item.activeIcon : item.icon} text-[22px] ${isActive ? "text-[#355485]" : "text-[#6d9bbc]"
                      }`}
                  ></i>
                  <span
                    className={
                      isActive
                        ? "text-[#355485] font-medium"
                        : "text-[#44515f]"
                    }
                  >
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center text-[11px]"
              >
                <i
                  className={`${isActive ? item.activeIcon : item.icon} text-[22px] ${isActive ? "text-[#355485]" : "text-[#6d9bbc]"
                    }`}
                ></i>
                <span
                  className={
                    isActive
                      ? "text-[#355485] font-medium"
                      : "text-[#44515f]"
                  }
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sidebar / Bottom Sheet */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50">
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={() => setIsMoreOpen(false)}
          ></div>

          {/* Bottom sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#fcfeff] rounded-t-2xl shadow-lg max-h-[70%] overflow-y-auto transition-transform transform animate-slide-up">
            <div className="flex justify-between items-center p-4 border-b border-[#cbdde9]">
              <h3 className="text-lg font-semibold text-[#355485]">More Menu</h3>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="text-[#6d9bbc] hover:text-[#44515f]"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 p-3">
              {moreMenus.map((menu) => (
                <Link
                  key={menu.path}
                  to={menu.path}
                  onClick={() => setIsMoreOpen(false)}
                  className="flex flex-col items-center text-center"
                >
                  <i className={`${menu.icon} text-3xl text-[#4f90c6] mb-2`}></i>
                  <span className="text-[13px] text-[#44515f]">{menu.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BottomNav;
