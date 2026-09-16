import React, { Component } from 'react';
import ReactGA from 'react-ga4';

const HOME = "/home/mainak";
const USER = "mainak";
const HOST = "ubuntu";

const link = (href, label) => ({ type: "link", href, label: label || href });

// ---------- virtual file system ----------
const file = (content) => ({ type: "file", content });
const dir = (children) => ({ type: "dir", children });

const FS = dir({
    "about.txt": file([
        "Mainak Das — Full-Stack Developer",
        "B.Tech, Computer & Communication Engineering @ LNMIIT Jaipur (2023 – 2027)",
        "",
        "I build full-stack products with Next.js, React & TypeScript,",
        "love competitive programming (LeetCode Knight, CodeChef 3★),",
        "and enjoy deep learning & computer vision research.",
    ]),
    "contact.txt": file([
        ["Email     ", link("mailto:mainak.lnmiit@gmail.com", "mainak.lnmiit@gmail.com")],
        ["College   ", link("mailto:23ucc569@lnmiit.ac.in", "23ucc569@lnmiit.ac.in")],
        ["Phone     ", link("tel:+919653723589", "+91-9653723589")],
        ["GitHub    ", link("https://github.com/mainak569", "github.com/mainak569")],
        ["LinkedIn  ", link("https://www.linkedin.com/in/mainak13", "linkedin.com/in/mainak13")],
        ["LeetCode  ", link("https://leetcode.com/u/mainak13/", "leetcode.com/u/mainak13")],
    ]),
    "resume.pdf": file(["Binary file. Run 'resume' to open it."]),
    "projects": dir({
        "JobFit.md": file([
            "# JobFit — Resume–Job Matching & Skill Analysis (Sep 2026)",
            "Django REST Framework · React + Vite · PostgreSQL · TF-IDF · Aho-Corasick",
            "- Match scores, missing-skill insights & suggestions for resumes vs job descriptions",
            "- Hand-written Aho-Corasick automaton over a 146-skill taxonomy",
            "- Custom TF-IDF + cosine similarity engine, no external ML libraries",
            ["demo:   ", link("https://jobfit-livid.vercel.app")],
            ["github: ", link("https://github.com/mainak569/JobFit")],
        ]),
        "GAN-cmfd.md": file([
            "# GAN-based Copy-Move Forgery Detection (Nov 2025 – Apr 2026)",
            "Python · PyTorch · Conditional GAN · U-Net · PatchGAN",
            "- Pixel-level localization of copy-move forgeries on CoMoFoD",
            "- Weighted BCE + Dice + adversarial loss against 5:1 class imbalance",
            ["github: ", link("https://github.com/mainak569/GAN-cmfd")],
        ]),
        "clinic-os.md": file([
            "# ClinicOS — Healthcare Appointment Management (Sep 2025)",
            "Next.js · React · TypeScript · Tailwind CSS · ShadCN UI · Jest",
            "- Scheduling, patient records, dashboards & role-based workflows",
            ["demo:   ", link("https://clinic-os-352p.vercel.app/")],
            ["github: ", link("https://github.com/mainak569/clinic-os")],
        ]),
        "craafter.md": file([
            "# Craafter — AI Full-Stack Website Builder (Jul 2025)",
            "Next.js · TypeScript · Gemini · E2B · Inngest · tRPC · Prisma",
            "- Generates, previews & iterates Next.js apps from prompts in cloud sandboxes",
            ["demo:   ", link("https://craafter.vercel.app/")],
            ["github: ", link("https://github.com/mainak569/craafter")],
        ]),
        "SyncPen.md": file([
            "# SyncPen — Real-time Docs, Whiteboard & AI (Jan 2025)",
            "Next.js · Convex · Clerk · Gemini · Tailwind CSS · ShadCN",
            "- Notion-style editor + Excalidraw-like whiteboard + page-aware AI chat",
            ["demo:   ", link("https://sync-pen-six.vercel.app/")],
            ["github: ", link("https://github.com/mainak569/SyncPen")],
        ]),
    }),
    "experience": dir({
        "ICSC-data-analyst.txt": file([
            "Data Analyst Intern — IndoUG Commerce and Social Council (Jun – Jul 2026, Remote)",
            "- Cleaned & validated business data with Python, Pandas, SQL and PostgreSQL",
            "- Built Alteryx ETL workflows and Power BI KPI dashboards",
        ]),
        "LUSIP-research.txt": file([
            "Summer Research Intern — LNMIIT × Dr. Indra Deep Mastan, IIT BHU (Jun – Jul 2025)",
            "- Unsupervised image restoration (Deep Image Prior): denoising, super-resolution",
            "- 92.8% pixel precision, 0.666 IoU; PatchGAN gave +4.1% Region-mIoU over U-Net",
        ]),
        "teaching-assistant.txt": file([
            "Teaching Assistant — LNMIIT (Aug 2024 – Apr 2025)",
            "- DAA, ML models, Scripting Languages, Problem Solving",
        ]),
        "acm-secretary.txt": file([
            "Secretary — ACM Student Chapter, LNMIIT (Aug 2025 – May 2026)",
            "- Organized 3 large-scale technical events with 1000+ participants",
        ]),
    }),
    "skills": dir({
        "languages.txt": file(["C++  C  JavaScript  TypeScript  Python  Java  SQL  Bash"]),
        "frontend.txt": file(["React  Next.js  Tailwind CSS  ShadCN UI  Vite"]),
        "backend.txt": file(["Node.js  Django  Django REST Framework  tRPC  Convex  Inngest  REST APIs"]),
        "databases.txt": file(["PostgreSQL  MongoDB  Prisma"]),
        "ai-ml-data.txt": file(["PyTorch  GANs / U-Net  Gemini  Pandas  Power BI  Alteryx"]),
        "tools.txt": file(["Git  Linux  Jest  Clerk  E2B  Vercel"]),
    }),
    "achievements.txt": file([
        "🏆 LeetCode Knight (1900+ rating)",
        "⭐ CodeChef 3-Star",
        "🎓 Secretary, ACM Student Chapter — LNMIIT",
    ]),
    "personal-documents": { type: "dir", locked: true, children: {} },
});

