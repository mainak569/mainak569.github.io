import React from 'react';
import $ from 'jquery';
import { ACCENTS, applyAccent, savedAccent, DEFAULT_ACCENT } from '../util components/accent';

export function Settings(props) {
    const wallpapers = {
        "jammy-jellyfish": "./images/wallpapers/jammy-jellyfish.webp",
        "jammy-jellyfish-grey": "./images/wallpapers/jammy-jellyfish-grey.webp",
        "wall-1": "./images/wallpapers/wall-1.webp",
        "wall-2": "./images/wallpapers/wall-2.webp",
        "wall-3": "./images/wallpapers/wall-3.webp",
        "wall-4": "./images/wallpapers/wall-4.webp",
        "wall-5": "./images/wallpapers/wall-5.webp",
        "wall-6": "./images/wallpapers/wall-6.webp",
        "wall-7": "./images/wallpapers/wall-7.webp",
        "wall-8": "./images/wallpapers/wall-8.webp",
    };

    let changeBackgroundImage = (e) => {
        props.changeBackgroundImage($(e.target).data("path"));
    }

    const [tab, setTab] = React.useState("appearance");
    const [client, setClient] = React.useState({});
    const [accent, setAccent] = React.useState(DEFAULT_ACCENT);

    React.useEffect(() => setAccent(savedAccent()), []);

    const chooseAccent = (name) => {
        setAccent(name);
        applyAccent(name);
        try { localStorage.setItem("accent-color", name); } catch (e) { }
    };

    const resetDesktop = () => {
        // everything the desktop remembers, except whether the boot animation was already seen
        ["bg-image", "accent-color", "brightness-level", "new_folders", "terminal-theme", "trash-empty", "frequentApps", "about-section", "screen-locked", "shut-down"]
            .forEach(key => { try { localStorage.removeItem(key); } catch (e) { } });
        window.location.reload();
    };

    React.useEffect(() => {
        const ua = navigator.userAgent;
        const browser = /Edg\//.test(ua) ? "Microsoft Edge" : /OPR\//.test(ua) ? "Opera" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "Unknown";
        setClient({
            browser,
            display: `${window.screen.width} × ${window.screen.height}` + (window.devicePixelRatio > 1 ? ` @${+window.devicePixelRatio.toFixed(2)}x` : ""),
            cores: navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} threads` : null,
        });
    }, []);

    const tabs = [["appearance", "Appearance"], ["about", "About"]];

    return (
        <div className="w-full flex flex-grow min-h-0 z-20 select-none bg-ub-cool-grey text-white">
            <div className="flex flex-col w-28 sm:w-44 md:w-52 flex-shrink-0 bg-ub-grey border-r border-black py-2 text-sm md:text-base">
                {tabs.map(([id, label]) => (
                    <button key={id} onClick={() => setTab(id)} className={"text-left px-3 md:px-4 py-2.5 focus:outline-none " + (tab === id ? "bg-ub-orange" : "hover:bg-white hover:bg-opacity-5")}>{label}</button>
                ))}
            </div>
            <div className="flex-grow min-w-0 overflow-y-auto windowMainScreen">
                {tab === "appearance" ? (
                    <>
                        <div className=" md:w-2/5 w-2/3 h-1/3 m-auto my-4" style={{ backgroundImage: `url(${wallpapers[props.currBgImgName]})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center center" }}>
                        </div>
                        <div className="flex flex-wrap justify-center items-center border-t border-gray-900">
                            {
                                Object.keys(wallpapers).map((name, index) => {
                                    return (
                                        <div key={index} tabIndex="1" onFocus={changeBackgroundImage} data-path={name} className={((name === props.currBgImgName) ? " border-ubb-orange " : " border-transparent ") + " md:px-28 md:py-20 md:m-4 m-2 px-14 py-10 outline-none border-4 border-opacity-80"} style={{ backgroundImage: `url(${wallpapers[name]})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center center" }}></div>
                                    );
                                })
                            }
                        </div>
                        <div className="px-4 md:px-8 pt-6 pb-10 border-t border-gray-900">
                            <div className="text-xs tracking-widest uppercase text-gray-400 mb-3">Accent colour</div>
                            <div className="flex flex-wrap gap-3 md:gap-4">
                                {Object.entries(ACCENTS).map(([name, rgb]) => (
                                    <button key={name} onClick={() => chooseAccent(name)} title={name} aria-label={`${name} accent`}
                                        className={"w-10 h-10 md:w-12 md:h-12 rounded-full focus:outline-none transition-transform hover:scale-105 " + (accent === name ? "ring-2 ring-white ring-offset-2 ring-offset-gray-800" : "")}
                                        style={{ background: `rgb(${rgb})` }}></button>
                                ))}
                            </div>
                            <button onClick={resetDesktop} className="mt-6 px-4 py-2 rounded bg-black bg-opacity-50 border border-black hover:bg-opacity-80 focus:outline-none">
                                Reset desktop to defaults
                            </button>
                        </div>
                    </>
                ) : (
                    <About client={client} />
                )}
            </div>
        </div>
    )
}

function About({ client }) {
    const ext = (href, label) => <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="hover:underline select-text">{label}</a>;
    const rows = [
        ["Device name", "mainak-desktop"],
        ["OS", "Ubuntu 22.04 LTS (in a browser)"],
        ["Windowing system", "Next.js 14 + React 18"],
        ["Owner", "Mainak Das"],
        ["Institution", "LNMIIT — B.Tech CCE"],
        ["Location", "Jaipur, India"],
        ["Contact", ext("mailto:mainak.lnmiit@gmail.com", "mainak.lnmiit@gmail.com")],
        ["Source", ext("https://github.com/mainak569/mainak569.github.io", "github.com/mainak569/mainak569.github.io")],
        ["Browser", client.browser],
        ["Display", client.display],
        ["Processor", client.cores],
    ].filter(([, value]) => value);

    return (
        <div className="flex flex-col items-center px-4 py-8 md:py-10">
            <img className="w-20 h-20 md:w-24 md:h-24" src="./themes/Yaru/status/cof_orange_hex.svg" alt="Ubuntu" />
            <div className="mt-3 text-lg font-medium">Ubuntu 22.04 LTS</div>
            <div className="w-full max-w-xl mt-6 md:mt-8">
                {rows.map(([label, value], i) => (
                    <div key={label} className={"flex justify-between items-baseline gap-4 py-2.5 text-sm md:text-base " + (i ? "border-t border-white border-opacity-10" : "")}>
                        <span className="text-gray-400 flex-shrink-0">{label}</span>
                        <span className="text-right break-all">{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Settings


export const displaySettings = () => {
    return <Settings> </Settings>;
}
