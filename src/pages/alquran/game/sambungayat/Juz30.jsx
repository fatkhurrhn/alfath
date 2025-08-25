// Juz30.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Juz30() {
  /* ---------- state ---------- */
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);

  /* audio ref agar mudah di-control */
  const audioRef = useRef(null);

  /* ---------- load soal ---------- */
  useEffect(() => {
    fetchQuestions();
  }, []);

  /* ---------- per-soal side-effect ---------- */
  useEffect(() => {
    if (questions.length && currentQuestion < questions.length) {
      setTimeLeft(30);
      setSelectedOption(null);
      setShowResult(false);

      /* autoplay audio */
      const audioUrl = questions[currentQuestion].question.audio;
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play().catch(() => {
        // autoplay diblokir → user harus klik tombol play
      });

      return () => {
        if (audioRef.current) audioRef.current.pause();
      };
    }
  }, [currentQuestion, questions]);

  /* ---------- countdown ---------- */
  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
      return;
    }
    if (!showResult && !gameOver) {
      const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timeLeft, showResult, gameOver]);

  /* ---------- fetch ---------- */
  const fetchQuestions = async () => {
    try {
      const res = await fetch('https://api.myquran.com/v2/quran/ayat/juz/30');
      const json = await res.json();
      const allAyat = json.data;

      // ambil 5 ayat secara acak
      const picked = allAyat.sort(() => Math.random() - 0.5).slice(0, 5);

      const qs = picked.map((ayat) => {
        const nextAyat =
          allAyat.find((a) => a.surah === ayat.surah && +a.ayah === +ayat.ayah + 1) ||
          allAyat[Math.floor(Math.random() * allAyat.length)];

        const wrongs = allAyat
          .filter(
            (a) =>
              a.id !== nextAyat.id &&
              (a.surah !== nextAyat.surah || a.ayah !== nextAyat.ayah)
          )
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        const options = [
          { ...nextAyat, isCorrect: true },
          ...wrongs.map((w) => ({ ...w, isCorrect: false }))
        ].sort(() => Math.random() - 0.5);

        return { question: ayat, options };
      });

      setQuestions(qs);
    } catch {
      // fallback (jika API error) – bisa dihapus jika tidak diperlukan
      alert('Gagal memuat soal, silakan refresh.');
    }
  };

  /* ---------- logic ---------- */
  const handleAnswer = (option) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    setShowResult(true);
    if (option.isCorrect) setScore((s) => s + 20);

    setTimeout(() => handleNextQuestion(), 1500);
  };

  const handleNextQuestion = () => {
    if (audioRef.current) audioRef.current.pause();
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((q) => q + 1);
    } else {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setGameOver(false);
    fetchQuestions();
  };

  /* ---------- UI ---------- */
  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
        <p className="text-white text-2xl animate-pulse">Memuat soal...</p>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 text-center max-w-sm w-full">
          <h2 className="text-3xl font-bold mb-4">Selesai!</h2>
          <p className="text-6xl font-black text-green-500 mb-2">{score}</p>
          <p className="text-gray-600 mb-6">
            {score >= 80 ? 'Luar biasa!' : score >= 60 ? 'Bagus!' : 'Terus latihan!'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={restartGame}
              className="bg-green-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-green-600"
            >
              Main Lagi
            </button>
            <Link
              to="/history"
              className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-md hover:bg-blue-600"
            >
              History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500">
      {/* header */}
      <div className="fixed top-0 left-0 right-0 bg-white/30 backdrop-blur-md p-4 flex justify-between items-center text-white font-bold z-20">
        <Link to="/game" className="flex items-center gap-2">
          <i className="ri-arrow-left-s-line text-2xl"></i>
          <span className="hidden sm:inline">Kembali</span>
        </Link>
        <span>
          Soal {currentQuestion + 1} / {questions.length}
        </span>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
          {timeLeft}
        </div>
      </div>

      {/* konten */}
      <div className="pt-28 pb-28 px-4 max-w-lg mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6">
          {/* audio */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => audioRef.current?.play()}
              className="bg-green-500 text-white p-3 rounded-full shadow-md hover:scale-110 transition"
            >
              <i className="ri-play-fill text-2xl"></i>
            </button>
          </div>

          {/* ayat soal */}
          <div className="text-center mb-4">
            <p className="text-4xl font-arabic leading-loose text-gray-800">
              {q.question.arab}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Ayat: {q.question.ayah}
            </p>
          </div>

          {/* opsi */}
          <div className="space-y-3">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleAnswer(opt)}
                className={`w-full p-4 rounded-xl text-right text-2xl font-arabic transition-all duration-300
                  ${
                    selectedOption
                      ? opt.isCorrect
                        ? 'bg-green-500 text-white scale-105 shadow-lg'
                        : 'bg-red-400 text-white opacity-60'
                      : 'bg-white/70 hover:bg-white hover:shadow-md'
                  }`}
              >
                {opt.arab}
              </button>
            ))}
          </div>

          {/* hasil */}
          {showResult && (
            <div className="mt-4 text-center">
              {selectedOption?.isCorrect ? (
                <p className="text-green-600 font-bold text-lg">✅ +20 poin</p>
              ) : (
                <p className="text-red-600 font-bold text-lg">❌ Salah</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* footer score */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/30 backdrop-blur-md p-4 flex justify-between text-white font-bold">
        <span>Skor: {score}</span>
        <span>Target: 100</span>
      </div>

      <style>{`
        .font-arabic {
          font-family: 'Amiri', serif;
        }
      `}</style>
    </div>
  );
}