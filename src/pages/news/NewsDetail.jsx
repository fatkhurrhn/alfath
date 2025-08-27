import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function NewsDetail() {
    const location = useLocation();
    const navigate = useNavigate();
    const { item } = location.state || {};

    if (!item) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Data tidak ditemukan
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-4">
            {/* Header */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
                <div className="max-w-xl mx-auto flex items-center gap-3 px-3 py-4">
                    <button onClick={() => navigate(-1)} className="text-gray-700">
                       
                        <h1 className="font-semibold text-gray-800 text-[15px]">
                            <i className="ri-arrow-left-line"></i> Detail Berita
                        </h1>
                    </button>
                    
                </div>
            </div>

            {/* Konten */}
            <div className="max-w-xl mx-auto px-4 pt-[70px]">
                {item.thumbnail && (
                    <img
                        src={item.thumbnail}
                        alt="thumbnail"
                        className="w-full h-52 object-cover rounded-lg mb-4"
                    />
                )}
                <span className="inline-block px-3 py-1 bg-[#cbdde9] text-[#355485] text-[12px] font-medium rounded mb-3">
                    Republika
                </span>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h2>
                <p className="text-xs text-[#6d9bbc] mb-4">
                    {new Date(item.pubDate).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">{item.description}</p>

                <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-5 py-2 bg-[#355485] text-white rounded-lg shadow hover:bg-[#4f90c6] transition"
                >
                    Baca di Republika
                </a>
            </div>
        </div>
    );
}
