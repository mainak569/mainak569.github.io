import React, { Component } from 'react';
import { EMAIL, RESUME, PROJECTS, SOCIAL } from '../apps/portfolio-data';

export const isMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
export const modKey = () => (isMac() ? "⌘" : "Ctrl+");

// subsequence match: every query char appears in order; tighter & earlier matches score higher
const score = (text, query) => {
    if (!query) return 1;
    const t = text.toLowerCase();
    const q = query.toLowerCase();
    const direct = t.indexOf(q);
    if (direct !== -1) return 1000 - direct * 2 - (t.length - q.length) * 0.1 + (direct === 0 || t[direct - 1] === " " ? 200 : 0);
    let ti = 0, gaps = 0, last = -1;
    for (const ch of q) {
        const found = t.indexOf(ch, ti);
        if (found === -1) return 0;
        if (last !== -1) gaps += found - last - 1;
        last = found;
        ti = found + 1;
    }
    return Math.max(1, 500 - gaps * 10);
};

const LINK_ICONS = {
    GitHub: "./themes/Yaru/apps/github.png",
    LinkedIn: "./themes/Yaru/apps/linkedin.svg",
    LeetCode: "./themes/Yaru/apps/leetcode.svg",
    CodeChef: "./themes/Yaru/apps/codechef.svg",
    Codeforces: "./themes/Yaru/apps/codeforces.svg",
    GeeksforGeeks: "./themes/Yaru/apps/geeksforgeeks.svg",
};

const KIND_ORDER = { app: 0, project: 1, link: 2, action: 3 };

