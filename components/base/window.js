import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import Draggable from 'react-draggable';
import Settings from '../apps/settings';
import ReactGA from 'react-ga4';
import { displayTerminal } from '../apps/terminal'

// phones get full-screen, non-draggable windows (like a mobile OS)
const isMobile = () => typeof window !== "undefined" && window.innerWidth < 640;

// windows live in a layer that starts below the top bar
const TOP_BAR = 32;
const SNAP_EDGE = 12;   // how close the pointer must get to a screen edge
const SNAP_CORNER = 90; // how far along an edge still counts as its corner

// which snap zone (if any) the pointer is in while dragging
const snapZone = (x, y) => {
    const w = window.innerWidth, h = window.innerHeight;
    const top = y <= TOP_BAR + SNAP_EDGE;
    const bottom = y >= h - SNAP_CORNER;
    if (x <= SNAP_EDGE) return top || y <= TOP_BAR + SNAP_CORNER ? "top-left" : bottom ? "bottom-left" : "left";
    if (x >= w - SNAP_EDGE) return top || y <= TOP_BAR + SNAP_CORNER ? "top-right" : bottom ? "bottom-right" : "right";
    if (top) return x <= SNAP_CORNER ? "top-left" : x >= w - SNAP_CORNER ? "top-right" : "top";
    return null;
};

// the area a zone covers, in the window layer's coordinates (px)
const snapRect = (zone) => {
    const w = window.innerWidth, h = window.innerHeight - TOP_BAR;
    const halfW = w / 2, halfH = h / 2;
    switch (zone) {
        case "top": return { x: 0, y: 0, w, h };
        case "left": return { x: 0, y: 0, w: halfW, h };
        case "right": return { x: halfW, y: 0, w: halfW, h };
        case "top-left": return { x: 0, y: 0, w: halfW, h: halfH };
        case "top-right": return { x: halfW, y: 0, w: halfW, h: halfH };
        case "bottom-left": return { x: 0, y: halfH, w: halfW, h: halfH };
        case "bottom-right": return { x: halfW, y: halfH, w: halfW, h: halfH };
        default: return null;
    }
};

export class Window extends Component {
    constructor() {
        super();
        this.id = null;
        this.state = {
            cursorType: "cursor-default",
            width: 60,
            height: 85,
            closed: false,
            maximized: false,
            snapPreview: null,
            pos: isMobile() ? { x: 0, y: 0 } : { x: 60, y: 10 },
            parentSize: {
                height: 100,
                width: 100
            }
        }
    }

    componentDidMount() {
        this.id = this.props.id;
        this.setDefaultWindowDimenstion();

        // google analytics
        ReactGA.send({ hitType: "pageview", page: `/${this.id}`, title: "Custom Title" });

        // on window resize (or phone rotation), recompute size & boundary
        window.addEventListener('resize', this.handleViewportResize);
    }

    componentWillUnmount() {
        ReactGA.send({ hitType: "pageview", page: "/desktop", title: "Custom Title" });

        window.removeEventListener('resize', this.handleViewportResize);
    }

    setDefaultWindowDimenstion = () => {
        if (isMobile()) {
            // fill the screen below the top bar
            this.setState({ height: 100 - (32 / window.innerHeight) * 100, width: 100, maximized: true }, () => {
                this.resizeBoundries();
                if (this.props.hideSideBar) this.props.hideSideBar(this.id, true);
            });
        }
        else {
            this.setState({ height: 85, width: 60 }, this.resizeBoundries);
        }
    }

    handleViewportResize = () => {
        if (isMobile()) {
            const r = document.querySelector("#" + this.id);
            if (r) r.style.transform = "translate(0px,0px)";
            this.setDefaultWindowDimenstion();
        } else {
            this.resizeBoundries();
        }
    }

    resizeBoundries = () => {
        this.setState({
            parentSize: {
                height: window.innerHeight //parent height
                    - (window.innerHeight * (this.state.height / 100.0))  // this window's height
                    - 28 // some padding
                ,
                width: window.innerWidth // parent width
                    - (window.innerWidth * (this.state.width / 100.0)) //this window's width
            }
        });
    }

    changeCursorToMove = () => {
        this.focusWindow();
        if (isMobile()) return;
        if (this.state.maximized) {
            this.restoreWindow();
        }
        this.setState({ cursorType: "cursor-move" })
    }

    changeCursorToDefault = () => {
        const zone = this.state.snapPreview;
        this.setState({ cursorType: "cursor-default", snapPreview: null });
        if (zone) this.snapTo(zone);
    }

