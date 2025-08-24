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

                // Fetch data surah dan ayat sekaligus dari endpoint equran.id
                const response = await fetch(`https://equran.id/api/v2/surat/${id}`)
                const result = await response.json()

                if (result.code !== 200) {
                    throw new Error('Failed to fetch surah data')
                }

                // Set data surah
                setSurahData(result.data)

                // Transform data ayat ke format yang diharapkan komponen
                if (result.data.ayat) {
                    const transformedVerses = result.data.ayat.map(ayat => ({
                        number: {
                            inSurah: ayat.nomorAyat
                        },
                        text: {
                            arab: ayat.teksArab
                        },
                        translation: {
                            id: ayat.teksIndonesia
                        }
                    }));
                    setVerses(transformedVerses)
                } else {
                    throw new Error('Verses data not found in response')
                }

                // Set document title
                document.title = `${result.data.namaLatin} - Islamic`

                // Scroll ke atas setelah data dimuat
                window.scrollTo(0, 0)
            } catch (err) {
                setError(err.message)
                document.title = "Detail Surah - Islamic"
            } finally {
                setIsLoading(false)
            }
        }

        fetchSurahData()
    }, [id])

    // Fungsi untuk navigasi yang smooth tanpa loading terlihat
    const navigateToSurah = (surahId) => {
        // Langsung update URL tanpa menunggu loading
        navigate(`/quran/surah/${surahId}`)

        // Scroll ke atas segera
        window.scrollTo(0, 0)

        // Data akan di-load oleh useEffect karena id berubah
    }

    if (isLoading && !surahData) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto max-w-xl px-4 md:mb-0 mb-[70px] border-x border-gray-200 bg-white min-h-screen flex items-center justify-center">
                    {/* Icon muter di tengah */}
                    <div className="text-center">
                        <i className="ri-loader-2-line text-2xl text-blue-700 mb-2"></i>
                    </div>
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
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Coba Lagi
                        </button>
                    </div>
                    <div className="text-center mt-4">
                        <Link
                            to="/"
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Kembali ke Halaman Utama
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Loading Bar saat navigasi antar surah */}
            {isLoading && (
                <div className="fixed top-0 left-0 right-0 h-0.5 z-50">
                    <div className="h-full bg-blue-700 animate-[progress_1.2s_ease-in-out_infinite]"></div>
                </div>
            )}

            <div className="max-w-xl mx-auto px-3 container border-x border-gray-200">
                {/* Navback */}
                <div className="max-w-xl mx-auto w-full z-40 bg-white px-3 py-4 border-b border-gray-200 flex items-center justify-between">
                    {/* Kiri: Back */}
                    <Link
                        to="/quran"
                        className="flex items-center font-semibold gap-2 text-gray-800 text-[15px]"
                    >
                        <i className="ri-arrow-left-line"></i> Detail Surah
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

                {surahData && (
                    <div className="pt-[10px]">
                        {/* Nama Surah */}
                        <div className="flex items-center justify-between mb-4">
                            {/* Tombol navigasi ke surah sebelumnya */}
                            <button
                                onClick={() => navigateToSurah(surahData.nomor > 1 ? surahData.nomor - 1 : 114)}
                                className="text-gray-500 hover:text-gray-700 p-2"
                                disabled={isLoading}
                            >
                                <i className="ri-arrow-left-s-line text-2xl"></i>
                            </button>

                            {/* Konten Surah */}
                            <div className="text-center flex-1">
                                <div>
                                    <p className="text-gray-900 font-mushaf text-2xl">
                                        {surahData.nama}
                                    </p>
                                    <p className="text-gray-600 pt-1">
                                        {surahData.namaLatin} - {surahData.arti}
                                    </p>
                                    <p className="text-[12px] text-gray-500">
                                        {surahData.tempatTurun} | {surahData.jumlahAyat} Ayat
                                    </p>
                                </div>
                            </div>

                            {/* Tombol navigasi ke surah selanjutnya */}
                            <button
                                onClick={() => navigateToSurah(surahData.nomor < 114 ? surahData.nomor + 1 : 1)}
                                className="text-gray-500 hover:text-gray-700 p-2"
                                disabled={isLoading}
                            >
                                <i className="ri-arrow-right-s-line text-2xl"></i>
                            </button>
                        </div>

                        {/* Bismillah (kecuali Al-Fatihah & At-Taubah) */}
                        {surahData.nomor !== 1 && surahData.nomor !== 9 && (
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
                                <p className="font-mushaf text-[22px] leading-loose text-right flex-1 ml-4">
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
                <ScrollToTop />
            </div>
        </div>
    )
}