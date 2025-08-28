import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Kiblat() {
    const [heading, setHeading] = useState(0);
    const [qiblaDirection, setQiblaDirection] = useState(293.5); // default arah kiblat Jakarta
    const [location, setLocation] = useState(null);

    // koordinat Ka'bah
    const kaaba = { lat: 21.4225, lng: 39.8262 };

    // 🔹 Hitung bearing (arah dari lokasi user ke Ka'bah)
    const calculateQibla = (lat, lng) => {
        const φ1 = (lat * Math.PI) / 180;
        const φ2 = (kaaba.lat * Math.PI) / 180;
        const Δλ = ((kaaba.lng - lng) * Math.PI) / 180;

        const y = Math.sin(Δλ) * Math.cos(φ2);
        const x =
            Math.cos(φ1) * Math.sin(φ2) -
            Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
        const θ = Math.atan2(y, x);
        const bearing = ((θ * 180) / Math.PI + 360) % 360;

        setQiblaDirection(bearing);
    };

    // 📍 Ambil lokasi user
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    calculateQibla(latitude, longitude);
                },
                (err) => {
                    console.warn("Gagal ambil lokasi:", err.message);
                }
            );
        } else {
            console.warn("Geolocation tidak didukung browser ini.");
        }
    }, []);

    // 📱 Sensor orientasi HP
    useEffect(() => {
        const handleOrientation = (event) => {
            let alpha = event.alpha;
            if (typeof alpha === "number") {
                setHeading(alpha);
            }
        };

        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", handleOrientation, true);
        } else {
            alert("Device orientation tidak didukung di perangkat ini");
        }

        return () => {
            window.removeEventListener("deviceorientation", handleOrientation);
        };
    }, []);

    // Hitung selisih arah kiblat
    const diff = Math.round(((qiblaDirection - heading + 360) % 360));

    return (
        <div className="min-h-screen pb-2 bg-gray-50">
            {/* Header */}
            <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
                <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-4">
                    <Link
                        to="/"
                        className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]"
                    >
                        <i className="ri-arrow-left-line"></i> Kiblat
                    </Link>
                    <button className="text-[#355485]">
                        <i className="ri-settings-5-line text-xl"></i>
                    </button>
                </div>
            </div>

            {/* Isi konten */}
            <div className="max-w-xl mx-auto px-3 border-x border-gray-200 pt-[80px] text-center">
                <h2 className="text-lg font-semibold text-[#355485] mb-2">
                    Kompas Arah Kiblat
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    Putar HP hingga panah <span className="text-green-600">hijau</span>{" "}
                    sejajar untuk arah sholat
                </p>

                {/* Kompas */}
                <div className="relative mx-auto w-72 h-72 rounded-full border-[8px] border-gray-300 shadow-lg flex items-center justify-center bg-gradient-to-b from-white to-gray-100">
                    {/* Putaran kompas */}
                    <div
                        className="absolute inset-0 rounded-full flex items-center justify-center transition-transform duration-200"
                        style={{ transform: `rotate(${-heading}deg)` }}
                    >
                        {/* Utara */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 text-red-600 font-bold">
                            N
                        </div>
                        {/* Panah kompas (biru) */}
                        <div className="w-0 h-0 border-l-[18px] border-r-[18px] border-b-[70px] border-transparent border-b-blue-500"></div>
                    </div>

                    {/* Panah arah kiblat */}
                    <div
                        className={`absolute w-0 h-0 border-l-[14px] border-r-[14px] border-b-[60px] mx-auto transition-all duration-300 ${diff < 5 ? "border-b-green-500" : "border-b-yellow-500"
                            }`}
                        style={{
                            transform: `rotate(${qiblaDirection - heading}deg)`,
                        }}
                    ></div>
                </div>

                {/* Info arah */}
                <div className="mt-6 space-y-1">
                    {location ? (
                        <p className="text-sm text-gray-700">
                            Lokasi:{" "}
                            <span className="font-semibold">
                                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                            </span>
                        </p>
                    ) : (
                        <p className="text-sm text-gray-400">📍 Mengambil lokasi...</p>
                    )}
                    <p className="text-sm text-gray-700">
                        Arah kiblat:{" "}
                        <span className="font-semibold">{qiblaDirection.toFixed(2)}°</span>
                    </p>
                    <p className="text-sm text-gray-500">
                        Selisih: {diff}° →{" "}
                        {diff < 5 ? (
                            <span className="text-green-600 font-semibold">✅ Pas ke kiblat</span>
                        ) : (
                            "↔ Geser sedikit"
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
