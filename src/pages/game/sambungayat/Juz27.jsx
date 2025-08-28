import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Juz27() {
  /* ---------- state ---------- */
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  const audioRef = useRef(null);

  /* ---------- utils ---------- */
  const formatDateId = (dateObj) => {
    const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const d = String(dateObj.getDate()).padStart(2, '0');
    const m = bulan[dateObj.getMonth()];
    const y = dateObj.getFullYear();
    const t = dateObj.toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return `${d} ${m} ${y} | ${t}`;
  };

  /* ---------- load ---------- */
  useEffect(() => {
    fetchQuestions();
    return () => {
      // cleanup audio saat unmount
      audioRef.current?.pause();
    };
  }, []);

  /* ---------- per-soal ---------- */
  useEffect(() => {
    if (questions.length && currentQuestion < questions.length) {
      setTimeLeft(30);
      setSelectedOption(null);

      const audioUrl = questions[currentQuestion].question.audio;

      // stop audio lama (kalau ada)
      audioRef.current?.pause();

      // buat audio baru & play
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play().catch(() => { });

      // cleanup saat pindah soal/unmount
      return () => {
        audioRef.current?.pause();
      };
    }
  }, [currentQuestion, questions]);


  /* ---------- countdown ---------- */
  useEffect(() => {
    if (timeLeft === 0) {
      handleTimeUp();
      return;
    }
    if (!selectedOption && !gameOver) {
      const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timeLeft, selectedOption, gameOver]);

  /* ---------- fetch ---------- */
  const fetchQuestions = async () => {
    try {
      // hapus spasi di ujung URL
      const res = await fetch('https://api.myquran.com/v2/quran/ayat/juz/27');
      const json = await res.json();
      const all = json.data;

      const picked = all.sort(() => Math.random() - 0.5).slice(0, 10);

      const qs = picked.map((ayat) => {
        const correct =
          all.find((a) => a.surah === ayat.surah && +a.ayah === +ayat.ayah + 1) ||
          all[Math.floor(Math.random() * all.length)];

        const wrongs = all
          .filter(
            (a) =>
              a.id !== correct.id &&
              !(a.surah === ayat.surah && +a.ayah === +ayat.ayah)
          )
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        const options = [correct, ...wrongs].sort(() => Math.random() - 0.5);
        return { question: ayat, options, correct };
      });

      setQuestions(qs);
    } catch {
      alert('Gagal memuat soal');
    }
  };

  /* ---------- save to localStorage ---------- */
  const saveGameHistory = (finalScore) => {
  const gameRecord = {
    date: formatDateId(new Date()),
    score: finalScore,
    total: 100,
    details: userAnswers,
    game: "Sambung Ayat",   // ⬅️ nama game
    // PENTING
    juz: "Juz 27",          // ⬅️ nomor juz
    juzNumber: 27, // ⬅️ penting untuk link ulangi
  };

  const existingHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
  const updatedHistory = [gameRecord, ...existingHistory];
  localStorage.setItem('gameHistory', JSON.stringify(updatedHistory.slice(0, 50)));
};

  /* ---------- logic ---------- */
  const handleAnswer = (option) => {
    if (selectedOption) return;
    setSelectedOption(option);

    const isCorrect = option.id === questions[currentQuestion].correct.id;
    const poinPerSoal = Math.round(100 / questions.length);

    // update skor untuk UI
    if (isCorrect) setScore((s) => s + poinPerSoal);

    setUserAnswers((prev) => [
      ...prev,
      { ...questions[currentQuestion], userAnswer: option, isCorrect }
    ]);

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion((q) => q + 1);
      } else {
        // hitung finalScore dari skor saat ini + poin jika benar
        const finalScore = isCorrect ? score + poinPerSoal : score;
        setGameOver(true);
        // simpan pakai finalScore agar tidak kena stale state
        saveGameHistory(finalScore);
        audioRef.current?.pause();
      }
    }, 1200);
  };

  const handleTimeUp = () => {
    setUserAnswers((prev) => [
      ...prev,
      { ...questions[currentQuestion], userAnswer: null, isCorrect: false }
    ]);
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion((q) => q + 1);
      } else {
        const finalScore = score; // tidak bertambah
        setGameOver(true);
        saveGameHistory(finalScore);
        audioRef.current?.pause();
      }
    }, 500);
  };

  const restartGame = () => {
    audioRef.current?.pause();
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswers([]);
    setGameOver(false);
    setSelectedOption(null);
    fetchQuestions();
  };

  /* ---------- UI ---------- */
  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Memuat soal...</p>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 pb-20">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-1">Hasil Akhir</h2>
          <p className="text-center text-lg mb-6">
            Skor Kamu: <span className="font-bold text-green-700">{score}</span>/100
          </p>

          {/* Recap Timeline Style */}
          <div className="space-y-6 border-l-2 border-gray-200 pl-4">
            {userAnswers.map((item, idx) => (
              <div key={idx} className="relative">
                {/* Bullet */}
                <span
                  className={`absolute -left-[13px] top-2 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${item.isCorrect
                    ? "bg-green-500 text-white"
                    : !item.userAnswer
                      ? "bg-yellow-500 text-white"
                      : "bg-red-500 text-white"
                    }`}
                >
                  {idx + 1}
                </span>

                {/* Card */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  {/* Pertanyaan */}
                  <p className="font-semibold text-center mb-2 font-mushaf text-gray-800 leading-loose">
                    {item.question.arab} —{" "}
                    <span className="font-semibold text-green-700">
                      {item.correct.arab}
                    </span>
                  </p>
                  <hr className="p-2" />

                  {/* Jawaban User */}
                  {item.userAnswer ? (
                    <div
                      className={`px-3 py-2 rounded-lg text-sm font-medium font-mushaf w-full flex flex-col items-center text-center ${item.isCorrect
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                    >
                      {item.isCorrect ? (
                        <span className="text-base font-semibold">Jawabanmu benar</span>
                      ) : (
                        <>
                          <span className="mb-2 text-base font-semibold">Jawaban salahmu</span>
                          <span className="font-mushaf text-lg mb-1">{item.userAnswer.arab}</span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="px-3 py-2 rounded-lg text-sm font-medium font-mushaf w-full flex flex-col items-center text-center bg-yellow-50 text-yellow-700 border border-yellow-200">
                      <span className="text-base font-semibold">Kamu tidak menjawab</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Floating Action Card */}
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-xl divide-x divide-gray-200 overflow-hidden">
              <button
                onClick={restartGame}
                className="w-[120px] py-2.5 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 transition"
              >
                <i className="ri-refresh-line"></i> Main Lagi
              </button>
              <Link
                to="/history"
                className="w-[120px] py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition flex items-center justify-center"
              >
                <i className="ri-time-line"></i> History
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];

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

        <div className="pt-[70px]">
          {/* Header progress */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              Soal <span className="font-semibold">{currentQuestion + 1}</span> / {questions.length}
            </span>
            <span className="text-sm font-mono font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
              {timeLeft}s
            </span>
          </div>

          {/* Card pertanyaan */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm relative">
            <p
              dir="rtl"
              className="text-2xl font-mushaf leading-relaxed text-center text-gray-800"
            >
              {q.question.arab}
            </p>

            {/* Tombol play audio */}
            <button
              onClick={() => audioRef.current?.play()}
              className="absolute bottom-1 right-2 transition"
              aria-label="Putar audio"
            >
              <i className="ri-volume-up-line text-md text-gray-700"></i>
            </button>
          </div>

          {/* Opsi jawaban */}
          <div className="max-w-md mx-auto px-2">
            <p className="text-center pb-3 font-medium text-gray-600">
              Silakan pilih jawabanmu
            </p>
            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                const isCorrect = opt.id === q.correct.id;
                const answered = selectedOption !== null;

                // Warna dasar zebra: selang-seling putih & abu muda
                const zebraBase = idx % 2 === 0 ? 'bg-white' : 'bg-gray-100';

                return (
                  <button
                    key={idx}
                    disabled={answered}
                    onClick={() => handleAnswer(opt)}
                    className={`w-full p-3 border rounded-lg text-right text-xl leading-relaxed font-mushaf transition
            ${answered && isCorrect
                        ? 'bg-green-50 border-green-500 text-green-700'
                        : ''
                      }
            ${answered &&
                        !isCorrect &&
                        opt.id === selectedOption?.id
                        ? 'bg-red-50 border-red-500 text-red-700'
                        : ''
                      }
            ${!answered ? `${zebraBase}` : ''}
          `}
                  >
                    {opt.arab}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
