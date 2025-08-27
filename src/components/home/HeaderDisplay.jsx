import React, { useState, useRef } from 'react';

function HeaderDisplay() {
    const [notificationsOn, setNotificationsOn] = useState(true);
    const audioRef = useRef(null);

    const toggleNotifications = () => {
        // Putar suara notifikasi
        if (audioRef.current) {
            audioRef.current.play().catch(error => {
                console.log("Autoplay prevented:", error);
            });
        }

        // Toggle status notifikasi
        setNotificationsOn(prevState => !prevState);
    };

    return (
        <div>
            {/* Element audio yang tersembunyi */}
            <audio ref={audioRef} src="/audio/getar.mp3" />

            <div className="flex justify-between pt-4 items-center px-4 py-2 text-sm bg-[#fcfeff]">
                <span className="text-[#355485] font-medium">28 Agustus 2025</span>
                <span className="font-semibold text-[#4f90c6]">Kota Depok</span>
            </div>

            <div className="flex justify-between items-center px-5 py-3 border-b bg-[#fcfeff]">
                <div className="space-y-[-4px]">
                    <div
                        className="w-[30px] h-[30px] flex items-center mb-2 justify-center rounded-[5px] bg-[#355485] cursor-pointer hover:bg-[#2a436c] transition-colors"
                        onClick={toggleNotifications}
                        title={notificationsOn ? "Matikan notifikasi" : "Nyalakan notifikasi"}
                    >
                        <i
                            className={`text-white text-md ${notificationsOn
                                    ? "ri-notification-3-line"
                                    : "ri-notification-off-line"
                                }`}
                        ></i>
                    </div>

                    <p className="font-normal pt-1 text-[#355485]">Now : Ashar</p>

                    <p className="font-semibold text-[25px] text-[#44515f]">
                        16:14 <span className="text-[10px]">AM (start time)</span>
                    </p>

                    <p className="text-sm text-[#6d9bbc]">
                        1 hour 19<span className="text-[10px]">.45</span> min left
                    </p>

                    <p className="text-[13px]">"Hamasah"</p>
                </div>

                <img
                    src="/img/masjid.jpg"
                    alt="Masjid"
                    className="w-[150px] h-[150px] object-contain"
                />
            </div>
        </div>
    );
}

export default HeaderDisplay;