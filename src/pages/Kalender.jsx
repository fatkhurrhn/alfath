import React, { useState, useEffect } from 'react';

export default function HybridCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hijriData, setHijriData] = useState({});
  const [loading, setLoading] = useState(false);
  const [specialDates, setSpecialDates] = useState({});
  const [monthEvents, setMonthEvents] = useState([]);

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
    setSelectedDate(null);
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

  // Fungsi untuk mendapatkan nama bulan Indonesia singkat
  const getIndonesianMonthShortName = (monthIndex) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    return months[monthIndex];
  };

  // Fungsi untuk mendapatkan nama hari Indonesia
  const getIndonesianDayName = (dayIndex) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[dayIndex];
  };

  // Fungsi untuk mendapatkan nama bulan Hijriyah Indonesia
  const getHijriMonthName = (monthNumber) => {
    const months = {
      1: 'Muharram',
      2: 'Safar',
      3: 'Rabiul Awal',
      4: 'Rabiul Akhir',
      5: 'Jumadil Awal',
      6: 'Jumadil Akhir',
      7: 'Rajab',
      8: 'Sya\'ban',
      9: 'Ramadhan',
      10: 'Syawal',
      11: 'Dzulqa\'dah',
      12: 'Dzulhijjah'
    };
    return months[monthNumber] || '';
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

  // Fungsi untuk menentukan event berdasarkan hari dan tanggal Hijriyah
  const getEventsForDate = (date, hijriInfo) => {
    const events = [];
    const dayOfWeek = date.getDay(); // 0 = Minggu, 1 = Senin, 2 = Selasa, ..., 6 = Sabtu
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    
    // Event berdasarkan hari (Senin & Kamis)
    if (dayOfWeek === 1) { // Senin
      events.push({ 
        type: 'puasa_senin', 
        title: 'Puasa Senin', 
        category: 'Puasa Sunnah',
        color: 'blue' 
      });
    } else if (dayOfWeek === 4) { // Kamis
      events.push({ 
        type: 'puasa_kamis', 
        title: 'Puasa Kamis', 
        category: 'Puasa Sunnah',
        color: 'yellow' 
      });
    }
    
    // Event berdasarkan tanggal Hijriyah (13, 14, 15)
    if (hijriInfo && [13, 14, 15].includes(parseInt(hijriInfo.day))) {
      events.push({ 
        type: 'puasa_yaumul_bidh', 
        title: 'Puasa Yaumul Bidh', 
        category: 'Puasa Sunnah',
        color: 'green' 
      });
    }
    
    // Event khusus berdasarkan tanggal Masehi
    if (specialDates[formattedDate]) {
      events.push({ 
        type: 'special', 
        title: specialDates[formattedDate], 
        category: 'Hari Besar & Libur Nasional',
        color: 'red' 
      });
    }
    
    return events;
  };

  // Effect untuk mengambil data awal
  useEffect(() => {
    // Set data tanggal penting (contoh)
    setSpecialDates({
      '17-08-2023': 'Hari Kemerdekaan RI ke-78',
      '17-08-2024': 'Hari Kemerdekaan RI ke-79',
      '17-08-2025': 'Hari Kemerdekaan RI ke-80',
      '01-01-2024': 'Tahun Baru Masehi',
      '01-05-2024': 'Hari Buruh Internasional',
      '25-12-2024': 'Hari Raya Natal'
    });
    
    // Ambil data tanggal hari ini
    const today = new Date();
    const formattedToday = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
    
    if (!hijriData[formattedToday]) {
      fetchHijriDate(today);
    }
  }, []);

  // Effect untuk mengupdate event bulanan ketika bulan atau data berubah
  useEffect(() => {
    const generateMonthEvents = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = getDaysInMonth(year, month);
      const events = [];
      
      // Cari range bulan Hijriyah untuk judul
      let hijriMonths = new Set();
      
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
        
        if (hijriData[formattedDate]) {
          hijriMonths.add(getHijriMonthName(hijriData[formattedDate].month.number));
        }
        
        const dateEvents = getEventsForDate(date, hijriData[formattedDate]);
        
        if (dateEvents.length > 0) {
          events.push({
            date,
            formattedDate,
            events: dateEvents,
            hijriInfo: hijriData[formattedDate]
          });
        }
      }
      
      // Set judul bulan Hijriyah
      setHijriMonthRange(Array.from(hijriMonths).join('-'));
      
      return events;
    };
    
    setMonthEvents(generateMonthEvents());
  }, [currentDate, hijriData]);

  // State untuk range bulan Hijriyah
  const [hijriMonthRange, setHijriMonthRange] = useState('');

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
          {hijriMonthRange && (
            <span className="block text-sm font-normal text-gray-500">
              {hijriMonthRange} {hijriData[`01-${(month + 1).toString().padStart(2, '0')}-${year}`]?.year || '1447'} H
            </span>
          )}
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
      
      <div className="grid grid-cols-7 gap-2 text-center mb-4">
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
          const events = getEventsForDate(date, hijriData[formattedDate]);
          
          return (
            <div 
              key={formattedDate}
              onClick={() => handleDateClick(date)}
              className={`h-12 flex items-center justify-center rounded-lg cursor-pointer transition-all relative ${
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
              
              {/* Penanda event */}
              {events.length > 0 && (
                <div className="absolute bottom-1 flex space-x-1">
                  {events.map((event, i) => (
                    <div 
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        event.color === 'blue' ? 'bg-blue-500' :
                        event.color === 'yellow' ? 'bg-yellow-400' :
                        event.color === 'green' ? 'bg-green-500' :
                        'bg-red-500'
                      }`}
                      title={event.title}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Informasi tanggal yang dipilih */}
      {selectedDate && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">
            {getIndonesianDayName(selectedDate.getDay())}, {selectedDate.getDate()} {getIndonesianMonthShortName(selectedDate.getMonth())} {selectedDate.getFullYear()}
            {hijriData[`${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getFullYear()}`] && (
              <span className="text-gray-600 font-normal">
                {' | '}
                {hijriData[`${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getFullYear()}`].day}{' '}
                {getHijriMonthName(hijriData[`${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getFullYear()}`].month.number)}{' '}
                {hijriData[`${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getFullYear()}`].year} H
              </span>
            )}
          </h3>
          
          {getEventsForDate(selectedDate, hijriData[`${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getFullYear()}`]).length > 0 && (
            <div className="mt-2">
              <ul className="text-sm mt-1 space-y-1">
                {getEventsForDate(selectedDate, hijriData[`${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getFullYear()}`]).map((event, i) => (
                  <li key={i} className="flex items-center">
                    <span 
                      className={`w-3 h-3 rounded-full mr-2 ${
                        event.color === 'blue' ? 'bg-blue-500' :
                        event.color === 'yellow' ? 'bg-yellow-400' :
                        event.color === 'green' ? 'bg-green-500' :
                        'bg-red-500'
                      }`}
                    ></span>
                    {event.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Daftar event bulanan */}
      {monthEvents.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-gray-800 mb-3">Event Bulan {getIndonesianMonthName(month)} {year}</h3>
          
          {/* Hari Besar & Libur Nasional */}
          {monthEvents.some(event => event.events.some(e => e.category === 'Hari Besar & Libur Nasional')) && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Hari Besar & Libur Nasional</h4>
              <div className="space-y-2">
                {monthEvents
                  .filter(event => event.events.some(e => e.category === 'Hari Besar & Libur Nasional'))
                  .map((event, i) => (
                    <div key={i} className="flex items-start text-sm">
                      <div className="w-16 font-medium">
                        {event.date.getDate()} {getIndonesianMonthShortName(event.date.getMonth())}
                      </div>
                      <div className="flex-1">
                        {event.events
                          .filter(e => e.category === 'Hari Besar & Libur Nasional')
                          .map((e, j) => (
                            <div key={j} className="flex items-center mb-1">
                              <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                              {e.title}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
          
          {/* Puasa Sunnah */}
          {monthEvents.some(event => event.events.some(e => e.category === 'Puasa Sunnah')) && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Puasa Sunnah</h4>
              <div className="space-y-2">
                {monthEvents
                  .filter(event => event.events.some(e => e.category === 'Puasa Sunnah'))
                  .map((event, i) => (
                    <div key={i} className="flex items-start text-sm">
                      <div className="w-16 font-medium">
                        {event.date.getDate()} {getIndonesianMonthShortName(event.date.getMonth())}
                      </div>
                      <div className="flex-1">
                        {event.events
                          .filter(e => e.category === 'Puasa Sunnah')
                          .map((e, j) => (
                            <div key={j} className="flex items-center mb-1">
                              <span 
                                className={`w-3 h-3 rounded-full mr-2 ${
                                  e.color === 'blue' ? 'bg-blue-500' :
                                  e.color === 'yellow' ? 'bg-yellow-400' :
                                  'bg-green-500'
                                }`}
                              ></span>
                              {e.title}
                              {event.hijriInfo && (
                                <span className="text-gray-500 text-xs ml-2">
                                  ({event.hijriInfo.day} {getHijriMonthName(event.hijriInfo.month.number)} {event.hijriInfo.year} H)
                                </span>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}