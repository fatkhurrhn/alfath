import React, { useState, useEffect } from 'react';

export default function HybridCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hijriData, setHijriData] = useState({});
  const [loading, setLoading] = useState(false);
  const [specialDates, setSpecialDates] = useState({});
  const [monthEvents, setMonthEvents] = useState([]);
  const [hijriMonthRange, setHijriMonthRange] = useState('');
  const [calendarDays, setCalendarDays] = useState([]);
  const [autoShowDate, setAutoShowDate] = useState(null);

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
    setAutoShowDate(null);
  };

  // Fungsi untuk mendapatkan data Hijriyah untuk semua tanggal dalam bulan
  const fetchHijriMonthData = async (year, month) => {
    try {
      setLoading(true);
      const daysInMonth = getDaysInMonth(year, month);
      const newHijriData = { ...hijriData };

      // Fetch data untuk semua tanggal dalam bulan
      for (let day = 1; day <= daysInMonth; day++) {
        const formattedDate = `${day.toString().padStart(2, '0')}-${(month + 1).toString().padStart(2, '0')}-${year}`;

        // Skip jika data sudah ada
        if (newHijriData[formattedDate]) continue;

        try {
          const response = await fetch(`https://api.aladhan.com/v1/gToH/${formattedDate}?calendarMethod=UAQ`);
          const data = await response.json();

          if (data.code === 200) {
            newHijriData[formattedDate] = data.data.hijri;
          }
        } catch (error) {
          console.error(`Error fetching hijri date for ${formattedDate}:`, error);
        }

        // Tambahkan delay kecil untuk menghindari rate limiting
        await new Promise(resolve => setTimeout(resolve, 30));
      }

      setHijriData(newHijriData);
    } catch (error) {
      console.error('Error fetching hijri month data:', error);
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
    setAutoShowDate(null);
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
      '06-08-2025': 'Tahun Baru Masehi',
      '01-05-2024': 'Hari Buruh Internasional',
      '25-12-2024': 'Hari Raya Natal',
      '10-04-2024': 'Hari Raya Idul Fitri 1445 H',
      '16-06-2024': 'Hari Raya Idul Adha 1445 H'
    });
  }, []);

  // Effect untuk mengambil data Hijriyah ketika bulan berubah
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    fetchHijriMonthData(year, month);
  }, [currentDate]);

  // Effect untuk menggenerate hari kalender
  useEffect(() => {
    const generateCalendarDays = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = getDaysInMonth(year, month);
      const firstDayOfMonth = getFirstDayOfMonth(year, month);
      const days = [];

      // Tambahkan hari dari bulan sebelumnya
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevMonthYear = month === 0 ? year - 1 : year;
      const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);

      for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const date = new Date(prevMonthYear, prevMonth, day);
        days.push({
          date,
          isCurrentMonth: false,
          isOtherMonth: true
        });
      }

      // Tambahkan hari dalam bulan saat ini
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        days.push({
          date,
          isCurrentMonth: true,
          isOtherMonth: false
        });
      }

      // Tambahkan hari dari bulan berikutnya
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextMonthYear = month === 11 ? year + 1 : year;
      const daysToAdd = 42 - days.length; // 6 minggu x 7 hari = 42

      for (let i = 1; i <= daysToAdd; i++) {
        const date = new Date(nextMonthYear, nextMonth, i);
        days.push({
          date,
          isCurrentMonth: false,
          isOtherMonth: true
        });
      }

      setCalendarDays(days);
    };

    generateCalendarDays();
  }, [currentDate]);

  // Effect untuk mengupdate event bulanan ketika data berubah
  useEffect(() => {
    const generateMonthEvents = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = getDaysInMonth(year, month);
      const events = [];
      const hijriMonths = new Set();

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

  // Effect untuk otomatis menampilkan info tanggal penting saat data siap
  useEffect(() => {
    if (!loading && monthEvents.length > 0 && !selectedDate && !autoShowDate) {
      // Cari tanggal hari ini
      const today = new Date();
      const isCurrentMonth = today.getMonth() === currentDate.getMonth() &&
        today.getFullYear() === currentDate.getFullYear();

      if (isCurrentMonth) {
        setAutoShowDate(today);
      }
    }
  }, [loading, monthEvents, selectedDate, autoShowDate, currentDate]);

  // Tentukan tanggal yang akan ditampilkan infonya
  const displayDate = selectedDate || autoShowDate;

  // Dapatkan data Hijriyah untuk bulan dan tahun saat ini
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
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

      {loading && (
        <div className="text-center text-sm text-gray-500 mb-2">Memuat data hijriyah...</div>
      )}

      <div className="grid grid-cols-7 gap-2 text-center mb-4">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(day => (
          <div key={day} className="text-xs font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}

        {calendarDays.map((dayObj, index) => {
          const date = dayObj.date;
          const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
          const isToday = new Date().toDateString() === date.toDateString();
          const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
          const isAutoShown = autoShowDate && autoShowDate.toDateString() === date.toDateString();
          const hijriInfo = hijriData[formattedDate];
          const events = getEventsForDate(date, hijriInfo);

          return (
            <div
              key={index}
              onClick={() => dayObj.isCurrentMonth && handleDateClick(date)}
              className={`h-12 flex items-center justify-center rounded-lg transition-all relative ${dayObj.isCurrentMonth
                  ? `cursor-pointer ${isToday ? "bg-blue-100 border border-blue-300" : isSelected || isAutoShown ? "bg-blue-500 text-gray-800" : "hover:bg-gray-100"}`
                  : "text-gray-400"
                }`}
            >
              <span className={`text-sm font-medium ${isSelected || isAutoShown ? "text-gray-800" : dayObj.isCurrentMonth ? "text-gray-800" : "text-gray-400"}`}>
                {date.getDate()}
              </span>

              {/* Penanda event */}
              {dayObj.isCurrentMonth && events.length > 0 && (
                <div className="absolute bottom-1 flex space-x-1">
                  {events.map((event, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${event.color === 'blue' ? 'bg-blue-500' :
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

      {displayDate && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">
            {getIndonesianDayName(displayDate.getDay())}, {displayDate.getDate()} {getIndonesianMonthShortName(displayDate.getMonth())} {displayDate.getFullYear()}
            {hijriData[`${displayDate.getDate().toString().padStart(2, '0')}-${(displayDate.getMonth() + 1).toString().padStart(2, '0')}-${displayDate.getFullYear()}`] && (
              <span className="text-gray-600 font-normal">
                {' | '}
                {hijriData[`${displayDate.getDate().toString().padStart(2, '0')}-${(displayDate.getMonth() + 1).toString().padStart(2, '0')}-${displayDate.getFullYear()}`].day}{' '}
                {getHijriMonthName(hijriData[`${displayDate.getDate().toString().padStart(2, '0')}-${(displayDate.getMonth() + 1).toString().padStart(2, '0')}-${displayDate.getFullYear()}`].month.number)}{' '}
                {hijriData[`${displayDate.getDate().toString().padStart(2, '0')}-${(displayDate.getMonth() + 1).toString().padStart(2, '0')}-${displayDate.getFullYear()}`].year} H
              </span>
            )}
          </h3>
        </div>
      )}

      {/* Daftar event bulanan - Tampilkan info Hijriyah untuk semua event */}
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
                                className={`w-3 h-3 rounded-full mr-2 ${e.color === 'blue' ? 'bg-blue-500' :
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