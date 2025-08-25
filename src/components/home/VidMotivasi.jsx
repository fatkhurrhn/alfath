import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function VidMotivasi() {
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
                setVideos(data);
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
            <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Video Motivasi</h2>
                    <div className="px-4 py-2 text-blue-600">More</div>
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex-shrink-0 w-64 bg-gray-200 rounded-lg animate-pulse">
                            <div className="w-full h-36 bg-gray-300 rounded-t-lg"></div>
                            <div className="p-3">
                                <div className="h-4 mb-2 bg-gray-300 rounded"></div>
                                <div className="flex justify-between">
                                    <div className="h-3 w-20 bg-gray-300 rounded"></div>
                                    <div className="h-3 w-16 bg-gray-300 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Video Motivasi</h2>
                    <div className="px-4 py-2 text-blue-600">More</div>
                </div>
                <div className="p-4 text-center text-red-500 bg-red-100 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-1.5">
            {/* Header dengan judul dan tombol more */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-[16px] font-semibold text-gray-800">Video Motivasi</h2>
                <Link
                    to="/more-videos"
                    className="flex items-center text-[14px] text-gray-600"
                >
                    More <i className="ml-1 ri-arrow-right-line"></i>
                </Link>
            </div>
            {/* Container video dengan scroll horizontal */}
            <div className="flex space-x-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {videos.map(video => (
                    <Link
                        key={video.id}
                        to={`/detail/video/${video.id}`}
                        className="flex-shrink-0 w-64 overflow-hidden transition-all duration-300 rounded-md block hover:shadow-md"
                    >
                        {/* Thumbnail video */}
                        <div className="relative">
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="object-cover w-full h-36"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300 opacity-0 hover:bg-opacity-30 hover:opacity-100">
                                <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full bg-opacity-80">
                                    <i className="text-blue-600 ri-play-fill ri-lg"></i>
                                </div>
                            </div>
                        </div>

                        {/* Info video */}
                        <div className="px-1 py-2">
                            <h3 className="font-medium text-[14px] text-gray-800 line-clamp-1">{video.title}</h3>
                            <div className="flex items-center justify-between mt-0 text-[11px] text-gray-500">
                                <span>{video.upload_date}</span>
                                <span className="flex items-center">
                                    <i className="mr-1 ri-eye-line"></i>
                                    {video.views.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default VidMotivasi;