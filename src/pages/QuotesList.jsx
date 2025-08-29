import { useState, useEffect } from "react";
import { myQuotesCollection } from "../firebase";
import { getDocs, query, orderBy, doc, updateDoc, increment } from "firebase/firestore";

/* ---------- Helpers ---------- */
const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    return text.split(regex).map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200">{part}</mark>
        ) : (
            part
        )
    );
};

const getCategoryLabel = (cat) => {
    switch (cat) {
        case "motivation": return "motivasi";
        case "life":
        case "wisdom": return "reminder";
        case "love": return "cinta";
        case "funny": return "lucu";
        default: return "lainnya";
    }
};

/* ---------- Main Component ---------- */
export default function QuotesList() {
    const [quotes, setQuotes] = useState([]);
    const [filteredQuotes, setFilteredQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const [quoteStates, setQuoteStates] = useState({});
    const [shareQuote, setShareQuote] = useState(null); // 👉 state buat bottom sheet

    // fetch quotes dari firestore
    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const q = query(myQuotesCollection, orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                const approved = data.filter((q) => q.status === "approved");
                setQuotes(approved);
                setFilteredQuotes(approved);

                const initState = {};
                approved.forEach((q) => {
                    initState[q.id] = {
                        copied: false,
                        isLiked: false,
                        likesCount: q.likes || 0,
                        isLiking: false,
                    };
                });
                setQuoteStates(initState);
            } catch (err) {
                console.error("Error fetch quotes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuotes();
    }, []);

    // filter search + kategori
    useEffect(() => {
        let filtered = [...quotes];
        if (searchTerm.trim()) {
            filtered = filtered.filter(
                (q) =>
                    q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    q.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedCategory !== "all") {
            filtered = filtered.filter((q) => q.category === selectedCategory);
        }
        setFilteredQuotes(filtered);
    }, [searchTerm, selectedCategory, quotes]);

    // like handler
    const handleLike = async (id) => {
        setQuoteStates((prev) => ({
            ...prev,
            [id]: { ...prev[id], isLiking: true, isLiked: true, likesCount: prev[id].likesCount + 1 }
        }));

        try {
            const ref = doc(myQuotesCollection, id);
            await updateDoc(ref, { likes: increment(1) });
        } catch (err) {
            console.error("Error like:", err);
            setQuoteStates((prev) => ({
                ...prev,
                [id]: { ...prev[id], isLiked: false, likesCount: prev[id].likesCount - 1 }
            }));
        } finally {
            setQuoteStates((prev) => ({
                ...prev,
                [id]: { ...prev[id], isLiking: false }
            }));
        }
    };

    // copy handler
    const handleCopy = (id, text, author) => {
        navigator.clipboard.writeText(`${text} — ${author}`);
        setQuoteStates((prev) => ({
            ...prev,
            [id]: { ...prev[id], copied: true }
        }));
        setTimeout(() => {
            setQuoteStates((prev) => ({
                ...prev,
                [id]: { ...prev[id], copied: false }
            }));
        }, 1500);
    };

    // share handler
    const handleShare = (quote) => {
        setShareQuote(quote);
    };

    const shareTo = (platform) => {
        if (!shareQuote) return;
        const text = `"${shareQuote.text}" — ${shareQuote.author} #${getCategoryLabel(shareQuote.category)}`;

        if (platform === "whatsapp") {
            const url = /Android|iPhone/i.test(navigator.userAgent)
                ? `https://wa.me/?text=${encodeURIComponent(text)}`
                : `https://web.whatsapp.com/send?text=${encodeURIComponent(text)}`;
            window.open(url, "_blank");
        }

        if (platform === "telegram") {
            window.open(`https://t.me/share/url?url=${encodeURIComponent(text)}`, "_blank");
        }
        if (platform === "instagram") {
            navigator.clipboard.writeText(text);
            alert("Teks disalin ke clipboard. Paste manual di Instagram!");
        }
        setShareQuote(null);
    };

    const getDisplayMessage = () => {
        if (loading) return "Memuat quotes...";
        if ((searchTerm || selectedCategory !== "all") && filteredQuotes.length === 0) {
            return "Tidak ada quote yang ditemukan";
        }
        if (searchTerm || selectedCategory !== "all") {
            return `Menampilkan ${filteredQuotes.length} dari ${quotes.length} quotes`;
        }
        return `Total ${quotes.length} quotes tersedia`;
    };

    return (
        <div className="bg-gray-50 min-h-screen text-gray-800">
            <div className="max-w-4xl mx-auto px-4 pt-4 pb-10">

                {/* Search & Filter */}
                {/* ... (biarin sama seperti punyamu) */}

                {/* Quotes */}
                {!loading && (
                    <div className="overflow-hidden">
                        {filteredQuotes.length > 0 ? (
                            filteredQuotes.map((q) => {
                                const state = quoteStates[q.id] || {};
                                return (
                                    <div key={q.id} className="relative flex gap-4 px-1 border-b mb-3 border-gray-200 hover:bg-gray-50">
                                        {/* Avatar */}
                                        <div className="flex-shrink-0">
                                            <img src="https://cdn-icons-png.freepik.com/512/7718/7718888.png" className="w-11 h-11 rounded-full" />
                                        </div>

                                        {/* Main */}
                                        <div className="flex-1">
                                            {/* Header */}
                                            <div className="flex justify-between">
                                                <div>
                                                    <p className="text-[14px] font-semibold">{highlightText(q.author, searchTerm)}</p>
                                                    <span className="text-[12px] text-gray-500">#{getCategoryLabel(q.category)}</span>
                                                </div>
                                                <button className="text-gray-400 hover:text-gray-600">
                                                    <i className="ri-more-line text-[18px]"></i>
                                                </button>
                                            </div>

                                            {/* Quote */}
                                            <p
                                                className="text-gray-800 text-[15px] leading-relaxed cursor-pointer"
                                                onClick={() => handleCopy(q.id, q.text, q.author)}
                                            >
                                                "{highlightText(q.text, searchTerm)}"
                                            </p>

                                            {/* Actions */}
                                            <div className="flex items-center justify-between mt-1 mb-2">
                                                <div className="flex items-center gap-2 text-gray-500 text-[14px]">
                                                    {/* like */}
                                                    <button onClick={() => handleLike(q.id)} className="hover:text-red-500 flex items-center gap-1">
                                                        <i className={`ri-heart-${state.isLiked ? "fill text-red-500" : "line"}`}></i>
                                                        <span className="text-xs">{state.likesCount}</span>
                                                    </button>

                                                    {/* copy */}
                                                    <button onClick={() => handleCopy(q.id, q.text, q.author)} className="hover:text-gray-700">
                                                        <i className="ri-clipboard-line"></i>
                                                    </button>

                                                    {/* share */}
                                                    <button onClick={() => handleShare(q)} className="hover:text-gray-700">
                                                        <i className="ri-share-line"></i>
                                                    </button>
                                                </div>

                                                {state.copied && (
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                                        Berhasil Disalin!
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center text-gray-500">Tidak ada quote</div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Sheet Share */}
            {shareQuote && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={() => setShareQuote(null)} />
                    <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl shadow-xl p-5 max-w-xl mx-auto">
                        <h3 className="font-semibold text-gray-800 mb-4">Bagikan ke</h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <button onClick={() => shareTo("whatsapp")} className="flex flex-col items-center">
                                <i className="ri-whatsapp-line text-green-500 text-2xl"></i>
                                <span className="text-xs mt-1">WhatsApp</span>
                            </button>
                            <button onClick={() => shareTo("telegram")} className="flex flex-col items-center">
                                <i className="ri-telegram-line text-sky-500 text-2xl"></i>
                                <span className="text-xs mt-1">Telegram</span>
                            </button>
                            <button onClick={() => shareTo("instagram")} className="flex flex-col items-center">
                                <i className="ri-instagram-line text-pink-500 text-2xl"></i>
                                <span className="text-xs mt-1">Instagram</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
