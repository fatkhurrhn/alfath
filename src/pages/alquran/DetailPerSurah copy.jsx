import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ScrollToTop from '../../components/ScrollToTop'

export default function DetailSurah() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [surahData, setSurahData] = useState(null)
    const [verses, setVerses] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchSurahData = async () => {
            try {
                setIsLoading(true)
                setError(null)

                // Fetch data surah dan ayat sekaligus dari endpoint yang sama
                const response = await fetch(`https://api.quran.gading.dev/surah/${id}`)
                const result = await response.json()

                if (result.status !== 200 && result.code !== 200) {
                    throw new Error('Failed to fetch surah data')
                }

                // Set data surah
                setSurahData(result.data)

                // Set data ayat - perhatikan struktur response yang benar
                if (result.data.verses) {
                    setVerses(result.data.verses)
                } else {
                    throw new Error('Verses data not found in response')
                }

                // Set document title
                document.title = `${result.data.name.transliteration.id} - Islamic`
            } catch (err) {
                setError(err.message)
                document.title = "Detail Surah - Islamic"
            } finally {
                setIsLoading(false)
            }
        }

        fetchSurahData()
    }, [id])

    // Fungsi untuk mendapatkan nomor surah sebelumnya
    const getPrevSurahId = () => {
        const currentId = parseInt(id)
        return currentId > 1 ? currentId - 1 : 114 // Jika di surah 1, kembali ke surah 114
    }

    // Fungsi untuk mendapatkan nomor surah selanjutnya
    const getNextSurahId = () => {
        const currentId = parseInt(id)
        return currentId < 114 ? currentId + 1 : 1 // Jika di surah 114, lanjut ke surah 1
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto max-w-xl px-4 md:mb-0 pt-20 mb-[70px] border-x border-gray-200 bg-white min-h-screen">
                    <div className="p-4 text-center text-gray-500">Memuat data surah...</div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto max-w-xl px-4 md:mb-0 pt-20 mb-[70px] border-x border-gray-200 bg-white min-h-screen">
                    <div className="p-4 text-center text-red-500">Error: {error}</div>
                    <div className="text-center mt-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Coba Lagi
                        </button>
                    </div>
                    <div className="text-center mt-4">
                        <Link
                            to="/"
                            className="text-blue-500 hover:text-blue-700"
                        >
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
                {surahData && (
                    <div className="border-b border-gray-200 p-2">
                        {/* Nama Surah */}
                        <div className="flex items-center justify-between mb-4">
                            {/* Tombol navigasi ke surah sebelumnya */}
                            <Link
                                to={`/quran/surah/${getPrevSurahId()}`}
                                className="text-gray-500 hover:text-gray-700 p-2"
                                onClick={(e) => {
                                    e.preventDefault()
                                    navigate(`/quran/surah/${getPrevSurahId()}`)
                                    window.scrollTo(0, 0)
                                }}
                            >
                                <i className="ri-arrow-left-s-line text-2xl"></i>
                            </Link>

                            {/* Konten Surah */}
                            <div className="text-center flex-1">
                                <Link to="/quran">
                                    <p className="text-gray-900 font-mushaf text-2xl">
                                        {surahData.name.short}
                                    </p>
                                    <p className="text-gray-600">
                                        {surahData.name.transliteration.id} - {surahData.name.translation.id}
                                    </p>
                                    <p className="text-[12px] text-gray-500">
                                        {surahData.revelation.id} | {surahData.numberOfVerses} Ayat
                                    </p>
                                </Link>
                            </div>

                            {/* Tombol navigasi ke surah selanjutnya */}
                            <Link
                                to={`/quran/surah/${getNextSurahId()}`}
                                className="text-gray-500 hover:text-gray-700 p-2"
                                onClick={(e) => {
                                    e.preventDefault()
                                    navigate(`/quran/surah/${getNextSurahId()}`)
                                    window.scrollTo(0, 0)
                                }}
                            >
                                <i className="ri-arrow-right-s-line text-2xl"></i>
                            </Link>
                        </div>

                        {/* Bismillah (kecuali Al-Fatihah & At-Taubah) */}
                        {surahData.number !== 1 && surahData.number !== 9 && (
                            <div className="text-center my-6">
                                <p className="font-uthmani text-3xl text-gray-800">
                                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                                </p>
                                <p className="text-sm text-gray-600 mt-2">
                                    Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Daftar Ayat */}
                <div className="divide-y divide-gray-100">
                    {verses.map((verse, index) => (
                        <div key={index} className="p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between mb-4">
                                {/* Icon kiri */}
                                <button className="text-gray-500 hover:text-gray-700">
                                    <i className="ri-more-2-fill text-xl"></i>
                                </button>

                                {/* Teks Arab kanan */}
                                <p className="font-mushaf text-[23px] leading-loose text-right flex-1 ml-4">
                                    {verse.text.arab}
                                </p>
                            </div>

                            {/* Terjemahan */}
                            <div className='text-[15px]'>
                                <p className="text-gray-800 text-justify"><span className="mr-2 font-semibold">({verse.number.inSurah})</span>{verse.translation.id}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ScrollToTop />
        </div>
    )
}