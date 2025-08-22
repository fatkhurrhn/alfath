import React, { useState, useEffect } from 'react'
import BottomNav from '../components/BottomNav'
import Footer from '../components/Footer';
import NavbarWaktuSholat from '../components/NavWaktuSholat'

export default function JadwalSholat() {
    useEffect(() => {
        document.title = "Jadwal Sholat - Islamic";
      }, []);

  const [prayerTimes, setPrayerTimes] = useState({
    Subuh: "--:--",
    Dzuhur: "--:--",
    Ashar: "--:--",
    Maghrib: "--:--",
    Isya: "--:--"
  });
  const [nextPrayer, setNextPrayer] = useState("Memuat...");
  const [nextPrayerTime, setNextPrayerTime] = useState("--:--");
  const [countdown, setCountdown] = useState("--:--:--");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCityId, setSelectedCityId] = useState(null);

  // Load kota yang dipilih dari localStorage saat komponen pertama kali dimuat
  useEffect(() => {
    const savedCity = localStorage.getItem('selectedCity');
    const savedCityId = localStorage.getItem('selectedCityId');
    
    if (savedCity && savedCityId) {
      setSelectedCity(savedCity);
      setSelectedCityId(parseInt(savedCityId));
    }
  }, []);

  // Handle pemilihan kota dari navbar
  const handleCitySelect = (cityId, cityName) => {
    setSelectedCityId(cityId);
    setSelectedCity(cityName);
    
    // Simpan ke localStorage
    localStorage.setItem('selectedCity', cityName);
    localStorage.setItem('selectedCityId', cityId.toString());
  };

  // Mengambil jadwal sholat berdasarkan kota
  useEffect(() => {
    // Jangan fetch jika kota belum dipilih
    if (!selectedCityId) return;
    
    const fetchPrayerTimes = async () => {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

        const response = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${selectedCityId}/${dateStr}`);
        const data = await response.json();
        
        if (data.status) {
          const jadwal = data.data.jadwal;
          
          // Simpan semua waktu sholat
          setPrayerTimes({
            Subuh: jadwal.subuh,
            Dzuhur: jadwal.dzuhur,
            Ashar: jadwal.ashar,
            Maghrib: jadwal.maghrib,
            Isya: jadwal.isya
          });

          // Hitung sholat berikutnya dan countdown
          calculateNextPrayer(jadwal);
        }
      } catch (error) {
        console.error("Error fetching prayer times:", error);
      }
    };

    fetchPrayerTimes();
    
    // Set interval untuk update countdown setiap detik
    const intervalId = setInterval(fetchPrayerTimes, 60000); // Update setiap menit
    
    return () => clearInterval(intervalId);
  }, [selectedCityId]);

  // Menghitung sholat berikutnya dan countdown
  const calculateNextPrayer = (jadwal) => {
    const now = new Date();
    const currentTime = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    
    const waktuSholat = [
      { name: 'Subuh', time: jadwal.subuh },
      { name: 'Dzuhur', time: jadwal.dzuhur },
      { name: 'Ashar', time: jadwal.ashar },
      { name: 'Maghrib', time: jadwal.maghrib },
      { name: 'Isya', time: jadwal.isya }
    ];

    // Konversi semua waktu sholat ke detik
    const sholatTimesInSeconds = waktuSholat.map(sholat => {
      const [hours, minutes] = sholat.time.split(':').map(Number);
      return {
        name: sholat.name,
        time: sholat.time,
        totalSeconds: hours * 3600 + minutes * 60
      };
    });

    // Cari sholat berikutnya
    let nextSholat = null;
    for (let sholat of sholatTimesInSeconds) {
      if (sholat.totalSeconds > currentTime) {
        nextSholat = sholat;
        break;
      }
    }
    
    // Jika tidak ada sholat berikutnya hari ini, set ke Subuh besok
    if (!nextSholat) {
      nextSholat = sholatTimesInSeconds[0]; // Subuh
      nextSholat.totalSeconds += 24 * 3600; // Tambah 24 jam
    }
    
    setNextPrayer(nextSholat.name);
    setNextPrayerTime(nextSholat.time);
    
    // Hitung countdown
    const timeRemaining = nextSholat.totalSeconds - currentTime;
    
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;
    
    setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    
    // Set interval untuk update countdown setiap detik
    const countdownInterval = setInterval(() => {
      const newTimeRemaining = nextSholat.totalSeconds - 
        (new Date().getHours() * 3600 + new Date().getMinutes() * 60 + new Date().getSeconds());
      
      if (newTimeRemaining <= 0) {
        clearInterval(countdownInterval);
        // Refresh data jika countdown habis
        window.location.reload();
        return;
      }
      
      const newHours = Math.floor(newTimeRemaining / 3600);
      const newMinutes = Math.floor((newTimeRemaining % 3600) / 60);
      const newSeconds = newTimeRemaining % 60;
      
      setCountdown(`${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(countdownInterval);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 pb-20">
      <NavbarWaktuSholat 
        onCitySelect={handleCitySelect}
        nextPrayer={nextPrayer}
        nextPrayerTime={nextPrayerTime}
        countdown={countdown}
        selectedCity={selectedCity}
      />
      
      {/* Konten Jadwal Sholat Lengkap */}
      <div className="container mx-auto px-4 pt-24">
        {selectedCityId ? (
          <>
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                Jadwal Sholat - {selectedCity}
              </h1>
              <p className="text-center text-gray-600 mb-6">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              
              <div className="space-y-4">
                {Object.entries(prayerTimes).map(([name, time]) => (
                  <div 
                    key={name} 
                    className={`flex justify-between items-center p-4 rounded-lg ${
                      nextPrayer === name ? 'bg-emerald-100 border-l-4 border-emerald-500' : 'bg-gray-50'
                    }`}
                  >
                    <span className={`font-medium ${nextPrayer === name ? 'text-emerald-700' : 'text-gray-700'}`}>
                      {name}
                    </span>
                    <span className={`font-mono text-lg ${nextPrayer === name ? 'text-emerald-600 font-bold' : 'text-gray-600'}`}>
                      {time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Box Countdown */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-md p-6 text-white text-center">
              <h3 className="text-lg font-bold mb-2">Menuju {nextPrayer}</h3>
              <p className="text-3xl font-mono font-bold mb-2">-{countdown}</p>
              <p className="text-sm opacity-90">Waktu sholat {nextPrayer} pukul {nextPrayerTime}</p>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-4xl mb-4">🕌</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Pilih Kota Terlebih Dahulu</h2>
            <p className="text-gray-600">Silakan pilih kota dari menu di atas untuk melihat jadwal sholat</p>
          </div>
        )}
      </div>
      
      <BottomNav />
      <Footer/>
    </div>
  );
}