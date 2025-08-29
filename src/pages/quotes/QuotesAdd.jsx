import { useState } from 'react';
import { myQuotesCollection } from '../../firebase';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const QuotesAdd = () => {
    const [quote, setQuote] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('motivation');
    const [isLoading, setIsLoading] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await addDoc(myQuotesCollection, {
                text: quote,
                author: author,
                category: category,
                status: 'approved',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                likes: 0,
                views: 0
            });

            // Tampilkan notifikasi sukses
            setShowNotification(true);

            // Reset form
            setQuote('');
            setAuthor('');
            setCategory('motivation');

            // Sembunyikan notifikasi setelah 3 detik
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
        } catch (error) {
            console.error("Error adding quote: ", error);

            // Tampilkan notifikasi error
            setShowNotification('error');
            setTimeout(() => {
                setShowNotification(false);
            }, 3000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen text-gray-800 flex items-center justify-center p-4">
            {/* Notifikasi */}
            {showNotification && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-300 ${showNotification === 'error' ? 'bg-red-100 text-red-700 border-l-4 border-red-500' : 'bg-green-100 text-green-700 border-l-4 border-green-500'}`}>
                    {showNotification === 'error' ? (
                        <>
                            <i className="ri-error-warning-line text-xl"></i>
                            <span>Terjadi kesalahan saat menambahkan quote</span>
                        </>
                    ) : (
                        <>
                            <i className="ri-checkbox-circle-line text-xl"></i>
                            <span>Quote berhasil ditambahkan!</span>
                        </>
                    )}
                </div>
            )}


            <div className="max-w-md w-full p-4">
                {/* Logo */}
                <Link to="/quotes">
                    <div className="flex flex-col items-center mb-6">
                        <img
                            src="/img/logo-x.png"
                            alt="Logo"
                            className="w-[140px] mx-auto -mt-20" // 👉 agak naik ke atas
                        />
                        <hr className="mt-4 w-full border-gray-200" />
                    </div>
                </Link>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Quote */}
                    <div>
                        <textarea
                            placeholder="Tulis quotenya di sini..."
                            id="quote"
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-gray-800 focus:ring-2 focus:ring-[#4f90c6] focus:border-[#4f90c6] transition"
                            value={quote}
                            onChange={(e) => setQuote(e.target.value)}
                            required
                        />
                    </div>

                    {/* Author */}
                    <div>
                        <input
                            placeholder="Tanpa '@'"
                            type="text"
                            id="author"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#4f90c6] focus:border-[#4f90c6] transition"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <select
                            id="category"
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#4f90c6] focus:border-[#4f90c6] transition"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="motivation">Motivasi</option>
                            <option value="life">Reminder</option>
                            <option value="love">Cinta</option>
                            <option value="funny">Lucu</option>
                            <option value="other">Lainnya</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full px-4 py-3 bg-[#355485] text-white rounded-xl font-medium flex items-center justify-center disabled:opacity-70 hover:bg-[#2a436c] transition"
                    >
                        {isLoading ? (
                            <>
                                <i className="ri-loader-4-line animate-spin mr-2"></i>
                                Menambahkan...
                            </>
                        ) : (
                            "Tambah Quote"
                        )}
                    </button>
                </form>
            </div>

        </div>
    );
};

export default QuotesAdd;