import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import NavbarWaktuSholat from '../../components/NavWaktuSholat'
import PrayerTimeManager from '../../components/PrayerTimeManager'

export default function DetailSurah() {
    const { id } = useParams()
    const [surahData, setSurahData] = useState(null)
    const [verses, setVerses] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchSurahData = async () => {
            try {
                setIsLoading(true)
                setError(null)

                // Fetch data surah
                const surahResponse = await fetch(`https://api.quran.gading.dev/surah/${id}`)
                const surahResult = await surahResponse.json()

                if (surahResult.code !== 200) {
                    throw new Error('Failed to fetch surah data')
                }

                setSurahData(surahResult.data)

                // Fetch semua ayat dalam surah
                const versesResponse = await fetch(`https://api.quran.gading.dev/surah/${id}`)
                const versesResult = await versesResponse.json()

                if (versesResult.code !== 200) {
                    throw new Error('Failed to fetch verses data')
                }

                setVerses(versesResult.data.verses)

                // Set document title
                document.title = `${surahResult.data.name.transliteration.id} - Islamic`
            } catch (err) {
                setError(err.message)
                document.title = "Detail Surah - Islamic"
            } finally {
                setIsLoading(false)
            }
        }

        fetchSurahData()
    }, [id])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <>
                    <div className="container mx-auto max-w-xl px-4 md:mb-0 pt-20 mb-[70px] border-x border-gray-200 bg-white min-h-screen">
                        <div className="p-4 text-center text-gray-500">Memuat data surah...</div>
                    </div>
                </>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <>
                    <div className="container mx-auto max-w-xl px-4 md:mb-0 pt-20 mb-[70px] border-x border-gray-200 bg-white min-h-screen">
                        <div className="p-4 text-center text-red-500">Error: {error}</div>
                        <div className="p-4 text-center">
                            <Link to="/quran" className="text-blue-600 hover:underline">
                                Kembali ke Daftar Surah
                            </Link>
                        </div>
                    </div>
                </>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <>
                {/* Header Surah */}
                <div className="container mx-auto max-w-xl px-4 md:mb-0 pt-20 mb-[70px] border-x border-gray-200 bg-white min-h-screen">
                    {surahData && (
                        <div className="sticky top-16 bg-white z-10 border-b border-gray-200 p-4">
                            <div className="mt-4 text-center">
                                <p className="text-gray-500 font-mushaf text-2xl">{surahData.name.short}</p>
                                <p className="text-gray-600">{surahData.name.transliteration.id} - {surahData.name.translation.id}</p>
                                <p className="text-sm text-gray-500">
                                    {surahData.revelation.id} | {surahData.numberOfVerses} Ayat
                                </p>
                            </div>

                            {/* Bismillah untuk surah selain Al-Fatihah dan At-Taubah */}
                            {surahData.number !== 1 && surahData.number !== 9 && (
                                <div className="text-center my-6">
                                    <p className="font-uthmani text-3xl text-gray-800">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                                    <p className="text-sm text-gray-600 mt-2">Dengan nama Allah Yang Maha Pengasih, Maha Penyayang</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Daftar Ayat */}
                    <div className="divide-y divide-gray-100">
                        {verses.map((verse, index) => (
                            <div key={index} className="p-4 hover:bg-gray-50">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full text-sm">
                                        {verse.number.inSurah}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="p-2 text-gray-500 hover:text-blue-600">
                                            <i className="ri-play-circle-line text-lg"></i>
                                        </button>
                                        <button className="p-2 text-gray-500 hover:text-green-600">
                                            <i className="ri-bookmark-line text-lg"></i>
                                        </button>
                                        <button className="p-2 text-gray-500 hover:text-red-600">
                                            <i className="ri-share-forward-line text-lg"></i>
                                        </button>
                                    </div>
                                </div>

                                {/* Teks Arab */}
                                <div className="text-right mb-4">
                                    <p className="font-mushaf text-2xl leading-loose">{verse.text.arab} 
                                        <span clas>{verse.number.inSurah}</span>
                                    </p>
                                </div>

                                {/* Terjemahan */}
                                <div className="mb-4">
                                    <p className="text-gray-800 text-justify">{verse.translation.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        </div>
    )
}