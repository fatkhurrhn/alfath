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
  const [isStandalone, setIsStandalone] = useState(false); // hanya untuk mode PWA
  const [isInstalled, setIsInstalled] = useState(false); // status udah install atau belum
  const [fadeOut, setFadeOut] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // 🔹 Splash screen pertama kali buka (per sesi)
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("splashShown");

    if (!alreadyShown) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setShowSplash(false);
          sessionStorage.setItem("splashShown", "true");
        }, 300);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  // 🔹 Deteksi install & mode PWA
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // cek apakah sedang dibuka di mode standalone (PWA)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;
    setIsStandalone(standalone);

    // cek apakah app udah pernah diinstall (dari localStorage)
    const installedFlag = localStorage.getItem("appInstalled");
    if (installedFlag) setIsInstalled(true);

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      localStorage.setItem("appInstalled", "true");
      setIsInstalled(true);
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
      localStorage.setItem("appInstalled", "true");
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
  };

  /* 
    🔑 Logic:
    - Splash → tampil dulu
    - Kalau PWA (standalone) → App utama
    - Kalau bukan PWA → LandingPage (walaupun sudah install tetap LandingPage)
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

  // kalau bukan standalone (browser biasa) → tetap LandingPage
  if (!isStandalone) {
    return (
      <div
        className={`transition-opacity duration-700 ${transitioning ? "opacity-0" : "opacity-100"
          }`}
      >
        <LandingPage onInstall={handleInstall} isInstalled={isInstalled} />
      </div>
    );
  }

  // 🔹 App utama (PWA mode)
  return (
    <div
      className={`min-h-screen bg-white text-[#44515f] pb-10 transition-opacity duration-700 ${transitioning ? "opacity-0" : "opacity-100"
        }`}
    >
      <HeaderDisplay />
      <FeatureGrid />

      <DoaSection />
      <VidMotivasi />
      <NewsSection />
      <QuranReminder />
      <BottomNav />
    </div>
  );
}
