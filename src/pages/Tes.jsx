import React, { useEffect, useState, useRef } from "react";

export default function Tes() {
  const [surah, setSurah] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [status, setStatus] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    fetch("/data/surah/93.json")
      .then((res) => res.json())
      .then((data) => {
        const surahData = Object.values(data)[0];
        setSurah(surahData);
        setCurrentIndex(randomStartIndex(surahData));
      });
  }, []);

  function randomStartIndex(s) {
    const total = parseInt(s.number_of_ayah);
    return Math.floor(Math.random() * (total - 1)) + 1;
  }

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = "ar-SA";
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);

      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        checkAnswer(transcript);
      };

      rec.onerror = (e) => {
        console.error("Speech error", e);
        setStatus("❌ Error: " + e.error);
        setIsListening(false);
      };

      recognitionRef.current = rec;
    } else {
      setStatus("Browser tidak mendukung voice recognition.");
    }
  }, [surah, currentIndex]);

  function startListening() {
    if (!recognitionRef.current || isCorrect === true || isListening) return;
    setStatus("Mendengarkan...");
    recognitionRef.current.start();
  }

  function removeDiacritics(str) {
    return str.replace(/[\u064B-\u0652]/g, "");
  }
  function normalize(str) {
    return removeDiacritics(str)
      .replace(/[^\u0600-\u06FF\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  function levenshtein(a, b) {
    const m = a.length,
      n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const dp = Array.from({ length: m + 1 }, (_, i) => i);
    for (let j = 1; j <= n; j++) {
      let prev = dp[0];
      dp[0] = j;
      for (let i = 1; i <= m; i++) {
        const tmp = dp[i];
        dp[i] = Math.min(
          dp[i] + 1,
          dp[i - 1] + 1,
          prev + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
        prev = tmp;
      }
    }
    return dp[m];
  }
  function similarity(a, b) {
    if (!a || !b) return 0;
    const distance = levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);
    return 1 - distance / maxLen;
  }

  function checkAnswer(spoken) {
    if (!surah || currentIndex == null) return;
    const nextIndex = currentIndex + 1;
    const correctAyah = surah.text[nextIndex.toString()];

    const spokenNorm = normalize(spoken);
    const correctNorm = normalize(correctAyah);

    const score = similarity(spokenNorm, correctNorm);

    if (score >= 0.7) {
      setIsCorrect(true);
      setStatus("Jawabanmu Benar");
      setUserAnswer(correctAyah);
    } else {
      setIsCorrect(false);
      setStatus("Jawabanmu salah. Coba ulangi!");
    }
  }

  function nextQuestion() {
    if (!surah) return;
    let next = randomStartIndex(surah);
    if (currentIndex != null && next === currentIndex) {
      next = randomStartIndex(surah);
    }
    setCurrentIndex(next);
    setIsCorrect(null);
    setStatus("");
    setUserAnswer("");
    setIsListening(false);
  }

  if (!surah || currentIndex == null)
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        <i className="ri-loader-2-line animate-spin text-2xl mr-2"></i> Loading...
      </div>
    );

  const micIcon = isListening ? "ri-mic-fill" : "ri-mic-line";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-1">🎮 Game Sambung Ayat</h1>
        <p className="text-center text-gray-600 mb-4">
          Surah {surah.name_latin} ({surah.translations.id.name})
        </p>
        <hr className="mb-4" />

        {/* Soal */}
        <div className="bg-gray-50 rounded-lg p-4 mb-3 shadow-inner">
          <p className="text-center text-xl leading-relaxed font-mushaf text-gray-800">
            {surah.text[currentIndex.toString()]}
          </p>
        </div>

        <p className="text-center text-gray-700 mb-3 font-medium">
          Apa sambungan ayat di atas?
        </p>

        {/* Tombol aksi */}
        <div className="flex justify-center gap-3 mb-5">
          {/* Mic muncul kalau belum benar */}
          {isCorrect !== true && (
            <button
              onClick={startListening}
              disabled={isListening}
              className={`relative inline-flex items-center justify-center
                        w-14 h-14 rounded-full text-white shadow transition
                        ${isListening ? "bg-blue-600" : "bg-blue-500 hover:bg-blue-600"}`}
            >
              {isListening && (
                <span className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-60 bg-blue-400"></span>
              )}
              <i className={`${micIcon} text-[22px] relative`}></i>
            </button>
          )}

          {/* NEXT muncul kalau benar */}
          {isCorrect === true && (
            <button
              onClick={nextQuestion}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>

        {/* Status Jawaban */}
        {status && (
          <div
            className={`p-3 rounded-lg text-center ${isCorrect === true
                ? "bg-blue-50 text-blue-700"
                : isCorrect === false
                  ? "bg-red-50 text-red-600"
                  : "bg-gray-100 text-gray-600"
              }`}
          >
            <p className="font-semibold">{status}</p>
            {isCorrect === true && (
              <p className="text-xl text-blue-700 text-center leading-relaxed font-mushaf mt-3">
                {userAnswer}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
