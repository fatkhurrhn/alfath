import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Templat() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // Scroll ke bawah -> sembunyikan header
        setShowHeader(false);
      } else {
        // Scroll ke atas -> tampilkan header
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen pb-2">
      {/* Header */}
      <div className={`fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 transition-transform duration-300 ${showHeader ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-3">
          <Link to="/" className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]">
            <i className="ri-arrow-left-line"></i> Template
          </Link>
          <Link to="/settings">
            <button className="text-[#355485]">
              <i className="ri-settings-5-line text-xl"></i>
            </button>
          </Link>
        </div>
      </div>

      {/* Isi konten */}
      <div className="max-w-xl mx-auto px-3 border-x border-gray-200 pt-[65px]">
        <h1 className="text-lg font-bold">ini untuk isi halaman</h1>
      </div>
    </div>
  );
}
