import React, { useState, useEffect } from 'react';
import ScrollToTop from '../../../components/ScrollToTop';

export default function DzikirPagiSugro() {
  const [dzikirData, setDzikirData] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetch('/data/dzikir/dzikir-sugro-pagi.json')
      .then((response) => response.json())
      .then((data) => setDzikirData(data))
      .catch((error) => console.error('Error fetching data:', error));

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (dzikirData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <i className="ri-loader-2-line animate-spin text-3xl text-gray-400"></i>
          <p className="mt-2 text-gray-500 font-nunito">Memuat data dzikir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-3">
      
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Al-Ma'surat</h1>
          <div className="flex justify-center items-center text-sm text-gray-600">
            <i className="ri-sun-line mr-1"></i>
            <span>Dzikir Pagi Sugro</span>
          </div>
        </div>

        {/* Daftar Dzikir */}
        <div className="space-y-6">
          {dzikirData.map((dzikir) => (
            <div key={dzikir.id} className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center font-nunito">
                {dzikir.title}
              </h2>
              <div className="mb-4 text-center">
                <div className="text-3xl leading-[3rem] mb-4 text-gray-800 font-uthmani">
                  {dzikir.core}
                </div>
                <div className="text-gray-700 text-justify mt-4 font-nunito text-lg">
                  {dzikir.terjemah}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isFullscreen && <ScrollToTop />}
    </div>
  );
}