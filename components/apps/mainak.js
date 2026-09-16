import React, { Component } from 'react';
import ReactGA from 'react-ga4';

const RESUME_PATH = "./files/Mainak-Das-Resume.pdf";

const sections = [
    { id: "about", label: "About Me", icon: "./themes/Yaru/status/about.svg" },
    { id: "education", label: "Education", icon: "./themes/Yaru/status/education.svg" },
    { id: "experience", label: "Experience", icon: "./themes/Yaru/status/experience.svg" },
    { id: "projects", label: "Projects", icon: "./themes/Yaru/status/projects.svg" },
    { id: "skills", label: "Skills", icon: "./themes/Yaru/status/skills.svg" },
    { id: "resume", label: "Resume", icon: "./themes/Yaru/status/download.svg" },
];

export class AboutMainak extends Component {

    constructor() {
        super();
        this.screens = {};
        this.state = {
            screen: () => { },
            active_screen: "about", // by default 'about' screen is active
            navbar: false,
        }
    }

    componentDidMount() {
        this.screens = {
            "about": <About />,
            "education": <Education />,
            "experience": <Experience />,
            "projects": <Projects />,
            "skills": <Skills />,
            "resume": <Resume />,
        }

        let lastVisitedScreen = localStorage.getItem("about-section");
        if (!lastVisitedScreen || !(lastVisitedScreen in this.screens)) {
            lastVisitedScreen = "about";
        }

        // focus last visited screen
        this.changeScreen(document.getElementById(lastVisitedScreen));
    }

    changeScreen = (e) => {
        const screen = e.id || e.target.id;

        // store this state
        localStorage.setItem("about-section", screen);

        // google analytics
        ReactGA.send({ hitType: "pageview", page: `/${screen}`, title: "Custom Title" });

        this.setState({
            screen: this.screens[screen],
            active_screen: screen
        });
    }

    showNavBar = () => {
        this.setState({ navbar: !this.state.navbar });
    }

    renderNavLinks = () => {
        return (
            <>
                {sections.map(section => (
                    <div key={section.id} id={section.id} tabIndex="0" onFocus={this.changeScreen} className={(this.state.active_screen === section.id ? " bg-ub-orange bg-opacity-100 hover:bg-opacity-95" : " hover:bg-gray-50 hover:bg-opacity-5 ") + " w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5"}>
                        <img className=" w-3 md:w-4" alt={section.label} src={section.icon} />
                        <span className=" ml-1 md:ml-2 text-gray-50 ">{section.label}</span>
                    </div>
                ))}
            </>
        );
    }

    render() {
        return (
            <div className="w-full h-full flex bg-ub-cool-grey text-white select-none relative">
                <div className="md:flex hidden flex-col w-1/4 md:w-1/5 text-sm overflow-y-auto windowMainScreen border-r border-black">
                    {this.renderNavLinks()}
                </div>
                <div onClick={this.showNavBar} className="md:hidden flex flex-col items-center justify-center absolute bg-ub-cool-grey rounded w-6 h-6 top-1 left-1 z-20">
                    <div className=" w-3.5 border-t border-white"></div>
                    <div className=" w-3.5 border-t border-white" style={{ marginTop: "2pt", marginBottom: "2pt" }}></div>
                    <div className=" w-3.5 border-t border-white"></div>
                    <div className={(this.state.navbar ? " visible animateShow z-30 " : " invisible ") + " md:hidden text-xs absolute bg-ub-cool-grey py-0.5 px-1 rounded-sm top-full mt-1 left-0 shadow border-black border border-opacity-20"}>
                        {this.renderNavLinks()}
                    </div>
                </div>
                <div className="flex flex-col w-3/4 md:w-4/5 justify-start items-center flex-grow bg-ub-grey overflow-y-auto windowMainScreen pb-6">
                    {this.state.screen}
                </div>
            </div>
        );
    }
}

export default AboutMainak;

export const displayAboutMainak = () => {
    return <AboutMainak />;
}

