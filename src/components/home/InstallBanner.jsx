import { useEffect, useState } from "react";

export default function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setVisible(true);
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log("User install choice:", outcome);
        setDeferredPrompt(null);
        setVisible(false);
    };

    const handleClose = () => {
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 flex items-center justify-between animate-slide-up z-50">
            <div className="flex flex-col">
                <span className="text-gray-800 font-semibold text-base">📲 Install Ihsanly</span>
                <span className="text-gray-500 text-sm">Dapatkan pengalaman lebih cepat di aplikasi</span>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={handleClose}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600"
                >
                    Nanti
                </button>
                <button
                    onClick={handleInstall}
                    className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                    Install
                </button>
            </div>
        </div>
    );
}
