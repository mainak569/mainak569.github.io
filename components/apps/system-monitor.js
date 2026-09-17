import React, { Component } from 'react';
import { USER, PROJECTS } from './portfolio-data';

const HISTORY = 60; // seconds kept in the graphs

const PROCESSES = [
    { name: "jobfit", state: "running", detail: "Django REST, React, PostgreSQL", href: "https://jobfit-livid.vercel.app" },
    { name: "gan-cmfd", state: "sleeping", detail: "PyTorch, Conditional GAN", href: "https://github.com/mainak569/GAN-cmfd" },
    { name: "clinic-os", state: "running", detail: "Next.js, TypeScript, Jest", href: "https://clinic-os-352p.vercel.app/" },
    { name: "craafter", state: "running", detail: "Next.js, Gemini, E2B, tRPC", href: "https://craafter.vercel.app/" },
    { name: "syncpen", state: "running", detail: "Next.js, Convex, Clerk", href: "https://sync-pen-six.vercel.app/" },
    { name: "leetcode-daily", state: "running", detail: "Knight · 1900+", href: "https://leetcode.com/u/mainak13/" },
    { name: "acm-chapter", state: "stopped", detail: "secretary, 2025 – 26", href: null },
    { name: "teaching-assistant", state: "stopped", detail: "DAA, ML, Problem Solving", href: null },
];

const HIGHLIGHTS = [
    ["1900+", "LeetCode rating — Knight badge"],
    ["1000+", "students reached through ACM chapter events"],
    ["92.8%", "pixel precision in unsupervised image restoration research"],
];

const STATE_STYLE = {
    running: { background: "rgba(78, 154, 6, 0.3)", color: "#8AE234" },
    sleeping: { background: "rgba(255, 255, 255, 0.1)", color: "#D3D7CF" },
    stopped: { background: "rgba(233, 84, 32, 0.2)", color: "#F5A07A" },
};

const formatUptime = (ms) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h ? `${h}h ${m}m` : `${m}m ${s % 60}s`;
};

function Card({ label, value, children }) {
    return (
        <div className="rounded border border-black border-opacity-40 bg-white bg-opacity-5 p-3 md:p-4">
            <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs tracking-widest uppercase text-gray-300">{label}</span>
                <span className="whitespace-nowrap" style={{ fontFamily: "'Ubuntu Mono', monospace", fontSize: "15px" }}>{value}</span>
            </div>
            {children}
        </div>
    );
}

function Bar({ ratio, color }) {
    return (
        <div className="mt-3 h-2 rounded-full bg-black bg-opacity-30 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(2, Math.min(100, ratio * 100))}%`, background: color }}></div>
        </div>
    );
}

