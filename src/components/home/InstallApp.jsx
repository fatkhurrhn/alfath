import { useEffect, useState } from "react";

export default function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            // Mencegah Chrome auto-munculin banner default
            e.preventDefault();
            // Simpan event biar bisa dipanggil lagi
            setDeferredPrompt(e);
            setVisible(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log("User choice:", outcome);
        setDeferredPrompt(null);
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-white shadow-md p-3 rounded-lg border w-[90%] max-w-sm text-center">
            <p className="mb-2 text-gray-700 font-medium">
                📲 Install Ihsanly di perangkatmu
            </p>
            <button
                onClick={handleInstallClick}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
                Install
            </button>
        </div>
    );
}
