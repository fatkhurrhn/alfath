import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import QuranTabs from '../../components/quran/QuranTabs'
import SearchBar from '../../components/quran/SearchBar'
import SurahList from '../../components/quran/SurahList'
import GamesList from '../../components/quran/GamesList'
import ReadingHistory from '../../components/quran/ReadingHistory'
import ScrollToTop from '../../components/ScrollToTop'

export default function HomeQuran() {
  const [surahList, setSurahList] = useState([]);
  const [gamesList, setGamesList] = useState([]); // Changed from juzList to gamesList
  const [activeTab, setActiveTab] = useState('surah');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isGamesLoading, setIsGamesLoading] = useState(false); // Changed from isJuzLoading

  useEffect(() => {
    document.title = "Al Quran - Islamic";

    // Load daftar surah dari API baru (equran.id)
    const loadSurahList = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://equran.id/api/v2/surat');
        const data = await response.json();

        if (data && data.data) {
          // Transform data to match the expected format
          const transformedData = data.data.map(surah => ({
            number: surah.nomor,
            name: {
              transliteration: {
                id: surah.namaLatin
              },
              translation: {
                id: surah.arti
              },
              short: surah.nama
            },
            numberOfVerses: surah.jumlahAyat,
            revelation: {
              id: surah.tempatTurun
            },
            description: surah.deskripsi,
            audio: surah.audioFull
          }));

          setSurahList(transformedData);
        }
      } catch (error) {
        console.error("Error loading surah data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSurahList();
  }, []);

  // Load data games ketika tab games aktif
  useEffect(() => {
    if (activeTab === 'games' && gamesList.length === 0) {
      loadGamesList();
    }
  }, [activeTab]);

  const loadGamesList = async () => {
    try {
      setIsGamesLoading(true);
      // This is a placeholder - you'll need to implement actual games data
      const gamesData = [
        {
          id: 1,
          title: "Tebak Surah",
          description: "Tebak nama surah berdasarkan ayat yang diberikan",
          icon: "ri-question-line"
        },
        {
          id: 2,
          title: "Hafalan Ayat",
          description: "Uji hafalan ayat-ayat pilihan",
          icon: "ri-brain-line"
        },
        {
          id: 3,
          title: "Kuis Quran",
          description: "Jawab pertanyaan seputar Al-Quran",
          icon: "ri-lightbulb-line"
        }
      ];
      setGamesList(gamesData);
    } catch (error) {
      console.error("Error loading games data:", error);
    } finally {
      setIsGamesLoading(false);
    }
  };

  // Render konten berdasarkan tab aktif
  const renderContent = () => {
    switch (activeTab) {
      case 'surah':
        return <SurahList surahList={surahList} isLoading={isLoading} searchQuery={searchQuery} />;

      case 'games':
        return <GamesList gamesList={gamesList} isGamesLoading={isGamesLoading} searchQuery={searchQuery} />;

      case 'riwayat':
        return <ReadingHistory />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-xl mx-auto px-3 container border-x border-gray-200">
        {/* Navback */}
        <div className="fixed top-0 max-w-xl border-b border-gray-200 mx-auto left-1/2 -translate-x-1/2 w-full z-50 bg-white px-3 py-4">
          <Link to="/" className="flex items-center font-semibold gap-2 text-gray-800 text-[15px]">
            <i className="ri-arrow-left-line"></i> Al-Qur'an
          </Link>
        </div>

        {/* isi kontennya */}
        <div className='pt-[65px]'>
          {/* Tab Navigation */}
          <QuranTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Pencarian - hanya tampil di tab surah */}
          {activeTab === 'surah' && (
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeTab={activeTab}
            />
          )}

          {/* Konten berdasarkan tab aktif */}
          {renderContent()}
        </div>
      </div>
      <ScrollToTop />
    </div>
  )
}