    handleDrag = (e, data) => {
        // dragging a snapped window away gives it back its previous size
        if (this.preSnapSize) {
            this.setState({ ...this.preSnapSize }, this.resizeBoundries);
            this.preSnapSize = null;
        }
        const point = e.touches && e.touches[0] ? e.touches[0] : e;
        const zone = typeof point.clientX === "number" ? snapZone(point.clientX, point.clientY) : null;
        this.setState({ pos: { x: data.x, y: data.y }, snapPreview: zone });
        this.checkOverlap();
    }

    snapTo = (zone) => {
        if (zone === "top") {
            if (!this.state.maximized) this.maximizeWindow();
            return;
        }
        const rect = snapRect(zone);
        if (!this.preSnapSize) this.preSnapSize = { width: this.state.width, height: this.state.height };
        // the window layer is as tall as the viewport, so percentages are of innerHeight
        this.setState({
            width: (rect.w / window.innerWidth) * 100,
            height: (rect.h / window.innerHeight) * 100,
            pos: { x: rect.x, y: rect.y },
        }, () => {
            this.resizeBoundries();
            this.checkOverlap();
        });
    }

    renderSnapPreview = () => {
        const rect = snapRect(this.state.snapPreview);
        if (!rect || typeof document === "undefined") return null;
        return createPortal(
            <div className="fixed pointer-events-none rounded-lg border-2 border-ubb-orange bg-ub-orange bg-opacity-20 transition-all duration-150"
                style={{ left: rect.x + 4, top: rect.y + TOP_BAR + 4, width: rect.w - 8, height: rect.h - 8, zIndex: 45 }} />,
            document.body
        );
    }

