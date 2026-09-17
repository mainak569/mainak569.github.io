import React, { Component } from 'react';
import ReactGA from 'react-ga4';
import { HOME, USER, HOST, EMAIL, RESUME, PROJECTS, SKILLS, EDUCATION, EXPERIENCE, SOCIAL, normalize, getNode, prettyPath } from './portfolio-data';

// colors are CSS variables so old output recolors when the theme changes
const C = {
    fg: "var(--t-fg)",
    muted: "var(--t-muted)",
    accent: "var(--t-accent)",
    green: "var(--t-green)",
    path: "var(--t-path)",
    error: "var(--t-error)",
    link: "var(--t-link)",
};

const THEMES = {
    ubuntu: { bg: "#2C001E", fg: "#EEEEEC", muted: "#AEA79F", accent: "#F5A623", green: "#8AE234", path: "#729FCF", error: "#EF2929", link: "#34E2E2", cursor: "#EEEEEC" },
    dracula: { bg: "#282A36", fg: "#F8F8F2", muted: "#6272A4", accent: "#FFB86C", green: "#50FA7B", path: "#BD93F9", error: "#FF5555", link: "#8BE9FD", cursor: "#F8F8F2" },
    matrix: { bg: "#000000", fg: "#00FF41", muted: "#008F11", accent: "#ADFF2F", green: "#00FF41", path: "#39FF14", error: "#FF3131", link: "#7CFC00", cursor: "#00FF41" },
    solarized: { bg: "#002B36", fg: "#EEE8D5", muted: "#839496", accent: "#B58900", green: "#859900", path: "#268BD2", error: "#DC322F", link: "#2AA198", cursor: "#EEE8D5" },
};

const APP_COMMANDS = {
    "code": "vscode",
    "vscode": "vscode",
    "spotify": "spotify",
    "chrome": "chrome",
    "calc": "calc",
    "settings": "settings",
    "trash": "trash",
    "about-mainak": "about-mainak",
    "contacts": "contacts",
    "gedit": "gedit",
    "files": "files",
    "nautilus": "files",
    "monitor": "system-monitor",
    "top": "system-monitor",
    "htop": "system-monitor",
};

const LINK_COMMANDS = {
    "github": "https://github.com/mainak569",
    "linkedin": "https://www.linkedin.com/in/mainak13",
    "leetcode": "https://leetcode.com/u/mainak13/",
};

// [command, args, description] — the order here is the order in `help`
const HELP = [
    ["help", "", "this list"],
    ["neofetch", "", "system + me, at a glance"],
    ["whoami", "", "the short version"],
    ["ls", "[dir]", "list this directory"],
    ["cd", "<dir>", "change directory"],
    ["cat", "<file>", "print a file"],
    ["tree", "", "the whole filesystem"],
    ["pwd", "", "where am I"],
    ["projects", "", "what I have built"],
    ["skills", "", "the stack"],
    ["education", "", "degrees and marks"],
    ["experience", "", "roles held"],
    ["stats", "", "numbers worth knowing"],
    ["contact", "", "how to reach me"],
    ["social", "", "profile links"],
    ["resume", "", "open the résumé"],
    ["email", "", "compose an email"],
    ["open", "<app>", "launch an app"],
    ["mkdir", "<name>", "new desktop folder"],
    ["echo", "<text>", "say it back"],
    ["date", "", "current time"],
    ["theme", "[name]", "change colors"],
    ["history", "", "commands so far"],
    ["banner", "", "the name, big"],
    ["clear", "", "wipe the screen"],
    ["exit", "", "close this window"],
];

const HIDDEN = ["uname", "sudo", "rm", "man", "ll", "cls", "hello", "hi", "vim", "nano", "neovim", "coffee", "hire", ...Object.keys(APP_COMMANDS), ...Object.keys(LINK_COMMANDS)];
const COMMANDS = [...HELP.map(h => h[0]), ...HIDDEN];
const isCommand = (word) => COMMANDS.includes(word) || word === "!!";