export class CommandPalette extends Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.listRef = React.createRef();
        this.state = { query: "", active: 0 };
    }

    componentDidMount() {
        if (this.inputRef.current) this.inputRef.current.focus({ preventScroll: true });
    }

    items = () => {
        const { apps, openApp, actions } = this.props;
        const appItems = apps
            .filter(app => !app.disabled && !app.id.startsWith("new-folder-"))
            .map(app => ({
                id: `app-${app.id}`, kind: "app", title: app.title, icon: app.icon,
                run: () => (app.isExternalApp && app.url ? window.open(app.url, "_blank", "noopener") : openApp(app.id)),
            }));
        const projectItems = PROJECTS.map(p => ({
            id: `project-${p.name}`, kind: "project", title: p.name, subtitle: p.tagline, keywords: p.stack, icon: "./themes/Yaru/system/folder.png",
            run: () => window.open(p.demo || p.github, "_blank", "noopener"),
        }));
        // GitHub, LinkedIn and LeetCode are already desktop apps, so skip their duplicate link rows
        const appTitles = new Set(appItems.map(item => item.title.toLowerCase()));
        const linkItems = SOCIAL.filter(([name]) => !appTitles.has(name.toLowerCase())).map(([name, href, label]) => ({
            id: `link-${name}`, kind: "link", title: name, subtitle: label, icon: LINK_ICONS[name] || "./themes/Yaru/status/external-link.svg",
            run: () => window.open(href, "_blank", "noopener"),
        }));
        const actionItems = [
            { id: "a-email", title: "Email Mainak", subtitle: EMAIL, icon: "./themes/Yaru/apps/gedit.png", run: () => openApp("gedit") },
            { id: "a-copy", title: "Copy email address", subtitle: EMAIL, icon: "./themes/Yaru/status/contact.svg", run: () => navigator.clipboard && navigator.clipboard.writeText(EMAIL).then(() => actions.notify("Copied", `${EMAIL} is on your clipboard.`)) },
            { id: "a-resume", title: "Download résumé", subtitle: "PDF", icon: "./themes/filetypes/pdf.svg", run: () => { const a = document.createElement("a"); a.href = RESUME; a.download = "Mainak-Das-Resume.pdf"; a.click(); } },
            { id: "a-wallpaper", title: "Change wallpaper", icon: "./themes/Yaru/apps/gnome-control-center.png", run: () => openApp("settings") },
            { id: "a-apps", title: "Show all applications", icon: "./themes/Yaru/system/view-app-grid-symbolic.svg", run: actions.showApps },
            { id: "a-shortcuts", title: "Keyboard shortcuts", subtitle: "?", icon: "./themes/Yaru/status/emblem-system-symbolic.svg", run: actions.showShortcuts },
            { id: "a-lock", title: "Lock screen", icon: "./themes/Yaru/status/changes-prevent-symbolic.svg", run: () => window.dispatchEvent(new CustomEvent("lock-screen")) },
        ].map(a => ({ ...a, kind: "action" }));
        return [...appItems, ...projectItems, ...linkItems, ...actionItems];
    }

    results = () => {
        const { query } = this.state;
        return this.items()
            // titles match fuzzily; subtitles and keywords only on a direct substring
            .map(item => ({ item, s: Math.max(score(item.title, query), `${item.subtitle || ""} ${item.keywords || ""}`.toLowerCase().includes(query.toLowerCase()) ? 300 : 0) }))
            .filter(r => r.s > 0)
            .sort((a, b) => (query ? b.s - a.s : 0) || KIND_ORDER[a.item.kind] - KIND_ORDER[b.item.kind])
            .map(r => r.item);
    }

    choose = (item) => {
        this.props.close();
        if (item) item.run();
    }

    scrollActiveIntoView = () => {
        const list = this.listRef.current;
        const el = list && list.children[this.state.active];
        if (!el) return;
        if (el.offsetTop < list.scrollTop) list.scrollTop = el.offsetTop;
        else if (el.offsetTop + el.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = el.offsetTop + el.offsetHeight - list.clientHeight;
    }

    handleKeyDown = (e, results) => {
        if (e.key === "ArrowDown" || (e.ctrlKey && e.key === "n")) {
            e.preventDefault();
            this.setState(prev => ({ active: (prev.active + 1) % Math.max(1, results.length) }), this.scrollActiveIntoView);
        } else if (e.key === "ArrowUp" || (e.ctrlKey && e.key === "p")) {
            e.preventDefault();
            this.setState(prev => ({ active: (prev.active - 1 + results.length) % Math.max(1, results.length) }), this.scrollActiveIntoView);
        } else if (e.key === "Enter") {
            e.preventDefault();
            this.choose(results[this.state.active]);
        } else if (e.key === "Escape") {
            e.preventDefault();
            this.props.close();
        }
    }

    render() {
        const results = this.results();
        const active = Math.min(this.state.active, results.length - 1);
        return (
            <div className="fixed inset-0 flex justify-center items-start px-3 pt-16 md:pt-24 bg-black bg-opacity-30" style={{ zIndex: 60 }}
                onMouseDown={e => { if (e.target === e.currentTarget) this.props.close(); }}>
                <div className="w-full max-w-2xl rounded-xl bg-ub-cool-grey border border-black border-opacity-60 shadow-2xl overflow-hidden text-white" role="dialog" aria-label="Search">
                    <div className="flex items-center px-4 py-3 border-b border-black border-opacity-50">
                        <img className="w-4 h-4 mr-3 opacity-60" src="./images/logos/search.png" alt="" style={{ filter: "invert(1)" }} />
                        <input
                            ref={this.inputRef}
                            value={this.state.query}
                            onChange={e => this.setState({ query: e.target.value, active: 0 })}
                            onKeyDown={e => this.handleKeyDown(e, results)}
                            placeholder="Search apps, projects, links and actions…"
                            className="flex-grow min-w-0 bg-transparent outline-none text-base md:text-lg placeholder-gray-400"
                            spellCheck={false}
                            autoComplete="off"
                            aria-label="Search"
                        />
                        <kbd className="ml-3 text-xs px-2 py-0.5 rounded border border-white border-opacity-20 text-gray-300 cursor-pointer" onClick={this.props.close}>esc</kbd>
                    </div>
                    <div ref={this.listRef} className="max-h-96 overflow-y-auto relative">
                        {results.length ? results.map((item, i) => (
                            <div
                                key={item.id}
                                onMouseMove={() => i !== active && this.setState({ active: i })}
                                onClick={() => this.choose(item)}
                                className={"flex items-center px-4 py-2.5 cursor-default " + (i === active ? "bg-ub-orange" : "")}
                            >
                                <img className="w-7 h-7 mr-3 flex-shrink-0 object-contain" src={item.icon} alt="" />
                                <div className="min-w-0 flex-grow">
                                    <span className="truncate">{item.title}</span>
                                    {item.subtitle ? <span className={"ml-2 text-sm truncate " + (i === active ? "text-white text-opacity-80" : "text-gray-400")}>{item.subtitle}</span> : null}
                                </div>
                                <span className={"ml-3 text-sm flex-shrink-0 " + (i === active ? "text-white" : "text-gray-400")}>{item.kind}</span>
                            </div>
                        )) : <div className="px-4 py-6 text-center text-gray-400">No results for “{this.state.query}”</div>}
                    </div>
                </div>
            </div>
        );
    }
}