function Heading({ children }) {
    return (
        <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
            {children}
            <div className="absolute pt-px bg-white mt-px top-full w-full">
                <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-full"></div>
                <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-full"></div>
            </div>
        </div>
    );
}

function ExtLink({ href, children, className = "" }) {
    return <a href={href} target="_blank" rel="noreferrer" className={"underline hover:text-ubt-gedit-orange " + className}>{children}</a>;
}

function About() {
    return (
        <>
            <div className="w-20 md:w-28 my-4 rounded-full shadow-lg">
                <img className="w-full rounded-full" src="./images/logos/avatar.svg" alt="Mainak Das" />
            </div>
            <div className=" mt-4 md:mt-8 text-lg md:text-2xl text-center px-1">
                <div>my name is <span className="font-bold">Mainak Das</span> ,</div>
                <div className="font-normal ml-1">I'm a <span className="text-pink-600 font-bold">Full-Stack Developer!</span></div>
            </div>
            <div className=" mt-4 relative md:my-8 pt-px bg-white w-32 md:w-48">
                <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 left-0"></div>
                <div className="bg-white absolute rounded-full p-0.5 md:p-1 top-0 transform -translate-y-1/2 right-0"></div>
            </div>
            <ul className=" mt-4 leading-tight tracking-tight text-sm md:text-base w-5/6 md:w-3/4 emoji-list">
                <li className=" list-pc">I'm a <span className=" font-medium">B.Tech student in Computer &amp; Communication Engineering</span> at <ExtLink href="https://lnmiit.ac.in/">LNMIIT Jaipur</ExtLink> (class of 2027), open to software engineering opportunities! ( Hit me up <a className='text-underline' href='mailto:mainak.lnmiit@gmail.com'><u>@mainak.lnmiit@gmail.com</u></a> :) )</li>
                <li className=" mt-3 list-building"> I enjoy building full-stack products with <span className="font-medium">Next.js, React &amp; TypeScript</span> — from AI website builders to healthcare platforms.</li>
                <li className=" mt-3 list-time"> I've done research on unsupervised image restoration with Dr. Indra Deep Mastan (IIT BHU), interned as a Data Analyst at ICSC, and served as a Teaching Assistant and ACM Secretary at LNMIIT.</li>
                <li className=" mt-3 list-star"> I'm a competitive programmer too — <span className="font-medium">LeetCode Knight (1900+)</span> and <span className="font-medium">CodeChef 3★</span> — with a soft spot for Deep Learning &amp; Computer Vision!</li>
            </ul>
        </>
    )
}

function Education() {
    const education = [
        {
            name: "The LNM Institute of Information Technology, Jaipur",
            link: "https://lnmiit.ac.in/",
            date: "Aug 2023 - May 2027",
            course: "B.Tech, Computer and Communication Engineering",
            score: "CGPA   7.63",
        },
        {
            name: "Emmanuel Mission School, Kota",
            date: "2021 - 2023",
            course: <>Class 12<sup>th</sup> (CBSE) — Physics, Chemistry, Maths + Computer</>,
            score: "Percentage   94.3%",
        },
        {
            name: "St. Patrick's Higher Secondary School, Asansol",
            date: "2011 - 2021",
            course: <>Class 10<sup>th</sup> (ICSE)</>,
            score: "Percentage   94.7%",
        },
    ];

    return (
        <>
            <Heading>Education</Heading>
            <ul className=" w-10/12  mt-4 ml-4 px-0 md:px-1">
                {education.map((edu, index) => (
                    <li key={index} className={"list-disc" + (index > 0 ? " mt-5" : "")}>
                        <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                            {edu.link ? <a href={edu.link} target="_blank" rel="noreferrer" className="hover:underline">{edu.name}</a> : edu.name}
                        </div>
                        <div className=" text-sm text-gray-400 mt-0.5">{edu.date}</div>
                        <div className=" text-sm md:text-base">{edu.course}</div>
                        <div className="text-sm text-gray-300 font-bold mt-1 whitespace-pre">{edu.score}</div>
                    </li>
                ))}
            </ul>
        </>
    )
}

