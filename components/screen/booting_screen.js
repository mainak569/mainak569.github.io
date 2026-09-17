import React, { useEffect } from 'react'

const BOOT_MS = 2000; // keep in sync with setTimeOutBootScreen in ubuntu.js

function PowerIcon() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M12 3v8" />
            <path d="M6.3 6.8a8 8 0 1 0 11.4 0" />
        </svg>
    );
}

function BootingScreen(props) {
    const { visible, isShutDown, turnOn } = props;
    const shown = visible || isShutDown;

    // Enter or Space powers the machine back on
    useEffect(() => {
        if (!isShutDown) return;
        const onKey = (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                turnOn();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isShutDown, turnOn]);

    return (
        <div
            style={{ zIndex: shown ? 100 : -20 }}
            className={(shown ? " visible opacity-100" : " invisible opacity-0 ") + " absolute duration-500 select-none top-0 right-0 overflow-hidden m-0 p-0 h-screen w-screen bg-black text-white"}
        >
            <style>{`
                @keyframes boot-progress { from { transform: scaleX(0) } to { transform: scaleX(1) } }
                @keyframes boot-pulse { 0%, 100% { opacity: .35 } 50% { opacity: 1 } }
            `}</style>

            <div className="h-full w-full flex flex-col items-center justify-center px-6">
                <img
                    width="160" height="160"
                    className="w-24 h-24 md:w-32 md:h-32"
                    src="./themes/Yaru/status/cof_orange_hex.svg" alt="Ubuntu logo"
                />

                {isShutDown ? (
                    <div className="mt-12 flex flex-col items-center">
                        <button
                            onClick={turnOn}
                            autoFocus
                            aria-label="Power on"
                            className="w-16 h-16 rounded-full flex items-center justify-center text-gray-300 border-2 border-white border-opacity-20 hover:text-white hover:border-ubb-orange hover:bg-ub-orange hover:bg-opacity-20 focus:outline-none focus:border-ubb-orange transition duration-200"
                        >
                            <PowerIcon />
                        </button>
                        <div className="mt-5 text-lg text-gray-200">Powered off</div>
                        <div className="mt-1 text-sm text-gray-500">Click the button or press Enter to start</div>
                    </div>
                ) : (
                    <div className="mt-12 flex flex-col items-center w-40 md:w-48">
                        <div className="w-full h-1 rounded-full bg-white bg-opacity-10 overflow-hidden">
                            {/* remounted on every boot so the bar restarts */}
                            {visible ? <div key={String(visible)} className="h-full w-full bg-ub-orange origin-left" style={{ animation: `boot-progress ${BOOT_MS}ms ease-in-out forwards` }} /> : null}
                        </div>
                        <div className="mt-4 text-xs tracking-widest uppercase text-gray-500 whitespace-nowrap text-center" style={{ animation: "boot-pulse 1.6s ease-in-out infinite" }}>
                            Starting Mainak's desktop
                        </div>
                    </div>
                )}
            </div>

            <div className="absolute bottom-0 inset-x-0 pb-6 flex flex-col items-center">
                <img width="140" height="40" className="w-28 md:w-32 opacity-90" src="./themes/Yaru/status/ubuntu_white_hex.svg" alt="Ubuntu" />
                <div className="mt-3 text-xs text-gray-500">
                    <a className="hover:text-white" href="https://www.linkedin.com/in/mainak13" rel="noreferrer noopener" target="_blank">linkedin</a>
                    <span className="mx-2">·</span>
                    <a className="hover:text-white" href="https://github.com/mainak569/mainak569.github.io" rel="noreferrer noopener" target="_blank">github</a>
                </div>
            </div>
        </div>
    )
}

export default BootingScreen