// ---------- ASCII banner (ANSI Shadow) ----------
const FONT = {
    M: ["███╗   ███╗", "████╗ ████║", "██╔████╔██║", "██║╚██╔╝██║", "██║ ╚═╝ ██║", "╚═╝     ╚═╝"],
    A: [" █████╗ ", "██╔══██╗", "███████║", "██╔══██║", "██║  ██║", "╚═╝  ╚═╝"],
    I: ["██╗", "██║", "██║", "██║", "██║", "╚═╝"],
    N: ["███╗   ██╗", "████╗  ██║", "██╔██╗ ██║", "██║╚██╗██║", "██║ ╚████║", "╚═╝  ╚═══╝"],
    K: ["██╗  ██╗", "██║ ██╔╝", "█████╔╝ ", "██╔═██╗ ", "██║  ██╗", "╚═╝  ╚═╝"],
    D: ["██████╗ ", "██╔══██╗", "██║  ██║", "██║  ██║", "██████╔╝", "╚═════╝ "],
    S: ["███████╗", "██╔════╝", "███████╗", "╚════██║", "███████║", "╚══════╝"],
};
const bigWord = (word) => FONT.M.map((_, row) => word.split("").map(ch => FONT[ch][row]).join("")).join("\n");

const joinPath = (cwd, name) => prettyPath(cwd === "/" ? `/${name}` : `${cwd}/${name}`);

const loadTheme = () => {
    try {
        const saved = localStorage.getItem("terminal-theme");
        return saved in THEMES ? saved : "ubuntu";
    } catch (e) {
        return "ubuntu";
    }
};

const commonPrefix = (words) => words.reduce((a, b) => {
    let i = 0;
    while (i < a.length && a[i] === b[i]) i++;
    return a.slice(0, i);
});

export class Terminal extends Component {
    constructor() {
        super();
        this.inputRef = React.createRef();
        this.bottomRef = React.createRef();
        this.history = [];
        this.historyIndex = 0;
        this.startedAt = Date.now();
        this.state = {
            cwd: HOME,
            input: "",
            caret: 0,
            focused: false,
            theme: "ubuntu",
            lines: [{ type: "welcome" }],
        };
    }

