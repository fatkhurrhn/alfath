import React from 'react';

const JuzList = ({ juzList, isJuzLoading, searchQuery }) => {
  // Fungsi untuk mengambil dua kata pertama dari teks Arab
  const getFirstTwoWords = (arabicText) => {
    const cleanText = arabicText.replace(/[^\u0600-\u06FF\s]/g, '');
    const words = cleanText.split(' ').filter(word => word.trim() !== '');
    return words.slice(0, 2).join(' ');
  };

  // Filter juz berdasarkan pencarian
  const filteredJuz = juzList.filter(juz => {
    return (
      `Juz ${juz.juz}`.includes(searchQuery) ||
      juz.juzStartInfo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      juz.juzEndInfo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (isJuzLoading) {
    return <div className="p-4 text-center text-gray-500">Memuat data juz...</div>;
  }

  if (filteredJuz.length === 0) {
    return <div className="p-4 text-center text-gray-500">Juz tidak ditemukan</div>;
  }

  return (
    <div className="divide-y divide-gray-100">
      {filteredJuz.map((juz, index) => (
        <div key={index} className="p-4 hover:bg-gray-50 cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-700 rounded-[6px] mr-3">
                {juz.juz}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Juz {juz.juz}</h3>
                <p className="text-[12px] text-gray-600">
                  {juz.juzStartInfo} - {juz.juzEndInfo}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-500 font-uthmani text-[16px] mb-1">
                {juz.verses && juz.verses.length > 0 
                  ? getFirstTwoWords(juz.verses[0].text.arab) 
                  : '...'
                }
              </p>
              <p className="text-[12px] text-gray-500">{juz.totalVerses} Ayat</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JuzList;