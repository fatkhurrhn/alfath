import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    document.title = "History - Islamic";
    loadHistory();
  }, []);

  const loadHistory = () => {
    const savedHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
    setHistory(savedHistory);
  };

  const clearHistory = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua riwayat?')) {
      localStorage.removeItem('gameHistory');
      setHistory([]);
    }
  };

  // Fungsi untuk melihat detail hasil permainan
  const viewDetails = (record) => {
    alert(`Detail permainan pada ${record.date}\nSkor: ${record.score}/${record.total}`);
    // Anda bisa mengembangkan ini menjadi modal atau halaman detail tersendiri
  };

  return (
    <div className="min-h-screen pb-2 bg-gray-50">
      <div className="max-w-xl mx-auto px-3 container border-x border-gray-200 bg-white min-h-screen">
        <div className="fixed max-w-xl border border-gray-200 mx-auto top-0 left-1/2 -translate-x-1/2 w-full z-50 bg-white px-3 py-4">
          <div className="flex items-center justify-between">
            <Link to="/game" className="flex items-center font-semibold gap-2 text-gray-800 text-[15px]">
              <i className="ri-arrow-left-line"></i> History
            </Link>
            {history.length > 0 && (
              <button 
                onClick={clearHistory}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                Hapus Riwayat
              </button>
            )}
          </div>
        </div>
        
        {/* isi kontennya */}
        <div className='pt-[65px] p-4'>
          <h1 className="text-xl font-bold mb-4">Riwayat Permainan</h1>
          
          {history.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <i className="ri-time-line text-4xl mb-3"></i>
              <p>Belum ada riwayat permainan</p>
              <Link 
                to="/juz30" 
                className="inline-block mt-4 text-blue-500 hover:text-blue-600"
              >
                Main game sekarang
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer"
                  onClick={() => viewDetails(record)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{record.date}</div>
                      <div className="text-sm text-gray-500">Skor: {record.score}/{record.total}</div>
                    </div>
                    <div className={`text-lg font-bold ${
                      record.score >= 40 ? 'text-green-600' : 
                      record.score >= 20 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {Math.round((record.score / record.total) * 100)}%
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        record.score >= 40 ? 'bg-green-500' : 
                        record.score >= 20 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} 
                      style={{width: `${(record.score / record.total) * 100}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}