    componentDidMount() {
        this.setState({ theme: loadTheme() });
        this.focus();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.lines === this.state.lines) return;
        // scroll only the window's own scroll area (scrollIntoView would also shift the whole desktop)
        const scroller = this.bottomRef.current && this.bottomRef.current.closest(".windowMainScreen");
        if (scroller) scroller.scrollTop = scroller.scrollHeight;
    }

    focus = () => {
        // don't steal focus from a text selection
        if (window.getSelection && String(window.getSelection())) return;
        if (this.inputRef.current) this.inputRef.current.focus({ preventScroll: true });
    }

    setInput = (input) => {
        this.setState({ input, caret: input.length }, () => {
            const el = this.inputRef.current;
            if (el) el.setSelectionRange(input.length, input.length);
        });
    }

    print = (cwd, command, output) => {
        this.setState(prev => ({
            lines: [...prev.lines, { type: "command", cwd, command }, ...(output && output.length ? [{ type: "output", content: output }] : [])],
        }));
    }

    // run a command from a click (help entries, ls entries...)
    execute = (command) => {
        this.setInput("");
        this.run(command);
        this.focus();
    }

    // ---------- small render helpers used inside output ----------
    cmd = (name, runAs) => (
        <span
            className="cursor-pointer hover:underline"
            style={{ color: C.accent }}
            onClick={(e) => { e.stopPropagation(); if (runAs === null) { this.setInput(name + " "); this.focus(); } else this.execute(runAs || name); }}
        >{name}</span>
    )

    ext = (href, label) => <a href={href} target="_blank" rel="noreferrer" className="underline hover:opacity-80" style={{ color: C.link }} onClick={e => e.stopPropagation()}>{label || href}</a>

    // ---------- commands ----------
    run = (raw) => {
        let command = raw.trim();
        const cwd = this.state.cwd;
        if (!command) {
            this.print(cwd, "", null);
            return;
        }
        if (command === "!!") {
            if (!this.history.length) { this.print(cwd, command, ["bash: !!: event not found"]); return; }
            command = this.history[this.history.length - 1];
        }
        this.history.push(command);
        this.historyIndex = this.history.length;

        const [main, ...args] = command.split(/\s+/);
        const rest = args.join(" ");
        let out = null;

        switch (main) {
            case "help":
            case "man":
                out = [
                    <div className="grid gap-x-6" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(17rem, 1fr))" }}>
                        {HELP.map(([name, arg, desc]) => (
                            <div key={name} className="truncate">
                                {this.cmd(name, arg.startsWith("<") ? null : name)}
                                {arg ? <span style={{ color: C.accent }}> {arg}</span> : null}
                                <span style={{ color: C.muted }}> — </span>{desc}
                            </div>
                        ))}
                    </div>,
                    <div className="mt-1" style={{ color: C.muted }}>Tab completes · ↑/↓ history · → accepts a suggestion · Ctrl+L clears · click any command to run it</div>,
                ];
                break;
            case "ls":
            case "ll": {
                const flags = args.filter(a => a.startsWith("-")).join("") + (main === "ll" ? "la" : "");
                const target = args.find(a => !a.startsWith("-"));
                const path = normalize(cwd, target);
                const node = getNode(path);
                if (!node) out = [`ls: cannot access '${target}': No such file or directory`];
                else if (node.locked) out = [`ls: cannot open directory '${target}': Permission denied 🙃`];
                else if (node.type === "file") out = [target];
                else {
                    const entries = Object.entries(node.children).filter(([name]) => flags.includes("a") || !name.startsWith("."));
                    if (flags.includes("l")) {
                        out = entries.map(([name, n]) => (
                            <div className="whitespace-pre">
                                <span style={{ color: C.muted }}>{n.type === "dir" ? (n.locked ? "d---------" : "drwxr-xr-x") : "-rw-r--r--"}  {USER} {USER}  {String(n.type === "dir" ? 4096 : n.content.join("").length * 8).padStart(5)}  </span>
                                {this.entry(path, name, n)}
                            </div>
                        ));
                    } else {
                        out = [<div className="flex flex-wrap gap-x-6">{entries.map(([name, n]) => <span key={name}>{this.entry(path, name, n)}</span>)}</div>];
                    }
                }
                break;
            }
            case "cd": {
                if (args.length > 1) { out = ["bash: cd: too many arguments"]; break; }
                let target = args[0];
                if (target === "-") target = this.prevCwd || cwd;
                const path = normalize(cwd, target);
                const node = getNode(path);
                if (path === "/" || path === "/home") { out = [`bash: cd: ${target}: Permission denied — stay in ~ 😉`]; break; }
                if (!node) out = [`bash: cd: ${target}: No such file or directory`];
                else if (node.type !== "dir") out = [`bash: cd: ${target}: Not a directory`];
                else if (node.locked) out = [`bash: cd: ${target}: Permission denied 😏`];
                else {
                    this.prevCwd = cwd;
                    this.print(cwd, command, null);
                    this.setState({ cwd: path });
                    return;
                }
                break;
            }
            case "pwd":
                out = [cwd];
                break;
            case "cat": {
                if (!args.length) { out = ["cat: missing file operand"]; break; }
                out = [];
                args.forEach(arg => {
                    const node = getNode(normalize(cwd, arg));
                    if (!node) out.push(<span style={{ color: C.error }}>cat: {arg}: No such file or directory</span>);
                    else if (node.type === "dir") out.push(<span style={{ color: C.error }}>cat: {arg}: Is a directory</span>);
                    else out.push(...node.content.map(line => typeof line === "string" && line.startsWith("# ")
                        ? <span className="font-bold" style={{ color: C.accent }}>{line.slice(2)}</span>
                        : line));
                });
                break;
            }
            case "tree": {
                const path = normalize(cwd, args[0]);
                const node = getNode(path);
                if (!node || node.type !== "dir") { out = [`tree: ${args[0]}: not a directory`]; break; }
                out = [<span className="font-bold" style={{ color: C.path }}>{prettyPath(path)}</span>, ...this.treeLines(path, node, "")];
                const count = (n) => Object.values(n.children).reduce((acc, c) => c.type === "dir" ? [acc[0] + 1 + count(c)[0], acc[1] + count(c)[1]] : [acc[0], acc[1] + 1], [0, 0]);
                const [dirs, files] = count(node);
                out.push("", `${dirs} directories, ${files} files`);
                break;
            }
            case "echo":
                out = [rest];
                break;
            case "history":
                out = this.history.map((h, i) => (
                    <div className="whitespace-pre"><span style={{ color: C.muted }}>{String(i + 1).padStart(4)}  </span>{this.cmd(h)}</div>
                ));
                break;
            case "whoami":
                out = [
                    <span><span className="font-bold" style={{ color: C.green }}>Mainak Das</span> — Full-Stack Developer</span>,
                    "B.Tech CCE @ LNMIIT Jaipur '27 · LeetCode Knight · CodeChef 3★",
                    "I build products with Next.js, React & TypeScript, and dabble in deep learning.",
                    <span>Reach me: {this.ext(`mailto:${EMAIL}`, EMAIL)}</span>,
                ];
                break;
            case "projects":
                out = PROJECTS.map((p, i) => (
                    <div className={i ? "mt-2" : ""}>
                        <div>
                            <span className="font-bold" style={{ color: C.green }}>{p.name}</span>
                            <span> — {p.tagline} </span>
                            <span style={{ color: C.muted }}>({p.date})</span>
                        </div>
                        <div className="pl-4" style={{ color: C.muted }}>{p.stack}</div>
                        <div className="pl-4">
                            {p.demo ? <>{this.ext(p.demo, "live demo ↗")}<span style={{ color: C.muted }}>  ·  </span></> : null}
                            {this.ext(p.github, "source ↗")}
                        </div>
                    </div>
                ));
                out.push(<div className="mt-2" style={{ color: C.muted }}>More in {this.cmd("~/projects", "ls ~/projects")} or {this.ext("https://github.com/mainak569", "github.com/mainak569")}</div>);
                break;
            case "skills":
                out = SKILLS.map(([k, v]) => (
                    <div className="flex">
                        <span className="flex-shrink-0 w-24 font-bold" style={{ color: C.accent }}>{k}</span>
                        <span>{v}</span>
                    </div>
                ));
                break;
            case "education":
                out = EDUCATION.map((e, i) => (
                    <div className={i ? "mt-2" : ""}>
                        <div><span className="font-bold" style={{ color: C.green }}>{e.school}</span> <span style={{ color: C.muted }}>({e.date})</span></div>
                        <div className="pl-4">{e.course} <span style={{ color: C.accent }}>· {e.score}</span></div>
                    </div>
                ));
                break;
            case "experience":
                out = EXPERIENCE.map((x, i) => (
                    <div className={i ? "mt-2" : ""}>
                        <div><span className="font-bold" style={{ color: C.green }}>{x.role}</span> @ {x.org} <span style={{ color: C.muted }}>({x.date})</span></div>
                        {x.points.map(p => <div key={p} className="pl-4"><span style={{ color: C.accent }}>▸ </span>{p}</div>)}
                    </div>
                ));
                break;
            case "stats": {
                const bar = (value, max) => {
                    const filled = Math.round((value / max) * 20);
                    return <><span style={{ color: C.green }}>{"█".repeat(filled)}</span><span style={{ color: C.muted }}>{"░".repeat(20 - filled)}</span></>;
                };
                const rows = [
                    ["LeetCode rating", "1900+", bar(1900, 2400), "Knight"],
                    ["CGPA", "7.63", bar(7.63, 10), "/ 10"],
                    ["Class 12", "94.3%", bar(94.3, 100), "CBSE"],
                    ["Class 10", "94.7%", bar(94.7, 100), "ICSE"],
                    ["CodeChef", "3★", bar(3, 7), "/ 7★"],
                ];
                const counts = [["5", "projects shipped"], ["2", "internships"], ["3", "events organized"], ["1000+", "participants reached"]];
                out = [
                    ...rows.map(([label, value, b, note]) => (
                        <div className="whitespace-pre">
                            <span>{label.padEnd(17)}</span><span className="font-bold" style={{ color: C.accent }}>{value.padEnd(7)}</span>{b}<span style={{ color: C.muted }}>  {note}</span>
                        </div>
                    )),
                    <div className="flex flex-wrap gap-x-6 mt-1">
                        {counts.map(([n, label]) => <span key={label}><span className="font-bold" style={{ color: C.green }}>{n}</span> {label}</span>)}
                    </div>,
                ];
                break;
            }
            case "contact":
                out = [
                    <div className="whitespace-pre">{"Email    "}{this.ext(`mailto:${EMAIL}`, EMAIL)}</div>,
                    <div className="whitespace-pre">{"College  "}{this.ext("mailto:23ucc569@lnmiit.ac.in", "23ucc569@lnmiit.ac.in")}</div>,
                    <div className="whitespace-pre">{"Phone    "}{this.ext("tel:+919653723589", "+91-9653723589")}</div>,
                    <div className="mt-1" style={{ color: C.muted }}>Or type {this.cmd("email")} to write to me right here.</div>,
                ];
                break;
            case "social":
                out = SOCIAL.map(([name, href, label]) => (
                    <div className="whitespace-pre"><span style={{ color: C.accent }}>{name.padEnd(15)}</span>{this.ext(href, label)}</div>
                ));
                break;
            case "resume":
                window.open(RESUME, "_blank", "noopener");
                out = [<span>Opening résumé… (or {this.ext(RESUME, "click here")})</span>];
                break;
            case "email":
            case "hire":
                this.props.openApp("gedit");
                out = ["Opening the compose window…"];
                break;
            case "date":
                out = [new Date().toString()];
                break;
            case "uname":
                out = [args.includes("-a") ? `Linux ${HOST} 6.8.0-mainak #1 SMP x86_64 GNU/Linux` : "Linux"];
                break;
            case "neofetch":
                out = [<Neofetch startedAt={this.startedAt} theme={this.state.theme} />];
                break;
            case "banner":
                out = [<Banner />];
                break;
            case "theme": {
                if (!args[0]) {
                    out = [
                        <div className="flex flex-wrap gap-x-4">
                            <span>Themes:</span>
                            {Object.keys(THEMES).map(t => <span key={t}>{this.cmd(t, `theme ${t}`)}{t === this.state.theme ? <span style={{ color: C.muted }}> (current)</span> : null}</span>)}
                        </div>,
                    ];
                } else if (THEMES[args[0]]) {
                    this.setState({ theme: args[0] });
                    try { localStorage.setItem("terminal-theme", args[0]); } catch (e) { }
                    out = [`Theme set to ${args[0]}.`];
                } else {
                    out = [`theme: unknown theme '${args[0]}'. Try: ${Object.keys(THEMES).join(", ")}`];
                }
                break;
            }
            case "mkdir":
                if (!args[0]) out = ["mkdir: missing operand"];
                else { this.props.addFolder(rest); out = [`Created folder '${rest}' on the Desktop`]; }
                break;
            case "open":
                if (APP_COMMANDS[args[0]]) this.props.openApp(APP_COMMANDS[args[0]]);
                else out = [
                    args[0] ? `open: unknown app '${args[0]}'` : "usage: open <app>",
                    <div className="flex flex-wrap gap-x-4"><span>Apps:</span>{Object.keys(APP_COMMANDS).map(a => <span key={a}>{this.cmd(a, `open ${a}`)}</span>)}</div>,
                ];
                break;
            case "exit":
                document.getElementById("close-terminal").click();
                return;
            case "clear":
            case "cls":
                this.setState({ lines: [] });
                return;
            case "sudo":
                ReactGA.event({ category: "Sudo Access", action: "lol" });
                out = [<img className="w-2/5 my-1" src="./images/memes/used-sudo-command.webp" alt="meme" />];
                break;
            case "rm":
                out = [args.includes("-rf") || args.includes("-fr") ? "Nice try. This portfolio is read-only 😄" : "rm: permission denied"];
                break;
            case "vim":
            case "nano":
            case "neovim":
                out = [`${main}: no need — try ${args[0] ? `'cat ${args[0]}'` : "'ls'"} instead. (And yes, I know how to exit vim.)`];
                break;
            case "hello":
            case "hi":
                out = ["Hey there 👋  Type 'whoami' to get to know me."];
                break;
            case "coffee":
                out = ["☕ Brewing… done. Now let's build something."];
                break;
            default:
                if (APP_COMMANDS[main]) {
                    this.props.openApp(APP_COMMANDS[main]);
                } else if (LINK_COMMANDS[main]) {
                    window.open(LINK_COMMANDS[main], "_blank", "noopener");
                    out = [`Opening ${main}…`];
                } else {
                    const guess = COMMANDS.find(c => c.startsWith(main.slice(0, 2)));
                    out = [
                        <span><span style={{ color: C.error }}>{main}: command not found.</span>{guess ? <> Did you mean {this.cmd(guess)}?</> : null} Type {this.cmd("help")} for the list.</span>,
                    ];
                }
        }
        this.print(cwd, command, out);
    }

    entry = (dirPath, name, node) => {
        const target = joinPath(dirPath, name);
        if (node.type === "dir") {
            return (
                <span className="font-bold cursor-pointer hover:underline" style={{ color: node.locked ? C.error : C.path }}
                    onClick={(e) => { e.stopPropagation(); this.execute(`cd ${target}`); }}>{name}/</span>
            );
        }
        return (
            <span className="cursor-pointer hover:underline" style={{ color: name.endsWith(".pdf") ? C.error : C.fg }}
                onClick={(e) => { e.stopPropagation(); this.execute(name.endsWith(".pdf") ? "resume" : `cat ${target}`); }}>{name}</span>
        );
    }

    treeLines = (path, node, indent) => {
        const entries = Object.entries(node.children).filter(([name]) => !name.startsWith("."));
        return entries.flatMap(([name, child], i) => {
            const last = i === entries.length - 1;
            const line = <div className="whitespace-pre"><span style={{ color: C.muted }}>{indent}{last ? "└── " : "├── "}</span>{this.entry(path, name, child)}</div>;
            if (child.type !== "dir" || child.locked) return [line];
            return [line, ...this.treeLines(`${path}/${name}`, child, indent + (last ? "    " : "│   "))];
        });
    }

    // ---------- input ----------
    suggestion = () => {
        const { input, caret } = this.state;
        if (!input || caret !== input.length) return "";
        const fromHistory = [...this.history].reverse().find(h => h.startsWith(input) && h !== input);
        if (fromHistory) return fromHistory.slice(input.length);
        if (!input.includes(" ")) {
            const c = COMMANDS.find(c => c.startsWith(input) && c !== input && !HIDDEN.includes(c));
            if (c) return c.slice(input.length);
        }
        return "";
    }

    complete = () => {
        const { input, cwd } = this.state;
        const parts = input.split(/\s+/);
        if (parts.length <= 1) {
            const matches = COMMANDS.filter(c => c.startsWith(parts[0]) && !HIDDEN.includes(c));
            if (matches.length === 1) this.setInput(matches[0] + " ");
            else if (matches.length > 1) {
                const prefix = commonPrefix(matches);
                if (prefix.length > input.length) this.setInput(prefix);
                else this.print(cwd, input, [<div className="flex flex-wrap gap-x-6">{matches.map(m => <span key={m}>{this.cmd(m)}</span>)}</div>]);
            }
            return;
        }
        const partial = parts[parts.length - 1];
        const slash = partial.lastIndexOf("/");
        const base = slash >= 0 ? partial.slice(0, slash + 1) : "";
        const prefix = partial.slice(slash + 1);
        const node = getNode(normalize(cwd, base || "."));
        if (!node || node.type !== "dir" || node.locked) return;
        const matches = Object.keys(node.children).filter(n => n.startsWith(prefix) && (prefix.startsWith(".") || !n.startsWith(".")));
        if (matches.length === 1) {
            const name = matches[0];
            parts[parts.length - 1] = base + name + (node.children[name].type === "dir" ? "/" : "");
            this.setInput(parts.join(" "));
        } else if (matches.length > 1) {
            const common = commonPrefix(matches);
            if (common.length > prefix.length) {
                parts[parts.length - 1] = base + common;
                this.setInput(parts.join(" "));
            } else {
                this.print(cwd, input, [matches.join("  ")]);
            }
        }
    }

    handleKeyDown = (e) => {
        const { input, caret } = this.state;
        if (e.key === "Enter") {
            this.setInput("");
            this.run(input);
        } else if (e.key === "Tab") {
            e.preventDefault();
            this.complete();
        } else if ((e.key === "ArrowRight" || e.key === "End") && caret === input.length) {
            const s = this.suggestion();
            if (s) { e.preventDefault(); this.setInput(input + s); }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.setInput(this.history[this.historyIndex]);
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.setInput(this.history[this.historyIndex]);
            } else {
                this.historyIndex = this.history.length;
                this.setInput("");
            }
        } else if (e.key === "l" && e.ctrlKey) {
            e.preventDefault();
            this.setState({ lines: [] });
        } else if (e.key === "u" && e.ctrlKey) {
            e.preventDefault();
            this.setInput("");
        } else if (e.key === "c" && e.ctrlKey && !String(window.getSelection())) {
            e.preventDefault();
            this.print(this.state.cwd, input + "^C", null);
            this.setInput("");
        }
    }

    renderPrompt = (cwd) => (
        <span className="whitespace-nowrap font-bold">
            <span style={{ color: C.green }}>{USER}@{HOST}</span>
            <span style={{ color: C.fg }}>:</span>
            <span style={{ color: C.path }}>{prettyPath(cwd)}</span>
            <span style={{ color: C.fg }}>$ </span>
        </span>
    )

    // the typed command: first word green if it's a real command, red if not
    renderCommand = (text) => {
        const match = text.match(/^(\s*)(\S+)([\s\S]*)$/);
        if (!match) return <span>{text}</span>;
        return (
            <>
                {match[1]}
                <span style={{ color: isCommand(match[2]) ? C.green : C.error }}>{match[2]}</span>
                {match[3]}
            </>
        );
    }

    renderInputLine = () => {
        const { input, caret, focused } = this.state;
        const ghost = this.suggestion();
        const full = input + ghost;
        const under = full[caret] || " ";
        const cursor = (
            <span className={focused ? "terminal-cursor" : ""}
                style={focused
                    ? { background: "var(--t-cursor)", color: "var(--t-bg)" }
                    : { outline: "1px solid var(--t-cursor)", outlineOffset: "-1px" }}>{under}</span>
        );
        // color of the command word, applied per slice so the cursor can sit anywhere inside it
        const m = input.match(/^(\s*)(\S+)/);
        const [wordStart, wordEnd] = m ? [m[1].length, m[0].length] : [0, 0];
        const wordColor = m && isCommand(m[2]) ? C.green : C.error;
        const slice = (from, to) => {
            if (from >= to) return null;
            const cut = (a, b) => [Math.max(from, a), Math.min(to, b)];
            return [[from, wordStart], [wordStart, wordEnd], [wordEnd, to]].map(([a, b], i) => {
                const [s, e] = cut(a, b);
                return s < e ? <span key={i} style={i === 1 ? { color: wordColor } : null}>{input.slice(s, e)}</span> : null;
            });
        };
        return (
            <span className="whitespace-pre-wrap break-all">
                {slice(0, Math.min(caret, input.length))}
                {cursor}
                {caret < input.length ? slice(caret + 1, input.length) : null}
                {ghost ? <span style={{ color: C.muted }}>{ghost.slice(1)}</span> : null}
            </span>
        );
    }

    render() {
        const t = THEMES[this.state.theme];
        const vars = {
            "--t-bg": t.bg, "--t-fg": t.fg, "--t-muted": t.muted, "--t-accent": t.accent, "--t-green": t.green,
            "--t-path": t.path, "--t-error": t.error, "--t-link": t.link, "--t-cursor": t.cursor,
            background: t.bg,
            color: t.fg,
            fontFamily: "'Ubuntu Mono', 'DejaVu Sans Mono', Menlo, Consolas, monospace",
            fontSize: "15px",
            lineHeight: 1.45,
        };
        return (
            <div className="min-h-full w-full px-2 py-1.5 cursor-text" style={vars} id="terminal-body" onClick={this.focus}>
                <style>{`
                    @keyframes terminal-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
                    .terminal-cursor { animation: terminal-blink 1.06s step-end infinite; }
                    #terminal-body ::selection { background: var(--t-muted); color: var(--t-bg); }
                `}</style>
                {this.state.lines.map((line, i) => {
                    if (line.type === "welcome") {
                        return (
                            <div key={i} className="mb-2">
                                <Banner />
                                <div className="mt-1">
                                    Welcome to Mainak Das's shell. Type {this.cmd("help")} for commands, or {this.cmd("neofetch")} for the quick version.
                                </div>
                            </div>
                        );
                    }
                    if (line.type === "command") {
                        return (
                            <div key={i} className="mt-1 break-all">
                                {this.renderPrompt(line.cwd)}
                                <span className="whitespace-pre-wrap">{this.renderCommand(line.command)}</span>
                            </div>
                        );
                    }
                    return <div key={i} className="mb-1.5 mt-0.5 whitespace-pre-wrap break-words">{line.content.map(this.renderOutputLine)}</div>;
                })}
                <div className="relative mt-1" ref={this.bottomRef}>
                    {this.renderPrompt(this.state.cwd)}
                    {this.renderInputLine()}
                    <input
                        ref={this.inputRef}
                        value={this.state.input}
                        onChange={(e) => { this.historyIndex = this.history.length; this.setState({ input: e.target.value, caret: e.target.selectionStart }); }}
                        onSelect={(e) => this.setState({ caret: e.target.selectionStart })}
                        onKeyDown={this.handleKeyDown}
                        onFocus={() => this.setState({ focused: true })}
                        onBlur={() => this.setState({ focused: false })}
                        className="absolute left-0 top-0 w-full h-full opacity-0 pointer-events-none"
                        style={{ fontSize: "16px" }}
                        spellCheck={false}
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        aria-label="terminal input"
                    />
                </div>
            </div>
        )
    }

    renderInline = (part, key) => {
        if (typeof part === "string") return <span key={key}>{part}</span>;
        if (part && part.type === "link") return <span key={key}>{this.ext(part.href, part.label)}</span>;
        return null;
    }

    renderOutputLine = (line, i) => {
        if (React.isValidElement(line)) return <div key={i}>{line}</div>;
        if (Array.isArray(line)) return <div key={i}>{line.map(this.renderInline)}</div>;
        if (typeof line === "string") return <div key={i}>{line || " "}</div>;
        return null;
    }
}

