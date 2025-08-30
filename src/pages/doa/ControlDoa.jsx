import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

/* ---------- Helpers ---------- */
const timeAgo = (date) => {
    if (!date) return "";
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return `${seconds} detik lalu`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    return `${Math.floor(hours / 24)} hari lalu`;
};

/* ---------- Main ---------- */
export default function ControlDoa() {
    const [doaList, setDoaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoa, setSelectedDoa] = useState(null); // untuk modal konfirmasi
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "doa"), (snapshot) => {
            const data = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
                createdAt: d.data().createdAt?.toDate(),
            }));
            setDoaList(data);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const confirmDelete = (doa) => {
        setSelectedDoa(doa);
    };

    const handleDelete = async () => {
        if (!selectedDoa) return;
        setDeleting(true);
        try {
            await deleteDoc(doc(db, "doa", selectedDoa.id));
            setSelectedDoa(null);
        } catch (err) {
            console.error("Error hapus doa:", err);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="min-h-screen pb-16 bg-gray-50">
            {/* Container */}
            <div className="max-w-xl mx-auto px-4 border-x border-gray-200 pt-6">
                <Link to="/doa">
                    <h2 className="font-bold text-xl text-center text-[#355485] mb-4">
                        Control Doa
                    </h2>
                </Link>
                <hr />

                {/* Loading */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <i className="ri-loader-2-line text-2xl animate-spin mb-2"></i>
                        <p className="text-sm">Memuat semua doa...</p>
                    </div>
                ) : doaList.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {doaList.map((doa) => (
                            <div
                                key={doa.id}
                                className="flex justify-between items-start py-4 px-3"
                            >
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {doa.nama || "Anonim"}
                                    </p>
                                    <p className="text-xs text-gray-500 mb-1">
                                        {timeAgo(doa.createdAt)}
                                    </p>
                                    <p className="text-sm text-justify text-gray-700">{doa.doa}</p>
                                </div>
                                <button
                                    onClick={() => confirmDelete(doa)}
                                    className="text-red-500 hover:text-red-700 ml-3"
                                >
                                    <i className="ri-delete-bin-5-line text-lg"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 py-10">Belum ada doa</p>
                )}
            </div>

            {/* Modal Konfirmasi */}
            {selectedDoa && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setSelectedDoa(null)}
                    />

                    {/* Modal box */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-fadeIn">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Hapus Doa
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Yakin ingin menghapus doa dari{" "}
                                <span className="font-semibold">
                                    {selectedDoa.nama || "Anonim"}
                                </span>
                                ?
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setSelectedDoa(null)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-70"
                                >
                                    {deleting ? (
                                        <i className="ri-loader-2-line animate-spin"></i>
                                    ) : (
                                        "Hapus"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
