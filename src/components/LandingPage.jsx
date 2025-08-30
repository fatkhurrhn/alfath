import React, { useEffect, useState } from 'react';

export default function LandingPage() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // deteksi apakah app udah mode standalone (udah install)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;
    setIsInstalled(isStandalone);

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setIsInstalled(true));

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-md py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <i className="ri-islamic-line text-3xl text-[#355485] mr-2"></i>
            <span className="text-xl font-bold text-[#44515f]">Ihsanly</span>
            <span className="text-xl text-[#6d9bbc] ml-1">- Muslim Daily</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-[#44515f] hover:text-[#4f90c6]">Fitur</a>
            <a href="#download" className="text-[#44515f] hover:text-[#4f90c6]">Download</a>
            <a href="#about" className="text-[#44515f] hover:text-[#4f90c6]">Tentang</a>
          </div>
          <button className="md:hidden text-[#44515f]">
            <i className="ri-menu-line text-2xl"></i>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#355485] to-[#4f90c6] text-white py-16 md:py-24">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Ihsanly - Muslim Daily</h1>
            <p className="text-xl mb-8 text-[#cbdde9]">Aplikasi panduan muslim sehari-hari untuk hidup lebih berkah dan ihsan</p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="px-3 pt-2 shadow-sm bg-[#fcfeff]">
                <div className="mb-2 rounded-2xl bg-gradient-to-r from-[#355485] to-[#4f90c6] p-4 text-white">
                  <div className="flex items-center justify-between">
                    {/* Icon + Text */}
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-bold text-base">Install Ihsanly</p>
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
                    </div>

                    {/* Button */}
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
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-[#90b6d5] rounded-2xl rotate-6 opacity-50"></div>
              <div className="relative bg-white p-2 rounded-2xl shadow-xl">
                <div className="bg-gray-100 rounded-xl w-64 h-96 flex items-center justify-center">
                  <i className="ri-smartphone-line text-6xl text-[#6d9bbc]"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-[#fcfeff]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#44515f] mb-12">Fitur Unggulan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-[#f0f1f2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-calendar-schedule-line text-3xl text-[#4f90c6]"></i>
              </div>
              <h3 className="text-xl font-semibold text-[#44515f] mb-2">Jadwal Sholat</h3>
              <p className="text-[#a6b0b6]">Jadwal sholat akurat berdasarkan lokasi Anda dengan notifikasi pengingat</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-[#f0f1f2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-book-open-line text-3xl text-[#4f90c6]"></i>
              </div>
              <h3 className="text-xl font-semibold text-[#44515f] mb-2">Al-Quran Digital</h3>
              <p className="text-[#a6b0b6]">Baca Al-Quran dengan terjemahan dan tafsir, plus audio murattal</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="bg-[#f0f1f2] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-compass-3-line text-3xl text-[#4f90c6]"></i>
              </div>
              <h3 className="text-xl font-semibold text-[#44515f] mb-2">Arah Kiblat</h3>
              <p className="text-[#a6b0b6]">Penunjuk arah kiblat yang presisi menggunakan sensor kompas smartphone</p>
            </div>
          </div>
        </div>
      </section>

      {/* Download Banner */}
      <section id="download" className="py-16 bg-gradient-to-r from-[#6d9bbc] to-[#4f90c6]">
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Download Aplikasi Ihsanly Sekarang</h2>
          <p className="text-xl mb-8 text-[#cbdde9]">Raih keberkahan dalam setiap aktivitas sehari-hari</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="bg-white text-[#355485] px-8 py-4 rounded-lg font-semibold flex items-center justify-center mx-auto sm:mx-0">
              <i className="ri-google-play-fill text-3xl mr-3"></i>
              <div className="text-left">
                <div className="text-xs">Download di</div>
                <div className="text-lg">Google Play</div>
              </div>
            </button>
            <button className="bg-[#44515f] text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center mx-auto sm:mx-0">
              <i className="ri-apple-fill text-3xl mr-3"></i>
              <div className="text-left">
                <div className="text-xs">Download di</div>
                <div className="text-lg">App Store</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-3xl font-bold text-[#44515f] mb-6">Tentang Ihsanly</h2>
              <p className="text-[#a6b0b6] mb-4">
                Ihsanly hadir sebagai teman setia muslim modern yang ingin menjalani kehidupan sehari-hari
                dengan penuh keberkahan dan sesuai tuntunan Islam.
              </p>
              <p className="text-[#a6b0b6]">
                Dengan fitur-fitur lengkap dan antarmuka yang mudah digunakan, Ihsanly membantu Anda
                menjaga konsistensi ibadah dan meningkatkan kualitas hidup sebagai muslim yang ihsan.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f0f1f2] p-4 rounded-lg text-center">
                  <i className="ri-user-heart-line text-4xl text-[#4f90c6] mb-2"></i>
                  <h4 className="font-semibold text-[#44515f]">Ramah Pengguna</h4>
                </div>
                <div className="bg-[#f0f1f2] p-4 rounded-lg text-center">
                  <i className="ri-shield-check-line text-4xl text-[#4f90c6] mb-2"></i>
                  <h4 className="font-semibold text-[#44515f]">Terpercaya</h4>
                </div>
                <div className="bg-[#f0f1f2] p-4 rounded-lg text-center">
                  <i className="ri-global-line text-4xl text-[#4f90c6] mb-2"></i>
                  <h4 className="font-semibold text-[#44515f]">Lengkap</h4>
                </div>
                <div className="bg-[#f0f1f2] p-4 rounded-lg text-center">
                  <i className="ri-lightbulb-flash-line text-4xl text-[#4f90c6] mb-2"></i>
                  <h4 className="font-semibold text-[#44515f]">Inovatif</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#44515f] text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <i className="ri-islamic-line text-2xl text-[#90b6d5] mr-2"></i>
                <span className="text-xl font-bold">Ihsanly</span>
                <span className="text-xl text-[#6d9bbc] ml-1">- Muslim Daily</span>
              </div>
              <p className="text-[#a6b0b6] max-w-md">
                Aplikasi panduan muslim sehari-hari untuk hidup lebih berkah dan ihsan.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Tautan</h4>
                <ul className="space-y-2 text-[#a6b0b6]">
                  <li><a href="#" className="hover:text-white">Beranda</a></li>
                  <li><a href="#features" className="hover:text-white">Fitur</a></li>
                  <li><a href="#download" className="hover:text-white">Download</a></li>
                  <li><a href="#about" className="hover:text-white">Tentang</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Dukungan</h4>
                <ul className="space-y-2 text-[#a6b0b6]">
                  <li><a href="#" className="hover:text-white">Bantuan</a></li>
                  <li><a href="#" className="hover:text-white">Kebijakan Privasi</a></li>
                  <li><a href="#" className="hover:text-white">Syarat & Ketentuan</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Hubungi Kami</h4>
                <div className="flex space-x-4">
                  <a href="#" className="text-[#a6b0b6] hover:text-white">
                    <i className="ri-facebook-fill text-xl"></i>
                  </a>
                  <a href="#" className="text-[#a6b0b6] hover:text-white">
                    <i className="ri-instagram-line text-xl"></i>
                  </a>
                  <a href="#" className="text-[#a6b0b6] hover:text-white">
                    <i className="ri-twitter-x-line text-xl"></i>
                  </a>
                  <a href="#" className="text-[#a6b0b6] hover:text-white">
                    <i className="ri-youtube-line text-xl"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-[#5c6b7a] mt-8 pt-8 text-center text-[#a6b0b6]">
            <p>© {new Date().getFullYear()} Ihsanly - Muslim Daily. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}