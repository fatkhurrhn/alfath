import { useState, useEffect } from "react";

const NavbarWaktuSholat = ({ onCitySelect, nextPrayer, nextPrayerTime, countdown, selectedCity }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCityModal, setShowCityModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mendapatkan data kota dari API (hanya sekali saat mount)
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://api.myquran.com/v2/sholat/kota/semua");
        const data = await response.json();
        if (data.status) {
          setCities(data.data);
          setFilteredCities(data.data);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, []); // Empty dependency array untuk eksekusi sekali saja

  // Mencari kota berdasarkan query
  const searchCities = (query) => {
    if (query.length < 2) {
      setFilteredCities(cities);
      return;
    }

    const filtered = cities.filter(city => 
      city.lokasi.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCities(filtered);
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
    setShowCityModal(false);
    setSearchQuery("");
    setFilteredCities(cities);
    if (onCitySelect) onCitySelect(cityId, cityName);
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
                {selectedCity || "Pilih Kota"} ▼
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
    </>
  );
};

export default NavbarWaktuSholat;