const SHORTCUTS = [
    ["Desktop", [
        [`${modKey()}K`, "Search apps, projects and actions"],
        ["?", "Show this sheet"],
        ["Esc", "Close search, menus and this sheet"],
    ]],
    ["Terminal", [
        ["Tab", "Autocomplete commands and paths"],
        ["↑ / ↓", "Walk through history"],
        ["→", "Accept the grey suggestion"],
        ["Ctrl+L", "Clear the screen"],
        ["Ctrl+U / Ctrl+C", "Clear / cancel the line"],
    ]],
    ["Files", [
        ["Enter", "Open selected item"],
        ["Backspace / Alt+←", "Go back"],
        ["Alt+↑", "Parent folder"],
        ["Ctrl+H", "Toggle hidden files"],
    ]],
    ["Calendar", [
        ["← / →", "Previous / next month"],
    ]],
];

export function ShortcutSheet({ close }) {
    return (
        <div className="fixed inset-0 flex justify-center items-center px-3 bg-black bg-opacity-40" style={{ zIndex: 60 }}
            onMouseDown={e => { if (e.target === e.currentTarget) close(); }}>
            <div className="w-full max-w-2xl max-h-full overflow-y-auto rounded-xl bg-ub-cool-grey border border-black border-opacity-60 shadow-2xl text-white p-5 md:p-6" role="dialog" aria-label="Keyboard shortcuts">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium">Keyboard shortcuts</span>
                    <kbd className="text-xs px-2 py-0.5 rounded border border-white border-opacity-20 text-gray-300 cursor-pointer" onClick={close}>esc</kbd>
                </div>
                <div className="grid gap-x-8 gap-y-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))" }}>
                    {SHORTCUTS.map(([group, rows]) => (
                        <div key={group}>
                            <div className="text-xs tracking-widest uppercase text-gray-400 mb-2">{group}</div>
                            {rows.map(([keys, desc]) => (
                                <div key={keys} className="flex items-center justify-between gap-3 py-1 text-sm">
                                    <span className="text-gray-200">{desc}</span>
                                    <kbd className="flex-shrink-0 px-1.5 py-0.5 rounded bg-black bg-opacity-30 border border-white border-opacity-10 text-xs" style={{ fontFamily: "'Ubuntu Mono', monospace" }}>{keys}</kbd>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function SearchHint({ open }) {
    // the OS is only known in the browser; rendering it during the static build would mismatch on Macs
    const [mac, setMac] = React.useState(false);
    React.useEffect(() => setMac(isMac()), []);
    return (
        <button onClick={open}
            className="hidden sm:block absolute bottom-4 right-4 z-10 px-4 py-2 rounded-full bg-ub-cool-grey bg-opacity-80 border border-white border-opacity-10 text-sm text-gray-200 hover:bg-opacity-100 shadow-lg focus:outline-none">
            Press <kbd style={{ fontFamily: "'Ubuntu Mono', monospace" }}>{mac ? "⌘K" : "Ctrl+K"}</kbd> to search
        </button>
    );
}

export function Notification({ title, body, icon, close }) {
    return (
        <div className="absolute inset-x-0 top-9 flex justify-center px-3 pointer-events-none" style={{ zIndex: 55 }}>
            <div onClick={close} className="w-full max-w-md animateShow pointer-events-auto flex items-start rounded-xl bg-ub-cool-grey bg-opacity-95 border border-black border-opacity-60 shadow-2xl px-4 py-3 text-white cursor-default">
                <img className="w-8 h-8 mr-3 mt-0.5 flex-shrink-0" src={icon} alt="" />
                <div className="min-w-0">
                    <div className="font-bold">{title}</div>
                    <div className="text-sm text-gray-300">{body}</div>
                </div>
            </div>
        </div>
    );
}
