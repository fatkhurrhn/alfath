import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function History() {
  const [history, setHistory] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    document.title = "History - Islamic";
    loadHistory();
  }, []);

  const loadHistory = () => {
    const savedHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
    setHistory(savedHistory);
  };

  const toggleSelectMode = () => {
    if (selectMode && selectedItems.length > 0) {
      // Hapus item yang terpilih
      const newHistory = history.filter((_, i) => !selectedItems.includes(i));
      localStorage.setItem("gameHistory", JSON.stringify(newHistory));
      setHistory(newHistory);
      setSelectedItems([]);
    }
    setSelectMode(!selectMode);
  };

  const toggleSelectItem = (index) => {
    setSelectedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen pb-2 bg-gray-50">
      <div className="max-w-xl mx-auto px-3 container border-x border-gray-200 bg-white min-h-screen">
        {/* Header */}
        <div className="fixed max-w-xl border border-gray-200 mx-auto top-0 left-1/2 -translate-x-1/2 w-full z-50 bg-white px-3 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/game"
              className="flex items-center font-semibold gap-2 text-gray-800 text-[15px]"
            >
              <i className="ri-arrow-left-line"></i> History Games
            </Link>
            {history.length > 0 && (
              <button
                onClick={toggleSelectMode}
                className="text-red-500 hover:text-red-600 text-lg"
                title={selectMode ? "Hapus yang dipilih" : "Pilih riwayat untuk dihapus"}
              >
                <i className="ri-delete-bin-6-line"></i>
              </button>
            )}
          </div>
        </div>

        {/* Isi konten */}
        <div className="pt-[75px] p-1">
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
              {history.map((record, index) => {
                const selected = selectedItems.includes(index);
                return (
                  <div
                    key={index}
                    onClick={() => selectMode && toggleSelectItem(index)}
                    className={`flex items-center border border-gray-200 rounded-lg cursor-pointer transition ${
                      selectMode ? "pr-3" : ""
                    } ${
                      selected ? "bg-red-50" : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {/* Isi card */}
                    <div className={`flex-1 p-4 ${selectMode ? "mr-2" : ""}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{record.date}</div>
                          <div className="text-sm text-gray-500">
                            Skor: {record.score}/{record.total}
                          </div>
                        </div>
                        <div
                          className={`text-lg font-bold ${
                            record.score >= 40
                              ? "text-green-600"
                              : record.score >= 20
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {Math.round((record.score / record.total) * 100)}%
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full ${
                            record.score >= 40
                              ? "bg-green-500"
                              : record.score >= 20
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${(record.score / record.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Checkbox */}
                    {selectMode && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleSelectItem(index)}
                          className="w-5 h-5 accent-red-500"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
