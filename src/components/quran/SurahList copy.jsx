import React from "react";
import { Link } from "react-router-dom";

const SurahList = ({ surahList, isLoading, searchQuery }) => {
  // Filter surah berdasarkan pencarian
  const filteredSurahs = surahList.filter((surah) => {
    return (
      surah.name.transliteration.id
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      surah.name.translation.id
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      surah.number.toString().includes(searchQuery)
    );
  });

  return (
    <div className="relative">
      {/* Loading indicator tipis di atas */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 h-0.5 z-50">
          <div className="w-full h-full bg-blue-700 animate-pulse origin-left"></div>
        </div>
      )}

      {/* Kondisi data */}
      {isLoading && (
        <div className="p-4 text-center text-gray-500">Memuat data surah...</div>
      )}

      {!isLoading && filteredSurahs.length === 0 && (
        <div className="p-4 text-center text-gray-500">Surah tidak ditemukan</div>
      )}

      {/* Daftar Surah */}
      {!isLoading && filteredSurahs.length > 0 && (
        <div className="divide-y divide-gray-100">
          {filteredSurahs.map((surah) => (
            <Link
              to={`/quran/surah/${surah.number}`}
              key={surah.number}
              className="block px-4 py-3 hover:bg-gray-50 transition"
            >
              <div className="flex items-center justify-between">
                {/* Nomor & info Surah */}
                <div className="flex items-center">
                  <div className="w-9 h-9 flex items-center justify-center bg-blue-100 text-blue-700 rounded-md mr-3 font-medium">
                    {surah.number}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {surah.name.transliteration.id}
                    </h3>
                    <p className="text-[12px] text-gray-600">
                      {surah.name.translation.id} • {surah.numberOfVerses} Ayat
                    </p>
                  </div>
                </div>

                {/* Nama Arab */}
                <div className="text-right">
                  <p className="text-gray-700 font-mushaf text-[22px] leading-none">
                    {surah.name.short}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SurahList;
