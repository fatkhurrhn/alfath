import React from 'react';
import { Link } from 'react-router-dom';

const SurahList = ({ surahList, isLoading, searchQuery }) => {
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
    <div className="divide-y divide-gray-100">
      {filteredSurahs.map((surah, index) => (
        <Link to={`/quran/surah/${surah.number}`} key={index} className="p-4 hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded-[6px] mr-3">
                {surah.number}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{surah.name.transliteration.id}</h3>
                <p className="text-[12px] text-gray-600">
                  {surah.name.translation.id} | {surah.numberOfVerses} Ayat
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-500 font-uthmani text-[22px]">{surah.name.short}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SurahList;