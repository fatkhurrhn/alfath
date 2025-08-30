// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import LandingPage from "../components/LandingPage";
import BottomNav from "../components/BottomNav";
import NewsSection from "../components/home/NewsSection";
import QuranReminder from "../components/home/QuranReminder";
import HeaderDisplay from "../components/home/HeaderDisplay";
import FeatureGrid from "../components/home/FeatureGrid";
import VidMotivasi from "../components/home/VidMotivasi";
import DoaSection from "../components/home/DoaSection";

export default function Home() {
  const [showSplash, setShowSplash] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // 🔹 Splash pertama kali buka
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("splashShown");

    if (!alreadyShown) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setShowSplash(false);
          sessionStorage.setItem("splashShown", "true");
        }, 300); // waktu fade-out
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  // 🔹 Deteksi install PWA
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;
    setIsInstalled(isStandalone);

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setTransitioning(true); // trigger animasi keluar LandingPage
      setTimeout(() => {
        setIsInstalled(true);
        setTransitioning(false); // reset
      }, 700); // sesuai durasi animasi
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("User install choice:", outcome);

    if (outcome === "accepted") {
      setTransitioning(true);
      setTimeout(() => {
        setIsInstalled(true);
        setTransitioning(false);
      }, 700);
    }

    setDeferredPrompt(null);
  };

  /* 
    🔑 Logic:
    - Kalau splash aktif → tampilkan splash custom
    - Kalau belum diinstall (browser biasa) → LandingPage
    - Kalau sudah diinstall (PWA mode) → tampilkan App utama
  */
  if (showSplash) {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center bg-white z-50 transition-opacity duration-700 ${fadeOut ? "opacity-0" : "opacity-100"
          }`}
      >
        <img
          src="/logo-splash.png"
          alt="AlFath Logo"
          className="w-28 h-28 animate-pulse"
        />
      </div>
    );
  }

  if (!isInstalled) {
    return (
      <div
        className={`transition-opacity duration-700 ${transitioning ? "opacity-0" : "opacity-100"
          }`}
      >
        <LandingPage onInstall={handleInstall} />
      </div>
    );
  }

  // 🔹 App utama (kalau sudah install)
  return (
    <div
      className={`min-h-screen bg-white text-[#44515f] pb-10 transition-opacity duration-700 ${transitioning ? "opacity-0" : "opacity-100"
        }`}
    >
      <HeaderDisplay />
      <FeatureGrid />

      {/* Install Info Card */}
      <div className="px-4">
        <div className="mb-2 rounded-2xl bg-gradient-to-r from-[#355485] to-[#4f90c6] p-4 text-white shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-base">Install AlFath</p>
              {!isInstalled ? (
                <p className="text-sm text-white/90">
                  Rasakan pengalaman lebih cepat dengan aplikasi
                </p>
              ) : (
                <p className="text-sm text-white/90">
                  Aplikasi sudah terpasang, nikmati kemudahan akses 🎉
                </p>
              )}
            </div>

            {!isInstalled ? (
              <button
                onClick={handleInstall}
                className="ml-4 px-4 py-2 rounded-lg bg-white text-[#355485] font-semibold text-sm shadow hover:bg-gray-100 transition"
              >
                Install
              </button>
            ) : (
              <span className="ml-4 px-4 py-2 rounded-lg bg-white/20 text-white font-medium text-sm shadow">
                Terpasang
              </span>
            )}
          </div>
        </div>
      </div>

      <DoaSection />
      <VidMotivasi />
      <NewsSection />
      <QuranReminder />
      <BottomNav />
    </div>
  );
}
