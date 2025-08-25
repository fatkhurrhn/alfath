import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Helper format tanggal
function formatTanggal(timestamp, short = false) {
    const date = new Date(timestamp)

    // Mapping bulan
    const bulanMapPendek = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]
    const bulanMapPanjang = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

    const hari = date.getDate()
    const bulan = short ? bulanMapPendek[date.getMonth()] : bulanMapPanjang[date.getMonth()]
    const tahun = date.getFullYear()

    const jam = date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23"
    })

    return `${hari} ${bulan} ${tahun} Pukul ${jam}`
}

function Bookmark() {
    const [bookmarks, setBookmarks] = useState([])

    useEffect(() => {
        // Ambil data bookmark dari localStorage
        const savedBookmarks = JSON.parse(localStorage.getItem('quran-bookmarks')) || []
        setBookmarks(savedBookmarks)
    }, [])

    const removeBookmark = (surahId) => {
        const updatedBookmarks = bookmarks.filter(bookmark => bookmark.surahId !== surahId)
        setBookmarks(updatedBookmarks)
        localStorage.setItem('quran-bookmarks', JSON.stringify(updatedBookmarks))
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-xl mx-auto min-h-screen">

                {/* Daftar Bookmark */}
                <div className="p-4">
                    {bookmarks.length === 0 ? (
                        <div className="text-center py-10">
                            <i className="ri-bookmark-line text-4xl text-gray-300 mb-4"></i>
                            <p className="text-gray-500">Belum ada surah yang di-bookmark</p>
                            <Link
                                to="/quran"
                                className="mt-4 inline-block px-4 py-2 bg-gray-600 text-white rounded-md"
                            >
                                Jelajahi Surah
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {bookmarks.map((bookmark, index) => (
                                <div key={index} className="py-4 flex items-center justify-between">
                                    <div className="flex-1">
                                        <Link
                                            to={`/quran/surah/${bookmark.surahId}`}
                                            className="block"
                                        >
                                            <h3 className="font-semibold font-mushaf text-gray-800">
                                                {bookmark.surahName} ({bookmark.surahNameArabic})
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {bookmark.totalVerses} ayat • {formatTanggal(bookmark.timestamp, true)}
                                                {/* true = pakai bulan pendek (Agu), false = bulan panjang (Agustus) */}
                                            </p>
                                        </Link>
                                    </div>
                                    <button
                                        onClick={() => removeBookmark(bookmark.surahId)}
                                        className="text-red-500 ml-4"
                                    >
                                        <i className="ri-close-line text-xl"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Bookmark
