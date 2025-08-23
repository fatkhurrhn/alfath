// src/components/home/HadithSection.jsx
import React, { useState, useEffect } from 'react';

// Hadits singkat statis
const HADITS = [
  "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lain. (HR. Ahmad)",
  "Sesungguhnya Allah tidak melihat rupa dan harta kalian, tetapi Allah melihat hati dan amal kalian. (HR. Muslim)",
  "Amal yang paling dicintai Allah adalah yang terus-menerus walaupun sedikit. (HR. Bukhari & Muslim)"
];

export default function HadithSection() {
  const [randomHadits, setRandomHadits] = useState("");

  // Ambil hadits random
  useEffect(() => {
    setRandomHadits(HADITS[Math.floor(Math.random() * HADITS.length)]);
  }, []);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border mb-6">
      <h3 className="font-semibold text-gray-800 mb-2">Hadits Pilihan 📜</h3>
      <p className="text-sm text-gray-600 italic">"{randomHadits}"</p>
    </div>
  );
}