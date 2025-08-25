import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';

export default function Templat() {
  useEffect(() => {
    document.title = "Juz30 - Islamic";
  }, []);

  return (
    <div className="min-h-screen pb-2">
      <div className="max-w-xl mx-auto px-3 container border-x border-gray-200">
        <div className="fixed max-w-xl border border-gray-200 mx-auto top-0 left-1/2 -translate-x-1/2 w-full z-50 bg-white px-3 py-4">
          <div className="flex items-center justify-between">
            <Link to="/game" className="flex items-center font-semibold gap-2 text-gray-800 text-[15px]">
              <i className="ri-arrow-left-line"></i> Sambung Ayat Juz 30
            </Link>
            <button className="text-gray-600 hover:text-gray-600">
              <i className="ri-settings-5-line text-xl"></i>
            </button>
          </div>
        </div>
        
        {/* isi kontennya */}
        <div className='pt-[65px]'>
          <h1>ini untuk isi halaman</h1>
        </div>
      </div>
    </div>
  )
}
