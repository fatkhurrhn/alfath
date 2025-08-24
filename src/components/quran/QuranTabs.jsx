import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuranTabs = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/quran/${tab}`);
  };

  return (
    <div className="flex border-b border-gray-200">
      <button
        className={`flex-1 py-3 text-center font-medium ${activeTab === 'surah' ? 'text-gray-600 border-b-2 border-gray-600' : 'text-gray-500'}`}
        onClick={() => handleTabChange('surah')}
      >
        Surah
      </button>
      <button
        className={`flex-1 py-3 text-center font-medium ${activeTab === 'juz' ? 'text-gray-600 border-b-2 border-gray-600' : 'text-gray-500'}`}
        onClick={() => handleTabChange('juz')}
      >
        Juz
      </button>
      <button
        className={`flex-1 py-3 text-center font-medium ${activeTab === 'games' ? 'text-gray-600 border-b-2 border-gray-600' : 'text-gray-500'}`}
        onClick={() => handleTabChange('games')}
      >
        Games
      </button>
    </div>
  );
};

export default QuranTabs;