    // ---------- resizing from any edge / corner ----------
    startResize = (dir) => (e) => {
        if (this.state.maximized || isMobile() || e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        this.focusWindow();

        const el = document.getElementById(this.id);
        const rect = el.getBoundingClientRect();
        const parent = el.parentElement.getBoundingClientRect();
        this.resizing = {
            dir,
            startX: e.clientX,
            startY: e.clientY,
            x: this.state.pos.x,
            y: this.state.pos.y,
            w: rect.width,
            h: rect.height,
            pw: parent.width,
            ph: parent.height,
        };
        // pointer capture keeps the resize going even over iframes (Spotify, VS Code...)
        e.currentTarget.setPointerCapture(e.pointerId);
        document.body.style.userSelect = "none";
    }

    onResize = (e) => {
        const r = this.resizing;
        if (!r) return;
        const dx = e.clientX - r.startX;
        const dy = e.clientY - r.startY;
        const minW = Math.min(Math.max(320, r.pw * 0.25), r.pw);
        const minH = Math.min(Math.max(200, r.ph * 0.25), r.ph);
        const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

        let { x, y, w, h } = r;
        if (r.dir.includes("e")) w = clamp(r.w + dx, minW, r.pw - r.x);
        if (r.dir.includes("s")) h = clamp(r.h + dy, minH, r.ph - r.y);
        if (r.dir.includes("w")) {
            x = clamp(r.x + dx, 0, r.x + r.w - minW);
            w = r.w + (r.x - x);
        }
        if (r.dir.includes("n")) {
            y = clamp(r.y + dy, 0, r.y + r.h - minH);
            h = r.h + (r.y - y);
        }
        this.setState({ width: (w / r.pw) * 100, height: (h / r.ph) * 100, pos: { x, y } });
    }

    endResize = (e) => {
        if (!this.resizing) return;
        this.resizing = null;
        if (e.currentTarget.hasPointerCapture && e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
        document.body.style.userSelect = "";
        this.resizeBoundries();
        this.checkOverlap();
    }

    setWinowsPosition = () => {
        var r = document.querySelector("#" + this.id);
        var rect = r.getBoundingClientRect();
        r.style.setProperty('--window-transform-x', rect.x.toFixed(1).toString() + "px");
        r.style.setProperty('--window-transform-y', (rect.y.toFixed(1) - 32).toString() + "px");
    }

    checkOverlap = () => {
        var r = document.querySelector("#" + this.id);
        var rect = r.getBoundingClientRect();
        if (rect.x.toFixed(1) < 50) { // if this window overlapps with SideBar
            this.props.hideSideBar(this.id, true);
        }
        else {
            this.props.hideSideBar(this.id, false);
        }
    }

    focusWindow = () => {
        this.props.focus(this.id);
    }

    minimizeWindow = () => {
        let posx = -310;
        if (this.state.maximized) {
            posx = -510;
        }
        this.setWinowsPosition();
        // get corrosponding sidebar app's position
        var r = document.querySelector("#sidebar-" + this.id);
        var sidebBarApp = r.getBoundingClientRect();

        r = document.querySelector("#" + this.id);
        if (isMobile()) {
            // shrink the full-screen window towards its dock icon
            const rect = r.getBoundingClientRect();
            const dx = (sidebBarApp.x + sidebBarApp.width / 2) - (rect.x + rect.width / 2);
            const dy = (sidebBarApp.y + sidebBarApp.height / 2) - (rect.y + rect.height / 2);
            r.style.transform = `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px) scale(0.1)`;
        } else {
            // translate window to that position
            r.style.transform = `translate(${posx}px,${sidebBarApp.y.toFixed(1) - 240}px) scale(0.2)`;
        }
        this.props.hasMinimised(this.id);
    }

    restoreWindow = () => {
        var r = document.querySelector("#" + this.id);
        // go back to the size the user had before maximizing
        if (this.preMaximizeSize && !isMobile()) {
            this.setState({ ...this.preMaximizeSize }, this.resizeBoundries);
        } else {
            this.setDefaultWindowDimenstion();
        }
        const pos = this.preMaximizePos || this.state.pos;
        this.preMaximizePos = null;
        r.style.transform = `translate(${pos.x}px,${pos.y}px)`;
        this.setState({ pos });
        setTimeout(() => {
            this.setState({ maximized: false });
            this.checkOverlap();
        }, 300);
    }

    maximizeWindow = () => {
        if (isMobile()) return; // always full-screen on phones
        if (this.state.maximized) {
            this.restoreWindow();
        }
        else {
            this.focusWindow();
            var r = document.querySelector("#" + this.id);
            this.setWinowsPosition();
            // a snapped window restores to its size from before the snap
            this.preMaximizeSize = this.preSnapSize || { width: this.state.width, height: this.state.height };
            this.preSnapSize = null;
            // translate window to maximize position; kept in state too, so react-draggable
            // doesn't put the old position back when a drag (e.g. snapping to the top) ends
            this.preMaximizePos = this.state.pos;
            const pos = { x: -1.33, y: -2.67 };
            r.style.transform = `translate(${pos.x}px,${pos.y}px)`;
            this.setState({ maximized: true, height: 96.3, width: 100.2, pos });
            this.props.hideSideBar(this.id, true);
        }
    }

    closeWindow = () => {
        this.setWinowsPosition();
        this.setState({ closed: true }, () => {
            this.props.hideSideBar(this.id, false);
            setTimeout(() => {
                this.props.closed(this.id)
            }, 300) // after 300ms this window will be unmounted from parent (Desktop)
        });
    }

    render() {
        return (
            <>
            <Draggable
                axis="both"
                handle=".bg-ub-window-title"
                grid={[1, 1]}
                scale={1}
                disabled={isMobile()}
                onMouseDown={isMobile() ? this.focusWindow : undefined}
                onStart={this.changeCursorToMove}
                onStop={this.changeCursorToDefault}
                onDrag={this.handleDrag}
                allowAnyClick={false}
                position={this.state.pos}
                bounds={{ left: 0, top: 0, right: this.state.parentSize.width, bottom: this.state.parentSize.height }}
            >
                <div style={{ width: `${this.state.width}%`, height: `${this.state.height}%` }}
                    onMouseDownCapture={this.props.isFocused ? null : this.focusWindow}
                    className={this.state.cursorType + " " + (this.state.closed ? " closed-window " : "") + (this.state.maximized ? " duration-300 rounded-none" : " rounded-lg") + (this.props.minimized ? " opacity-0 invisible duration-200 " : "") + (this.props.isFocused ? " z-30 " : " z-20 notFocused") + " opened-window overflow-hidden min-w-1/4 min-h-1/4 main-window absolute window-shadow border-black border-opacity-40 border border-t-0 flex flex-col"}
                    id={this.id}
                >
                    {this.state.maximized || isMobile() ? null : <ResizeHandles start={this.startResize} move={this.onResize} end={this.endResize} />}
                    <WindowTopBar title={this.props.title} onDoubleClick={this.maximizeWindow} />
                    <WindowEditButtons minimize={this.minimizeWindow} maximize={this.maximizeWindow} isMaximised={this.state.maximized} close={this.closeWindow} id={this.id} />
                    {(this.id === "settings"
                        ? <Settings changeBackgroundImage={this.props.changeBackgroundImage} currBgImgName={this.props.bg_image_name} />
                        : <WindowMainScreen screen={this.props.screen} title={this.props.title}
                            addFolder={this.props.id === "terminal" ? this.props.addFolder : null}
                            openApp={this.props.openApp} />)}
                    {/* iframes (Spotify, VS Code, Chrome...) swallow clicks, so a background window gets a
                        transparent shield that brings it to the front when clicked anywhere */}
                    {this.props.isFocused ? null : <div className="absolute inset-x-0 bottom-0 z-40" style={{ top: "34px" }} onMouseDown={this.focusWindow}></div>}
                </div>
            </Draggable >
            {this.renderSnapPreview()}
            </>
        )
    }
}

export default Window

// Window's title bar
export function WindowTopBar(props) {
    return (
        <div onDoubleClick={props.onDoubleClick} className={" relative bg-ub-window-title border-t-2 border-white border-opacity-5 py-1.5 px-3 text-white w-full select-none rounded-b-none"}>
            <div className="flex justify-center text-sm font-bold">{props.title}</div>
        </div>
    )
}

// Invisible grab areas along every edge and corner
const RESIZE_HANDLES = [
    { dir: "n", className: "top-0 left-3 right-3 h-1.5 cursor-ns-resize" },
    { dir: "s", className: "bottom-0 left-3 right-3 h-1.5 cursor-ns-resize" },
    { dir: "e", className: "right-0 top-3 bottom-3 w-1.5 cursor-ew-resize" },
    { dir: "w", className: "left-0 top-3 bottom-3 w-1.5 cursor-ew-resize" },
    { dir: "nw", className: "top-0 left-0 w-3 h-3 cursor-nwse-resize" },
    { dir: "ne", className: "top-0 right-0 w-3 h-3 cursor-nesw-resize" },
    { dir: "sw", className: "bottom-0 left-0 w-3 h-3 cursor-nesw-resize" },
    { dir: "se", className: "bottom-0 right-0 w-3 h-3 cursor-nwse-resize" },
];

export function ResizeHandles(props) {
    return (
        <>
            {RESIZE_HANDLES.map(handle => (
                <div
                    key={handle.dir}
                    className={"absolute z-50 touch-none " + handle.className}
                    onPointerDown={props.start(handle.dir)}
                    onPointerMove={props.move}
                    onPointerUp={props.end}
                    onPointerCancel={props.end}
                />
            ))}
        </>
    )
}

// Window's Edit Buttons
export function WindowEditButtons(props) {
    return (
        <div className="absolute select-none right-0 top-0 mt-1 mr-1 flex justify-center items-center">
            <span className="mx-1.5 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-full flex justify-center mt-1 h-5 w-5 items-center" onClick={props.minimize}>
                <img
                    src="./themes/Yaru/window/window-minimize-symbolic.svg"
                    alt="ubuntu window minimize"
                    className="h-5 w-5 inline"
                />
            </span>
            {
                (props.isMaximised
                    ?
                    <span className="mx-2 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-full hidden sm:flex justify-center mt-1 h-5 w-5 items-center" onClick={props.maximize}>
                        <img
                            src="./themes/Yaru/window/window-restore-symbolic.svg"
                            alt="ubuntu window restore"
                            className="h-5 w-5 inline"
                        />
                    </span>
                    :
                    <span className="mx-2 bg-white bg-opacity-0 hover:bg-opacity-10 rounded-full hidden sm:flex justify-center mt-1 h-5 w-5 items-center" onClick={props.maximize}>
                        <img
                            src="./themes/Yaru/window/window-maximize-symbolic.svg"
                            alt="ubuntu window maximize"
                            className="h-5 w-5 inline"
                        />
                    </span>
                )
            }
            <button tabIndex="-1" id={`close-${props.id}`} className="mx-1.5 focus:outline-none cursor-default bg-ub-orange bg-opacity-90 hover:bg-opacity-100 rounded-full flex justify-center mt-1 h-5 w-5 items-center" onClick={props.close}>
                <img
                    src="./themes/Yaru/window/window-close-symbolic.svg"
                    alt="ubuntu window close"
                    className="h-5 w-5 inline"
                />
            </button>
        </div>
    )
}

// Window's Main Screen
export class WindowMainScreen extends Component {
    constructor() {
        super();
        this.state = {
            setDarkBg: false,
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({ setDarkBg: true });
        }, 3000);
    }
    render() {
        return (
            <div className={"w-full flex-grow z-20 max-h-full overflow-y-auto windowMainScreen" + (this.state.setDarkBg ? " bg-ub-drk-abrgn " : " bg-ub-cool-grey")}>
                {this.props.addFolder ? displayTerminal(this.props.addFolder, this.props.openApp) : this.props.screen()}
            </div>
        )
    }
}