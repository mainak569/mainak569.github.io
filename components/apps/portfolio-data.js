// Shared content + virtual filesystem for the Terminal and Files apps.

export const HOME = "/home/mainak";
export const USER = "mainak";
export const HOST = "lnmiit";
export const EMAIL = "mainak.lnmiit@gmail.com";
export const RESUME = "./files/Mainak-Das-Resume.pdf";

export const link = (href, label) => ({ type: "link", href, label: label || href });

export const PROJECTS = [
    { name: "JobFit", tagline: "Resume–job matching & skill analysis", date: "Sep 2026", stack: "Django REST · React + Vite · PostgreSQL · TF-IDF · Aho-Corasick", demo: "https://jobfit-livid.vercel.app", github: "https://github.com/mainak569/JobFit" },
    { name: "GAN-cmfd", tagline: "GAN-based copy-move forgery detection", date: "Nov 2025 – Apr 2026", stack: "PyTorch · Conditional GAN · U-Net · PatchGAN", github: "https://github.com/mainak569/GAN-cmfd" },
    { name: "ClinicOS", tagline: "Healthcare appointment management", date: "Sep 2025", stack: "Next.js · TypeScript · Tailwind · ShadCN · Jest", demo: "https://clinic-os-352p.vercel.app/", github: "https://github.com/mainak569/clinic-os" },
    { name: "Craafter", tagline: "AI full-stack website builder", date: "Jul 2025", stack: "Next.js · Gemini · E2B · Inngest · tRPC · Prisma", demo: "https://craafter.vercel.app/", github: "https://github.com/mainak569/craafter" },
    { name: "SyncPen", tagline: "Real-time docs, whiteboard & AI", date: "Jan 2025", stack: "Next.js · Convex · Clerk · Gemini", demo: "https://sync-pen-six.vercel.app/", github: "https://github.com/mainak569/SyncPen" },
];

export const SKILLS = [
    ["Languages", "C++, C, JavaScript, TypeScript, Python, Java, SQL, Bash"],
    ["Frontend", "React, Next.js, Tailwind CSS, ShadCN UI, Vite"],
    ["Backend", "Node.js, Django, DRF, tRPC, Convex, Inngest, REST APIs"],
    ["Databases", "PostgreSQL, MongoDB, Prisma"],
    ["AI / ML", "PyTorch, GANs / U-Net, Gemini, Pandas, Power BI, Alteryx"],
    ["Tooling", "Git, Linux, Jest, Clerk, E2B, Vercel"],
];

export const EDUCATION = [
    { id: "lnmiit", school: "The LNM Institute of Information Technology, Jaipur", course: "B.Tech, Computer & Communication Engineering", date: "2023 – 2027", score: "CGPA 7.63" },
    { id: "class-12", school: "Emmanuel Mission School, Kota", course: "Class 12 (CBSE) — PCM + Computer", date: "2021 – 2023", score: "94.3%" },
    { id: "class-10", school: "St. Patrick's Higher Secondary School, Asansol", course: "Class 10 (ICSE)", date: "2011 – 2021", score: "94.7%" },
];

export const EXPERIENCE = [
    { id: "icsc-data-analyst", role: "Data Analyst Intern", org: "IndoUG Commerce and Social Council", date: "Jun – Jul 2026", points: ["Cleaned & validated business data with Python, Pandas, SQL, PostgreSQL", "Built Alteryx ETL workflows and Power BI KPI dashboards"] },
    { id: "lusip-research", role: "Summer Research Intern", org: "LNMIIT × Dr. Indra Deep Mastan, IIT BHU", date: "Jun – Jul 2025", points: ["Unsupervised image restoration (Deep Image Prior)", "92.8% pixel precision, 0.666 IoU; PatchGAN +4.1% Region-mIoU"] },
    { id: "acm-secretary", role: "Secretary", org: "ACM Student Chapter, LNMIIT", date: "Aug 2025 – May 2026", points: ["Organized 3 large-scale technical events with 1000+ participants"] },
    { id: "teaching-assistant", role: "Teaching Assistant", org: "LNMIIT", date: "Aug 2024 – Apr 2025", points: ["DAA, ML models, Scripting Languages, Problem Solving"] },
];

export const SOCIAL = [
    ["GitHub", "https://github.com/mainak569", "github.com/mainak569"],
    ["LinkedIn", "https://www.linkedin.com/in/mainak13", "linkedin.com/in/mainak13"],
    ["LeetCode", "https://leetcode.com/u/mainak13/", "leetcode.com/u/mainak13"],
    ["CodeChef", "https://www.codechef.com/users/mainak_13", "codechef.com/users/mainak_13"],
    ["Codeforces", "https://codeforces.com/profile/mainak13", "codeforces.com/profile/mainak13"],
    ["GeeksforGeeks", "https://www.geeksforgeeks.org/profile/mainaklk377", "geeksforgeeks.org/profile/mainaklk377"],
];

