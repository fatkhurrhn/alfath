import React, { useEffect, useState, useRef } from "react";

export default function Tes() {
  const [surah, setSurah] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [status, setStatus] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const recognitionRef = useRef(null);

  // ambil data surah dari JSON
  useEffect(() => {
    fetch("/data/surah/78.json")
      .then((res) => res.json())
      .then((data) => {
        const surahData = Object.values(data)[0]; // { "112": {...} } → ambil isinya
        setSurah(surahData);

        // pilih index random (pastikan masih ada minimal 2 ayat setelahnya)
        const total = parseInt(surahData.number_of_ayah);
        const randomStart = Math.floor(Math.random() * (total - 2)) + 1;
        setCurrentIndex(randomStart);
      });
  }, []);

  // setup speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = "ar-SA"; // gunakan mushaf
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setUserAnswer(transcript);
        checkAnswer(transcript);
      };

      rec.onerror = (e) => {
        console.error("Speech error", e);
        setStatus("❌ Error: " + e.error);
      };

      recognitionRef.current = rec;
    } else {
      setStatus("Browser tidak mendukung voice recognition.");
    }
  }, [surah, currentIndex]);

  function startListening() {
    if (recognitionRef.current) {
      setStatus("🎤 Mendengarkan...");
      recognitionRef.current.start();
    }
  }

  // ========== Normalisasi & Similarity ==========
  function removeDiacritics(str) {
    return str.replace(/[\u064B-\u0652]/g, ""); // hapus harakat arab
  }

  function normalize(str) {
    return removeDiacritics(str)
      .replace(/[^\u0600-\u06FF\s]/g, "") // hanya huruf arab
      .replace(/\s+/g, " ")
      .trim();
  }

  // Levenshtein Distance
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
    return 1 - distance / maxLen; // hasil 0..1
  }

  // cek jawaban player
  function checkAnswer(spoken) {
    if (!surah || currentIndex == null) return;
    const nextIndex = currentIndex + 2; // ayat sambungan setelah 2 yang ditampilkan
    const correctAyah = surah.text[nextIndex.toString()];

    const spokenNorm = normalize(spoken);
    const correctNorm = normalize(correctAyah);

    const score = similarity(spokenNorm, correctNorm);

    if (score >= 0.7) {
      setStatus("✅ Benar! Sambungan ayat:");
      setUserAnswer(correctAyah);
    } else {
      setStatus("❌ Salah! Jawaban benar:");
      setUserAnswer(correctAyah);
    }
  }

  // ========== Render ==========
  if (!surah || currentIndex == null) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          🎮 Game Sambung Ayat
        </h1>
        <h2 className="text-lg font-semibold text-center text-gray-600 mb-2">
          Surah {surah.name_latin} ({surah.translations.id.name})
        </h2>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-right text-xl leading-relaxed font-mushaf">
            {surah.text[currentIndex.toString()]} -  {surah.text[(currentIndex + 1).toString()]}
          </p>
           
        </div>

        <p className="text-center text-gray-700 mb-2">
          👉 Apa sambungan ayat di atas?
        </p>

        <div className="flex justify-center gap-3 mb-4">
          <button
            onClick={startListening}
            className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium shadow hover:bg-green-600"
          >
            🎤 Jawab dengan Suara
          </button>
        </div>

        {status && (
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="font-semibold">{status}</p>
            <p className="text-xl text-right font-mushaf mt-2">{userAnswer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
