import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import QuranTabs from '../../components/quran/QuranTabs'
import SearchBar from '../../components/quran/SearchBar'
import SurahList from '../../components/quran/SurahList'
import JuzList from '../../components/quran/JuzList'
import GamesList from '../../components/quran/GamesList' // Import komponen GamesList
import { useParams, useNavigate } from 'react-router-dom'

export default function HomeQuran() {
  const [surahList, setSurahList] = useState([]);
  const [juzList, setJuzList] = useState([]);
  const [gamesList, setGamesList] = useState([]);
  const [activeTab, setActiveTab] = useState('surah');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isJuzLoading, setIsJuzLoading] = useState(false);
  const [isGamesLoading, setIsGamesLoading] = useState(false);

  const { tab } = useParams();
  const navigate = useNavigate();

  // Sync activeTab dengan URL parameter
  useEffect(() => {
    if (tab && ['surah', 'juz', 'games'].includes(tab)) {
      setActiveTab(tab);
    } else {
      // Redirect ke default tab jika parameter tidak valid
      navigate('/quran/surah', { replace: true });
    }
  }, [tab, navigate]);

  useEffect(() => {
    document.title = "Al Quran - Islamic";

    const loadSurahList = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://equran.id/api/v2/surat');
        const data = await response.json();

        if (data && data.data) {
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

  // Load data juz ketika tab juz aktif
  useEffect(() => {
    if (activeTab === 'juz' && juzList.length === 0) {
      loadJuzList();
    }
  }, [activeTab]);

  // Load data games ketika tab games aktif
  useEffect(() => {
    if (activeTab === 'games' && gamesList.length === 0) {
      loadGamesList();
    }
  }, [activeTab]);

  const loadJuzList = async () => {
    try {
      setIsJuzLoading(true);
      const response = await fetch('https://api.myquran.com/v2/quran/juz/semua');
      const data = await response.json();

      if (data && data.data) {
        setJuzList(data.data);
      }
    } catch (error) {
      console.error("Error loading juz data:", error);
    } finally {
      setIsJuzLoading(false);
    }
  };

  const loadGamesList = async () => {
    try {
      setIsGamesLoading(true);
      // Data games placeholder
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

      case 'juz':
        return <JuzList juzList={juzList} isJuzLoading={isJuzLoading} searchQuery={searchQuery} />;

      case 'games':
        return <GamesList gamesList={gamesList} isGamesLoading={isGamesLoading} searchQuery={searchQuery} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-xl mx-auto px-3 container border-x border-gray-200">
        {/* Navback */}
        <div className="fixed top-0 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 border-b border-gray-200 bg-white px-3 py-4">
          <div className="flex items-center justify-between">
            {/* Kiri: Back */}
            <Link
              to="/"
              className="flex items-center gap-2 text-[15px] font-semibold text-gray-800"
            >
              <i className="ri-arrow-left-line"></i>
              Al-Qur'an
            </Link>

            {/* Kanan: Settings & Filter */}
            <div className="flex items-center gap-3">
              <button className="text-gray-600 hover:text-gray-800">
                <i className="ri-filter-line text-xl"></i>
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                <i className="ri-settings-5-line text-xl"></i>
              </button>
            </div>
          </div>
        </div>

        {/* isi kontennya */}
        <div className='pt-[65px]'>
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
      </div>
    </div>
  )
}