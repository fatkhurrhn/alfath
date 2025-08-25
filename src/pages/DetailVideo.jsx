import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

export default function DetailVideo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [videos, setVideos] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [showControls, setShowControls] = useState(false);
    const [loading, setLoading] = useState(true);
    const [hoverControls, setHoverControls] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Ambil data video
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch('/data/vidmotivasi.json');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setVideos(data);

                const video = data.find(v => v.id === parseInt(id));
                if (video) setCurrentVideo(video);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching video data:', error);
                setLoading(false);
            }
        };
        fetchVideos();
    }, [id]);

    // Setup video
    useEffect(() => {
        if (videoRef.current && currentVideo) {
            const video = videoRef.current;

            const updateProgress = () => {
                if (video.duration) {
                    setProgress((video.currentTime / video.duration) * 100);
                    setCurrentTime(video.currentTime);
                }
            };

            const setVideoDuration = () => setDuration(video.duration);

            video.addEventListener('timeupdate', updateProgress);
            video.addEventListener('loadedmetadata', setVideoDuration);
            video.addEventListener('ended', handleVideoEnd);

            const playVideo = async () => {
                try {
                    await video.play();
                    setIsPlaying(true);
                } catch {
                    setIsPlaying(false);
                }
            };
            playVideo();

            return () => {
                video.removeEventListener('timeupdate', updateProgress);
                video.removeEventListener('loadedmetadata', setVideoDuration);
                video.removeEventListener('ended', handleVideoEnd);
            };
        }
    }, [currentVideo]);

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleVideoClick = () => {
        togglePlayPause();
        setShowControls(true);
        const timer = setTimeout(() => {
            if (isPlaying && !hoverControls) setShowControls(false);
        }, 3000);
        return () => clearTimeout(timer);
    };

    const handleVideoEnd = () => {
        const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
        if (currentIndex < videos.length - 1) {
            const nextVideo = videos[currentIndex + 1];
            navigate(`/detail/video/${nextVideo.id}`);
        }
    };

    const handleNextVideo = () => {
        const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
        if (currentIndex < videos.length - 1) {
            const nextVideo = videos[currentIndex + 1];
            navigate(`/detail/video/${nextVideo.id}`);
        }
    };

    const handlePrevVideo = () => {
        const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
        if (currentIndex > 0) {
            const prevVideo = videos[currentIndex - 1];
            navigate(`/detail/video/${prevVideo.id}`);
        }
    };

    const handleSeek = (e) => {
        if (videoRef.current && duration) {
            const rect = e.target.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = percent * duration;
        }
    };

    const toggleFullscreen = async () => {
        if (!document.fullscreenElement) {
            await videoRef.current.requestFullscreen();
            if (screen.orientation && screen.orientation.lock) {
                try {
                    await screen.orientation.lock("landscape");
                } catch { }
            }
            setIsFullscreen(true);
        } else {
            await document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleVideoSelect = (videoId) => navigate(`/detail/video/${videoId}`);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat video...</p>
                </div>
            </div>
        );
    }

    if (!currentVideo) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <i className="ri-error-warning-line text-5xl text-red-500 mb-4"></i>
                    <h2 className="text-xl font-semibold text-gray-800">Video tidak ditemukan</h2>
                    <Link to="/" className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded-lg">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-2">
            <div className="max-w-xl mx-auto px-3 container">
                {/* Header */}
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 bg-white px-3 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <Link to="/" className="flex items-center font-semibold gap-2 text-gray-800 text-[15px]">
                            <i className="ri-arrow-left-line"></i> Video Motivasi
                        </Link>
                        <button className="text-gray-600 hover:text-gray-800">
                            <i className="ri-settings-5-line text-xl"></i>
                        </button>
                    </div>
                </div>

                {/* Video Player */}
                <div className="pt-[60px]">
                    <div
                        className="relative bg-gray-900 rounded-lg overflow-hidden"
                        onClick={handleVideoClick}
                        onMouseEnter={() => setHoverControls(true)}
                        onMouseLeave={() => setHoverControls(false)}
                    >
                        <video
                            ref={videoRef}
                            src={currentVideo.video_url}
                            className="w-full h-auto max-h-[70vh]"
                            playsInline
                        />

                        {/* Controls Tengah */}
                        {(showControls || hoverControls) && (
                            <div className="absolute inset-0 flex items-center justify-center space-x-6">
                                <button onClick={handlePrevVideo} className="bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70">
                                    <i className="ri-skip-back-line text-2xl"></i>
                                </button>
                                <button onClick={togglePlayPause} className="bg-black bg-opacity-50 text-white p-6 rounded-full hover:bg-opacity-70">
                                    <i className={`ri-${isPlaying ? 'pause' : 'play'}-line text-3xl`}></i>
                                </button>
                                <button onClick={handleNextVideo} className="bg-black bg-opacity-50 text-white p-4 rounded-full hover:bg-opacity-70">
                                    <i className="ri-skip-forward-line text-2xl"></i>
                                </button>
                            </div>
                        )}

                        {/* Progress Bar */}
                        {(showControls || hoverControls) && (
                            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-600 bg-opacity-50 cursor-pointer" onClick={handleSeek}>
                                <div className="h-full bg-red-500" style={{ width: `${progress}%` }}></div>
                            </div>
                        )}

                        {/* Time kiri bawah */}
                        {(showControls || hoverControls) && (
                            <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </div>
                        )}

                        {/* Fullscreen kanan bawah */}
                        {(showControls || hoverControls) && (
                            <button
                                onClick={toggleFullscreen}
                                className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-70"
                            >
                                <i className={`ri-${isFullscreen ? 'fullscreen-exit-line' : 'fullscreen-fill'} text-lg`}></i>
                            </button>
                        )}
                    </div>

                    {/* Video Info */}
                    <div className="p-4 bg-white">
                        <h1 className="text-xl font-bold mb-2 text-gray-800">{currentVideo.title}</h1>
                        <div className="flex justify-between text-sm text-gray-500">
                            <span>{currentVideo.upload_date}</span>
                            <span className="flex items-center">
                                <i className="ri-eye-line mr-1"></i>
                                {currentVideo.views.toLocaleString()} ditonton
                            </span>
                        </div>
                    </div>

                    {/* Video List */}
                    <div className="px-4 mt-4">
                        <h2 className="text-gray-800 text-lg font-semibold mb-3">Video Lainnya</h2>
                        <div className="space-y-3">
                            {videos.map(video => (
                                <div
                                    key={video.id}
                                    className={`flex items-center rounded-lg overflow-hidden cursor-pointer border ${video.id === currentVideo.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                                    onClick={() => handleVideoSelect(video.id)}
                                >
                                    <div className="relative w-32 h-20 flex-shrink-0">
                                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                                            <i className="ri-play-fill text-white"></i>
                                        </div>
                                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                                            {video.duration}
                                        </div>
                                        {video.id === currentVideo.id && (
                                            <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 rounded flex items-center">
                                                <i className="ri-play-fill mr-1"></i> Sedang diputar
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 flex-1">
                                        <h3 className={`text-sm font-medium line-clamp-2 ${video.id === currentVideo.id ? 'text-blue-600' : 'text-gray-800'}`}>
                                            {video.title}
                                        </h3>
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>{video.upload_date}</span>
                                            <span className="flex items-center">
                                                <i className="ri-eye-line mr-1"></i>
                                                {video.views.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
