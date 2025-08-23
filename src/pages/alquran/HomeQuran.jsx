import React, { useEffect, useState } from 'react'
import BottomNav from '../../components/BottomNav'
import NavbarWaktuSholat from '../../components/NavWaktuSholat'
import PrayerTimeManager from '../../components/PrayerTimeManager'
import QuranTabs from '../../components/quran/QuranTabs'
import SearchBar from '../../components/quran/SearchBar'
import SurahList from '../../components/quran/SurahList'
import JuzList from '../../components/quran/JuzList'
import ReadingHistory from '../../components/quran/ReadingHistory'

export default function HomeQuran() {
  const [surahList, setSurahList] = useState([]);
  const [juzList, setJuzList] = useState([]);
  const [activeTab, setActiveTab] = useState('surah');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isJuzLoading, setIsJuzLoading] = useState(false);

  useEffect(() => {
    document.title = "Al Quran - Islamic";

    // Load daftar surah dari API baru
    const loadSurahList = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://api.quran.gading.dev/surah');
        const data = await response.json();
        
        if (data && data.data) {
          setSurahList(data.data);
        }
      } catch (error) {
        console.error("Error loading surah data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSurahList();
  }, []);

  // Load data juz ketika tab juz aktif
  useEffect(() => {
    if (activeTab === 'juz' && juzList.length === 0) {
      loadJuzList();
    }
  }, [activeTab]);

  const loadJuzList = async () => {
    try {
      setIsJuzLoading(true);
      const juzPromises = [];
      
      // Load data untuk setiap juz (1-30)
      for (let i = 1; i <= 30; i++) {
        juzPromises.push(
          fetch(`https://api.quran.gading.dev/juz/${i}`)
            .then(response => response.json())
            .then(data => data.data)
            .catch(error => {
              console.error(`Error loading juz ${i}:`, error);
              return null;
            })
        );
      }
      
      const juzData = await Promise.all(juzPromises);
      const validJuz = juzData.filter(juz => juz !== null);
      setJuzList(validJuz);
    } catch (error) {
      console.error("Error loading juz data:", error);
    } finally {
      setIsJuzLoading(false);
    }
  };

  // Render konten berdasarkan tab aktif
  const renderContent = () => {
    switch (activeTab) {
      case 'surah':
        return <SurahList surahList={surahList} isLoading={isLoading} searchQuery={searchQuery} />;
      
      case 'juz':
        return <JuzList juzList={juzList} isJuzLoading={isJuzLoading} searchQuery={searchQuery} />;
      
      case 'riwayat':
        return <ReadingHistory />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PrayerTimeManager>
        {({ nextPrayer, nextPrayerTime, countdown, selectedCity, handleCitySelect }) => (
          <>
            <NavbarWaktuSholat
              onCitySelect={handleCitySelect}
              nextPrayer={nextPrayer}
              nextPrayerTime={nextPrayerTime}
              countdown={countdown}
              selectedCity={selectedCity}
            />

            {/* Konten utama */}
            <div className="container mx-auto max-w-xl px-2 md:mb-0 pt-20 mb-[70px] border-x border-gray-200 bg-white min-h-screen">
              {/* Tab Navigation */}
              <QuranTabs activeTab={activeTab} setActiveTab={setActiveTab} />

              {/* Pencarian - hanya tampil di tab surah dan juz */}
              {(activeTab === 'surah' || activeTab === 'juz') && (
                <SearchBar 
                  searchQuery={searchQuery} 
                  setSearchQuery={setSearchQuery} 
                  activeTab={activeTab} 
                />
              )}

              {/* Konten berdasarkan tab aktif */}
              {renderContent()}
            </div>
          </>
        )}
      </PrayerTimeManager>
      <BottomNav />
    </div>
  )
}