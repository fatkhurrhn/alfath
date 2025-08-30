import React, { useEffect, useState } from "react";
import LandingPage from "../components/LandingPage";
import BottomNav from "../components/BottomNav";
import NewsSection from "../components/home/NewsSection";
import QuranReminder from "../components/home/QuranReminder";
import HeaderDisplay from "../components/home/HeaderDisplay";
import FeatureGrid from "../components/home/FeatureGrid";
import VidMotivasi from "../components/home/VidMotivasi";

/* Splash Screen Component */
const SplashScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-white animate-fadeIn">
    <div className="flex flex-col items-center">
      <img
        src="/logo-splash.png"
        alt="AlFath Logo"
        className="w-32 h-32 mb-0 animate-pulse"
      />
      <h1 className="text-2xl font-bold mt-1.5 text-gray-800 animate-fadeInUp">
        AlFath
      </h1>
      <p className="text-gray-600 animate-fadeIn delay-300">Muslim Daily</p>
    </div>
  </div>
);

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  /* Splash logic */
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("splashShown");

    if (!alreadyShown) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem("splashShown", "true");
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setShowSplash(false);
    }
  }, []);

  /* PWA install detect */
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
      setIsInstalled(true);
      setTransitioning(true);
      setTimeout(() => setTransitioning(false), 800); // smooth delay
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
    setDeferredPrompt(null);
  };

  /* 🔑 Logic utama */
  if (showSplash) return <SplashScreen />;

  if (!isInstalled) {
    return (
      <div
        className={`transition-all duration-700 transform ${transitioning ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"
          }`}
      >
        <LandingPage />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-white text-[#44515f] pb-10 transition-all duration-700 transform ${transitioning ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"
        }`}
    >
      <HeaderDisplay />
      <FeatureGrid />

      {/* Install Info Card */}
      <div className="px-4">
        <div className="mb-2 rounded-2xl bg-gradient-to-r from-[#355485] to-[#4f90c6] p-4 text-white">
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

      <VidMotivasi />
      <NewsSection />
      <QuranReminder />
      <BottomNav />
    </div>
  );
}
