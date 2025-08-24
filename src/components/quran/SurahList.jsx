import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Komponen Mini Player yang terpisah
const MiniPlayer = ({
    surahData,
    sheikh,
    isPlaying,
    onTogglePlay,
    onClose,
    onExpand
}) => {
    if (!surahData || !sheikh) return null;

    return (
        <div className="fixed bottom-4 right-4 left-4 bg-white rounded-xl shadow-lg border border-gray-200 p-3 z-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <button
                        className="w-10 h-10 flex items-center justify-center bg-green-100 text-green-600 rounded-full mr-3"
                        onClick={onTogglePlay}
                    >
                        <i className={isPlaying ? 'ri-pause-line' : 'ri-play-line'}></i>
                    </button>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 truncate">
                            {surahData.nomor}. {surahData.namaLatin}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">{getSheikhName(sheikh)}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                        onClick={onExpand}
                    >
                        <i className="ri-expand-diagonal-line"></i>
                    </button>
                    <button
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                    >
                        <i className="ri-close-line"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Komponen utama SurahList
const SurahList = ({ surahList, isLoading, searchQuery }) => {
    const [selectedSurah, setSelectedSurah] = useState(null);
    const [surahAudioData, setSurahAudioData] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMiniPlayerVisible, setIsMiniPlayerVisible] = useState(false);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const [selectedSheikh, setSelectedSheikh] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    // Memuat state dari localStorage saat komponen dimuat
    useEffect(() => {
        const savedSheikh = localStorage.getItem('selectedSheikh');
        const savedSurah = localStorage.getItem('playingSurah');
        const savedIsPlaying = localStorage.getItem('isPlaying');
        const savedCurrentTime = localStorage.getItem('currentTime');

        if (savedSheikh) setSelectedSheikh(savedSheikh);
        if (savedSurah) setSelectedSurah(JSON.parse(savedSurah));
        if (savedIsPlaying === 'true') setIsPlaying(true);
        if (savedCurrentTime) setCurrentTime(parseFloat(savedCurrentTime));

        // Cek apakah ada audio yang sedang diputar
        if (savedSurah && savedSheikh) {
            setIsMiniPlayerVisible(true);
            // Load audio data untuk surah yang sedang diputar
            loadAudioData(JSON.parse(savedSurah));
        }
    }, []);

    // Menyimpan state ke localStorage saat berubah
    useEffect(() => {
        if (selectedSheikh) {
            localStorage.setItem('selectedSheikh', selectedSheikh);
        }
        if (selectedSurah) {
            localStorage.setItem('playingSurah', JSON.stringify(selectedSurah));
        }
        localStorage.setItem('isPlaying', isPlaying.toString());
        localStorage.setItem('currentTime', currentTime.toString());
    }, [selectedSheikh, selectedSurah, isPlaying, currentTime]);

    // Load audio data dari API
    const loadAudioData = async (surah) => {
        setIsLoadingAudio(true);
        try {
            const response = await fetch(`https://equran.id/api/v2/surat/${surah.number}`);
            const data = await response.json();
            setSurahAudioData(data.data);
        } catch (error) {
            console.error('Error fetching audio data:', error);
        } finally {
            setIsLoadingAudio(false);
        }
    };

    // Handler untuk membuka sidebar murottal dan mengambil data audio
    const handlePlayClick = async (surah) => {
        setSelectedSurah(surah);
        setIsLoadingAudio(true);
        setIsSidebarOpen(true);
        setIsMiniPlayerVisible(false); // Pastikan mini player tidak terlihat saat sidebar terbuka
        await loadAudioData(surah);

        // ➕ Tambahkan ini untuk otomatis play
        setTimeout(() => {
            if (audioRef.current && selectedSheikh) {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }, 100); // delay kecil untuk pastikan audio sudah loaded
    };

    // Handler untuk minimize sidebar menjadi mini player
    const handleMinimize = () => {
        setIsSidebarOpen(false);
        setIsMiniPlayerVisible(true);
    };

    // Handler untuk expand mini player menjadi sidebar
    const handleExpand = () => {
        setIsSidebarOpen(true);
        setIsMiniPlayerVisible(false);
    };

    // Handler untuk menutup mini player dan menghentikan audio
    const handleClose = () => {
        setIsMiniPlayerVisible(false);
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsPlaying(false);
        setSelectedSurah(null);
        setSurahAudioData(null);
        localStorage.removeItem('playingSurah');
        localStorage.removeItem('isPlaying');
        localStorage.removeItem('currentTime');
    };

    // Handler untuk memutar/menjeda audio
    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    // Handler untuk memilih syekh
    const handleSheikhSelect = async (sheikhKey) => {
        setSelectedSheikh(sheikhKey);
        // Otomatis putar audio setelah memilih syekh
        setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }, 100);
    };

    // Handler untuk mengupdate progress bar
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    // Handler untuk mengubah posisi pemutaran
    const handleSeek = (e) => {
        if (audioRef.current) {
            const seekTime = parseFloat(e.target.value);
            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    };

    // Handler untuk memutar surah berikutnya
    const playNextSurah = () => {
        if (selectedSurah && surahList.length > 0) {
            const currentIndex = surahList.findIndex(s => s.number === selectedSurah.number);
            if (currentIndex < surahList.length - 1) {
                const nextSurah = surahList[currentIndex + 1];
                handlePlayClick(nextSurah);
            }
        }
    };

    // Handler untuk memutar surah sebelumnya
    const playPrevSurah = () => {
        if (selectedSurah && surahList.length > 0) {
            const currentIndex = surahList.findIndex(s => s.number === selectedSurah.number);
            if (currentIndex > 0) {
                const prevSurah = surahList[currentIndex - 1];
                handlePlayClick(prevSurah);
            }
        }
    };

    // Filter surah berdasarkan pencarian
    const filteredSurahs = surahList.filter(surah => {
        return (
            surah.name.transliteration.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            surah.name.translation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            surah.number.toString().includes(searchQuery)
        );
    });

    if (isLoading) {
        return <div className="p-4 text-center text-gray-500">Memuat data surah...</div>;
    }

    if (filteredSurahs.length === 0) {
        return <div className="p-4 text-center text-gray-500">Surah tidak ditemukan</div>;
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
                {filteredSurahs.map((surah, index) => (
                    <div key={index} className="block hover:bg-gray-50 transition-colors duration-200">
                        <div className="flex items-center px-3 py-3">
                            {/* Play Button */}
                            <button
                                onClick={() => handlePlayClick(surah)}
                                className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700 font-medium transition-colors hover:bg-gray-200"
                            >
                                <i className="ri-play-line text-gray-600"></i>
                            </button>

                            {/* Surah Info + Arabic Title (in one Link) */}
                            <Link
                                to={`/quran/surah/${surah.number}`}
                                className="flex w-full items-center justify-between"
                            >
                                {/* Left Info */}
                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        {surah.number}. {surah.name.transliteration.id}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {surah.name.translation.id} • {surah.numberOfVerses} Ayat
                                    </p>
                                </div>

                                {/* Right Arabic Title */}
                                <p className="font-mushaf text-xl text-gray-600 text-right">
                                    {surah.name.short}
                                </p>
                            </Link>
                        </div>

                    </div>
                ))}
            </div>

            {/* Sidebar Murottal */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                        onClick={() => { }} // Tidak melakukan apa-apa saat overlay diklik
                    ></div>

                    {/* Sidebar Content */}
                    <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-2xl shadow-lg p-4 max-h-[80vh] overflow-y-auto">
                        {/* Close button */}
                        <button
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                            onClick={handleMinimize}
                        >
                            <i className="ri-collapse-diagonal-line text-gray-600"></i>
                        </button>

                        {isLoadingAudio ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                                <span className="ml-3 text-gray-600">Memuat data audio...</span>
                            </div>
                        ) : surahAudioData ? (
                            <>
                                <h2 className="text-xl font-bold mb-4 text-center">
                                    {surahAudioData.nomor}. {surahAudioData.namaLatin}
                                </h2>

                                {/* Daftar Syekh */}
                                <div className="mb-6">
                                    <h3 className="font-medium text-gray-700 mb-3">Pilih Qari</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {surahAudioData.audioFull && Object.entries(surahAudioData.audioFull).map(([key]) => {
                                            const sheikhName = getSheikhName(key);
                                            return (
                                                <button
                                                    key={key}
                                                    className={`p-3 rounded-lg text-left ${selectedSheikh === key ? 'bg-green-100 border border-green-500' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                    onClick={() => handleSheikhSelect(key)}
                                                >
                                                    <p className="font-medium text-gray-800">{sheikhName}</p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Audio Player */}
                                {selectedSheikh && surahAudioData.audioFull[selectedSheikh] && (
                                    <div className="bg-gray-100 rounded-xl p-4 mb-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <p className="font-medium text-gray-800">{getSheikhName(selectedSheikh)}</p>
                                                <p className="text-sm text-gray-600">Sedang diputar</p>
                                            </div>

                                        </div>

                                        {/* Progress bar */}
                                        <div className="mb-2">
                                            <input
                                                type="range"
                                                min="0"
                                                max={duration || 0}
                                                value={currentTime}
                                                onChange={handleSeek}
                                                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                <span>{formatTime(currentTime)}</span>
                                                <span>{formatTime(duration)}</span>
                                            </div>
                                        </div>

                                        {/* Navigation Controls */}
                                        <div className="flex justify-center items-center space-x-4 mt-2">
                                            {/* Previous Button */}
                                            <button
                                                onClick={playPrevSurah}
                                                disabled={selectedSurah.number === 1}
                                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 disabled:opacity-50"
                                            >
                                                <i className="ri-skip-back-line text-xl"></i>
                                            </button>

                                            {/* Play / Pause Button */}
                                            <button
                                                onClick={togglePlayPause}
                                                className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600"
                                            >
                                                <i className={isPlaying ? 'ri-pause-line' : 'ri-play-line'}></i>
                                            </button>

                                            {/* Next Button */}
                                            <button
                                                onClick={playNextSurah}
                                                disabled={selectedSurah.number === 114}
                                                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 disabled:opacity-50"
                                            >
                                                <i className="ri-skip-forward-line text-xl"></i>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <i className="ri-error-warning-line text-3xl mb-2"></i>
                                <p>Gagal memuat data audio</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <audio
                ref={audioRef}
                src={selectedSheikh && surahAudioData?.audioFull?.[selectedSheikh]}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => setDuration(audioRef.current.duration || 0)}
                onEnded={() => {
                    setIsPlaying(false);
                    +       playNextSurah();   // ➕ Auto-play surah berikutnya
                }}
                autoPlay={isPlaying}
                className="hidden"
            />

            {/* Mini Player */}
            {isMiniPlayerVisible && selectedSurah && surahAudioData && selectedSheikh && (
                <MiniPlayer
                    surahData={surahAudioData}
                    sheikh={selectedSheikh}
                    isPlaying={isPlaying}
                    onTogglePlay={togglePlayPause}
                    onClose={handleClose}
                    onExpand={handleExpand}
                />
            )}
        </>
    );
};

// Helper function untuk mendapatkan nama syekh berdasarkan kode
function getSheikhName(key) {
    const sheikhMap = {
        '01': 'Syaikh Abdullah Al-Juhany',
        '02': 'Syaikh Abdul Muhsin Al-Qasim',
        '03': 'Syaikh Abdurrahman as-Sudais',
        '04': 'Syaikh Ibrahim Al-Dossari',
        '05': 'Syaikh Misyari Rasyid Al-Afasi'
    };
    return sheikhMap[key] || `Qari ${key}`;
}

// Helper function untuk format waktu (detik ke menit:detik)
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

export default SurahList;