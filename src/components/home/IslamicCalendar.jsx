import React, { useState, useEffect } from 'react';

export default function HybridCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hijriData, setHijriData] = useState({});
  const [loading, setLoading] = useState(false);
  const [specialDates, setSpecialDates] = useState({});

  // Fungsi untuk mendapatkan jumlah hari dalam bulan
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Fungsi untuk mendapatkan hari pertama dalam bulan
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Fungsi untuk mengubah bulan
  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  // Fungsi untuk mendapatkan data Hijriyah untuk tanggal tertentu
  const fetchHijriDate = async (gregorianDate) => {
    const formattedDate = `${gregorianDate.getDate().toString().padStart(2, '0')}-${(gregorianDate.getMonth() + 1).toString().padStart(2, '0')}-${gregorianDate.getFullYear()}`;
    
    try {
      setLoading(true);
      const response = await fetch(`https://api.aladhan.com/v1/gToH/${formattedDate}?calendarMethod=UAQ`);
      const data = await response.json();
      
      if (data.code === 200) {
        setHijriData(prev => ({
          ...prev,
          [formattedDate]: data.data.hijri
        }));
      }
    } catch (error) {
      console.error('Error fetching hijri date:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk mendapatkan nama bulan Indonesia
  const getIndonesianMonthName = (monthIndex) => {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[monthIndex];
  };

  // Fungsi untuk mendapatkan nama hari Indonesia
  const getIndonesianDayName = (dayIndex) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[dayIndex];
  };

  // Fungsi untuk menangani klik tanggal
  const handleDateClick = (date) => {
    setSelectedDate(date);
    
    // Format tanggal untuk kunci
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    
    // Jika data Hijriyah belum ada, fetch dari API
    if (!hijriData[formattedDate]) {
      fetchHijriDate(date);
    }
  };

  // Effect untuk mengambil data awal
  useEffect(() => {
    // Ambil data tanggal hari ini
    const today = new Date();
    const formattedToday = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
    
    if (!hijriData[formattedToday]) {
      fetchHijriDate(today);
    }
    
    // Set data tanggal penting (contoh)
    setSpecialDates({
      '15-08-2023': 'Hari Kemerdekaan RI',
      '01-01-2024': 'Tahun Baru Masehi',
      '12-04-2024': 'Hari Raya Idul Fitri 1445 H'
    });
  }, []);

  // Generate kalender
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  const days = [];
  
  // Tambahkan hari kosong untuk minggu sebelumnya
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  
  // Tambahkan hari dalam bulan
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  // Dapatkan data Hijriyah untuk bulan dan tahun saat ini
  const currentMonthYear = `${getIndonesianMonthName(month)} ${year}`;
  let hijriMonthYear = '';

  // Coba dapatkan info bulan Hijriyah dari tanggal pertama
  const firstDateFormatted = `01-${(month + 1).toString().padStart(2, '0')}-${year}`;
  if (hijriData[firstDateFormatted]) {
    const hijri = hijriData[firstDateFormatted];
    hijriMonthYear = `${hijri.month.en} ${hijri.year}`;
  }

  return (
    <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => changeMonth(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-lg font-semibold text-gray-800 text-center">
          {currentMonthYear}
          {hijriMonthYear && <span className="block text-sm font-normal text-gray-500">{hijriMonthYear}</span>}
        </h2>
        
        <button 
          onClick={() => changeMonth(1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-2 text-center">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(day => (
          <div key={day} className="text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}
        
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-12"></div>;
          }
          
          const day = date.getDate();
          const formattedDate = `${day.toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
          const isToday = new Date().toDateString() === date.toDateString();
          const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
          const hijriInfo = hijriData[formattedDate];
        //   const isSpecial = specialDates[formattedDate];
          
          return (
            <div 
              key={formattedDate}
              onClick={() => handleDateClick(date)}
              className={`h-12 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all ${
                isToday 
                  ? "bg-blue-100 border border-blue-300" 
                  : isSelected 
                    ? "bg-blue-500 text-white" 
                    : "hover:bg-gray-100"
              }`}
            >
              <span className={`text-sm font-medium ${isSelected ? "text-white" : "text-gray-800"}`}>
                {day}
              </span>
              {hijriInfo && (
                <span className={`text-xs ${isSelected ? "text-blue-100" : "text-gray-500"}`}>
                  {hijriInfo.day}
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Informasi tanggal yang dipilih */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-2">
            {getIndonesianDayName(selectedDate.getDay())}, {selectedDate.getDate()} {getIndonesianMonthName(selectedDate.getMonth())} {selectedDate.getFullYear()}
          </h3>
          
          {loading ? (
            <p className="text-sm text-gray-600">Memuat data Hijriyah...</p>
          ) : (
            <>
              {hijriData[`${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getFullYear()}`] ? (
                <p className="text-sm text-gray-600">
                  Hijriyah: {hijriData[`${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getFullYear()}`].day} {
                  hijriData[`${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getFullYear()}`].month.en
                  } {hijriData[`${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getFullYear()}`].year} H
                </p>
              ) : (
                <p className="text-sm text-gray-600">Data Hijriyah tidak tersedia</p>
              )}
              
              {specialDates[`${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getFullYear()}`] && (
                <p className="text-sm text-green-600 mt-1">
                  {specialDates[`${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getFullYear()}`]}
                </p>
              )}
            </>
          )}
        </div>
      )}
      
      {/* Informasi bulan */}
      <div className="mt-3 text-xs text-gray-600">
        <p className="font-semibold mb-1">Keterangan:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Angka besar: Tanggal Masehi</li>
          <li>Angka kecil: Tanggal Hijriyah</li>
          <li>Klik pada tanggal untuk melihat informasi detail</li>
        </ul>
      </div>
    </div>
  );
}