import React, { useEffect } from 'react'
import BottomNav from '../../../components/BottomNav'
import NavbarWaktuSholat from '../../../components/NavWaktuSholat'
import PrayerTimeManager from '../../../components/PrayerTimeManager'
import { Link } from 'react-router-dom';

export default function Almasurat() {
    useEffect(() => {
        document.title = "Home - Islamic";
    }, []);

    return (
        <div className="min-h-screen pb-20">
            <PrayerTimeManager>
                {({ nextPrayer, nextPrayerTime, countdown, selectedCity, handleCitySelect }) => (
                    <>
                        <NavbarWaktuSholat
                            onCitySelect={handleCitySelect}
                            nextPrayer={nextPrayer}
                            nextPrayerTime={nextPrayerTime}
                            countdown={countdown}
                            selectedCity={selectedCity}
                        />

                        {/* tempat isi kontennya */}
                        <div className="container mx-auto max-w-5xl mx-auto px-5 pt-24">
                            <div className="space-y-3">
                                <Link to="/dzikir/almasurat/pagi" className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                                    <div className="text-left">
                                        <h3 className="text-base font-medium text-gray-800">Dzikir Pagi</h3>
                                        <p className="text-gray-600 text-sm mt-1">deskripsi</p>
                                    </div>
                                    <div className="ml-auto text-gray-400">
                                        <i className="ri-arrow-right-s-line text-xl"></i>
                                    </div>
                                </Link>
                                <Link to="/dzikir/almasurat/petang" className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                                    <div className="text-left">
                                        <h3 className="text-base font-medium text-gray-800">Dzikir Petang</h3>
                                        <p className="text-gray-600 text-sm mt-1">deskripsi</p>
                                    </div>
                                    <div className="ml-auto text-gray-400">
                                        <i className="ri-arrow-right-s-line text-xl"></i>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </PrayerTimeManager>
            <BottomNav />
        </div>
    )
}