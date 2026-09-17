import React, { Component } from 'react';

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default class Calendar extends Component {
    constructor() {
        super();
        const now = new Date();
        this.state = { year: now.getFullYear(), month: now.getMonth(), selected: null };
    }

    shift = (delta) => {
        this.setState(({ year, month }) => {
            const d = new Date(year, month + delta, 1);
            return { year: d.getFullYear(), month: d.getMonth() };
        });
    }

    resetToToday = () => {
        const now = new Date();
        this.setState({ year: now.getFullYear(), month: now.getMonth(), selected: null });
    }

    handleKeyDown = (e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); this.shift(-1); }
        else if (e.key === "ArrowRight") { e.preventDefault(); this.shift(1); }
        else if (e.key === "Escape") this.props.close();
    }

    render() {
        const { year, month, selected } = this.state;
        const today = new Date();
        const isThisMonth = today.getFullYear() === year && today.getMonth() === month;
        const offset = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const cells = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
        const navBtn = "w-8 h-8 flex items-center justify-center rounded-full text-xl hover:bg-white hover:bg-opacity-10 focus:outline-none";

        return (
            <div
                className="absolute left-1/2 top-full mt-2 -translate-x-1/2 transform w-72 md:w-80 rounded-lg bg-ub-cool-grey border border-black border-opacity-50 shadow-2xl text-white p-3 md:p-4 cursor-default z-50 outline-none"
                tabIndex="-1"
                ref={el => el && !this.focused && (this.focused = true) && el.focus({ preventScroll: true })}
                onKeyDown={this.handleKeyDown}
                onClick={e => e.stopPropagation()}
            >
                <div className="absolute left-1/2 -top-1.5 w-3 h-3 bg-ub-cool-grey border-l border-t border-black border-opacity-50 transform -translate-x-1/2 rotate-45"></div>
                <div className="relative text-center pb-2 mb-2 border-b border-white border-opacity-10">
                    <div className="text-xs text-gray-400">{DAYS[today.getDay()]}</div>
                    <div className="font-medium">{MONTHS[today.getMonth()]} {today.getDate()} {today.getFullYear()}</div>
                </div>
                <div className="flex items-center justify-between">
                    <button className={navBtn} onClick={() => this.shift(-1)} aria-label="Previous month">‹</button>
                    <button className="font-bold text-base hover:underline focus:outline-none" onClick={this.resetToToday} title="Back to today">{MONTHS[month]} {year}</button>
                    <button className={navBtn} onClick={() => this.shift(1)} aria-label="Next month">›</button>
                </div>
                <div className="grid grid-cols-7 mt-2 text-center text-xs text-gray-400">
                    {WEEKDAYS.map((d, i) => <div key={i} className="py-1.5">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 text-center text-sm">
                    {cells.map((day, i) => {
                        if (!day) return <div key={i}></div>;
                        const isToday = isThisMonth && day === today.getDate();
                        const isSelected = selected && selected.year === year && selected.month === month && selected.day === day;
                        const weekend = i % 7 === 0 || i % 7 === 6;
                        return (
                            <div key={i} className="flex items-center justify-center py-0.5">
                                <button
                                    onClick={() => this.setState({ selected: { year, month, day } })}
                                    className={"w-9 h-8 rounded-full focus:outline-none " +
                                        (isToday ? "bg-ub-orange font-bold" : isSelected ? "bg-white bg-opacity-20" : "hover:bg-white hover:bg-opacity-10 " + (weekend ? "text-gray-400" : ""))}
                                >{day}</button>
                            </div>
                        );
                    })}
                </div>
                {!isThisMonth ? (
                    <div className="mt-2 text-center">
                        <button onClick={this.resetToToday} className="text-xs px-3 py-1 rounded-full border border-white border-opacity-20 hover:bg-white hover:bg-opacity-10 focus:outline-none">Today</button>
                    </div>
                ) : null}
            </div>
        );
    }
}
