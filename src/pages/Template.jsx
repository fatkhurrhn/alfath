import React from 'react'
import { Link } from 'react-router-dom';

export default function Templat() {
  return (
    <div className="min-h-screen pb-2 bg-gray-50">
      <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
        <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-4">
          <Link
            to="/"
            className="flex items-center font-semibold gap-2 text-gray-800 text-[15px]"
          >
            <i className="ri-arrow-left-line"></i> Template
          </Link>
          <button className="text-gray-600 hover:text-gray-800">
            <i className="ri-settings-5-line text-xl"></i>
          </button>
        </div>
      </div>

      {/* Isi konten */}
      <div className="max-w-xl mx-auto px-3 border-x border-gray-200 pt-[65px]">
        <h1>ini untuk isi halaman</h1>
      </div>
    </div>
  );
}