// ---------- virtual file system ----------
// file content is a list of lines: a string, or an array of strings / link() parts
const file = (content) => ({ type: "file", content });
const dir = (children) => ({ type: "dir", children });
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const FS = dir({
    "projects": dir(Object.fromEntries(PROJECTS.map(p => [`${p.name}.md`, file([
        `# ${p.name} — ${p.tagline}`,
        p.date,
        "",
        p.stack,
        "",
        ...(p.demo ? [["demo:   ", link(p.demo)]] : []),
        ["github: ", link(p.github)],
    ])]))),
    "experience": dir(Object.fromEntries(EXPERIENCE.map(x => [`${x.id}.txt`, file([
        `# ${x.role} — ${x.org}`,
        x.date,
        "",
        ...x.points.map(p => `- ${p}`),
    ])]))),
    "education": dir(Object.fromEntries(EDUCATION.map(e => [`${e.id}.txt`, file([
        `# ${e.school}`,
        e.date,
        "",
        e.course,
        e.score,
    ])]))),
    "skills": dir(Object.fromEntries(SKILLS.map(([k, v]) => [`${slug(k)}.txt`, file([`# ${k}`, "", ...v.split(", ").map(s => `- ${s}`)])]))),
    "interests": dir({
        "competitive-programming.txt": file(["# Competitive programming", "", "LeetCode Knight (1900+), CodeChef 3★.", "Segment trees, DP and graphs are my happy place."]),
        "deep-learning.txt": file(["# Deep learning & computer vision", "", "GANs, U-Nets and image restoration —", "from LUSIP research to copy-move forgery detection."]),
        "building-products.txt": file(["# Building products", "", "Shipping full-stack apps with Next.js, React & TypeScript,", "from AI website builders to healthcare platforms."]),
        "community.txt": file(["# Community", "", "ACM Student Chapter secretary and teaching assistant —", "events for 1000+ students and a lot of office hours."]),
    }),
    "contact": dir({
        "email.txt": file([["Email    ", link(`mailto:${EMAIL}`, EMAIL)], ["College  ", link("mailto:23ucc569@lnmiit.ac.in", "23ucc569@lnmiit.ac.in")]]),
        "phone.txt": file([["Phone    ", link("tel:+919653723589", "+91-9653723589")]]),
        "social.txt": file(SOCIAL.map(([name, href, label]) => [name.padEnd(15), link(href, label)])),
    }),
    "about.txt": file([
        "Mainak Das — Full-Stack Developer",
        "B.Tech, Computer & Communication Engineering @ LNMIIT Jaipur (2023 – 2027)",
        "",
        "I build full-stack products with Next.js, React & TypeScript,",
        "love competitive programming (LeetCode Knight, CodeChef 3★),",
        "and enjoy deep learning & computer vision research.",
    ]),
    "achievements.txt": file([
        "🏆 LeetCode Knight (1900+ rating)",
        "⭐ CodeChef 3-Star",
        "🎓 Secretary, ACM Student Chapter — LNMIIT",
    ]),
    "resume.pdf": { type: "file", href: RESUME, content: ["Binary file. Run 'resume' to open it."] },
    ".secret": file(["You found it! 🎉  Hire me: " + EMAIL]),
    "personal-documents": { type: "dir", locked: true, children: {} },
});

// ---------- path helpers ----------
export const normalize = (cwd, target) => {
    if (!target || target === "~") return HOME;
    const path = target.startsWith("~") ? HOME + target.slice(1) : (target.startsWith("/") ? target : `${cwd}/${target}`);
    const parts = [];
    path.split("/").forEach(part => {
        if (!part || part === ".") return;
        if (part === "..") parts.pop();
        else parts.push(part);
    });
    return "/" + parts.join("/");
};

export const getNode = (absPath) => {
    if (absPath === HOME) return FS;
    if (!absPath.startsWith(HOME + "/")) return null;
    let node = FS;
    for (const part of absPath.slice(HOME.length + 1).split("/")) {
        if (!node || node.type !== "dir" || !(part in node.children)) return null;
        node = node.children[part];
    }
    return node;
};

export const prettyPath = (absPath) => absPath === HOME ? "~" : (absPath.startsWith(HOME + "/") ? "~" + absPath.slice(HOME.length) : absPath);