const APP_COMMANDS = {
    "code": "vscode",
    "spotify": "spotify",
    "chrome": "chrome",
    "calc": "calc",
    "settings": "settings",
    "trash": "trash",
    "about-mainak": "about-mainak",
    "contacts": "contacts",
    "sendmsg": "gedit",
    "email": "gedit",
};

const LINK_COMMANDS = {
    "github": "https://github.com/mainak569",
    "linkedin": "https://www.linkedin.com/in/mainak13",
    "leetcode": "https://leetcode.com/u/mainak13/",
    "resume": "./files/Mainak-Das-Resume.pdf",
};

const COMMANDS = [
    "help", "ls", "cd", "pwd", "cat", "echo", "clear", "history", "whoami", "date", "uname", "neofetch",
    "mkdir", "open", "exit", "sudo", "rm", ...Object.keys(APP_COMMANDS), ...Object.keys(LINK_COMMANDS),
];

// ---------- path helpers ----------
const normalize = (cwd, target) => {
    if (!target || target === "~") return HOME;
    let path = target.startsWith("~") ? HOME + target.slice(1) : (target.startsWith("/") ? target : `${cwd}/${target}`);
    const parts = [];
    path.split("/").forEach(part => {
        if (!part || part === ".") return;
        if (part === "..") parts.pop();
        else parts.push(part);
    });
    return "/" + parts.join("/");
};

const getNode = (absPath) => {
    if (absPath === HOME) return FS;
    if (!absPath.startsWith(HOME + "/")) return null;
    let node = FS;
    for (const part of absPath.slice(HOME.length + 1).split("/")) {
        if (!node || node.type !== "dir" || !(part in node.children)) return null;
        node = node.children[part];
    }
    return node;
};

