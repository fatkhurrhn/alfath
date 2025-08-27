import React from 'react'
import { Link } from 'react-router-dom'

function NewsSection() {
  return (
    <div>
      {/* News Islamic */}
      <div className="p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-[#355485]">News Islamic</h2>
          <Link to="/news">
            <i className="ri-arrow-right-s-line text-xl text-[#6d9bbc]"></i>
          </Link>
        </div>

        <Link
          to="/artikel-1"
          className="flex items-center bg-white shadow-sm border-y border-gray-200 py-3"
        >
          {/* Kiri: tag + title + date */}
          <div className="flex-1 px-1">
            <span className="inline-block px-2 py-0.5 bg-[#cbdde9] text-[#355485] text-[11px] font-medium rounded mb-2">
              Tafsir
            </span>
            <h3 className="text-sm font-semibold text-gray-800 leading-snug mb-1 line-clamp-2">
              Tafsir kepimpinan Nabi Sulaiman: mendengar dan menghargai suara rakyat kecil
            </h3>
            <p className="text-xs text-[#6d9bbc]">Selasa, 27 Agustus 2025</p>
          </div>

          {/* Kanan: thumbnail */}
          <div className="w-[75px] h-[75px] flex-shrink-0 mr-1">
            <img
              src="https://i.pinimg.com/736x/84/5b/11/845b1193e5cd04b5c065df25925d13ce.jpg"
              alt="thumbnail"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        </Link>
      </div>
    </div>
  )
}

export default NewsSection
