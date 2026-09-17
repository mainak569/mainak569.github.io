import React from "react";
import SmallArrow from "./small_arrow";

export function WifiIcon({ on, className = "" }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-label="wifi">
      <path fill="gray" d="M8 2C5.39 2 2.78 2.84.6 4.52l-.27.2.21.27L8 14.66l7.67-9.93-.27-.2A12.1 12.1 0 0 0 8 2zm0 1c2.18 0 4.34.67 6.23 1.95L8 13.02 1.77 4.95A11.1 11.1 0 0 1 8 3z" />
      {on ? <path fill="#fff" d="M2.43 6.9a9.13 9.13 0 0 1 11.15 0L8 14.12z" /> : <path stroke="#fff" strokeWidth="1.4" d="M2 2l12 12" />}
    </svg>
  );
}

export function BatteryIcon({ level, charging, className = "" }) {
  const pct = level == null ? 0.75 : level;
  const fillW = Math.max(1, Math.round(9 * pct));
  const color = pct <= 0.15 && !charging ? "#ef4444" : "#fff";
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-label="battery">
      <rect x="1.5" y="4.5" width="12" height="7" rx="1.5" fill="none" stroke="#fff" />
      <rect x="14" y="6.5" width="1.5" height="3" rx=".5" fill="#fff" />
      <rect x="3" y="6" width={fillW} height="4" rx=".5" fill={color} />
      {charging ? <path d="M8.6 4.8L5.8 8.4h2l-.6 2.8 2.8-3.6h-2z" fill="#E95420" stroke="#333" strokeWidth=".4" /> : null}
    </svg>
  );
}

export default function Status({ system }) {
  return (
    <div className="flex justify-center items-center">
      <span className="mx-1.5">
        <WifiIcon on={system.online} className="inline status-symbol w-4 h-4" />
      </span>
      <span className="mx-1.5 flex items-center">
        <BatteryIcon level={system.battery.level} charging={system.battery.charging} className="inline status-symbol w-4 h-4" />
      </span>
      <span className="mx-1">
        <SmallArrow angle="down" className=" status-symbol" />
      </span>
    </div>
  );
}
