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
  const [eventsLoading, setEventsLoading] = useState(false); // State untuk loading events

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
    setEventsLoading(true); // Set loading events ketika bulan berubah
  };

  // Fungsi untuk mendapatkan data Hijriyah untuk semua tanggal dalam bulan
  const fetchHijriMonthData = async (year, month) => {
    try {
      setLoading(true);
      setEventsLoading(true); // Set loading events
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
      '01-01-2022': 'Tahun Baru Masehi (Internasional)'
      // '01-01-2025': 'Hari Perdamaian Dunia',
      // '03-01-2025': 'Hari Departemen Agama',
      // '04-01-2025': 'Hari Konvensi Internasional Tentang Penghapusan Segala Bentuk Diskriminasi Rasial',
      // '05-01-2025': 'Hari Korps Wanita Angkatan Laut (KOWAL)',
      // '10-01-2025': 'Hari Lingkungan Hidup Indonesia',
      // '10-01-2025': 'Hari Gerakan Satu Juta Pohon',
      // '10-01-2025': 'Hari Tritura',
      // '13-01-2025': 'Hari HAM Nelayan dan Masyarakat Sipil',
      // '15-01-2025': 'Hari Darma Samudra',
      // '25-01-2025': 'Hari Gizi dan Makanan',
      // '25-01-2025': 'Hari Kusta Internasional (Internasional)',
      // '02-02-2025': 'Hari Lahan Basah Sedunia (Konvensi Ramsar) (Internasional)',
      // '04-02-2025': 'Hari Kanker Dunia (Internasional)',
      // '05-02-2025': 'Hari Peristiwa Kapal Tujuh Provinsi (Zeven Provincien)',
      // '06-02-2025': 'Hari Internasional Nol Toleransi Bagi Praktik Sunat Perempuan',
      // '09-02-2025': 'Hari Pers Nasional',
      // '09-02-2025': 'Hari Kavaleri',
      // '13-02-2025': 'Hari Persatuan Farmasi Indonesia',
      // '14-02-2025': 'Hari Valentine (Internasional)',
      // '14-02-2025': 'Hari Peringatan Pembela Tanah Air (PETA)',
      // '20-02-2025': 'Hari Pekerja Nasional',
      // '21-02-2025': 'Hari Bahasa Ibu (Internasional)',
      // '22-02-2025': 'Hari Istiqlal',
      // '28-02-2025': 'Hari Gizi Nasional Indonesia',
      // '01-03-2025': 'Hari Solidaritas LGBT Nasional',
      // '01-03-2025': 'Peristiwa Serangan Umum 1 Maret 1949',
      // '01-03-2025': 'Hari Kehakiman Nasional',
      // '06-03-2025': 'Hari KOSTRAD (Komando Strategis Angkatan Darat)',
      // '08-03-2025': 'Hari Perempuan (Internasional)',
      // '09-03-2025': 'Hari Musik Nasional',
      // '10-03-2025': 'Hari Persatuan Artis Film Indonesia (PARFI)',
      // '11-03-2025': 'Hari Surat Perintah 11 Maret (SUPERSEMAR)',
      // '13-03-2025': 'Hari Masyarakat Adat',
      // '15-03-2025': 'Hari Hak Konsumen Sedunia',
      // '17-03-2025': 'Hari Perawat Nasional',
      // '18-03-2025': 'Hari Arsitektur Indonesia',
      // '20-03-2025': 'Hari Kehutanan Sedunia (Internasional)',
      // '20-03-2025': 'Hari Dongeng Sedunia (Internasional)',
      // '21-03-2025': 'Hari Penghapusan Diskriminasi Rasial (Internasional)',
      // '21-03-2025': 'Hari Hutan Sedunia',
      // '21-03-2025': 'Hari Puisi Sedunia (Internasional)',
      // '21-03-2025': 'Hari Down Sindrom (Internasional)',
      // '22-03-2025': 'Hari Air Sedunia (Internasional)',
      // '24-03-2025': 'Hari Tuberkulosis Sedunia (Internasional)',
      // '30-03-2025': 'Hari Film Indonesia',
      // '01-04-2025': 'Hari Bank Dunia (Internasional)',
      // '02-04-2025': 'Hari Peduli Autisme Sedunia (Internasional)',
      // '02-04-2025': 'Hari Buku Anak Sedunia (Internasional)',
      // '06-04-2025': 'Hari Nelayan Indonesia',
      // '07-04-2025': 'Hari Kesehatan Sedunia (Internasional)',
      // '18-04-2025': 'Hari Peringatan Konferensi Asia-Afrika di Bandung',
      // '19-04-2025': 'Hari Pertahanan Sipil (HANSIP)',
      // '20-04-2025': 'Hari Konsumen Nasional',
      // '21-04-2025': 'Hari Kartini',
      // '22-04-2025': 'Hari Bumi/Earth Day/KTT Bumi (Internasional)',
      // '23-04-2025': 'Hari Buku Sedunia (Internasional)',
      // '24-04-2025': 'Hari Angkutan Nasional',
      // '24-04-2025': 'Hari Solidaritas Asia-Afrika (Internasional)',
      // '25-04-2025': 'Hari Malaria Sedunia',
      // '26-04-2025': 'Hari Kekayaan Intelektual Sedunia',
      // '27-04-2025': 'Hari Lembaga Pemasyarakatan Indonesia',
      // '28-04-2025': 'Hari Puisi Nasional',
      // '28-04-2025': 'Hari Kesehatan dan Keselamatan Kerja (Internasional)',
      // '29-04-2025': 'Hari Tari (Internasional)',
      // '01-05-2025': 'Hari Buruh Sedunia (Internasional)',
      // '01-05-2025': 'Hari Peringatan Pembebasan Irian Barat',
      // '02-05-2025': 'Hari Pendidikan Nasional',
      // '03-05-2025': 'Hari Kebebasan Pers Internasional',
      // '05-05-2025': 'Hari Bidan Sedunia (Internasional)',
      // '05-05-2025': 'Hari Lembaga Sosial Desa (LSD)',
      // '08-05-2025': 'Hari Palang Merah Internasional',
      // '10-05-2025': 'Hari Lupus Dunia (Internasional)',
      // '15-05-2025': 'Malam Renungan AIDS Nusantara (MRAN)',
      // '15-05-2025': 'Hari Keluarga Internasional',
      // '17-05-2025': 'Hari Buku Nasional',
      // '17-05-2025': 'Hari Internasional Melawan Homophobia (IDAHOT)',
      // '20-05-2025': 'Hari Kebangkitan Nasional',
      // '21-05-2025': 'Hari Peringatan Reformasi',
      // '28-05-2025': 'Hari Kesehatan Perempuan Internasional',
      // '28-05-2025': 'Menstrual Hygiene Day',
      // '29-05-2025': 'Hari Lanjut Usia Nasional',
      // '29-05-2025': 'Hari Keluarga',
      // '31-05-2025': 'Hari Tanpa Tembakau Sedunia (Internasional)',
      // '01-06-2025': 'Hari Lahir Pancasila',
      // '01-06-2025': 'Hari Anak-anak Sedunia (Internasional)',
      // '03-06-2025': 'Hari Pasar Modal Indonesia',
      // '05-06-2025': 'Hari Lingkungan Hidup Sedunia (Internasional)',
      // '08-06-2025': 'Hari Laut Sedunia',
      // '21-06-2025': 'Hari Krida Pertanian',
      // '24-06-2025': 'Hari Bidan Indonesia (nasional)',
      // '26-06-2025': 'Hari Anti Narkoba Sedunia (Internasional)',
      // '29-06-2025': 'Hari Keluarga Berencana Nasional (KB)',
      // '01-07-2025': 'Hari Bhayangkara',
      // '05-07-2025': 'Hari Bank Indonesia',
      // '05-07-2025': 'Hari Satelit Palapa',
      // '12-07-2025': 'Hari Koperasi Indonesia',
      // '17-07-2025': 'Hari Keadilan (Internasional)',
      // '22-07-2025': 'Hari Kejaksaan',
      // '23-07-2025': 'Hari Anak Nasional',
      // '24-07-2025': 'Pemerintah Republik Indonesia Meratifikasi Konvensi Perempuan Dengan UU NO.7/1984',
      // '29-07-2025': 'Hari Bhakti TNI Angkatan Udara',
      // '01-08-2025': 'Hari ASI Sedunia (Internasional)',
      // '05-08-2025': 'Hari Dharma Wanita Nasional',
      // '08-08-2025': 'Hari Ulang Tahun ASEAN',
      // '09-08-2025': 'Hari Masyarakat Adat (Internasional)',
      // '10-08-2025': 'Hari Veteran Nasional',
      // '10-08-2025': 'Hari Kebangkitan Teknologi Nasional',
      // '12-08-2025': 'Hari Remaja Internasional (Internasional)',
      // '14-08-2025': 'Hari Pramuka (Praja Muda Karana)',
      // '17-08-2025': 'Hari Proklamasi Kemerdekaan Indonesia',
      // '18-08-2025': 'Hari Konstitusi Republik Indonesia',
      // '19-08-2025': 'Hari Departemen Luar Negeri Indonesia',
      // '21-08-2025': 'Hari Maritim Nasional',
      // '23-08-2025': 'Hari Internasional Untuk Mengenang Perdagangan Budak & Penghapusanya (UNESCO)',
      // '24-08-2025': 'Hari Televisi Republik Indonesia (TVRI)',
      // '01-09-2025': 'Hari Jantung Dunia (Internasional)',
      // '01-09-2025': 'Hari Polisi Wanita (POLWAN)',
      // '03-09-2025': 'Hari Palang Merah Indonesia (PMI)',
      // '04-09-2025': 'Hari Kesehatan Seksual Sedunia',
      // '04-09-2025': 'Hari Pelanggan Nasional',
      // '08-09-2025': 'Hari Aksara (Internasional)',
      // '08-09-2025': 'Hari Pamong Praja',
      // '09-09-2025': 'Hari Olah Raga Nasional',
      // '11-09-2025': 'Hari Radio Republik Indonesia (RRI)',
      // '14-09-2025': 'Hari Kunjung Perpustakaan',
      // '15-09-2025': 'Hari Demokrasi (Internasional)',
      // '16-09-2025': 'Hari Ozon (Internasional)',
      // '17-09-2025': 'Hari Perhubungan Nasional',
      // '17-09-2025': 'Hari Palang Merah Nasional',
      // '21-09-2025': 'Hari Perdamaian (Internasional)',
      // '24-09-2025': 'Hari Agraria Nasional/Hari Tani',
      // '26-09-2025': 'Hari Kontrasepsi Sedunia',
      // '26-09-2025': 'Hari Statistik',
      // '27-09-2025': 'Hari Pos Telekomunikasi Telegraf (PTT)',
      // '28-09-2025': 'Hari Kereta Api',
      // '28-09-2025': 'Hari Jantung Sedunia (Internasional)',
      // '29-09-2025': 'Hari Aborsi Aman Sedunia',
      // '29-09-2025': 'Hari Sarjana Nasional',
      // '30-09-2025': 'Hari Peringatan Pemberontakan G30S/PKI',
      // '01-10-2025': 'Hari Lansia Internasional',
      // '01-10-2025': 'Hari Kesaktian Pancasila',
      // '01-10-2025': 'Hari Vegetarian Sedunia (Internasional)',
      // '02-10-2025': 'Hari Batik Nasional dan Sedunia (Internasional)',
      // '02-10-2025': 'Hari Susu Nasional',
      // '05-10-2025': 'Hari Guru Sedunia',
      // '08-10-2025': 'Hari Tata Ruang Nasional',
      // '10-10-2025': 'Hari Kesehatan Jiwa Sedunia (Internasional)',
      // '11-10-2025': 'Hari Anak Perempuan Sedunia (Internasional)',
      // '14-10-2025': 'Hari Penglihatan Sedunia (Internasional)',
      // '15-10-2025': 'Hari Hak Asasi Binatang (Internasional)',
      // '16-10-2025': 'Hari Pangan Sedunia (Internasional)',
      // '16-10-2025': 'Hari Parlemen Indonesia',
      // '17-10-2025': 'Hari Pengentasan Kemiskinan Internasional',
      // '20-10-2025': 'Hari Osteoporosis Sedunia (Internasional)',
      // '24-10-2025': 'Hari Dokter Indonesia',
      // '24-10-2025': 'Hari Perserikatan Bangsa-Bangsa (PBB)',
      // '26-10-2025': 'Hari Interseks Internasional',
      // '27-10-2025': 'Hari Listrik Nasional',
      // '27-10-2025': 'Hari Penerbangan Nasional',
      // '28-10-2025': 'Hari Sumpah Pemuda',
      // '30-10-2025': 'Hari Keuangan',
      // '03-11-2025': 'Hari Kerohanian',
      // '03-11-2025': 'Hari Cinta Puspa dan Satwa Nasional',
      // '09-11-2025': 'Hari Seksualitas Muslim Sedunia',
      // '10-11-2025': 'Hari Pahlawan',
      // '10-11-2025': 'Hari Ganefo',
      // '11-11-2025': 'Hari Bangunan Indonesia',
      // '12-11-2025': 'Hari Kesehatan Nasional',
      // '12-11-2025': 'Hari Ayah Nasional',
      // '14-11-2025': 'Hari Diabetes Sedunia (Internasional)',
      // '14-11-2025': 'Hari Brigade Mobil (BRIMOB)',
      // '16-11-2025': 'Hari Toleransi Internasional',
      // '16-11-2025': 'Hari Konferensi Warisan Sedunia (Internasional)',
      // '20-11-2025': 'Hari Anak Sedunia (Internasional)',
      // '20-11-2025': 'Hari Internasional Untuk Transgender (Trangender Day)',
      // '21-11-2025': 'Hari Pohon Internasional',
      // '21-11-2025': 'Hari Televisi Sedunia (Internasional)',
      // '22-11-2025': 'Hari Perhubungan Darat Nasional',
      // '25-11-2025': 'Hari Anti KekerasanTerhadap Perempuan Internasional',
      // '25-11-2025': 'Hari Guru (PGRI)',
      // '28-11-2025': 'Hari Menanam Pohon Indonesia',
      // '29-11-2025': 'Hari KORPRI (Korps Pegawai RI)',
      // '01-12-2025': 'Hari AIDS Sedunia (Internasional)',
      // '01-12-2025': 'Hari Artileri',
      // '03-12-2025': 'Hari Difabel Internasional',
      // '05-12-2025': 'Hari Relawan Internasional',
      // '06-12-2025': 'Hari Tidak Ada Toleransi bagi Kekerasan terhadap Perempuan',
      // '07-12-2025': 'Hari Penerbangan Sipil (Internasional)',
      // '09-12-2025': 'Hari Pemberantasan Korupsi Sedunia (Internasional)',
      // '09-12-2025': 'Hari Armada Republik Indonesia',
      // '10-12-2025': 'Hari Hak Asasi Manusia (Internasional)',
      // '12-12-2025': 'Hari Transmigrasi',
      // '13-12-2025': 'Hari Kesatuan Nasional (Nusantara)',
      // '15-12-2025': 'Hari Juang Kartika TNI-AD (Hari Infanteri)',
      // '17-12-2025': 'Hari Internasional Penghapusan Kekerasan Terhadap Pekerja Seks',
      // '19-12-2025': 'Hari Bela Negara',
      // '20-12-2025': 'Hari Kesetiakawanan Sosial Nasional',
      // '22-12-2025': 'Hari Sosial',
      // '22-12-2025': 'Hari Ibu',
      // '23-12-2025': 'Ulang Tahun Perkumpulan Keluarga Berencana Indonesia (PKBI)',
      // '29-12-2025': 'Hari Keanekaragaman Hayati'
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

    if (Object.keys(hijriData).length > 0) {
      setMonthEvents(generateMonthEvents());
      setEventsLoading(false); // Matikan loading events setelah data siap
    }
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
    <div className="mb-1">
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
              className={`h-10 w-10 flex items-center justify-center rounded-lg transition-all relative ${dayObj.isCurrentMonth
                ? `cursor-pointer ${isToday ? "bg-blue-100 border border-blue-300" : isSelected || isAutoShown ? "bg-gray-200 text-gray-800" : "hover:bg-gray-100"}`
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
                      className={`w-1 h-1 rounded-full ${event.color === 'blue' ? 'bg-blue-500' :
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
        <div className="mt-4 p-3 bg-gray-50 text-sm rounded-lg border mb-4">
          <h5 className="font-semibold text-gray-800">
            {getIndonesianDayName(displayDate.getDay())}, {displayDate.getDate()} {getIndonesianMonthShortName(displayDate.getMonth())} {displayDate.getFullYear()}
            {hijriData[`${displayDate.getDate().toString().padStart(2, '0')}-${(displayDate.getMonth() + 1).toString().padStart(2, '0')}-${displayDate.getFullYear()}`] && (
              <span className="text-gray-600 font-normal">
                {' | '}
                {hijriData[`${displayDate.getDate().toString().padStart(2, '0')}-${(displayDate.getMonth() + 1).toString().padStart(2, '0')}-${displayDate.getFullYear()}`].day}{' '}
                {getHijriMonthName(hijriData[`${displayDate.getDate().toString().padStart(2, '0')}-${(displayDate.getMonth() + 1).toString().padStart(2, '0')}-${displayDate.getFullYear()}`].month.number)}{' '}
                {hijriData[`${displayDate.getDate().toString().padStart(2, '0')}-${(displayDate.getMonth() + 1).toString().padStart(2, '0')}-${displayDate.getFullYear()}`].year} H
              </span>
            )}
          </h5>
        </div>
      )}

      {/* Daftar event bulanan - Tampilkan info Hijriyah untuk semua event */}
      {eventsLoading ? (
        <div className="text-left text-sm text-gray-500 py-2">
          Memuat data event...
        </div>
      ) : monthEvents.length > 0 ? (
        <div className="mt-4">
          {/* Hari Besar & Libur Nasional */}
          {monthEvents.some(event => event.events.some(e => e.category === 'Hari Besar & Libur Nasional')) && (
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-700 mb-2">Hari Besar & Libur Nasional</h4>
              <div className="space-y-2">
                {monthEvents
                  .filter(event => event.events.some(e => e.category === 'Hari Besar & Libur Nasional'))
                  .map((event, i) => (
                    <div key={i}>
                      {event.events
                        .filter(e => e.category === 'Hari Besar & Libur Nasional')
                        .map((e, j) => (
                          <div key={j}>
                            <div className="flex items-start text-sm">
                              {/* Box untuk tanggal dengan warna merah */}
                              <div className="flex flex-col items-center justify-center w-12 h-12 bg-red-100 rounded-md mr-3">
                                <div className="text-xs font-semibold text-red-800 uppercase -mb-1.5">
                                  {getIndonesianMonthShortName(event.date.getMonth())}
                                </div>
                                <div className="text-lg font-bold text-red-800">
                                  {event.date.getDate()}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">
                                  {e.title}
                                </div>
                                {event.hijriInfo && (
                                  <div className="text-gray-500 text-xs">
                                    {getIndonesianDayName(event.date.getDay())}, {event.date.getDate()} {getIndonesianMonthShortName(event.date.getMonth())} {event.date.getFullYear()} / {event.hijriInfo.day} {getHijriMonthName(event.hijriInfo.month.number)} {event.hijriInfo.year} H
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* Garis pembatas antara events dalam tanggal yang sama */}
                            {j < event.events.filter(e => e.category === 'Hari Besar & Libur Nasional').length - 1 && (
                              <hr className="my-2 mx-12 border-gray-200" />
                            )}
                          </div>
                        ))}
                      {/* Garis pembatas antara tanggal yang berbeda */}
                      {i < monthEvents.filter(event => event.events.some(e => e.category === 'Hari Besar & Libur Nasional')).length - 1 && (
                        <hr className="my-3 border-gray-200" />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Puasa Sunnah */}
          {monthEvents.some(event => event.events.some(e => e.category === 'Puasa Sunnah')) && (
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-2">Puasa Sunnah</h4>
              <div className="space-y-2">
                {monthEvents
                  .filter(event => event.events.some(e => e.category === 'Puasa Sunnah'))
                  .map((event, i) => (
                    <div key={i}>
                      {event.events
                        .filter(e => e.category === 'Puasa Sunnah')
                        .map((e, j) => (
                          <div key={j}>
                            <div className="flex items-start text-sm">
                              {/* Box untuk tanggal dengan warna sesuai jenis puasa */}
                              <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-md mr-3 ${e.title.includes('Senin')
                                ? 'bg-blue-100'
                                : e.title.includes('Kamis')
                                  ? 'bg-yellow-100'
                                  : e.title.includes('Ayyamul Bidh') || e.title.includes('Yaumul Bidh')
                                    ? 'bg-green-100'
                                    : 'bg-gray-100'
                                }`}>
                                <div className={`text-xs font-semibold uppercase -mb-1.5 ${e.title.includes('Senin')
                                  ? 'text-blue-800'
                                  : e.title.includes('Kamis')
                                    ? 'text-yellow-800'
                                    : e.title.includes('Ayyamul Bidh') || e.title.includes('Yaumul Bidh')
                                      ? 'text-green-800'
                                      : 'text-gray-800'
                                  }`}>
                                  {getIndonesianMonthShortName(event.date.getMonth())}
                                </div>
                                <div className={`text-lg font-bold ${e.title.includes('Senin')
                                  ? 'text-blue-800'
                                  : e.title.includes('Kamis')
                                    ? 'text-yellow-800'
                                    : e.title.includes('Ayyamul Bidh') || e.title.includes('Yaumul Bidh')
                                      ? 'text-green-800'
                                      : 'text-gray-800'
                                  }`}>
                                  {event.date.getDate()}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium">
                                  {e.title}
                                </div>
                                {event.hijriInfo && (
                                  <div className="text-gray-500 text-xs">
                                    {getIndonesianDayName(event.date.getDay())}, {event.date.getDate()} {getIndonesianMonthShortName(event.date.getMonth())} {event.date.getFullYear()} / {event.hijriInfo.day} {getHijriMonthName(event.hijriInfo.month.number)} {event.hijriInfo.year} H
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* Garis pembatas antara events dalam tanggal yang sama */}
                            {j < event.events.filter(e => e.category === 'Puasa Sunnah').length - 1 && (
                              <hr className="my-2 mx-12 border-gray-200" />
                            )}
                          </div>
                        ))}
                      {/* Garis pembatas antara tanggal yang berbeda */}
                      {i < monthEvents.filter(event => event.events.some(e => e.category === 'Puasa Sunnah')).length - 1 && (
                        <hr className="my-3 border-gray-200" />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        !eventsLoading && (
          <div className="mt-4 text-center text-gray-500 py-4">
            Tidak ada event pada bulan ini.
          </div>
        )
      )}
    </div>
  );
}