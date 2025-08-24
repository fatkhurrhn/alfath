import React from 'react';
import { Link } from 'react-router-dom';

const JuzList = ({ juzList, isJuzLoading, searchQuery }) => {
  // Filter juz berdasarkan pencarian
  const filteredJuz = juzList.filter(juz => {
    return (
      juz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      juz.name_start_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      juz.name_end_id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Fungsi untuk menentukan jumlah kata berdasarkan nomor juz
  const getWordCountByJuz = (juzNumber) => {
    const wordCountMap = {
      1: 2,   
      2: 2,   
      3: 3,   
      4: 3,   
      5: 2,   
      6: 3,   
      7: 2,   
      8: 3,   
      9: 3,   
      10: 2,
      11: 3,
      12: 4,
      13: 3,
      14: 3,
      15: 2,
      16: 3,
      17: 2,
      18: 2,
      19: 3,
      20: 3,
      21: 3,
      22: 3,
      23: 3,
      24: 3,
      25: 3,
      26: 3,
      27: 3,
      28: 2,
      29: 2,
      30: 8 
    };
    
    return wordCountMap[juzNumber] || 2; // Default 2 kata jika tidak ditemukan
  };

  // Fungsi untuk mengambil kata pertama dari teks Arab berdasarkan jumlah yang ditentukan
  const getArabicWords = (arabicText, juzNumber) => {
    if (!arabicText) return '';
    
    const wordCount = getWordCountByJuz(parseInt(juzNumber));
    // Split teks Arab berdasarkan spasi dan ambil kata sesuai jumlah
    const words = arabicText.split(' ').filter(word => word.trim() !== '');
    return words.slice(0, wordCount).join(' ');
  };

  if (isJuzLoading) {
    return <div className="p-4 text-center text-gray-500">Memuat data juz...</div>;
  }

  if (filteredJuz.length === 0) {
    return <div className="p-4 text-center text-gray-500">Juz tidak ditemukan</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
      {filteredJuz.map(juz => (
        <div key={juz.number} className="block hover:bg-gray-50 transition-colors duration-200">
          <div className="flex items-center px-3 py-3">
            {/* Number Button - Menampilkan nomor juz */}
            <div
              className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700 font-medium"
            >
              {juz.number}
            </div>

            {/* Juz Info */}
            <Link
              to={`/quran/juz/${juz.number}`}
              className="flex w-full items-center justify-between"
            >
              {/* Left Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">
                  Juz Ke {juz.number}
                </h3>
                <p className="text-xs text-gray-500">
                  {juz.name_start_id} {juz.verse_start} • {juz.name_end_id} {juz.verse_end}
                </p>
              </div>

              {/* Right Arabic Title - Menampilkan kata sesuai custom setting */}
              <p className="font-mushaf text-xl text-gray-600 text-right ml-2">
                {getArabicWords(juz.ayat_arab, juz.number)}
              </p>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JuzList;