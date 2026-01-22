import { useState, useEffect } from "react";
import { myQuotesCollection } from "../../firebase";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { Link } from "react-router-dom";

const QuotesAdd = () => {
    const [quote, setQuote] = useState("");
    const [author, setAuthor] = useState("");
    const [category, setCategory] = useState("motivation");
    const [isLoading, setIsLoading] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    // 🔹 Header scroll hide
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setShowHeader(currentScrollY < lastScrollY);
            setLastScrollY(currentScrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    // 🔹 Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await addDoc(myQuotesCollection, {
                text: quote,
                author: author,
                category: category,
                status: "approved",
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                likes: 0,
                views: 0,
            });

            setShowNotification("success");

            setQuote("");
            setAuthor("");
            setCategory("motivation");

            setTimeout(() => setShowNotification(false), 3000);
        } catch (error) {
            console.error("Error adding quote: ", error);
            setShowNotification("error");
            setTimeout(() => setShowNotification(false), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            {/* 🔹 Notifikasi */}
            {showNotification && (
                <div
                    className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center space-x-2 transition-all duration-300 ${showNotification === "error"
                            ? "bg-red-100 text-red-700 border-l-4 border-red-500"
                            : "bg-green-100 text-green-700 border-l-4 border-green-500"
                        }`}
                >
                    {showNotification === "error" ? (
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

            {/* 🔹 Header */}
            <div
                className={`fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-200 transition-transform duration-300 ${showHeader ? "translate-y-0" : "-translate-y-full"
                    }`}
            >
                <div className="max-w-xl mx-auto flex items-center justify-between px-3 py-3">
                    <Link
                        to="/quotes"
                        className="flex items-center font-semibold gap-2 text-[#355485] text-[15px]"
                    >
                        <i className="ri-arrow-left-line"></i> Tambah Quote
                    </Link>
                    <Link to="/settings">
                        <button className="text-[#355485]">
                            <i className="ri-settings-5-line text-xl"></i>
                        </button>
                    </Link>
                </div>
            </div>

            {/* 🔹 Form */}
            <div className="max-w-xl mx-auto px-3 border-x border-gray-200 pt-[70px] pb-10">
                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Quote */}
                    <textarea
                        placeholder="Tulis quotenya di sini..."
                        id="quote"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-gray-800 focus:ring-2 focus:ring-[#4f90c6] focus:border-[#4f90c6] transition"
                        value={quote}
                        onChange={(e) => setQuote(e.target.value)}
                        required
                    />

                    {/* Author */}
                    <input
                        placeholder="Tanpa '@'"
                        type="text"
                        id="author"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-[#4f90c6] focus:border-[#4f90c6] transition"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    />

                    {/* Category */}
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
