import React, { Component } from 'react';

const icon = (slug, color) => `https://cdn.simpleicons.org/${slug}/${color}`;

const MailIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="rgb(var(--accent))" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
);
const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#4E9A06" strokeWidth="2"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
);
const GlobeIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#50B6C6" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>
);
const FileIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#F39A21" strokeWidth="2"><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></svg>
);

const GROUPS = [
    {
        title: "Reach me",
        items: [
            { label: "Email", value: "mainak.lnmiit@gmail.com", href: "mailto:mainak.lnmiit@gmail.com", Icon: MailIcon },
            { label: "College Email", value: "23ucc569@lnmiit.ac.in", href: "mailto:23ucc569@lnmiit.ac.in", Icon: MailIcon },
            { label: "Phone", value: "+91 96537 23589", copy: "+919653723589", href: "tel:+919653723589", Icon: PhoneIcon },
            { label: "Website", value: "mainak.me", href: "https://mainak.me", Icon: GlobeIcon },
            { label: "Resume", value: "Mainak-Das-Resume.pdf", href: "./files/Mainak-Das-Resume.pdf", Icon: FileIcon },
        ],
    },
    {
        title: "Social",
        items: [
            { label: "GitHub", value: "github.com/mainak569", href: "https://github.com/mainak569", img: icon("github", "white") },
            { label: "LinkedIn", value: "linkedin.com/in/mainak13", href: "https://www.linkedin.com/in/mainak13", img: "./themes/Yaru/apps/linkedin.svg" },
        ],
    },
    {
        title: "Competitive Programming",
        items: [
            { label: "LeetCode", value: "mainak13 · Knight (1900+)", copy: "https://leetcode.com/u/mainak13/", href: "https://leetcode.com/u/mainak13/", img: icon("leetcode", "FFA116") },
            { label: "CodeChef", value: "mainak_13 · 3★", copy: "https://www.codechef.com/users/mainak_13", href: "https://www.codechef.com/users/mainak_13", img: icon("codechef", "white") },
            { label: "Codeforces", value: "mainak13", copy: "https://codeforces.com/profile/mainak13", href: "https://codeforces.com/profile/mainak13", img: icon("codeforces", "1F8ACB") },
            { label: "GeeksforGeeks", value: "mainaklk377", copy: "https://www.geeksforgeeks.org/profile/mainaklk377", href: "https://www.geeksforgeeks.org/profile/mainaklk377", img: icon("geeksforgeeks", "2F8D46") },
            { label: "Code360 (Coding Ninjas)", value: "naukri.com/code360", href: "https://www.naukri.com/code360/profile/c67f4463-4965-48ff-ae29-6286770a9a04", Icon: GlobeIcon },
        ],
    },
];

export class Contacts extends Component {
    constructor() {
        super();
        this.state = { copied: null };
    }

    copy = async (text, key) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (e) {
            const el = document.createElement("textarea");
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
        }
        this.setState({ copied: key });
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.setState({ copied: null }), 1500);
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        return (
            <div className="w-full h-full flex flex-col bg-ub-cool-grey text-white select-none overflow-y-auto windowMainScreen">
                <div className="flex flex-col sm:flex-row items-center px-4 sm:px-8 py-5 border-b border-black border-opacity-40">
                    <img src="./images/logos/mainak.webp" alt="Mainak Das" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-lg border-2 border-white border-opacity-20" />
                    <div className="sm:ml-5 mt-3 sm:mt-0 text-center sm:text-left">
                        <div className="text-2xl font-bold">Mainak Das</div>
                        <div className="text-sm text-gray-300">Full-Stack Developer · B.Tech CCE, LNMIIT Jaipur</div>
                        <div className="flex flex-wrap justify-center sm:justify-start mt-2 text-sm">
                            <a href="mailto:mainak.lnmiit@gmail.com" className="px-3 py-1 mr-2 mt-1 rounded bg-ub-orange hover:bg-opacity-90">Email</a>
                            <a href="tel:+919653723589" className="px-3 py-1 mr-2 mt-1 rounded border border-gray-50 border-opacity-30 hover:bg-white hover:bg-opacity-10">Call</a>
                            <a href="https://www.linkedin.com/in/mainak13" target="_blank" rel="noreferrer" className="px-3 py-1 mt-1 rounded border border-gray-50 border-opacity-30 hover:bg-white hover:bg-opacity-10">LinkedIn</a>
                        </div>
                    </div>
                </div>

                <div className="px-3 sm:px-8 py-3">
                    {GROUPS.map(group => (
                        <div key={group.title} className="mb-4">
                            <div className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1 px-1">{group.title}</div>
                            <div className="rounded-md border border-black border-opacity-30 bg-ub-grey bg-opacity-60 divide-y divide-black divide-opacity-30">
                                {group.items.map(item => {
                                    const key = group.title + item.label;
                                    const external = item.href.startsWith("http") || item.href.startsWith("./");
                                    return (
                                        <div key={key} className="flex items-center px-3 py-2 hover:bg-white hover:bg-opacity-5">
                                            <div className="w-8 flex-shrink-0 flex items-center">
                                                {item.img ? <img src={item.img} alt="" className="w-5 h-5" /> : <item.Icon />}
                                            </div>
                                            <a href={item.href} target={external ? "_blank" : undefined} rel="noreferrer" className="flex-grow min-w-0">
                                                <div className="text-xs text-gray-400">{item.label}</div>
                                                <div className="text-sm truncate hover:underline">{item.value}</div>
                                            </a>
                                            <button
                                                onClick={() => this.copy(item.copy || item.value, key)}
                                                title="Copy"
                                                className="ml-2 flex-shrink-0 text-xs px-2 py-1 rounded border border-gray-50 border-opacity-20 hover:bg-white hover:bg-opacity-10 focus:outline-none w-16"
                                            >
                                                {this.state.copied === key ? "Copied ✓" : "Copy"}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Contacts;

export const displayContacts = () => {
    return <Contacts />;
}