function Graph({ label, data, max, color, unit }) {
    const w = 300, h = 90;
    const points = data.map((v, i) => `${(i / (HISTORY - 1)) * w},${h - (Math.min(v, max) / max) * (h - 4) - 2}`).join(" ");
    const latest = data.length ? data[data.length - 1] : null;
    return (
        <div className="rounded border border-black border-opacity-40 bg-white bg-opacity-5 p-3 md:p-4">
            <div className="flex justify-between text-xs tracking-widest uppercase text-gray-300">
                <span>{label}, last minute</span>
                <span style={{ color }}>{latest === null ? "—" : `${latest}${unit}`}</span>
            </div>
            <svg className="w-full h-24 mt-3" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
                {[0.25, 0.5, 0.75].map(f => <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="rgba(255,255,255,0.06)" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
                {data.length > 1 ? (
                    <>
                        <polygon points={`0,${h} ${points} ${((data.length - 1) / (HISTORY - 1)) * w},${h}`} fill={color} opacity="0.12" />
                        <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
                    </>
                ) : null}
            </svg>
        </div>
    );
}

export class SystemMonitor extends Component {
    constructor() {
        super();
        this.frames = 0;
        this.state = { fps: null, heap: null, heapLimit: null, uptime: 0, fpsHistory: [], heapHistory: [], killed: null };
    }

    componentDidMount() {
        const loop = () => {
            this.frames++;
            this.raf = requestAnimationFrame(loop);
        };
        this.raf = requestAnimationFrame(loop);
        this.lastTick = performance.now();
        this.sample();
        this.timer = setInterval(this.sample, 1000);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.raf);
        clearInterval(this.timer);
        clearTimeout(this.killTimer);
    }

    sample = () => {
        const now = performance.now();
        const fps = Math.round((this.frames * 1000) / Math.max(1, now - this.lastTick));
        this.frames = 0;
        this.lastTick = now;
        // performance.memory is Chromium-only
        const mem = performance.memory;
        const heap = mem ? +(mem.usedJSHeapSize / 1048576).toFixed(1) : null;
        this.setState(prev => ({
            fps,
            heap,
            heapLimit: mem ? mem.jsHeapSizeLimit / 1048576 : null,
            uptime: now,
            fpsHistory: [...prev.fpsHistory, fps].slice(-HISTORY),
            heapHistory: heap === null ? prev.heapHistory : [...prev.heapHistory, heap].slice(-HISTORY),
        }));
    }

    kill = (name) => {
        this.setState({ killed: name });
        clearTimeout(this.killTimer);
        this.killTimer = setTimeout(() => this.setState({ killed: null }), 3000);
    }

    render() {
        const { fps, heap, heapLimit, uptime, fpsHistory, heapHistory, killed } = this.state;
        const heapMax = Math.max(8, ...heapHistory) * 1.25;
        return (
            <div className="w-full min-h-full bg-ub-cool-grey text-white p-3 md:p-5 select-none">
                <div className="grid gap-3 md:gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))" }}>
                    <Card label="Frame rate" value={fps === null ? "—" : `${fps} fps`}><Bar ratio={(fps || 0) / 60} color="#E95420" /></Card>
                    <Card label="JS heap" value={heap === null ? "n/a" : `${heap} MB`}><Bar ratio={heap && heapLimit ? heap / heapLimit : 0} color="#50B6C6" /></Card>
                    <Card label="Session uptime" value={formatUptime(uptime)}><Bar ratio={(uptime % 60000) / 60000} color="#4E9A06" /></Card>
                    <Card label="Projects" value={`${PROJECTS.length} tracked`}><Bar ratio={1} color="#F39A21" /></Card>
                </div>

                <div className="grid gap-3 md:gap-4 mt-3 md:mt-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))" }}>
                    <Graph label="Frame rate" data={fpsHistory} max={Math.max(60, ...fpsHistory)} color="#E95420" unit=" fps" />
                    {heap === null
                        ? <div className="rounded border border-black border-opacity-40 bg-white bg-opacity-5 p-4 flex items-center justify-center text-sm text-gray-400 text-center">JS heap stats are only exposed by Chromium browsers.</div>
                        : <Graph label="JS heap" data={heapHistory} max={heapMax} color="#50B6C6" unit=" MB" />}
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs tracking-widest uppercase text-gray-300">Processes</span>
                    <span className="text-xs text-gray-400">{PROCESSES.filter(p => p.state === "running").length} running · {PROCESSES.length} total</span>
                </div>
                <div className="mt-2 overflow-x-auto">
                    <table className="w-full text-sm" style={{ minWidth: "34rem" }}>
                        <thead>
                            <tr className="text-left text-xs tracking-widest uppercase text-gray-400">
                                <th className="font-medium py-2 pr-3">Name</th>
                                <th className="font-medium py-2 pr-3">User</th>
                                <th className="font-medium py-2 pr-3">State</th>
                                <th className="font-medium py-2 pr-3">Detail</th>
                                <th className="py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {PROCESSES.map(p => (
                                <tr key={p.name} className="border-t border-white border-opacity-10 hover:bg-white hover:bg-opacity-5">
                                    <td className="py-2.5 pr-3" style={{ fontFamily: "'Ubuntu Mono', monospace", fontSize: "15px" }}>
                                        {p.href ? <a href={p.href} target="_blank" rel="noreferrer" className="hover:underline">{p.name}</a> : p.name}
                                    </td>
                                    <td className="py-2.5 pr-3 text-gray-300">{USER}</td>
                                    <td className="py-2.5 pr-3"><span className="px-2 py-0.5 rounded-full text-xs" style={STATE_STYLE[p.state]}>{p.state}</span></td>
                                    <td className="py-2.5 pr-3 text-gray-300">{p.detail}</td>
                                    <td className="py-2.5 text-right">
                                        {p.state === "running"
                                            ? <button onClick={() => this.kill(p.name)} className="text-xs px-2 py-0.5 rounded border border-white border-opacity-20 hover:bg-white hover:bg-opacity-10 focus:outline-none">End</button>
                                            : null}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {killed ? <div className="mt-2 text-sm text-ubt-gedit-orange">kill: ({killed}) — Operation not permitted. Some processes never stop. 🙂</div> : null}

                <div className="grid gap-3 md:gap-4 mt-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))" }}>
                    {HIGHLIGHTS.map(([n, label]) => (
                        <div key={n} className="rounded border border-black border-opacity-40 bg-white bg-opacity-5 p-4">
                            <div className="text-2xl md:text-3xl font-bold" style={{ color: "#E95420" }}>{n}</div>
                            <div className="mt-1 text-sm text-gray-200">{label}</div>
                        </div>
                    ))}
                </div>

                <div className="mt-5 text-xs text-gray-400">Host: LNMIIT · B.Tech CCE · 2023 — 2027</div>
            </div>
        );
    }
}

export default SystemMonitor;

export const displaySystemMonitor = () => {
    return <SystemMonitor />;
}