const prettyPath = (absPath) => absPath === HOME ? "~" : (absPath.startsWith(HOME + "/") ? "~" + absPath.slice(HOME.length) : absPath);

export class Terminal extends Component {
    constructor() {
        super();
        this.inputRef = React.createRef();
        this.bottomRef = React.createRef();
        this.history = [];
        this.historyIndex = 0;
        this.state = {
            cwd: HOME,
            input: "",
            lines: [{ type: "welcome" }],
        };
    }

    componentDidMount() {
        this.focus();
    }

    componentDidUpdate() {
        // scroll only the window's own scroll area (scrollIntoView would also shift the whole desktop)
        const scroller = this.bottomRef.current && this.bottomRef.current.closest(".windowMainScreen");
        if (scroller) scroller.scrollTop = scroller.scrollHeight;
    }

    focus = () => {
        // don't steal focus from a text selection
        if (window.getSelection && String(window.getSelection())) return;
        if (this.inputRef.current) this.inputRef.current.focus({ preventScroll: true });
    }

    print = (cwd, command, output) => {
        this.setState(prev => ({
            lines: [...prev.lines, { type: "command", cwd, command }, ...(output ? [{ type: "output", content: output }] : [])],
        }));
    }

    run = (raw) => {
        const command = raw.trim();
        const cwd = this.state.cwd;
        if (!command) {
            this.print(cwd, "", null);
            return;
        }
        this.history.push(command);
        this.historyIndex = this.history.length;

        const [main, ...args] = command.split(/\s+/);
        const rest = args.join(" ");
        let out = null;

        switch (main) {
            case "help":
                out = [
                    "Available commands:",
                    "  ls [dir]          list files            cd <dir>     change directory (.., ~, -)",
                    "  cat <file>        print a file          pwd          print working directory",
                    "  whoami            who is Mainak?        neofetch     system info",
                    "  echo <text>       print text            history      command history",
                    "  date / uname -a   date & system         clear        clear screen (Ctrl+L)",
                    "  mkdir <name>      folder on desktop     exit         close terminal",
                    "Apps:   about-mainak, contacts, email, code, chrome, spotify, calc, settings, trash",
                    "Links:  resume, github, linkedin, leetcode",
                    "Tip: use Tab to autocomplete and ↑/↓ for history. Try 'cat about.txt'.",
                ];
                break;
            case "ls": {
                const flags = args.filter(a => a.startsWith("-"));
                const target = args.find(a => !a.startsWith("-"));
                const path = normalize(cwd, target);
                const node = getNode(path);
                if (!node) out = [`ls: cannot access '${target}': No such file or directory`];
                else if (node.locked) out = ["ls: cannot open directory: Permission denied 🙃"];
                else if (node.type === "file") out = [target];
                else {
                    const entries = Object.entries(node.children);
                    if (flags.some(f => f.includes("l"))) {
                        out = entries.map(([name, n]) => ({ type: "entry", name, node: n, long: true }));
                    } else {
                        out = [{ type: "entries", entries }];
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
                    if (!node) out.push(`cat: ${arg}: No such file or directory`);
                    else if (node.type === "dir") out.push(`cat: ${arg}: Is a directory`);
                    else out.push(...node.content);
                });
                break;
            }
            case "echo":
                out = [rest];
                break;
            case "history":
                out = this.history.map((h, i) => `${String(i + 1).padStart(4)}  ${h}`);
                break;
            case "whoami":
                out = [
                    "Mainak Das — Full-Stack Developer",
                    "B.Tech CCE @ LNMIIT Jaipur · LeetCode Knight · CodeChef 3★",
                    ["Reach me: ", link("mailto:mainak.lnmiit@gmail.com", "mainak.lnmiit@gmail.com")],
                ];
                break;
            case "date":
                out = [new Date().toString()];
                break;
            case "uname":
                out = [args.includes("-a") ? "Linux ubuntu 6.8.0-mainak #1 SMP x86_64 GNU/Linux" : "Linux"];
                break;
            case "neofetch":
                out = [{ type: "neofetch" }];
                break;
            case "mkdir":
                if (!args[0]) out = ["mkdir: missing operand"];
                else { this.props.addFolder(rest); out = [`Created folder '${rest}' on the Desktop`]; }
                break;
            case "open":
                if (APP_COMMANDS[args[0]]) { this.props.openApp(APP_COMMANDS[args[0]]); }
                else out = [`open: unknown app '${args[0] || ""}'`];
                break;
            case "exit":
                document.getElementById("close-terminal").click();
                return;
            case "clear":
                this.setState({ lines: [] });
                return;
            case "sudo":
                ReactGA.event({ category: "Sudo Access", action: "lol" });
                out = [{ type: "image", src: "./images/memes/used-sudo-command.webp" }];
                break;
            case "rm":
                out = [args.includes("-rf") || args.includes("-fr") ? "Nice try. This portfolio is read-only 😄" : "rm: permission denied"];
                break;
            default:
                if (APP_COMMANDS[main]) {
                    this.props.openApp(APP_COMMANDS[main]);
                } else if (LINK_COMMANDS[main]) {
                    window.open(LINK_COMMANDS[main], "_blank", "noopener");
                    out = [`Opening ${main}...`];
                } else {
                    out = [`${main}: command not found. Type 'help' to see available commands.`];
                }
        }
        this.print(cwd, command, out);
    }

