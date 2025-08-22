import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Tampilkan tombol ketika scroll down lebih dari 300px
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Scroll ke atas dengan efek smooth
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className="fixed bottom-10 right-6 z-50">
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="bg-gray-600 hover:bg-gray-700 text-white w-11 h-11 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none"
                    aria-label="Scroll to top"
                >
                    <i className="ri-arrow-up-line text-xl"></i>
                </button>
            )}
        </div>
    );
};

export default ScrollToTop;