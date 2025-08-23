import React from 'react';

const ReadingHistory = () => {
  // Data dummy untuk riwayat dan surah populer
  const readingHistory = [
    { id: 1, name: 'Al-Fatihah', ayah: 5, date: '23 Agustus 2023' },
    { id: 2, name: 'Al-Baqarah', ayah: 255, date: '22 Agustus 2023' },
    { id: 3, name: 'Yasin', ayah: 1, date: '21 Agustus 2023' },
    { id: 4, name: 'Ar-Rahman', ayah: 1, date: '20 Agustus 2023' },
    { id: 5, name: 'Al-Mulk', ayah: 1, date: '19 Agustus 2023' }
  ];

  const popularSurahs = [
    { id: 56, name: 'Al-Waqi\'ah', name_arab: 'الواقعة' },
    { id: 36, name: 'Yasin', name_arab: 'يس' },
    { id: 67, name: 'Al-Mulk', name_arab: 'الملك' },
    { id: 55, name: 'Ar-Rahman', name_arab: 'الرحمن' },
    { id: 32, name: 'As-Sajdah', name_arab: 'السجدة' }
  ];

  return (
    <div className="p-4">
      {/* Tanda Akhir Dibaca */}
      <div className="mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">Tanda Akhir Dibaca</h2>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-gray-500 text-sm">Belum ada riwayat bacaan</p>
        </div>
      </div>

      {/* Riwayat Membaca */}
      <div className="mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">Riwayat Membaca</h2>
        <div className="divide-y divide-gray-100">
          {readingHistory.map((item, index) => (
            <div key={index} className="py-3 hover:bg-gray-50 cursor-pointer">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800">{item.name} : {item.ayah}</h3>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Surah Populer */}
      <div>
        <h2 className="font-semibold text-gray-800 mb-3">Surah Populer</h2>
        <div className="grid grid-cols-2 gap-3">
          {popularSurahs.map((surah, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:bg-gray-100 cursor-pointer">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-800 text-sm">{surah.name}</h3>
                </div>
                <p className="text-gray-500 font-uthmani text-[16px]">{surah.name_arab}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReadingHistory;