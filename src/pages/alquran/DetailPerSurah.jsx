import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ScrollToTop from '../../components/ScrollToTop'

export default function DetailSurah() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [pageData, setPageData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(parseInt(id) || 1)
    const [totalPages, setTotalPages] = useState(604) // Total halaman Quran standar
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                setIsLoading(true)
                setError(null)

                // Menggunakan API myquran.com
                const response = await fetch(`https://api.myquran.com/v2/quran/ayat/page/${currentPage}`)
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                
                const result = await response.json()

                if (result.status !== true) {
                    throw new Error('Failed to fetch page data')
                }

                setPageData(result.data)
                document.title = `Halaman ${currentPage} - Islamic`
            } catch (err) {
                setError(err.message)
                document.title = "Detail Halaman - Islamic"
                console.error("Fetch error:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPageData()
    }, [currentPage])

    // Fungsi untuk navigasi halaman
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
            window.scrollTo(0, 0)
            
            // Update URL tanpa reload halaman
            navigate(`/quran/page/${page}`, { replace: true })
        }
    }

    // Fungsi untuk menangani swipe/touch events
    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX)
    }

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 50) {
            // Swipe kiri - ke halaman berikutnya
            goToPage(currentPage + 1)
        } else if (touchEnd - touchStart > 50) {
            // Swipe kanan - ke halaman sebelumnya
            goToPage(currentPage - 1)
        }
    }

    // Fungsi untuk mendapatkan nama surah dari nomor surah
    const getSurahName = (surahNumber) => {
        // Daftar nama surah dalam Quran
        const surahNames = {
            1: "Al-Fatihah",
            2: "Al-Baqarah",
            3: "Ali 'Imran",
            4: "An-Nisa",
            5: "Al-Ma'idah",
            6: "Al-An'am",
            7: "Al-A'raf",
            8: "Al-Anfal",
            9: "At-Taubah",
            10: "Yunus",
            11: "Hud",
            12: "Yusuf",
            13: "Ar-Ra'd",
            14: "Ibrahim",
            15: "Al-Hijr",
            16: "An-Nahl",
            17: "Al-Isra",
            18: "Al-Kahf",
            19: "Maryam",
            20: "Taha",
            21: "Al-Anbiya",
            22: "Al-Hajj",
            23: "Al-Mu'minun",
            24: "An-Nur",
            25: "Al-Furqan",
            26: "Asy-Syu'ara",
            27: "An-Naml",
            28: "Al-Qasas",
            29: "Al-'Ankabut",
            30: "Ar-Rum",
            31: "Luqman",
            32: "As-Sajdah",
            33: "Al-Ahzab",
            34: "Saba",
            35: "Fatir",
            36: "Yasin",
            37: "As-Saffat",
            38: "Sad",
            39: "Az-Zumar",
            40: "Ghafir",
            41: "Fussilat",
            42: "Asy-Syura",
            43: "Az-Zukhruf",
            44: "Ad-Dukhan",
            45: "Al-Jasiyah",
            46: "Al-Ahqaf",
            47: "Muhammad",
            48: "Al-Fath",
            49: "Al-Hujurat",
            50: "Qaf",
            51: "Az-Zariyat",
            52: "At-Tur",
            53: "An-Najm",
            54: "Al-Qamar",
            55: "Ar-Rahman",
            56: "Al-Waqi'ah",
            57: "Al-Hadid",
            58: "Al-Mujadilah",
            59: "Al-Hasyr",
            60: "Al-Mumtahanah",
            61: "As-Saff",
            62: "Al-Jumu'ah",
            63: "Al-Munafiqun",
            64: "At-Taghabun",
            65: "At-Talaq",
            66: "At-Tahrim",
            67: "Al-Mulk",
            68: "Al-Qalam",
            69: "Al-Haqqah",
            70: "Al-Ma'arij",
            71: "Nuh",
            72: "Al-Jinn",
            73: "Al-Muzzammil",
            74: "Al-Muddaththir",
            75: "Al-Qiyamah",
            76: "Al-Insan",
            77: "Al-Mursalat",
            78: "An-Naba",
            79: "An-Nazi'at",
            80: "'Abasa",
            81: "At-Takwir",
            82: "Al-Infitar",
            83: "Al-Mutaffifin",
            84: "Al-Insyiqaq",
            85: "Al-Buruj",
            86: "At-Tariq",
            87: "Al-A'la",
            88: "Al-Gasyiyah",
            89: "Al-Fajr",
            90: "Al-Balad",
            91: "Asy-Syams",
            92: "Al-Lail",
            93: "Ad-Duha",
            94: "Al-Insyirah",
            95: "At-Tin",
            96: "Al-'Alaq",
            97: "Al-Qadr",
            98: "Al-Bayyinah",
            99: "Az-Zalzalah",
            100: "Al-'Adiyat",
            101: "Al-Qari'ah",
            102: "At-Takasur",
            103: "Al-'Asr",
            104: "Al-Humazah",
            105: "Al-Fil",
            106: "Quraisy",
            107: "Al-Ma'un",
            108: "Al-Kausar",
            109: "Al-Kafirun",
            110: "An-Nasr",
            111: "Al-Lahab",
            112: "Al-Ikhlas",
            113: "Al-Falaq",
            114: "An-Nas"
        };
        return surahNames[surahNumber] || `Surah ${surahNumber}`;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto max-w-xl px-4 md:mb-0 pt-20 mb-[70px] border-x border-gray-200 bg-white min-h-screen">
                    <div className="p-4 text-center text-gray-500">
                        <div className="flex justify-center my-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                        </div>
                        <p>Memuat halaman {currentPage}...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto max-w-xl px-4 md:mb-0 pt-20 mb-[70px] border-x border-gray-200 bg-white min-h-screen">
                    <div className="p-4 text-center text-red-500">
                        <i className="ri-error-warning-line text-2xl mb-2 block"></i>
                        <p>Error: Gagal memuat data</p>
                        <p className="text-sm mt-1 text-gray-600">{error}</p>
                    </div>
                    <div className="text-center mt-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center mx-auto"
                        >
                            <i className="ri-refresh-line mr-2"></i>
                            Coba Lagi
                        </button>
                    </div>
                    <div className="text-center mt-4">
                        <Link
                            to="/"
                            className="text-blue-500 hover:text-blue-700 inline-flex items-center"
                        >
                            <i className="ri-home-line mr-1"></i>
                            Kembali ke Halaman Utama
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto max-w-xl px-2 md:mb-0 pt-6 border-x border-gray-200 bg-white min-h-screen">
                {/* Header dengan navigasi halaman */}
                <div className="border-b border-gray-200 p-4 sticky top-0 bg-white z-10 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        {/* Tombol navigasi ke halaman sebelumnya */}
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <i className="ri-arrow-left-s-line text-2xl"></i>
                        </button>

                        {/* Info Halaman */}
                        <div className="text-center flex-1">
                            <p className="text-gray-900 font-semibold text-xl">
                                Halaman {currentPage}
                            </p>
                            <p className="text-gray-600 text-sm">
                                {pageData && pageData.ayat && pageData.ayat.length > 0 && 
                                    `${getSurahName(pageData.ayat[0].surah.nomor)} - ${getSurahName(pageData.ayat[pageData.ayat.length - 1].surah.nomor)}`
                                }
                            </p>
                        </div>

                        {/* Tombol navigasi ke halaman selanjutnya */}
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-full ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <i className="ri-arrow-right-s-line text-2xl"></i>
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div 
                            className="bg-green-500 h-1.5 rounded-full transition-all duration-300" 
                            style={{ width: `${(currentPage / totalPages) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Daftar Ayat (Per Halaman) */}
                <div 
                    className="py-4"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {pageData && pageData.ayat && pageData.ayat.map((verse, index) => (
                        <div key={index} className="mb-6 px-4">
                            {/* Header ayat - hanya tampilkan jika surah berbeda dengan ayat sebelumnya */}
                            {(index === 0 || verse.surah.nomor !== pageData.ayat[index - 1].surah.nomor) && (
                                <div className="text-center my-4 p-3 bg-green-50 rounded-lg border border-green-100">
                                    <p className="font-semibold text-green-800">
                                        {getSurahName(verse.surah.nomor)}
                                    </p>
                                    <p className="text-xs text-green-600 mt-1">
                                        {verse.surah.namaLatin} ({verse.surah.jumlahAyat} ayat)
                                    </p>
                                    {verse.nomorAyat === 1 && verse.surah.nomor !== 1 && verse.surah.nomor !== 9 && (
                                        <p className="text-xs text-green-500 mt-1">Dengan menyebut nama Allah Yang Maha Pengasih lagi Maha Penyayang</p>
                                    )}
                                </div>
                            )}

                            {/* Teks Arab */}
                            <div className="text-right mb-3">
                                <p className="font-mushaf text-2xl leading-loose">
                                    {verse.teksArab}
                                    <span className="text-lg text-gray-500 ml-2">﴿{verse.nomorAyat}﴾</span>
                                </p>
                            </div>

                            {/* Info Ayat dan Terjemahan */}
                            <div className='flex justify-between items-start mb-2'>
                                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {verse.surah.nomor}:{verse.nomorAyat}
                                </span>
                                <button className="text-gray-500 hover:text-gray-700">
                                    <i className="ri-more-2-fill text-xl"></i>
                                </button>
                            </div>
                            
                            <div className='text-gray-700 text-justify mb-3'>
                                <p>{verse.teksIndonesia}</p>
                            </div>

                            {/* Latin */}
                            <div className='text-gray-500 text-sm italic mb-3'>
                                <p>{verse.teksLatin}</p>
                            </div>

                            <div className="border-b border-gray-100 my-4"></div>
                        </div>
                    ))}
                </div>

                {/* Navigasi Halaman (Bawah) */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-md">
                    <div className="flex justify-between items-center mb-3">
                        <button 
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg flex items-center ${currentPage === 1 ? 'text-gray-400 bg-gray-100' : 'text-white bg-green-500 hover:bg-green-600'}`}
                        >
                            <i className="ri-arrow-left-s-line text-xl mr-1"></i> 
                            <span className="hidden sm:inline">Sebelumnya</span>
                        </button>
                        
                        <span className="text-sm text-gray-600 mx-2">
                            {currentPage} / {totalPages}
                        </span>
                        
                        <button 
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-lg flex items-center ${currentPage === totalPages ? 'text-gray-400 bg-gray-100' : 'text-white bg-green-500 hover:bg-green-600'}`}
                        >
                            <span className="hidden sm:inline">Selanjutnya</span>
                            <i className="ri-arrow-right-s-line text-xl ml-1"></i>
                        </button>
                    </div>
                    
                    {/* Input lompat ke halaman */}
                    <div className="flex justify-center">
                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                            <input 
                                type="number" 
                                min="1" 
                                max="604" 
                                placeholder="Halaman"
                                className="px-3 py-2 w-20 text-center border-none focus:ring-0 focus:outline-none"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        const page = parseInt(e.target.value);
                                        if (page >= 1 && page <= 604) {
                                            goToPage(page);
                                            e.target.value = '';
                                        }
                                    }
                                }}
                            />
                            <button 
                                className="px-3 py-2 bg-blue-500 text-white hover:bg-blue-600"
                                onClick={() => {
                                    const input = document.querySelector('input[type="number"]');
                                    const page = parseInt(input.value);
                                    if (page >= 1 && page <= 604) {
                                        goToPage(page);
                                        input.value = '';
                                    }
                                }}
                            >
                                <i className="ri-search-line"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ScrollToTop />
        </div>
    )
}