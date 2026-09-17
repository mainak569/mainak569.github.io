import React, { Component } from 'react';
import { HOME, USER, getNode, prettyPath } from './portfolio-data';

const PLACES = [
    { label: "Home", path: HOME },
    { label: "Projects", path: `${HOME}/projects` },
    { label: "Experience", path: `${HOME}/experience` },
    { label: "Education", path: `${HOME}/education` },
    { label: "Skills", path: `${HOME}/skills` },
    { label: "Interests", path: `${HOME}/interests` },
    { label: "Contact", path: `${HOME}/contact` },
];

const iconFor = (name, node) => {
    if (node.type === "dir") return name === "~" ? "./themes/Yaru/system/user-home.png" : "./themes/Yaru/system/folder.png";
    if (name.endsWith(".pdf")) return "./themes/filetypes/pdf.svg";
    return "./themes/filetypes/txt.svg";
};

const isTouch = () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

export class Files extends Component {
    constructor() {
        super();
        this.state = {
            path: HOME,
            back: [],
            forward: [],
            selected: null,
            openFile: null, // name of the file being previewed in the current folder
            showHidden: false,
            notice: null,
        };
    }

    navigate = (path, { fromHistory = false } = {}) => {
        const node = getNode(path);
        if (!node || node.type !== "dir") return;
        if (node.locked) {
            this.setState({ notice: `You don't have permission to open “${path.split("/").pop()}”.` });
            return;
        }
        this.setState(prev => ({
            path,
            back: fromHistory || path === prev.path ? prev.back : [...prev.back, prev.path],
            forward: fromHistory || path === prev.path ? prev.forward : [],
            selected: null,
            openFile: null,
            notice: null,
        }));
    }

    goBack = () => {
        if (this.state.openFile) { this.setState({ openFile: null }); return; }
        const { back, path, forward } = this.state;
        if (!back.length) return;
        const target = back[back.length - 1];
        this.setState({ back: back.slice(0, -1), forward: [path, ...forward] }, () => this.navigate(target, { fromHistory: true }));
    }

    goForward = () => {
        const { back, path, forward } = this.state;
        if (!forward.length) return;
        this.setState({ back: [...back, path], forward: forward.slice(1) }, () => this.navigate(forward[0], { fromHistory: true }));
    }

    goUp = () => {
        if (this.state.openFile) { this.setState({ openFile: null }); return; }
        if (this.state.path !== HOME) this.navigate(this.state.path.slice(0, this.state.path.lastIndexOf("/")));
    }

    open = (name) => {
        const node = getNode(this.state.path).children[name];
        if (node.type === "dir") this.navigate(`${this.state.path}/${name}`);
        else this.setState({ openFile: name, selected: name, notice: null });
    }

    handleKeyDown = (e) => {
        const entries = this.entries().map(([name]) => name);
        const i = entries.indexOf(this.state.selected);
        if (e.key === "Enter" && this.state.selected && !this.state.openFile) this.open(this.state.selected);
        else if (e.key === "Backspace" || (e.altKey && e.key === "ArrowLeft")) { e.preventDefault(); this.goBack(); }
        else if (e.altKey && e.key === "ArrowRight") { e.preventDefault(); this.goForward(); }
        else if (e.altKey && e.key === "ArrowUp") { e.preventDefault(); this.goUp(); }
        else if (e.key === "Escape") this.setState({ openFile: null });
        else if ((e.key === "ArrowRight" || e.key === "ArrowDown") && !this.state.openFile) { e.preventDefault(); this.setState({ selected: entries[Math.min(entries.length - 1, i + 1)] }); }
        else if ((e.key === "ArrowLeft" || e.key === "ArrowUp") && !this.state.openFile) { e.preventDefault(); this.setState({ selected: entries[Math.max(0, i - 1)] }); }
        else if (e.ctrlKey && e.key === "h") { e.preventDefault(); this.setState(prev => ({ showHidden: !prev.showHidden })); }
    }

    entries = () => Object.entries(getNode(this.state.path).children)
        .filter(([name]) => this.state.showHidden || !name.startsWith("."))
        .sort(([a, x], [b, y]) => (x.type === y.type ? 0 : x.type === "dir" ? -1 : 1));

