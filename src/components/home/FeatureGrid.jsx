import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { to: "/quran", icon: "📖", label: "Qur'an", color: "text-green-500" },
  { to: "/game", icon: "🎮", label: "Game", color: "text-purple-500" },
  { to: "/dzikir", icon: "📿", label: "Dzikir", color: "text-blue-500" },
  { to: "/kiblat", icon: "🕋", label: "Kiblat", color: "text-yellow-500" },
  { to: "/jadwal-sholat", icon: "🕌", label: "Sholat", color: "text-indigo-500" }
];

export default function FeatureGrid() {
  return (
    <div className="mb-2">
      <div className="flex overflow-x-auto space-x-3 pb-2 no-scrollbar gap-0 space-x-0 overflow-visible">
        {features.map(item => (
          <Link 
            key={item.to} 
            to={item.to} 
            className="flex flex-col items-center min-w-[80px] p-3 bg-white border border-gray-300 rounded-xl shadow-sm"
          >
            <div className={`text-2xl md:text-3xl ${item.color} mb-1`}>
              {item.icon}
            </div>
            <span className="text-xs md:text-sm text-center text-gray-700">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}