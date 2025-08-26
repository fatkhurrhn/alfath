import { useEffect, useState } from "react";

export default function InstallBanner() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);

            const isStandalone =
                window.matchMedia("(display-mode: standalone)").matches ||
                window.navigator.standalone;

            if (!isStandalone) setVisible(true);
        };

        window.addEventListener("beforeinstallprompt", handler);
        window.addEventListener("appinstalled", () => setVisible(false));

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log("User install choice:", outcome);
        setDeferredPrompt(null);
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="mb-4 rounded-2xl border border-gray-200 bg-gradient-to-r from-green-500 to-emerald-600 p-4 shadow-md text-white">
            <div className="flex items-center justify-between">
                {/* Icon + Text */}
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 rounded-xl p-2">
                        <span className="text-2xl">📲</span>
                    </div>
                    <div>
                        <p className="font-bold text-base">Install Ihsanly</p>
                        <p className="text-sm text-white/90">
                            Rasakan pengalaman lebih cepat dengan aplikasi
                        </p>
                    </div>
                </div>

                {/* Button */}
                <button
                    onClick={handleInstall}
                    className="ml-4 px-4 py-2 rounded-lg bg-white text-green-700 font-semibold text-sm shadow hover:bg-gray-100"
                >
                    Install
                </button>
            </div>
        </div>
    );
}
