import React, { Component } from 'react';

const TRASH_ITEMS = [
    {
        name: "resume_final_FINAL(3).pdf",
        icon: "./themes/filetypes/pdf.svg",
        note: "Replaced by the version that actually compiles. An unescaped & strikes again.",
    },
    {
        name: "wrong_answer_on_test_2.cpp",
        icon: "./themes/filetypes/cpp.svg",
        note: "Passed all the samples, died on test 2. Forgot to use long long.",
    },
    {
        name: "TLE_brute_force.cpp",
        icon: "./themes/filetypes/cpp.svg",
        note: "O(n³) on n = 2·10⁵. Rewritten with a segment tree — that's how you become a LeetCode Knight.",
    },
    {
        name: "gan_run_37_mode_collapse",
        icon: "./themes/Yaru/system/folder.png",
        note: "The generator learned to draw one blurry square. Fixed with Adam β₁ = 0.5 and a Dice + BCE loss.",
    },
    {
        name: "node_modules",
        icon: "./themes/Yaru/system/folder.png",
        note: "The heaviest object in the known universe. Freed 1.4 GB.",
    },
    {
        name: "center_a_div_attempts",
        icon: "./themes/Yaru/system/folder.png",
        note: "47 attempts before discovering flex items-center justify-center.",
    },
    {
        name: "todo_app_v12.js",
        icon: "./themes/filetypes/js.png",
        note: "Every developer's first project. And second. And twelfth.",
    },
    {
        name: "assignment_final_v2.zip",
        icon: "./themes/filetypes/zip.png",
        note: "Submitted at 11:59 PM. Deleted at 12:00 AM.",
    },
    {
        name: "sleep_schedule.txt",
        icon: "./themes/filetypes/txt.svg",
        note: "Deleted during contest season. Will restore after placements.",
    },
    {
        name: "php",
        icon: "./themes/filetypes/php.png",
        note: "Tried it once. We don't talk about it.",
    },
];

export class Trash extends Component {
    constructor() {
        super();
        this.state = {
            empty: false,
            selected: null,
        }
    }

    componentDidMount() {
        // get user preference from local-storage
        if (localStorage.getItem("trash-empty") === "true") this.setState({ empty: true });
    }

    emptyTrash = () => {
        this.setState({ empty: true, selected: null });
        localStorage.setItem("trash-empty", true);
    };

    restoreTrash = () => {
        this.setState({ empty: false, selected: null });
        localStorage.setItem("trash-empty", false);
    };

    emptyScreen = () => {
        return (
            <div className="flex-grow flex flex-col justify-center items-center">
                <img className=" w-24" src="./themes/Yaru/status/user-trash-symbolic.svg" alt="Ubuntu Trash" />
                <span className="font-bold mt-4 text-xl px-1 text-gray-400">Trash is Empty</span>
                <span className="mt-1 text-sm text-gray-500">Click Restore to bring the bugs back</span>
            </div>
        );
    }

    showTrashItems = () => {
        const selected = this.state.selected !== null ? TRASH_ITEMS[this.state.selected] : null;
        return (
            <>
                <div className="flex-grow min-h-0 p-2 md:p-4 grid gap-2 content-start overflow-y-auto windowMainScreen" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(6.5rem, 1fr))" }} onClick={() => this.setState({ selected: null })}>
                    {
                        TRASH_ITEMS.map((item, index) => {
                            const isSelected = this.state.selected === index;
                            return (
                                <div
                                    key={index}
                                    tabIndex="0"
                                    onClick={(e) => { e.stopPropagation(); this.setState({ selected: index }); }}
                                    onFocus={() => this.setState({ selected: index })}
                                    title={item.name}
                                    className="flex flex-col items-center text-xs md:text-sm outline-none p-1 rounded cursor-default"
                                >
                                    <div className={"w-14 h-14 md:w-16 md:h-16 flex items-center justify-center " + (isSelected ? "opacity-70" : "")}>
                                        <img className="max-w-full max-h-full" src={item.icon} alt="" />
                                    </div>
                                    <span className={"mt-1 text-center rounded px-1 w-full break-all leading-tight " + (isSelected ? "bg-ub-orange" : "")} style={isSelected ? {} : { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                        {item.name}
                                    </span>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="border-t border-black border-opacity-40 bg-ub-warm-grey bg-opacity-10 px-3 py-2 text-xs md:text-sm">
                    {selected
                        ? <><span className="font-bold">{selected.name}</span><span className="text-gray-300"> — {selected.note}</span></>
                        : <span className="text-gray-400">{TRASH_ITEMS.length} items · select an item to see why it ended up here</span>}
                </div>
            </>
        );
    }

    render() {
        return (
            <div className="w-full h-full flex flex-col bg-ub-cool-grey text-white select-none">
                <div className="flex items-center justify-between w-full bg-ub-warm-grey bg-opacity-40 text-sm">
                    <span className="font-bold ml-2">Trash</span>
                    <div className="flex">
                        <button onClick={this.restoreTrash} disabled={!this.state.empty} className={"border border-black bg-black bg-opacity-50 px-3 py-1 my-1 mx-1 rounded focus:outline-none " + (this.state.empty ? "hover:bg-opacity-80" : "text-gray-400 cursor-default")}>Restore</button>
                        <button onClick={this.emptyTrash} disabled={this.state.empty} className={"border border-black bg-black bg-opacity-50 px-3 py-1 my-1 mx-1 rounded focus:outline-none " + (this.state.empty ? "text-gray-400 cursor-default" : "hover:bg-opacity-80")}>Empty</button>
                    </div>
                </div>
                {
                    (this.state.empty
                        ? this.emptyScreen()
                        : this.showTrashItems()
                    )
                }
            </div>
        )
    }
}

export default Trash;

export const displayTrash = () => {
    return <Trash> </Trash>;
}
