// src/pages/settings/SettingHome.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, googleProvider } from "../../firebase";
import BottomNav from "../../components/BottomNav";
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
} from "firebase/auth";

export default function SettingHome() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            if (u) {
                setUser(u);
                localStorage.setItem("user", JSON.stringify(u));
            } else {
                setUser(null);
                localStorage.removeItem("user");
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        try {
            await setPersistence(auth, browserLocalPersistence);
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user);
            localStorage.setItem("user", JSON.stringify(result.user));
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            localStorage.removeItem("user");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    // handle fallback image
    const handleImgError = (e) => {
        e.target.src =
            "https://cdn-icons-png.freepik.com/512/7718/7718888.png";
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
           <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200">
                   <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-3">
                     <Link
                       to="/"
                       className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]"
                     >
                       <i className="ri-arrow-left-line"></i> Setting
                     </Link>
                     <button className="text-[#355485]">
                       <i className="ri-settings-5-line text-xl"></i>
                     </button>
                   </div>
                 </div>

            <div className="max-w-xl mx-auto px-4 pt-[70px]">
                {/* Profile Section */}
                <div className="flex flex-col items-center mb-6 text-center">
                    <img
                        src={
                            user?.photoURL ||
                            "https://cdn-icons-png.freepik.com/512/7718/7718888.png"
                        }
                        alt="User avatar"
                        onError={handleImgError}
                        className="w-20 h-20 rounded-full border border-gray-200 object-cover"
                    />
                    <h2 className="mt-3 text-lg font-semibold text-gray-800">
                        {user?.displayName || "Belum login"}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {user?.email || "Silakan login untuk melanjutkan"}
                    </p>

                    <div className="mt-3">
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={handleLogin}
                                className="px-4 py-2 text-sm rounded-lg bg-[#355485] text-white hover:bg-[#2a436c] transition"
                            >
                                Login dengan Google
                            </button>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                        { label: "Sholat", icon: "ri-time-line", link: "/jadwal-sholat" },
                        { label: "Quran", icon: "ri-book-2-line", link: "/quran" },
                        { label: "Qiblat", icon: "ri-compass-3-line", link: "/qiblat" },
                        { label: "Dzikir", icon: "ri-hand-heart-line", link: "/dzikir" },
                    ].map((m, i) => (
                        <Link
                            key={i}
                            to={m.link}
                            className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm hover:bg-gray-100 transition"
                        >
                            <i className={`${m.icon} text-xl text-[#355485]`} />
                            <span className="text-xs mt-1 text-gray-700">{m.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Settings Options */}
                <div className="space-y-4">
                    {/* Notifikasi */}
                    <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div>
                            <p className="font-medium text-gray-700">Notifikasi</p>
                            <p className="text-sm text-gray-500">Aktifkan pengingat sholat</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[#355485] transition"></div>
                            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></span>
                        </label>
                    </div>

                    {/* Mode Hemat Data */}
                    <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div>
                            <p className="font-medium text-gray-700">Mode Hemat Data</p>
                            <p className="text-sm text-gray-500">
                                Kurangi penggunaan gambar & animasi
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[#355485] transition"></div>
                            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition"></span>
                        </label>
                    </div>

                    {/* Ukuran Font */}
                    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                        <p className="font-medium text-gray-700 mb-2">Ukuran Font</p>
                        <select className="w-full p-2 border border-gray-300 rounded-lg">
                            <option>Kecil</option>
                            <option>Sedang</option>
                            <option>Besar</option>
                        </select>
                    </div>

                    {/* Bahasa */}
                    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                        <p className="font-medium text-gray-700 mb-2">Bahasa</p>
                        <select className="w-full p-2 border border-gray-300 rounded-lg">
                            <option>Indonesia</option>
                            <option>English</option>
                        </select>
                    </div>

                    {/* Tentang */}
                    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                        <p className="font-medium text-gray-700 mb-1">Tentang Aplikasi</p>
                        <p className="text-sm text-gray-500">
                            AlFath — Muslim Daily. Versi 1.0.0
                        </p>
                    </div>

                    {/* Support */}
                    <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 text-center">
                        <p className="text-sm text-gray-500 mb-2">Butuh bantuan?</p>
                        <a
                            href="https://wa.me/6282285512813"
                            className="px-4 py-2 rounded-lg bg-[#355485] text-white hover:bg-green-600 transition"
                        >
                            Hubungi Support
                        </a>
                    </div>
                </div>
            </div>
            <BottomNav/>
        </div>
    );
}
