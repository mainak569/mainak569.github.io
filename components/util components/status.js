import React from "react";
import SmallArrow from "./small_arrow";

export function VolumeIcon({ level, muted, className = "" }) {
  const v = muted ? 0 : Number(level);
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="#fff" aria-label="volume">
      <path d="M8 1.333L4.5 5H1.87S1 5.893 1 8.001C1 10.11 1.87 11 1.87 11H4.5L8 14.667z" />
      {v === 0 ? (
        <path d="M10.5 5.5l1.75 1.75L14 5.5l.75.75-1.75 1.75 1.75 1.75-.75.75-1.75-1.75-1.75 1.75-.75-.75 1.75-1.75-1.75-1.75z" />
      ) : (
        <>
          <path opacity={v > 0 ? 1 : 0.35} d="M10.524 4.926l-.707.707.354.354a2.999 2.999 0 0 1 0 4.242l-.354.353.707.707.354-.353a4 4 0 0 0 0-5.656z" />
          <path opacity={v > 66 ? 1 : 0.35} d="M12.645 2.805l-.707.707.354.353a5.999 5.999 0 0 1 0 8.485l-.354.353.707.707.354-.353a7 7 0 0 0 0-9.899z" />
        </>
      )}
    </svg>
  );
}

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
      <span className="mx-1.5">
        <VolumeIcon level={system.volume} muted={system.muted} className="inline status-symbol w-4 h-4" />
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
