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

/* ---------- Generate Image Quote ---------- */
const generateQuoteImage = async (quote, author, category) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // ukuran square
    canvas.width = 1080;
    canvas.height = 1080;

    // background putih
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#333";
    ctx.textAlign = "center";

    // Author di atas
    ctx.font = "bold 42px Arial";
    ctx.fillText(`— ${author} —`, canvas.width / 2, 120);

    // Quote di tengah (wrap + center vertical)
    ctx.font = "bold 58px Georgia";
    const wrapped = wrapText(ctx, `"${quote}"`, 900);
    const textHeight = wrapped.length * 70;
    const startY = canvas.height / 2 - textHeight / 2;

    wrapped.forEach((line, i) => {
        ctx.fillText(line, canvas.width / 2, startY + i * 70);
    });

    // Category (atas watermark)
    ctx.font = "italic 38px Arial";
    ctx.fillText(`#${category}`, canvas.width / 2, canvas.height - 140);

    // Watermark bawah
    ctx.font = "30px Arial";
    ctx.fillStyle = "#777";
    ctx.fillText("selengkapnya ... http://alfathh.vercel.app/", canvas.width / 2, canvas.height - 70);

    return canvas.toDataURL("image/png");
};

// helper wrapText → return array line
function wrapText(ctx, text, maxWidth) {
    const words = text.split(" ");
    let line = "";
    const lines = [];
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + " ";
        } else {
            line = testLine;
        }
    }
    lines.push(line);
    return lines;
}


/* ---------- Main Component ---------- */
export default function QuotesList() {
    const [quotes, setQuotes] = useState([]);
    const [filteredQuotes, setFilteredQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const [quoteStates, setQuoteStates] = useState({}); // state per-quote

    // fetch quotes
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

    // share handler → generate image
    const handleShare = async (q) => {
        const dataUrl = await generateQuoteImage(q.text, q.author, getCategoryLabel(q.category));

        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], "quote.png", { type: "image/png" });

        if (navigator.share && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: "Quote Islami",
                text: `"${q.text}" — ${q.author}`,
            });
        } else {
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = "quote.png";
            link.click();
        }
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
                <div className="p-2 mb-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Cari quote atau author..."
                                className="w-full p-3 pl-10 rounded-lg border border-gray-300 bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <i className="ri-search-line absolute left-3 top-3.5 text-gray-400"></i>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                >
                                    <i className="ri-close-line"></i>
                                </button>
                            )}
                        </div>

                        <select
                            className="w-full p-3 rounded-lg border border-gray-300 bg-white"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">Semua Kategori</option>
                            <option value="motivation">Motivasi</option>
                            <option value="life">Reminder</option>
                            <option value="love">Cinta</option>
                            <option value="funny">Lucu</option>
                            <option value="other">Lainnya</option>
                        </select>
                    </div>

                    <div className="text-sm text-gray-500 mb-2">{getDisplayMessage()}</div>
                </div>

                {/* Quotes */}
                {loading ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center animate-pulse">
                        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    </div>
                ) : (
                    <div className="overflow-hidden">
                        {filteredQuotes.length > 0 ? (
                            filteredQuotes.map((q) => {
                                const state = quoteStates[q.id] || {};
                                return (
                                    <div
                                        key={q.id}
                                        className="relative flex gap-4 px-1 border-b mb-3 border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Avatar */}
                                        <div className="flex-shrink-0 mr-[-4px]">
                                            <img
                                                src="https://cdn-icons-png.freepik.com/512/7718/7718888.png"
                                                alt="Profile"
                                                className="w-11 h-11 rounded-full object-cover"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-[14px] font-semibold text-gray-800 leading-tight mb-[-5px]">
                                                        {highlightText(q.author, searchTerm)}
                                                    </p>
                                                    <span className="text-[12px] text-gray-500">
                                                        #{getCategoryLabel(q.category)}
                                                    </span>
                                                </div>
                                                <button className="text-gray-400 hover:text-gray-600">
                                                    <i className="ri-more-line text-[18px]"></i>
                                                </button>
                                            </div>

                                            <p
                                                className="text-gray-800 mr-1 text-[15px] leading-relaxed cursor-pointer"
                                                onClick={() => handleCopy(q.id, q.text, q.author)}
                                            >
                                                "{highlightText(q.text, searchTerm)}"
                                            </p>

                                            <div className="flex items-center justify-between mt-1 mb-2">
                                                <div className="flex items-center gap-2 text-gray-500 text-[14px]">
                                                    {/* Like */}
                                                    <button
                                                        onClick={() => handleLike(q.id)}
                                                        disabled={state.isLiking}
                                                        className="flex items-center gap-1 group hover:text-red-500"
                                                    >
                                                        <i
                                                            className={`ri-heart-${state.isLiked ? "fill" : "line"} ${state.isLiked ? "text-red-500" : ""
                                                                }`}
                                                        ></i>
                                                        <span className="text-xs">{state.likesCount}</span>
                                                    </button>

                                                    {/* Copy */}
                                                    <button
                                                        onClick={() => handleCopy(q.id, q.text, q.author)}
                                                        className="hover:text-gray-700"
                                                    >
                                                        <i className="ri-clipboard-line"></i>
                                                    </button>

                                                    {/* Share → generate image */}
                                                    <button
                                                        onClick={() => handleShare(q)}
                                                        className="hover:text-gray-700"
                                                    >
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
        </div>
    );
}