function Experience() {
    const experience = [
        {
            role: "Data Analyst Intern",
            org: "IndoUG Commerce and Social Council (ICSC)",
            date: "Jun 2026 - Jul 2026",
            mode: "Remote",
            proof: { label: "Offer", link: "https://drive.google.com/file/d/1YXwnkXvkPs33LTNBzFanqypRv4S55HYx/view?usp=sharing" },
            points: [
                "Analyzed and prepared structured business data using Python, Pandas, SQL and PostgreSQL, improving data quality through cleaning, validation and standardization.",
                "Built ETL workflows with Alteryx and developed Power BI dashboards to track KPIs, identify trends and support business reporting and decision-making.",
            ],
        },
        {
            role: "Summer Research Intern (LUSIP)",
            org: "LNMIIT × Dr. Indra Deep Mastan, IIT BHU",
            date: "Jun 2025 - Jul 2025",
            mode: "Remote",
            proof: { label: "Certificate", link: "https://drive.google.com/file/d/1N46I7bQ1NfsSLBDQoWlcbvPJNPrncs94/view?usp=sharing" },
            points: [
                "Worked on unsupervised image restoration using techniques like Deep Image Prior for denoising and super-resolution without ground-truth supervision.",
                "Achieved 92.8% pixel precision and 0.666 IoU on a held-out test set; ablation showed PatchGAN adversarial training improved Region-mIoU by 4.1% over a U-Net-only baseline.",
            ],
        },
        {
            role: "Teaching Assistant",
            org: "LNMIIT — DAA, ML Models, Scripting Languages, Problem Solving",
            date: "Aug 2024 - Apr 2025",
            mode: "Onsite",
            proof: { label: "Certificates", link: "https://drive.google.com/file/d/1K94xCiLWfzVik2-B_fsHtp5ZSVQcf3kI/view?usp=sharing" },
            points: [
                "Helped students understand and implement core ML models — Linear Regression, K-Means, Decision Trees, Random Forest, clustering and more.",
                "Improved code architecture and used real-world scenarios to connect theory with practical programming.",
            ],
        },
    ];

    const leadership = [
        {
            role: "Secretary, ACM Student Chapter",
            org: "LNMIIT",
            date: "Aug 2025 - May 2026",
            proof: { label: "Certificate", link: "https://drive.google.com/file/d/1C_JBy5bxM6ZheXDPLKBst1XHQhFiLml5/view?usp=sharing" },
            points: [
                "Coordinated with faculty advisors and external speakers, handled logistics for events, competitions and coding contests, and onboarded new members.",
                "Organized 3 large-scale technical events/workshops engaging 1000+ student participants.",
            ],
        },
    ];

    const renderItem = (item, index) => (
        <div key={index} className="w-full py-2 px-3 my-2 border border-gray-50 border-opacity-10 rounded">
            <div className="flex flex-wrap justify-between items-start">
                <div className="mr-2">
                    <div className="text-base md:text-lg font-bold leading-tight">{item.role}</div>
                    <div className="text-sm text-ubt-gedit-orange">{item.org}</div>
                </div>
                <div className="text-right">
                    <div className="text-gray-300 font-light text-sm">{item.date}</div>
                    <div className="text-xs text-gray-400">
                        <ExtLink href={item.proof.link}>{item.proof.label}</ExtLink>{item.mode ? ` · ${item.mode}` : ""}
                    </div>
                </div>
            </div>
            <ul className=" tracking-normal leading-tight text-sm font-light ml-4 mt-2">
                {item.points.map((point, i) => <li key={i} className="list-disc mt-1 text-gray-100">{point}</li>)}
            </ul>
        </div>
    );

    return (
        <>
            <Heading>Experience</Heading>
            <div className="w-full px-4 mt-2">{experience.map(renderItem)}</div>
            <div className="font-medium text-xl mt-6 mb-1 w-full px-4">Leadership</div>
            <div className="w-full px-4">{leadership.map(renderItem)}</div>
        </>
    )
}

