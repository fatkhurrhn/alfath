import React, { useEffect } from 'react'
import HybridCalendar from '../components/HybridCalendar'
import { Link } from 'react-router-dom';

export default function Home() {
    useEffect(() => {
        document.title = "Kalender - Islamic";
    }, []);

    return (
        <div className="min-h-screen pb-20">
            <div className="max-w-xl mx-auto px-3 container border-x border-gray-200">
                <div className="fixed max-w-xl border border-gray-200 mx-auto top-0 left-1/2 -translate-x-1/2 w-full z-50 bg-white px-3 py-4">
                    <Link to="/" className="flex items-center font-semibold gap-2 text-gray-800  text-[15px]">
                        <i className="ri-arrow-left-line"></i> Kalender
                    </Link>
                </div>
                {/* tempat isi kontennya */}
                <div className="pt-[65px]">
                    <HybridCalendar />
                </div>
            </div>
        </div>
    )
}