function Banner() {
    const gradient = {
        backgroundImage: "linear-gradient(90deg, var(--t-accent), var(--t-green) 55%, var(--t-path))",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        lineHeight: 1,
        fontSize: "12px",
    };
    return (
        <div className="flex flex-wrap gap-x-5 gap-y-1 select-none" aria-label="Mainak Das">
            <pre className="m-0" style={gradient}>{bigWord("MAINAK")}</pre>
            <pre className="m-0" style={gradient}>{bigWord("DAS")}</pre>
        </div>
    );
}

function Neofetch({ startedAt, theme }) {
    const mins = Math.floor((Date.now() - startedAt) / 60000);
    const info = [
        ["OS", "Ubuntu 22.04 LTS (web)"],
        ["Host", "mainak.me"],
        ["Kernel", "Next.js 14 + React 18"],
        ["Uptime", mins < 1 ? "just now" : `${mins} min${mins === 1 ? "" : "s"}`],
        ["Shell", "bash (react edition)"],
        ["Theme", theme],
        ["Role", "Full-Stack Developer"],
        ["Education", "B.Tech CCE, LNMIIT '27"],
        ["Languages", "C++, TypeScript, Python, Java"],
        ["Stack", "Next.js, React, Django, PostgreSQL"],
        ["LeetCode", "Knight (1900+)"],
        ["CodeChef", "3★"],
        ["Email", EMAIL],
    ];
    const palette = ["error", "green", "accent", "path", "link", "muted", "fg"];
    return (
        <div className="flex flex-wrap items-start gap-x-6 my-1">
            <pre className="m-0 font-bold" style={{ color: C.accent, lineHeight: 1.2 }}>{`            .-/+oossssoo+/-.
        \`:+ssssssssssssssssss+:\`
      -+ssssssssssssssssssyyssss+-
    .ossssssssssssssssssdMMMNysssso.
   /ssssssssssshdmmNNmmyNMMMMhssssss/
  +ssssssssshmydMMMMMMMNddddyssssssss+
 /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/
.ssssssssdMMMNhsssssssssshNMMMdssssssss.
+sssshhhyNMMNyssssssssssssyNMMMysssssss+
ossyNMMMNyMMhsssssssssssssshmmmhssssssso
ossyNMMMNyMMhsssssssssssssshmmmhssssssso
+sssshhhyNMMNyssssssssssssyNMMMysssssss+
.ssssssssdMMMNhsssssssssshNMMMdssssssss.
 /sssssssshNMMMyhhyyyyhdNMMMNhssssssss/
  +sssssssssdmydMMMMMMMMddddyssssssss+
   /ssssssssssshdmNNNNmyNMMMMhssssss/
    .ossssssssssssssssssdMMMNysssso.
      -+sssssssssssssssssyyyssss+-
        \`:+ssssssssssssssssss+:\`
            .-/+oossssoo+/-.`}</pre>
            <div className="mt-1">
                <div className="font-bold"><span style={{ color: C.green }}>{USER}</span>@<span style={{ color: C.green }}>{HOST}</span></div>
                <div style={{ color: C.muted }}>{"-".repeat(USER.length + HOST.length + 1)}</div>
                {info.map(([k, v]) => (
                    <div key={k}><span className="font-bold" style={{ color: C.accent }}>{k}</span>: {v}</div>
                ))}
                <div className="flex mt-2">
                    {palette.map(p => <span key={p} className="inline-block w-6 h-4" style={{ background: `var(--t-${p})` }}></span>)}
                </div>
            </div>
        </div>
    );
}

export default Terminal

export const displayTerminal = (addFolder, openApp) => {
    return <Terminal addFolder={addFolder} openApp={openApp}> </Terminal>;
}
