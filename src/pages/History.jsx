// =============================================
// File: History.jsx
// History gabungan (Juz & Per Surah) + tombol Ulangi dinamis
// - Robust ke riwayat lama yang belum punya juzNumber
// =============================================

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function History() {
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    document.title = 'History - Islamic';
    loadHistory();
  }, []);

  const loadHistory = () => {
    const savedHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
    setHistory(savedHistory);
  };

  const handleDelete = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    localStorage.setItem('gameHistory', JSON.stringify(newHistory));
    setHistory(newHistory);
    setShowModal(false);
    setActiveIndex(null);
  };

  // Fallback: ambil angka juz dari string "Juz 26" kalau juzNumber tidak tersedia
  const getJuzNumber = (rec) => {
    if (!rec) return null;
    if (rec.juzNumber != null) return rec.juzNumber; // already number or string
    if (typeof rec.juz === 'string') {
      const m = rec.juz.match(/\d+/);
      if (m) return Number(m[0]);
    }
    return null;
  };

  return (
    <div className="min-h-screen pb-2 bg-gray-50">
      <div className="max-w-xl mx-auto px-3 container border-x border-gray-200 bg-white min-h-screen">
        {/* Header */}
        <div className="fixed max-w-xl border border-gray-200 mx-auto top-0 left-1/2 -translate-x-1/2 w-full z-50 bg-white px-3 py-4">
          <div className="flex items-center justify-between">
            <Link to="/game" className="flex items-center font-semibold gap-2 text-gray-800 text-[15px]">
              <i className="ri-arrow-left-line"></i> History Games
            </Link>
          </div>
        </div>

        {/* Isi konten */}
        <div className="pt-[75px] p-1">
          {history.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <i className="ri-time-line text-4xl mb-3"></i>
              <p>Belum ada riwayat permainan</p>
              <Link to="/juz30" className="inline-block mt-4 text-blue-500 hover:text-blue-600">
                Main game sekarang
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((record, index) => {
                const percent = Math.round((record.score / record.total) * 100);
                const labelKanan = record?.juz
                  ? record.juz
                  : record?.surahName
                  ? `Surah ${record.surahName}`
                  : '';

                return (
                  // card konten history
                  <div
                    key={index}
                    onClick={() => {
                      setActiveIndex(index);
                      setShowModal(true);
                    }}
                    className="flex items-center border border-gray-200 rounded-lg cursor-pointer transition bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{record.date}</div>
                          <div className="text-sm text-gray-600">
                            {record.game} {record.mode ? `` : ''}{' '}
                            {labelKanan && `— ${labelKanan}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            Skor: {record.score}/100
                          </div>
                        </div>
                        <div
                          className={`text-lg font-bold ${
                            percent >= 40
                              ? 'text-green-600'
                              : percent >= 20
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {percent}%
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full ${
                            percent >= 40
                              ? 'bg-green-500'
                              : percent >= 20
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal popup */}
      {showModal && activeIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">Aksi Riwayat</h3>
            <p className="text-sm text-gray-600 mb-6">
              Apa yang ingin kamu lakukan untuk riwayat ini?
            </p>

            <div className="flex gap-3 justify-center">
              {/* Hapus */}
              <button
                onClick={() => handleDelete(activeIndex)}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Hapus
              </button>

              {/* Ulangi */}
              {(() => {
                const rec = history[activeIndex];
                const juzNo = getJuzNumber(rec);
                const surahNo = rec?.surahNumber;

                if (juzNo != null) {
                  return (
                    <Link
                      to={`/game/sambung-ayat/juz/${juzNo}`}
                      className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
                      onClick={() => setShowModal(false)}
                    >
                      Ulangi
                    </Link>
                  );
                }

                if (surahNo != null) {
                  return (
                    <Link
                      to={`/game/sambung-ayat/surah/${surahNo}`}
                      className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
                      onClick={() => setShowModal(false)}
                    >
                      Ulangi
                    </Link>
                  );
                }

                // fallback kalau dua-duanya gak ada
                return null;
              })()}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
