// Yaru accent colours, stored as space-separated RGB for the --accent CSS variable
export const ACCENTS = {
    orange: "233 84 32",
    purple: "119 33 111",
    sage: "58 138 110",
    blue: "58 100 165",
    magenta: "166 63 121",
    olive: "111 124 42",
};

export const DEFAULT_ACCENT = "orange";

export const applyAccent = (name) => {
    const value = ACCENTS[name] || ACCENTS[DEFAULT_ACCENT];
    document.documentElement.style.setProperty("--accent", value);
};

export const savedAccent = () => {
    try {
        const name = localStorage.getItem("accent-color");
        return name in ACCENTS ? name : DEFAULT_ACCENT;
    } catch (e) {
        return DEFAULT_ACCENT;
    }
};
