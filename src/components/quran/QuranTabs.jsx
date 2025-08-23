import React from 'react';

const QuranTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-gray-200">
      <button
        className={`flex-1 py-3 text-center font-medium ${activeTab === 'surah' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        onClick={() => setActiveTab('surah')}
      >
        Surah
      </button>
      <button
        className={`flex-1 py-3 text-center font-medium ${activeTab === 'juz' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        onClick={() => setActiveTab('juz')}
      >
        Juz
      </button>
      <button
        className={`flex-1 py-3 text-center font-medium ${activeTab === 'riwayat' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        onClick={() => setActiveTab('riwayat')}
      >
        Riwayat
      </button>
    </div>
  );
};

export default QuranTabs;