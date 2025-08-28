import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Kiblat() {
    const [qiblaDirection, setQiblaDirection] = useState(null);
    const [deviceOrientation, setDeviceOrientation] = useState(0);
    const [locationGranted, setLocationGranted] = useState(false);
    const [showPermissionModal, setShowPermissionModal] = useState(true);
    const [coords, setCoords] = useState(null);

    // Hitung arah kiblat pakai rumus geodesi
    const calculateQibla = (lat, lng) => {
        const kaabaLat = 21.4225 * (Math.PI / 180);
        const kaabaLng = 39.8262 * (Math.PI / 180);
        const userLat = lat * (Math.PI / 180);
        const userLng = lng * (Math.PI / 180);

        const longDiff = kaabaLng - userLng;
        const y = Math.sin(longDiff);
        const x =
            Math.cos(userLat) * Math.tan(kaabaLat) -
            Math.sin(userLat) * Math.cos(longDiff);

        let bearing = (Math.atan2(y, x) * 180) / Math.PI;
        bearing = (bearing + 360) % 360;
        return bearing;
    };

    // Minta lokasi
    const requestLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const qibla = calculateQibla(latitude, longitude);
                    setQiblaDirection(qibla);
                    setCoords({ lat: latitude, lng: longitude });
                    setLocationGranted(true);
                    setShowPermissionModal(false);
                },
                (err) => {
                    console.error("Location error:", err);
                    setLocationGranted(false);
                    setShowPermissionModal(false);
                }
            );
        } else {
            alert("Browser tidak mendukung geolokasi.");
            setShowPermissionModal(false);
        }
    };

    // Baca orientasi device
    useEffect(() => {
        const handleOrientation = (event) => {
            if (event.alpha !== null) {
                setDeviceOrientation(event.alpha);
            }
        };
        window.addEventListener("deviceorientationabsolute", handleOrientation, true);
        window.addEventListener("deviceorientation", handleOrientation, true);

        return () => {
            window.removeEventListener("deviceorientationabsolute", handleOrientation);
            window.removeEventListener("deviceorientation", handleOrientation);
        };
    }, []);

    // Sudut relatif kiblat
    const getRotation = () => {
        if (qiblaDirection === null) return 0;
        return qiblaDirection - deviceOrientation;
    };

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
                </div>
            </div>

            {/* Isi konten */}
            <div className="max-w-xl mx-auto px-3 border-x border-gray-200 pt-[70px] flex flex-col items-center">
                <h2 className="text-xl font-bold text-[#355485] mb-2">Arah Kiblat</h2>
                <p className="text-sm text-[#6d9bbc] mb-6 text-center">
                    Hadapkan perangkat Anda ke arah garis hijau untuk menghadap Ka&apos;bah
                </p>

                {/* Kompas */}
                <div className="relative w-72 h-72 rounded-full border-[6px] border-gray-300 flex items-center justify-center shadow-lg bg-white">
                    {/* Jarum Utara */}
                    <div
                        className="absolute w-1 h-28 bg-red-500 top-8 origin-bottom"
                        style={{ transform: `rotate(${-deviceOrientation}deg)` }}
                    ></div>

                    {/* Jarum Kiblat */}
                    {qiblaDirection !== null && (
                        <div
                            className="absolute w-1.5 h-32 bg-green-600 rounded-full top-4 origin-bottom"
                            style={{ transform: `rotate(${getRotation()}deg)` }}
                        ></div>
                    )}

                    <span className="text-xs text-gray-500 absolute bottom-6">
                        {qiblaDirection !== null
                            ? `Arah Kiblat: ${Math.round(qiblaDirection)}° dari Utara`
                            : "Menunggu lokasi..."}
                    </span>
                </div>

                {/* Info tambahan */}
                {coords && (
                    <div className="mt-6 w-full space-y-2">
                        <div className="bg-white border rounded-lg p-3 shadow-sm">
                            <p className="text-sm text-gray-600">
                                📍 Lokasi Anda:{" "}
                                <span className="font-medium text-[#355485]">
                                    {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                                </span>
                            </p>
                        </div>
                        <div className="bg-white border rounded-lg p-3 shadow-sm">
                            <p className="text-sm text-gray-600">
                                🧭 Orientasi Device:{" "}
                                <span className="font-medium text-[#355485]">
                                    {Math.round(deviceOrientation)}°
                                </span>
                            </p>
                        </div>
                    </div>
                )}

                {!locationGranted && (
                    <p className="text-center text-sm text-red-500 mt-4">
                        Lokasi diperlukan untuk menentukan arah kiblat.
                    </p>
                )}
            </div>

            {/* Modal izin lokasi */}
            {showPermissionModal && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40"></div>
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-80 shadow-lg text-center">
                            <h3 className="text-lg font-semibold mb-2 text-gray-800">
                                Izin Lokasi
                            </h3>
                            <p className="text-sm text-gray-600 mb-5">
                                Aplikasi membutuhkan akses lokasi untuk menentukan arah kiblat.
                            </p>
                            <div className="flex justify-center gap-3">
                                <button
                                    onClick={requestLocation}
                                    className="px-4 py-2 bg-[#355485] text-white rounded-lg hover:bg-[#2a436c]"
                                >
                                    Izinkan
                                </button>
                                <button
                                    onClick={() => setShowPermissionModal(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