function Projects() {
    const project_list = [
        {
            name: "JobFit",
            subtitle: "Resume–Job Matching & Skill Analysis Platform",
            date: "Sep 2026",
            link: "https://github.com/mainak569/JobFit",
            demo: "https://jobfit-livid.vercel.app",
            description: [
                "Full-stack platform that compares resumes with job descriptions to generate match scores, missing-skill insights and improvement suggestions.",
                "Custom skill extraction over a 146-skill taxonomy with a hand-written Aho-Corasick automaton, plus a custom TF-IDF + cosine similarity engine — no external ML libraries.",
                "Django REST Framework + PostgreSQL APIs and a React + Vite dashboard with score visualization and side-by-side job comparison.",
            ],
            domains: ["python", "django", "react", "vite", "postgresql", "algorithms"]
        },
        {
            name: "GAN-cmfd",
            subtitle: "GAN-based Copy-Move Forgery Detection",
            date: "Nov 2025 - Apr 2026",
            link: "https://github.com/mainak569/GAN-cmfd",
            description: [
                "Conditional GAN (U-Net generator + PatchGAN discriminator) for pixel-level localization of copy-move forgeries on the CoMoFoD dataset.",
                "Composite loss (weighted BCE + Dice + adversarial) to counter 5:1 class imbalance, with base-image-grouped splits to prevent data leakage.",
            ],
            domains: ["python", "pytorch", "gan", "computer-vision"]
        },
        {
            name: "clinic-os",
            subtitle: "ClinicOS — Healthcare Appointment Management Platform",
            date: "Sep 2025",
            link: "https://github.com/mainak569/clinic-os",
            demo: "https://clinic-os-352p.vercel.app/",
            description: [
                "Responsive healthcare platform for appointment scheduling, patient records, dashboards, analytics and role-based workflows.",
                "Built with Next.js, TypeScript, Tailwind CSS and ShadCN UI; component and workflow tests written with Jest.",
            ],
            domains: ["next.js", "typescript", "tailwindcss", "shadcn", "jest"]
        },
        {
            name: "craafter",
            subtitle: "Craafter — AI Full-Stack Website Builder",
            date: "Jul 2025",
            link: "https://github.com/mainak569/craafter",
            demo: "https://craafter.vercel.app/",
            description: [
                "Generates, previews and iterates Next.js apps from natural-language prompts using Gemini and E2B cloud sandboxes.",
                "Multi-agent workflow with Inngest, tRPC, Prisma and PostgreSQL for code generation, sandbox execution, live preview and versioned iterations.",
            ],
            domains: ["next.js", "typescript", "gemini", "trpc", "prisma", "postgresql"]
        },
        {
            name: "SyncPen",
            subtitle: "Real-time Docs, Whiteboard & AI Assistant",
            date: "Jan 2025",
            link: "https://github.com/mainak569/SyncPen",
            demo: "https://sync-pen-six.vercel.app/",
            description: [
                "Notion-style document editor, Excalidraw-inspired whiteboard and AI assistant in one real-time productivity app.",
                "Nested documents, file uploads, auth, publishing and page-aware Gemini chat, built on Next.js, Convex and Clerk.",
            ],
            domains: ["next.js", "convex", "clerk", "gemini", "tailwindcss"]
        },
    ];

    const tag_colors = {
        "python": "#86efac",
        "django": "#16a34a",
        "react": "#67e8f9",
        "vite": "#a78bfa",
        "postgresql": "#60a5fa",
        "algorithms": "#fbbf24",
        "pytorch": "#f97316",
        "gan": "#f472b6",
        "computer-vision": "#facc15",
        "next.js": "#c084fc",
        "typescript": "#3b82f6",
        "tailwindcss": "#93c5fd",
        "shadcn": "#e5e7eb",
        "jest": "#fb7185",
        "gemini": "#818cf8",
        "trpc": "#38bdf8",
        "prisma": "#5eead4",
        "convex": "#fdba74",
        "clerk": "#a5b4fc",
    }

    return (
        <>
            <Heading>Projects</Heading>
            {
                project_list.map((project, index) => {
                    return (
                        <div key={index} className="flex w-full flex-col px-4">
                            <div className="w-full py-1 px-2 my-2 border border-gray-50 border-opacity-10 rounded hover:bg-gray-50 hover:bg-opacity-5">
                                <div className="flex flex-wrap justify-between items-center">
                                    <div className='flex flex-wrap items-center'>
                                        <a href={project.link} target="_blank" rel="noreferrer" className=" text-base md:text-lg mr-2 hover:underline">{project.name.toLowerCase()}</a>
                                        <iframe src={`https://ghbtns.com/github-btn.html?user=mainak569&repo=${project.name}&type=star&count=true`} frameBorder="0" scrolling="0" width="100" height="20" title={project.name.toLowerCase() + "-star"}></iframe>
                                    </div>
                                    <div className="text-gray-300 font-light text-sm">{project.date}</div>
                                </div>
                                <div className="text-sm text-ubt-gedit-orange">{project.subtitle}</div>
                                <ul className=" tracking-normal leading-tight text-sm font-light ml-4 mt-1">
                                    {
                                        project.description.map((desc, index) => {
                                            return <li key={index} className="list-disc mt-1 text-gray-100">{desc}</li>;
                                        })
                                    }
                                </ul>
                                <div className="flex flex-wrap items-center justify-between py-2">
                                    <div className="flex flex-wrap items-start justify-start text-xs">
                                        {
                                            project.domains.map((domain, index) => {
                                                return <span key={index} style={{ borderColor: tag_colors[domain], color: tag_colors[domain] }} className="px-1.5 py-0.5 w-max border m-1 rounded-full">{domain}</span>
                                            })
                                        }
                                    </div>
                                    <div className="flex text-xs m-1">
                                        {project.demo ? <a href={project.demo} target="_blank" rel="noreferrer" className="px-2 py-0.5 mr-2 rounded bg-ub-orange hover:bg-opacity-80">Live Demo ↗</a> : null}
                                        <a href={project.link} target="_blank" rel="noreferrer" className="px-2 py-0.5 rounded border border-gray-50 border-opacity-30 hover:bg-gray-50 hover:bg-opacity-10">GitHub ↗</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
            <div className="text-sm text-gray-300 mt-2">More on <ExtLink href="https://github.com/mainak569">github.com/mainak569</ExtLink></div>
        </>
    )
}

function Skills() {
    const badge = (label, color, logo, logoColor = "white") =>
        `https://img.shields.io/badge/${encodeURIComponent(label.replace(/-/g, "--"))}-${color}?style=flat&logo=${encodeURIComponent(logo)}&logoColor=${logoColor}`;

    const languages = [
        ["C++", "00599C", "cplusplus"],
        ["C", "A8B9CC", "c", "000000"],
        ["JavaScript", "F7DF1E", "javascript", "000000"],
        ["TypeScript", "3178C6", "typescript"],
        ["Python", "3776AB", "python"],
        ["Java", "ED8B00", "openjdk"],
        ["Bash", "4EAA25", "gnubash"],
    ];
    const frameworks = [
        ["React", "20232A", "react", "61DAFB"],
        ["Next.js", "000000", "nextdotjs"],
        ["Node.js", "339933", "nodedotjs"],
        ["Django", "092E20", "django"],
        ["Tailwind CSS", "06B6D4", "tailwindcss"],
        ["PyTorch", "EE4C2C", "pytorch"],
        ["Pandas", "150458", "pandas"],
    ];
    const tools = [
        ["PostgreSQL", "4169E1", "postgresql"],
        ["MongoDB", "47A248", "mongodb"],
        ["Prisma", "2D3748", "prisma"],
        ["Git", "F05032", "git"],
        ["Power BI", "F2C811", "powerbi", "000000"],
    ];
    const profiles = [
        { name: "LeetCode", note: "Knight · 1900+", link: "https://leetcode.com/u/mainak13/" },
        { name: "CodeChef", note: "3★", link: "https://www.codechef.com/users/mainak_13" },
        { name: "Codeforces", note: "mainak13", link: "https://codeforces.com/profile/mainak13" },
        { name: "GeeksforGeeks", note: "mainaklk377", link: "https://www.geeksforgeeks.org/profile/mainaklk377" },
        { name: "Code360", note: "Coding Ninjas", link: "https://www.naukri.com/code360/profile/c67f4463-4965-48ff-ae29-6286770a9a04" },
    ];

    const renderBadges = (list) => (
        <div className="flex flex-wrap justify-center items-start w-full mt-2">
            {list.map(([label, color, logo, logoColor]) => (
                <img key={label} className="m-1" src={badge(label, color, logo, logoColor)} alt={label} />
            ))}
        </div>
    );

    return (
        <>
            <Heading>Technical Skills</Heading>
            <ul className=" tracking-tight text-sm md:text-base w-10/12 emoji-list">
                <li className=" list-arrow text-sm md:text-base mt-4 leading-tight tracking-tight">
                    I've worked with a wide variety of programming languages &amp; frameworks.
                </li>
                <li className=" list-arrow text-sm md:text-base mt-4 leading-tight tracking-tight">
                    <div> My areas of expertise are <strong className="text-ubt-gedit-orange">full-stack web development, data structures &amp; algorithms, and deep learning!</strong></div>
                </li>
                <li className=" list-arrow text-sm md:text-base mt-4 leading-tight tracking-tight">
                    <div>Here are my most frequently used</div>
                </li>
            </ul>
            <div className="w-full md:w-10/12 flex mt-4">
                <div className=" text-sm text-center md:text-base w-1/2 font-bold">Languages</div>
                <div className=" text-sm text-center md:text-base w-1/2 font-bold">Frameworks &amp; Libraries</div>
            </div>
            <div className="w-full md:w-10/12 flex justify-center items-start font-bold text-center">
                <div className="px-2 w-1/2">{renderBadges(languages)}</div>
                <div className="px-2 w-1/2">{renderBadges(frameworks)}</div>
            </div>
            <div className=" text-sm text-center md:text-base font-bold mt-4">Databases &amp; Tools</div>
            <div className="w-full md:w-8/12 px-2">{renderBadges(tools)}</div>
            <ul className=" tracking-tight text-sm md:text-base w-10/12 emoji-list mt-2">
                <li className=" list-arrow text-sm md:text-base mt-4 leading-tight tracking-tight">
                    <span> And of course,</span> <img className=" inline ml-1" src="https://img.shields.io/badge/-Linux-0078D6?style=plastic&logo=linux&logoColor=ffffff" alt="linux" /> <span>!</span>
                </li>
            </ul>

            <Heading>Problem Solving</Heading>
            <div className="w-full md:w-10/12 px-4 flex flex-wrap justify-center">
                {profiles.map(profile => (
                    <a key={profile.name} href={profile.link} target="_blank" rel="noreferrer" className="m-1.5 px-3 py-2 w-40 rounded border border-gray-50 border-opacity-10 hover:bg-gray-50 hover:bg-opacity-5 text-center">
                        <div className="font-bold">{profile.name}</div>
                        <div className="text-xs text-ubt-gedit-orange">{profile.note}</div>
                    </a>
                ))}
            </div>
        </>
    )
}

function Resume() {
    return (
        <div className="h-full w-full flex flex-col">
            <div className="flex justify-end items-center text-sm py-1 px-2 border-b border-black">
                <a href={RESUME_PATH} target="_blank" rel="noreferrer" className="px-2 py-0.5 mr-2 rounded border border-gray-50 border-opacity-30 hover:bg-gray-50 hover:bg-opacity-10">Open in new tab ↗</a>
                <a href={RESUME_PATH} download="Mainak-Das-Resume.pdf" className="px-2 py-0.5 rounded bg-ub-orange hover:bg-opacity-80">Download</a>
            </div>
            <iframe className="flex-grow w-full" src={RESUME_PATH} title="Mainak Das resume" frameBorder="0"></iframe>
        </div>
    )
}