    renderLine = (line, i) => {
        if (typeof line === "string") {
            if (line.startsWith("# ")) return <div key={i} className="text-lg md:text-xl font-bold text-white mb-0.5">{line.slice(2)}</div>;
            if (line.startsWith("- ")) return <div key={i} className="pl-4 relative"><span className="absolute left-0 text-ubt-gedit-orange">•</span>{line.slice(2)}</div>;
            return <div key={i}>{line || " "}</div>;
        }
        return (
            <div key={i} className="whitespace-pre-wrap">
                {line.map((part, j) => typeof part === "string"
                    ? <span key={j} className="text-gray-400">{part}</span>
                    : <a key={j} href={part.href} target={part.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="underline text-ubt-gedit-blue hover:text-white">{part.label}</a>)}
            </div>
        );
    }

    renderPreview = () => {
        const name = this.state.openFile;
        const node = getNode(this.state.path).children[name];
        return (
            <div className="flex-grow min-h-0 flex flex-col">
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-black border-opacity-40 text-sm">
                    <div className="flex items-center min-w-0">
                        <img className="w-5 h-5 mr-2" src={iconFor(name, node)} alt="" />
                        <span className="truncate font-bold">{name}</span>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                        {node.href ? <a href={node.href} target="_blank" rel="noreferrer" className="px-2 py-0.5 mr-2 rounded bg-ub-orange hover:bg-opacity-80">Open ↗</a> : null}
                        <button onClick={() => this.setState({ openFile: null })} className="px-2 py-0.5 rounded border border-gray-50 border-opacity-30 hover:bg-gray-50 hover:bg-opacity-10 focus:outline-none">Close</button>
                    </div>
                </div>
                {node.href
                    ? <iframe className="flex-grow w-full bg-white" src={node.href} title={name} frameBorder="0"></iframe>
                    : <div className="flex-grow overflow-y-auto windowMainScreen p-4 md:p-6 text-sm md:text-base leading-relaxed text-gray-200 select-text" style={{ fontFamily: "'Ubuntu Mono', monospace" }}>
                        {node.content.map(this.renderLine)}
                    </div>}
            </div>
        );
    }

    renderGrid = () => {
        const entries = this.entries();
        if (!entries.length) {
            return <div className="flex-grow flex items-center justify-center text-gray-400">Folder is empty</div>;
        }
        return (
            <div className="flex-grow min-h-0 p-2 md:p-4 grid gap-2 content-start overflow-y-auto windowMainScreen"
                style={{ gridTemplateColumns: "repeat(auto-fill, minmax(6.5rem, 1fr))" }}
                onClick={() => this.setState({ selected: null })}>
                {entries.map(([name, node]) => {
                    const isSelected = this.state.selected === name;
                    return (
                        <div
                            key={name}
                            title={node.locked ? `${name} (locked)` : name}
                            onClick={(e) => { e.stopPropagation(); if (isTouch()) this.open(name); else this.setState({ selected: name, notice: null }); }}
                            onDoubleClick={() => this.open(name)}
                            className={"flex flex-col items-center text-xs md:text-sm p-1 rounded cursor-default " + (isSelected ? "" : "hover:bg-white hover:bg-opacity-5")}
                        >
                            <div className={"relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center " + (isSelected ? "opacity-70" : "")}>
                                <img className="max-w-full max-h-full" src={iconFor(name, node)} alt="" draggable={false} />
                                {node.locked ? <img className="absolute bottom-1 right-0 w-5 h-5 bg-ub-cool-grey rounded-full p-0.5" src="./themes/Yaru/status/changes-prevent-symbolic.svg" alt="locked" /> : null}
                            </div>
                            <span className={"mt-1 text-center rounded px-1 w-full break-words leading-tight " + (isSelected ? "bg-ub-orange" : "")}>
                                {name}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    }

    renderBreadcrumbs = () => {
        const rel = this.state.path === HOME ? [] : this.state.path.slice(HOME.length + 1).split("/");
        const crumbs = [{ label: USER, path: HOME }, ...rel.map((part, i) => ({ label: part, path: `${HOME}/${rel.slice(0, i + 1).join("/")}` }))];
        if (this.state.openFile) crumbs.push({ label: this.state.openFile, path: null });
        return (
            <div className="flex items-center min-w-0 overflow-x-auto">
                {crumbs.map((c, i) => {
                    const last = i === crumbs.length - 1;
                    return (
                        <React.Fragment key={i}>
                            {i ? <span className="text-gray-400 mx-0.5">/</span> : null}
                            <button
                                onClick={() => c.path && (this.state.openFile || !last) ? this.navigate(c.path) : null}
                                className={"px-2.5 py-1 rounded whitespace-nowrap focus:outline-none " + (last ? "bg-black bg-opacity-30 font-medium" : "hover:bg-black hover:bg-opacity-20")}
                            >{c.label}</button>
                        </React.Fragment>
                    );
                })}
            </div>
        );
    }

    render() {
        const { path, back, forward, openFile, notice, selected } = this.state;
        const count = this.entries().length;
        const navBtn = (onClick, enabled, label, glyph) => (
            <button onClick={onClick} disabled={!enabled} aria-label={label} title={label}
                className={"w-8 h-8 flex items-center justify-center rounded text-lg focus:outline-none " + (enabled ? "hover:bg-black hover:bg-opacity-20" : "text-gray-500 cursor-default")}>{glyph}</button>
        );
        return (
            <div className="w-full h-full flex flex-col bg-ub-cool-grey text-white select-none outline-none" tabIndex="0" onKeyDown={this.handleKeyDown}>
                <div className="flex items-center justify-between w-full bg-ub-warm-grey bg-opacity-40 text-sm px-1.5 py-1 gap-2 border-b border-black border-opacity-50">
                    <div className="flex items-center min-w-0">
                        {navBtn(this.goBack, !!(back.length || openFile), "Back", "‹")}
                        {navBtn(this.goForward, !!forward.length && !openFile, "Forward", "›")}
                        {navBtn(() => this.navigate(HOME), path !== HOME || !!openFile, "Home",
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 1.5l-7 6.2.7.8L3 7.4V14h4v-4h2v4h4V7.4l1.3 1.1.7-.8z" /></svg>)}
                        <div className="ml-1 min-w-0">{this.renderBreadcrumbs()}</div>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                        <button onClick={() => this.setState(prev => ({ showHidden: !prev.showHidden }))} title="Show hidden files (Ctrl+H)"
                            className={"hidden sm:block px-2 py-1 mr-2 rounded text-xs focus:outline-none " + (this.state.showHidden ? "bg-ub-orange" : "hover:bg-black hover:bg-opacity-20 text-gray-300")}>hidden</button>
                        <span className="text-gray-300 whitespace-nowrap">{count} item{count === 1 ? "" : "s"}</span>
                    </div>
                </div>
                <div className="flex flex-grow min-h-0">
                    <div className="hidden sm:flex flex-col w-40 md:w-48 flex-shrink-0 bg-ub-grey bg-opacity-80 border-r border-black text-sm py-2 overflow-y-auto windowMainScreen">
                        {PLACES.map(place => {
                            const active = path === place.path;
                            return (
                                <button key={place.label} onClick={() => this.navigate(place.path)}
                                    className={"flex items-center text-left px-3 py-2 focus:outline-none " + (active ? "bg-ub-orange" : "hover:bg-white hover:bg-opacity-5")}>
                                    <img className="w-5 h-5 mr-2.5" src={place.path === HOME ? "./themes/Yaru/system/user-home.png" : "./themes/Yaru/system/folder.png"} alt="" />
                                    {place.label}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex flex-col flex-grow min-w-0">
                        {openFile ? this.renderPreview() : this.renderGrid()}
                        <div className="border-t border-black border-opacity-40 bg-ub-warm-grey bg-opacity-10 px-3 py-1.5 text-xs md:text-sm truncate">
                            {notice
                                ? <span className="text-red-400">{notice}</span>
                                : <span className="text-gray-400">{selected && !openFile ? `“${selected}” selected · double-click to open` : prettyPath(path) + (openFile ? `/${openFile}` : "")}</span>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Files;

// a folder created on the desktop: always empty, since the portfolio's filesystem is read-only
export function EmptyFolder({ name }) {
    return (
        <div className="w-full h-full flex flex-col bg-ub-cool-grey text-white select-none">
            <div className="flex items-center justify-between w-full bg-ub-warm-grey bg-opacity-40 text-sm px-3 py-1.5 border-b border-black border-opacity-50">
                <div className="flex items-center min-w-0">
                    <span className="text-gray-300 mr-1">Desktop /</span>
                    <span className="px-2.5 py-1 rounded bg-black bg-opacity-30 font-medium truncate">{name}</span>
                </div>
                <span className="text-gray-300 whitespace-nowrap ml-2">0 items</span>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
                <img className="w-20 h-20 opacity-40" src="./themes/Yaru/system/folder.png" alt="" />
                <div className="mt-4 text-lg text-gray-300">Folder is empty</div>
                <div className="mt-1 text-sm text-gray-400">Portfolio files are read-only — but the folder is yours to keep.</div>
            </div>
        </div>
    );
}

export const displayEmptyFolder = (name) => () => <EmptyFolder name={name} />;

export const displayFiles = () => {
    return <Files />;
}
