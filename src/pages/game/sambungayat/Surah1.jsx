import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function SurahSambungAyat() {
    const { surahNumber: surahParam } = useParams();
    const surahNumber = Number(surahParam ?? 1); // PENTING - default ke (example 67 = Al-Mulk)

    /* ---------- state ---------- */
    const [surah, setSurah] = useState(null); // object data surah dari API
    const [questions, setQuestions] = useState([]); // {question, correct, options}
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

    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    /* ---------- load ---------- */
    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const res = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
                const json = await res.json();
                if (!mounted) return;
                setSurah(json.data);

                const ayat = json.data.ayat; // array ayat satu surah
                // pertanyaan hanya dari ayat yang BUKAN ayat terakhir (harus ada sambungannya)
                const kandidat = ayat.filter(a => a.nomorAyat < json.data.jumlahAyat);
                // jumlah soal: maksimal 10, kalau kurang dari 10 menyesuaikan (random, tidak berurutan)
                const jumlahSoal = Math.min(10, kandidat.length);
                const picked = shuffle(kandidat).slice(0, jumlahSoal);

                const qs = picked.map((q) => {
                    const correct = ayat.find(a => a.nomorAyat === q.nomorAyat + 1);
                    // pool jawaban salah diambil DARI SURAH YANG SAMA
                    const wrongPool = ayat.filter(a => a.nomorAyat !== q.nomorAyat && a.nomorAyat !== correct.nomorAyat);
                    // maksimal 4 pilihan (1 benar + 3 salah). Kalau surah-nya pendek, ikut menyesuaikan.
                    const wrongs = shuffle(wrongPool).slice(0, 3);
                    const options = shuffle([correct, ...wrongs]);
                    return { question: q, correct, options };
                });

                setQuestions(qs);
            } catch (e) {
                console.error(e);
                alert('Gagal memuat data surah: ' + e.message);
            }

        };

        load();
        return () => { mounted = false; audioRef.current?.pause(); };
    }, [surahNumber]);

    /* ---------- per-soal ---------- */
    useEffect(() => {
        if (questions.length && currentQuestion < questions.length) {
            setTimeLeft(30);
            setSelectedOption(null);

            // play audio ayat PERTANYAAN (bukan jawaban): pakai q.question.audio["05"] (Misyari)
            const audioUrl = questions[currentQuestion].question.audio?.["05"];

            // stop audio lama (kalau ada)
            audioRef.current?.pause();

            if (audioUrl) {
                audioRef.current = new Audio(audioUrl);
                audioRef.current.play().catch(() => { });
            }

            return () => { audioRef.current?.pause(); };
        }
    }, [currentQuestion, questions]);

    /* ---------- countdown ---------- */
    useEffect(() => {
        if (timeLeft === 0) { handleTimeUp(); return; }
        if (!selectedOption && !gameOver) {
            const t = setTimeout(() => setTimeLeft(v => v - 1), 1000);
            return () => clearTimeout(t);
        }
    }, [timeLeft, selectedOption, gameOver]);

    /* ---------- history ---------- */
    const saveGameHistory = (finalScore) => {
        const gameRecord = {
            date: formatDateId(new Date()),
            score: finalScore,
            total: 100,
            details: userAnswers,
            game: 'Sambung Ayat',
            mode: 'Per Surah',
            surahName: surah?.namaLatin,
            surahNumber: surah?.nomor,
        };
        const existingHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
        const updatedHistory = [gameRecord, ...existingHistory];
        localStorage.setItem('gameHistory', JSON.stringify(updatedHistory.slice(0, 50)));
    };

    /* ---------- logic ---------- */
    const handleAnswer = (option) => {
        if (selectedOption) return;
        setSelectedOption(option);

        const isCorrect = option.nomorAyat === questions[currentQuestion].correct.nomorAyat;
        const poinPerSoal = Math.round(100 / questions.length);
        if (isCorrect) setScore((s) => s + poinPerSoal);

        setUserAnswers(prev => ([
            ...prev,
            { ...questions[currentQuestion], userAnswer: option, isCorrect }
        ]));

        setTimeout(() => {
            if (currentQuestion + 1 < questions.length) {
                setCurrentQuestion(q => q + 1);
            } else {
                const finalScore = isCorrect ? score + poinPerSoal : score;
                setGameOver(true);
                saveGameHistory(finalScore);
                audioRef.current?.pause();
            }
        }, 1200);
    };

    const handleTimeUp = () => {
        setUserAnswers(prev => ([
            ...prev,
            { ...questions[currentQuestion], userAnswer: null, isCorrect: false }
        ]));

        setTimeout(() => {
            if (currentQuestion + 1 < questions.length) {
                setCurrentQuestion(q => q + 1);
            } else {
                const finalScore = score;
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
        setQuestions([]);
        setSurah(null);
        (async () => {
            try {
                const res = await fetch(`https://equran.id/api/v2/surat/${surahNumber}`);
                const json = await res.json();
                setSurah(json.data);

                const ayat = json.data.ayat;
                const kandidat = ayat.filter(a => a.nomorAyat < json.data.jumlahAyat);
                const jumlahSoal = Math.min(10, kandidat.length);
                const picked = shuffle(kandidat).slice(0, jumlahSoal);
                const qs = picked.map((q) => {
                    const correct = ayat.find(a => a.nomorAyat === q.nomorAyat + 1);
                    const wrongPool = ayat.filter(a => a.nomorAyat !== q.nomorAyat && a.nomorAyat !== correct.nomorAyat);
                    const wrongs = shuffle(wrongPool).slice(0, 3);
                    const options = shuffle([correct, ...wrongs]);
                    return { question: q, correct, options };
                });
                setQuestions(qs);
            } catch (e) {
                console.error(e);
                alert('Gagal memuat data surah: ' + e.message);
            }

        })();
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
                                <span
                                    className={`absolute -left-[13px] top-2 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${item.isCorrect
                                        ? 'bg-green-500 text-white'
                                        : !item.userAnswer
                                            ? 'bg-yellow-500 text-white'
                                            : 'bg-red-500 text-white'
                                        }`}
                                >
                                    {idx + 1}
                                </span>

                                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                    <p className="font-semibold text-center mb-2 font-mushaf text-gray-800 leading-loose">
                                        {item.question.teksArab} —{' '}
                                        <span className="font-semibold text-green-700">
                                            {item.correct.teksArab}
                                        </span>
                                    </p>
                                    <hr className="p-2" />

                                    {item.userAnswer ? (
                                        <div
                                            className={`px-3 py-2 rounded-lg text-sm font-medium font-mushaf w-full flex flex-col items-center text-center ${item.isCorrect
                                                ? 'bg-green-50 text-green-700 border border-green-200'
                                                : 'bg-red-50 text-red-700 border border-red-200'
                                                }`}
                                        >
                                            {item.isCorrect ? (
                                                <span className="text-base font-semibold">Jawabanmu benar</span>
                                            ) : (
                                                <>
                                                    <span className="mb-2 text-base font-semibold">Jawaban salahmu</span>
                                                    <span className="font-mushaf text-lg mb-1">{item.userAnswer.teksArab}</span>
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
                            <i className="ri-arrow-left-line"></i> Sambung Ayat — {surah?.namaLatin ?? `Surah ${surahNumber}`}
                        </Link>
                        <button className="text-gray-600 hover:text-gray-600" aria-label="Pengaturan">
                            <i className="ri-settings-5-line text-xl"></i>
                        </button>
                    </div>
                </div>

                <div className="pt-[70px]">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-700">
                            Soal <span className="font-semibold">{currentQuestion + 1}</span> / {questions.length}
                        </span>
                        <span className="text-sm font-mono font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                            {timeLeft}s
                        </span>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm relative">
                        <p dir="rtl" className="text-2xl font-mushaf leading-relaxed text-center text-gray-800">
                            {q.question.teksArab}
                        </p>
                        <button
                            onClick={() => audioRef.current?.play()}
                            className="absolute bottom-1 right-2 transition"
                            aria-label="Putar audio"
                        >
                            <i className="ri-volume-up-line text-md text-gray-700"></i>
                        </button>
                    </div>

                    <div className="max-w-md mx-auto px-2">
                        <p className="text-center pb-3 font-medium text-gray-600">Silakan pilih jawabanmu</p>
                        <div className="space-y-3">
                            {q.options.map((opt, idx) => {
                                const isCorrect = opt.nomorAyat === q.correct.nomorAyat;
                                const answered = selectedOption !== null;
                                const zebraBase = idx % 2 === 0 ? 'bg-white' : 'bg-gray-100';

                                return (
                                    <button
                                        key={idx}
                                        disabled={answered}
                                        onClick={() => handleAnswer(opt)}
                                        className={`w-full p-3 border rounded-lg text-right text-xl leading-relaxed font-mushaf transition ${answered && isCorrect ? 'bg-green-50 border-green-500 text-green-700' : ''} ${answered && !isCorrect && opt.nomorAyat === selectedOption?.nomorAyat ? 'bg-red-50 border-red-500 text-red-700' : ''} ${!answered ? `${zebraBase}` : ''}`}
                                    >
                                        {opt.teksArab}
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