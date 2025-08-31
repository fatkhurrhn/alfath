// src/pages/ListSurah.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ListSurah() {
    const [surahs, setSurahs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                const list = [];
                for (let i = 1; i <= 114; i++) {
                    const res = await fetch(`/data/surah/${i}.json`);
                    const data = await res.json();
                    const surah = Object.values(data)[0]; // ambil objek pertama
                    list.push(surah);
                }
                setSurahs(list);
                setLoading(false);
            } catch (err) {
                console.error("Error load surah:", err);
                setLoading(false);
            }
        };
        fetchSurahs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
                <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-3">
                    <Link
                        to="/game"
                        className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]"
                    >
                        <i className="ri-arrow-left-line"></i> Rekam Ayat
                    </Link>
                </div>
            </div>

            {/* Isi konten */}
            <div className="max-w-xl mx-auto px-3 border-x border-gray-200 pt-[65px] pb-6">
                {loading ? (
                    <div className="flex justify-center items-center py-10 text-gray-500">
                        <i className="ri-loader-2-line animate-spin text-xl mr-2"></i>
                        Memuat daftar surah...
                    </div>
                ) : (
                    <div className="space-y-2">
                        {surahs.map((s) => (
                            <Link
                                key={s.number}
                                to={`/game/rekam-ayat/surah/${s.number}`}
                                className="flex items-center px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
                            >
                                <div>
                                    <h3 className="text-sm font-medium text-gray-800">
                                        {s.number}. Surah {s.name_latin}
                                    </h3>
                                    <p className="text-gray-500 text-xs mt-0.5">
                                        {s.translations.id.name} ({s.number_of_ayah} ayat)
                                    </p>
                                </div>
                                <div className="ml-auto text-gray-400">
                                    <i className="ri-arrow-right-s-line text-lg"></i>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