    complete = () => {
        const { input, cwd } = this.state;
        const parts = input.split(/\s+/);
        if (parts.length <= 1) {
            const matches = COMMANDS.filter(c => c.startsWith(parts[0]));
            if (matches.length === 1) this.setState({ input: matches[0] + " " });
            else if (matches.length > 1) this.print(cwd, input, [matches.join("  ")]);
            return;
        }
        const partial = parts[parts.length - 1];
        const slash = partial.lastIndexOf("/");
        const base = slash >= 0 ? partial.slice(0, slash + 1) : "";
        const prefix = partial.slice(slash + 1);
        const node = getNode(normalize(cwd, base || "."));
        if (!node || node.type !== "dir" || node.locked) return;
        const matches = Object.keys(node.children).filter(n => n.startsWith(prefix));
        if (matches.length === 1) {
            const name = matches[0];
            parts[parts.length - 1] = base + name + (node.children[name].type === "dir" ? "/" : "");
            this.setState({ input: parts.join(" ") });
        } else if (matches.length > 1) {
            this.print(cwd, input, [matches.join("  ")]);
        }
    }

    handleKeyDown = (e) => {
        if (e.key === "Enter") {
            const input = this.state.input;
            this.setState({ input: "" });
            this.run(input);
        } else if (e.key === "Tab") {
            e.preventDefault();
            this.complete();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.setState({ input: this.history[this.historyIndex] });
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.setState({ input: this.history[this.historyIndex] });
            } else {
                this.historyIndex = this.history.length;
                this.setState({ input: "" });
            }
        } else if (e.key === "l" && e.ctrlKey) {
            e.preventDefault();
            this.setState({ lines: [] });
        } else if (e.key === "c" && e.ctrlKey && !String(window.getSelection())) {
            e.preventDefault();
            this.print(this.state.cwd, this.state.input + "^C", null);
            this.setState({ input: "" });
        }
    }

    renderPrompt = (cwd) => (
        <span className="whitespace-nowrap">
            <span className="text-ubt-green font-bold">{USER}@{HOST}</span>
            <span className="text-white font-bold">:</span>
            <span className="text-ubt-blue font-bold">{prettyPath(cwd)}</span>
            <span className="text-white font-bold mr-2">$</span>
        </span>
    )

    renderInline = (part, key) => {
        if (typeof part === "string") return <span key={key}>{part}</span>;
        if (part && part.type === "link") {
            return <a key={key} href={part.href} target={part.href.startsWith("http") || part.href.startsWith("./") ? "_blank" : undefined} rel="noreferrer" className="underline text-ubt-gedit-blue hover:text-white">{part.label}</a>;
        }
        return null;
    }

    renderOutputLine = (line, i) => {
        if (Array.isArray(line)) return <div key={i}>{line.map(this.renderInline)}</div>;
        if (typeof line === "string") return <div key={i}>{line || " "}</div>;
        if (line.type === "link") return <div key={i}>{this.renderInline(line)}</div>;
        if (line.type === "image") return <img key={i} className="w-2/5 my-1" src={line.src} alt="meme" />;
        if (line.type === "entries") {
            return (
                <div key={i} className="flex flex-wrap">
                    {line.entries.map(([name, node]) => (
                        <span key={name} className={"mr-4 " + (node.type === "dir" ? "text-ubt-blue font-bold" : "text-white")}>{name}{node.type === "dir" ? "/" : ""}</span>
                    ))}
                </div>
            );
        }
        if (line.type === "entry") {
            const isDir = line.node.type === "dir";
            return (
                <div key={i} className="whitespace-pre">
                    <span className="text-gray-400">{isDir ? (line.node.locked ? "d---------" : "drwxr-xr-x") : "-rw-r--r--"}  mainak mainak  </span>
                    <span className={isDir ? "text-ubt-blue font-bold" : ""}>{line.name}</span>
                </div>
            );
        }
        if (line.type === "neofetch") return <Neofetch key={i} />;
        return null;
    }

    render() {
        return (
            <div className="min-h-full w-full bg-ub-drk-abrgn text-white text-sm font-mono p-1.5 cursor-text" id="terminal-body" onClick={this.focus}>
                {this.state.lines.map((line, i) => {
                    if (line.type === "welcome") {
                        return (
                            <div key={i} className="mb-2 text-gray-300">
                                Welcome to Ubuntu 22.04 LTS (mainak.me) — type <span className="text-ubt-gedit-orange">help</span> to get started.
                            </div>
                        );
                    }
                    if (line.type === "command") {
                        return (
                            <div key={i} className="flex flex-wrap break-all">
                                {this.renderPrompt(line.cwd)}
                                <span className="whitespace-pre-wrap">{line.command}</span>
                            </div>
                        );
                    }
                    return <div key={i} className="mb-1 whitespace-pre-wrap break-words">{line.content.map(this.renderOutputLine)}</div>;
                })}
                <div className="flex items-center" ref={this.bottomRef}>
                    {this.renderPrompt(this.state.cwd)}
                    <input
                        ref={this.inputRef}
                        value={this.state.input}
                        onChange={(e) => this.setState({ input: e.target.value })}
                        onKeyDown={this.handleKeyDown}
                        className="flex-1 min-w-0 bg-transparent outline-none text-white font-mono"
                        style={{ caretColor: "#fff" }}
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
}

function Neofetch() {
    const info = [
        ["", `${USER}@${HOST}`],
        ["", "-------------"],
        ["OS", "Ubuntu 22.04 LTS (web)"],
        ["Host", "mainak.me"],
        ["Kernel", "Next.js 14 + React 18"],
        ["Shell", "bash (react edition)"],
        ["Theme", "Yaru-dark"],
        ["Languages", "C++, TypeScript, Python, Java"],
        ["Stack", "Next.js, React, Node, Django, PostgreSQL"],
        ["LeetCode", "Knight (1900+)"],
        ["CodeChef", "3★"],
    ];
    return (
        <div className="flex flex-wrap items-start my-1">
            <pre className="text-ub-orange mr-4 leading-tight" style={{ color: "#E95420" }}>{`            .-/+oossssoo+/-.
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
            <div className="mt-2">
                {info.map(([k, v], i) => (
                    <div key={i}>{k ? <span className="font-bold" style={{ color: "#E95420" }}>{k}: </span> : null}<span className={i === 0 ? "font-bold text-ubt-green" : ""}>{v}</span></div>
                ))}
            </div>
        </div>
    );
}

export default Terminal

export const displayTerminal = (addFolder, openApp) => {
    return <Terminal addFolder={addFolder} openApp={openApp}> </Terminal>;
}
