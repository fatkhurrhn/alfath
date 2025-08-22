import React from 'react'
import BottomNav from '../components/BottomNav'
import NavbarWaktuSholat from '../components/NavWaktuSholat'

export default function Home() {
  const handleCitySelect = (cityId) => {
    // Anda bisa menggunakan cityId ini untuk keperluan lain di komponen Home
    console.log("Kota terpilih ID:", cityId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <NavbarWaktuSholat onCitySelect={handleCitySelect} />
      <BottomNav />
    </div>
  )
}