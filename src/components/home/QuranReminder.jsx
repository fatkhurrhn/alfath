import React from 'react';
import { Link } from 'react-router-dom';

export default function QuranReminder() {
  return (
    <div className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-5 text-white shadow-md">
      <h2 className="text-lg font-semibold mb-1">Ingat Baca Qur'an</h2>
      <p className="text-sm opacity-90 mb-4">
        Luangkan waktumu sebentar untuk membaca Al-Qur'an hari ini.
      </p>
      <div className="flex items-center space-x-3">
        <Link
          to="/alquran"
          className="px-4 py-2 bg-white text-green-700 font-medium text-sm rounded-lg shadow hover:bg-gray-100 transition"
        >
          Baca Sekarang
        </Link>
        <button className="px-4 py-2 border border-white/70 text-white font-medium text-sm rounded-lg hover:bg-white/10 transition">
          Nanti
        </button>
      </div>
    </div>
  );
}