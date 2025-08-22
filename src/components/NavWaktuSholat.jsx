import { useState, useEffect } from "react";

const NavbarWaktuSholat = ({ onCitySelect }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [nextPrayer, setNextPrayer] = useState("Memuat...");
  const [nextPrayerTime, setNextPrayerTime] = useState("--:--");
  const [countdown, setCountdown] = useState("--:--:--");
  const [prayerTimes, setPrayerTimes] = useState({
    Subuh: "--:--",
    Dzuhur: "--:--",
    Ashar: "--:--",
    Maghrib: "--:--",
    Isya: "--:--"
  });
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Memuat lokasi...");
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [showCityModal, setShowCityModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Mendapatkan lokasi pengguna dengan API yang lebih akurat
  useEffect(() => {
    const getLocation = async () => {
      try {
        // Menggunakan API geolocation yang lebih akurat
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          });
        });

        const { latitude, longitude } = position.coords;
        
        // Menggunakan Nominatim untuk reverse geocoding yang lebih akurat
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=id`
        );
        const data = await response.json();
        
        // Mendapatkan nama kota dari hasil reverse geocoding
        let city = data.address.city || data.address.town || data.address.municipality || 
                  data.address.county || data.address.state || "Jakarta";
        
        // Membersihkan nama kota (kadang ada "Kota" di depannya)
        city = city.replace(/^Kota\s+/i, '').replace(/^Kabupaten\s+/i, '');
        
        setSelectedCity(city);
        
        // Cari ID kota berdasarkan nama
        const citiesResponse = await fetch("https://api.myquran.com/v2/sholat/kota/semua");
        const citiesData = await citiesResponse.json();
        
        if (citiesData.status) {
          setCities(citiesData.data);
          setFilteredCities(citiesData.data);
          
          // Mencari kota yang cocok (fuzzy matching)
          const foundCity = citiesData.data.find(k => 
            k.lokasi.toLowerCase().includes(city.toLowerCase()) ||
            city.toLowerCase().includes(k.lokasi.toLowerCase())
          );
          
          if (foundCity) {
            setSelectedCityId(foundCity.id);
            if (onCitySelect) {
              onCitySelect(foundCity.id);
            }
            fetchPrayerTimes(foundCity.id);
          } else {
            // Default ke Jakarta jika tidak ditemukan
            const jakarta = citiesData.data.find(k => k.lokasi.toLowerCase().includes("jakarta"));
            if (jakarta) {
              setSelectedCityId(jakarta.id);
              if (onCitySelect) {
                onCitySelect(jakarta.id);
              }
              fetchPrayerTimes(jakarta.id);
            }
          }
        }
      } catch (error) {
        console.error("Error getting location:", error);
        // Default ke Jakarta jika error
        setSelectedCity("Jakarta");
        fetchDefaultCities();
      }
      setIsLoading(false);
    };

    const fetchDefaultCities = async () => {
      try {
        const response = await fetch("https://api.myquran.com/v2/sholat/kota/semua");
        const data = await response.json();
        if (data.status) {
          setCities(data.data);
          setFilteredCities(data.data);
          
          // Default ke Jakarta
          const jakarta = data.data.find(k => k.lokasi.toLowerCase().includes("jakarta"));
          if (jakarta) {
            setSelectedCityId(jakarta.id);
            if (onCitySelect) {
              onCitySelect(jakarta.id);
            }
            fetchPrayerTimes(jakarta.id);
          }
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    getLocation();
  }, [onCitySelect]);

  // Mengambil jadwal sholat berdasarkan kota
  const fetchPrayerTimes = async (cityId) => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

      const response = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${cityId}/${dateStr}`);
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

        // Cari waktu sholat berikutnya
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const waktuSholat = [
          { name: 'Subuh', time: jadwal.subuh },
          { name: 'Dzuhur', time: jadwal.dzuhur },
          { name: 'Ashar', time: jadwal.ashar },
          { name: 'Maghrib', time: jadwal.maghrib },
          { name: 'Isya', time: jadwal.isya }
        ];

        // Cari sholat berikutnya
        let nextPrayerFound = false;
        for (let sholat of waktuSholat) {
          const [hours, minutes] = sholat.time.split(':').map(Number);
          const sholatTime = hours * 60 + minutes;
          
          if (sholatTime > currentTime) {
            setNextPrayer(sholat.name);
            setNextPrayerTime(sholat.time);
            nextPrayerFound = true;
            
            // Hitung countdown
            const updateCountdown = () => {
              const now = new Date();
              const currentTime = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
              const timeRemaining = sholatTime - currentTime;
              
              if (timeRemaining <= 0) {
                setCountdown('00:00:00');
                // Refresh data jika countdown habis
                fetchPrayerTimes(cityId);
              } else {
                const hours = Math.floor(timeRemaining / 60);
                const minutes = Math.floor(timeRemaining % 60);
                const seconds = Math.floor((timeRemaining * 60) % 60);
                setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
              }
            };
            
            // Update countdown setiap detik
            updateCountdown();
            const countdownInterval = setInterval(updateCountdown, 1000);
            
            // Bersihkan interval ketika komponen unmount atau sholat berubah
            return () => clearInterval(countdownInterval);
          }
        }
        
        // Jika tidak ada sholat berikutnya (artinya sudah lewat Isya), set ke Subuh besok
        if (!nextPrayerFound) {
          setNextPrayer('Subuh');
          setNextPrayerTime(waktuSholat[0].time);
          
          // Hitung countdown sampai Subuh besok
          const updateCountdown = () => {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
            const timeUntilMidnight = 24 * 60 - currentTime;
            const subuhTime = waktuSholat[0].time.split(':').map(Number);
            const subuhMinutes = subuhTime[0] * 60 + subuhTime[1];
            const timeRemaining = timeUntilMidnight + subuhMinutes;
            
            const hours = Math.floor(timeRemaining / 60);
            const minutes = Math.floor(timeRemaining % 60);
            const seconds = Math.floor((timeRemaining * 60) % 60);
            setCountdown(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
          };
          
          updateCountdown();
          const countdownInterval = setInterval(updateCountdown, 1000);
          return () => clearInterval(countdownInterval);
        }
      }
    } catch (error) {
      console.error("Error fetching prayer times:", error);
    }
  };

  // Mencari kota berdasarkan query
  const searchCities = async (query) => {
    if (query.length < 2) {
      setFilteredCities(cities);
      return;
    }

    try {
      const response = await fetch(`https://api.myquran.com/v2/sholat/kota/cari/${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.status) {
        setFilteredCities(data.data);
      }
    } catch (error) {
      console.error("Error searching cities:", error);
    }
  };

  // Handle scroll untuk show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY === 0) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleCityChange = (cityName, cityId) => {
    setSelectedCity(cityName);
    setSelectedCityId(cityId);
    setShowCityModal(false);
    setSearchQuery("");
    setFilteredCities(cities);
    if (onCitySelect) onCitySelect(cityId);
    fetchPrayerTimes(cityId);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchCities(query);
  };

  return (
    <>
      <div className={`fixed top-0 left-0 w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 px-5 shadow-lg transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"} z-40`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <span className="text-xl">🕌</span>
            </div>
            <div className="ml-3">
              <h2 className="text-sm font-semibold">Waktu Sholat</h2>
              <button 
                onClick={() => setShowCityModal(true)}
                className="text-xs flex items-center mt-1 bg-white bg-opacity-0 hover:bg-opacity-10 transition-all rounded px-2 py-1"
                disabled={isLoading}
              >
                {isLoading ? "Mendeteksi lokasi..." : selectedCity} ▼
              </button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">{nextPrayer} - {nextPrayerTime}</p>
            <p className="text-xs opacity-90">{countdown}</p>
          </div>
        </div>
      </div>

      {/* Modal Pilih Kota */}
      {showCityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-4 max-h-96 overflow-hidden flex flex-col">
            <h3 className="text-lg font-bold mb-4 text-center text-gray-800">Pilih Kota</h3>
            
            {/* Search Input */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Cari kota..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="absolute right-3 top-3 text-gray-400">🔍</span>
            </div>
            
            {/* Daftar Kota */}
            <div className="overflow-y-auto flex-grow">
              {filteredCities.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Tidak ada kota ditemukan</p>
              ) : (
                <div className="space-y-2">
                  {filteredCities.map(city => (
                    <button
                      key={city.id}
                      className={`w-full p-3 rounded-lg text-left ${
                        selectedCity === city.lokasi 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                      onClick={() => handleCityChange(city.lokasi, city.id)}
                    >
                      {city.lokasi}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              className="w-full mt-4 p-3 bg-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-300"
              onClick={() => {
                setShowCityModal(false);
                setSearchQuery("");
                setFilteredCities(cities);
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Jadwal Sholat Lengkap */}
      <div className="pt-20 pb-16 px-4">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
            Jadwal Sholat Hari Ini
          </h2>
          <div className="space-y-3">
            {Object.entries(prayerTimes).map(([name, time]) => (
              <div 
                key={name} 
                className={`flex justify-between items-center p-3 rounded-lg ${
                  nextPrayer === name ? 'bg-emerald-100 border-l-4 border-emerald-500' : 'bg-gray-50'
                }`}
              >
                <span className={`font-medium ${nextPrayer === name ? 'text-emerald-700' : 'text-gray-700'}`}>
                  {name}
                </span>
                <span className={`font-mono ${nextPrayer === name ? 'text-emerald-600 font-bold' : 'text-gray-600'}`}>
                  {time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Countdown Section */}
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-md p-6 text-white text-center">
          <h3 className="text-lg font-bold mb-2">Menuju {nextPrayer}</h3>
          <p className="text-3xl font-mono font-bold mb-2">{countdown}</p>
          <p className="text-sm opacity-90">Waktu sholat {nextPrayer} pukul {nextPrayerTime}</p>
        </div>
      </div>
    </>
  );
};

export default NavbarWaktuSholat;