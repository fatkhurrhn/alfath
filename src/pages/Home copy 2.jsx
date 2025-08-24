import React, { useEffect } from 'react'
import BottomNav from '../components/BottomNav'

export default function Home() {
  useEffect(() => {
    document.title = "Home - Islamic";
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-xl mx-auto px-3 container border-x border-gray-200">
        {/* Navback */}
        <div className="fixed max-w-xl mx-auto top-0 left-1/2 -translate-x-1/2 w-full z-50 bg-gray-800 px-3 py-4">
          <button type="button" className="flex items-center gap-2 text-white text-[15px]" onClick={() => window.history.back()}>
            <i className="ri-arrow-left-line"></i> Tes Halaman
          </button>
        </div>

        {/* 

    <div className="min-h-screen pb-20">
      <div className="max-w-xl mx-auto px-3 container border-x border-gray-200">
        <div className="fixed max-w-xl border border-gray-200 mx-auto top-0 left-1/2 -translate-x-1/2 w-full z-50 bg-white px-3 py-4">
          <Link to="/" className="flex items-center font-semibold gap-2 text-gray-800  text-[15px]">
            <i className="ri-arrow-left-line"></i> Al-Qur'an
          </Link>
        </div>
        
         */}

        {/* isi kontennya */}
        <div className='pt-[65px]'>
          <h1>ini untuk isi halaman</h1>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
