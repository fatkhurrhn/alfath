import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function VideoList() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mengambil data dari file JSON
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch('/data/vidmotivasi.json');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                // Urutkan berdasarkan ID terbesar pertama (descending)
                const sortedVideos = data.sort((a, b) => b.id - a.id);
                setVideos(sortedVideos);
            } catch (error) {
                console.error('Error fetching video data:', error);
                setError('Gagal memuat data video. Pastikan file JSON tersedia.');
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pb-2">
                <div className="max-w-xl mx-auto px-3 container border-x border-gray-200">
                    <div className="fixed max-w-xl border border-gray-200 mx-auto top-0 left-1/2 -translate-x-1/2 w-full z-50 bg-white px-3 py-4">
                        <div className="flex items-center justify-between">
                            <Link to="/" className="flex items-center font-semibold gap-2 text-gray-800 text-[15px]">
                                <i className="ri-arrow-left-line"></i> Video Motivasi
                            </Link>
                            <button className="text-gray-600 hover:text-gray-600">
                                <i className="ri-settings-5-line text-xl"></i>
                            </button>
                        </div>
                    </div>

                    {/* Skeleton loading */}
                    <div className='pt-[65px]'>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="mb-4 bg-gray-200 rounded-lg animate-pulse">
                                <div className="w-full h-48 bg-gray-300 rounded-t-lg"></div>
                                <div className="p-4">
                                    <div className="h-5 mb-3 bg-gray-300 rounded"></div>
                                    <div className="flex justify-between">
                                        <div className="h-4 w-24 bg-gray-300 rounded"></div>
                                        <div className="h-4 w-20 bg-gray-300 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pb-2">
                <div className="max-w-xl mx-auto px-3 container border-x border-gray-200">
                    <div className="fixed max-w-xl border border-gray-200 mx-auto top-0 left-1/2 -translate-x-1/2 w-full z-50 bg-white px-3 py-4">
                        <div className="flex items-center justify-between">
                            <Link to="/" className="flex items-center font-semibold gap-2 text-gray-800 text-[15px]">
                                <i className="ri-arrow-left-line"></i> Video Motivasi
                            </Link>
                            <button className="text-gray-600 hover:text-gray-600">
                                <i className="ri-settings-5-line text-xl"></i>
                            </button>
                        </div>
                    </div>

                    <div className='pt-[65px] p-4 text-center text-red-500 bg-red-100 rounded-lg'>
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-2">
            <div className="max-w-xl mx-auto px-3 container border-x border-gray-200">
                <div className="fixed max-w-xl border border-gray-200 mx-auto top-0 left-1/2 -translate-x-1/2 w-full z-50 bg-white px-3 py-3">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center font-semibold gap-2 text-gray-800 text-[15px]">
                            <i className="ri-arrow-left-line"></i> Video Motivasi
                        </Link>
                        <button className="text-gray-600 hover:text-gray-600">
                            <i className="ri-settings-5-line text-xl"></i>
                        </button>
                    </div>
                </div>

                {/* Konten video dalam bentuk vertikal */}
                <div className='pt-[65px]'>
                    {videos.map(video => (
                        <Link
                            key={video.id}
                            to={`/detail/video/${video.id}`}
                            className="block mb-5 overflow-hidden border border-gray-200 transition-all duration-300 rounded-lg"
                        >
                            {/* Thumbnail video */}
                            <div className="relative">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="object-cover w-full h-48"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300 opacity-0 hover:bg-opacity-30 hover:opacity-100">
                                    <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full bg-opacity-80">
                                        <i className="text-blue-600 ri-play-fill ri-lg"></i>
                                    </div>
                                </div>
                            </div>

                            {/* Info video */}
                            <div className="p-3">
                                <h3 className="font-medium text-[15px] text-gray-800 line-clamp-2 mb-1">{video.title}</h3>
                                <div className="flex items-center justify-between text-[12px] text-gray-500">
                                    <span className="flex items-center">
                                        {video.views.toLocaleString()} x ditonton
                                    </span>
                                    <span>{video.upload_date}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}