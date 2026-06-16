import { useEffect, useState } from "react";

const ROWS = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'"],
  ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"],
  ["SPACE"],
];

const FINGER_MAP: Record<string, string> = {
  "`": "pinky-l", "1": "pinky-l", "Q": "pinky-l", "A": "pinky-l", "Z": "pinky-l",
  "2": "ring-l", "W": "ring-l", "S": "ring-l", "X": "ring-l",
  "3": "middle-l", "E": "middle-l", "D": "middle-l", "C": "middle-l",
  "4": "index-l", "R": "index-l", "F": "index-l", "V": "index-l",
  "5": "index-l", "T": "index-l", "G": "index-l", "B": "index-l",
  "6": "index-r", "Y": "index-r", "H": "index-r", "N": "index-r",
  "7": "index-r", "U": "index-r", "J": "index-r", "M": "index-r",
  "8": "middle-r", "I": "middle-r", "K": "middle-r", ",": "middle-r",
  "9": "ring-r", "O": "ring-r", "L": "ring-r", ".": "ring-r",
  "0": "pinky-r", "P": "pinky-r", ";": "pinky-r", "/": "pinky-r",
  "-": "pinky-r", "[": "pinky-r", "'": "pinky-r",
  "=": "pinky-r", "]": "pinky-r", "\\": "pinky-r",
  "SPACE": "thumb",
};

const FINGER_COLORS: Record<string, string> = {
  "pinky-l": "#ef4444",
  "ring-l": "#f97316",
  "middle-l": "#eab308",
  "index-l": "#22c55e",
  "index-r": "#3b82f6",
  "middle-r": "#8b5cf6",
  "ring-r": "#ec4899",
  "pinky-r": "#06b6d4",
  "thumb": "#94a3b8",
};

const FINGER_LABELS: Record<string, string> = {
  "pinky-l": "Left Pinky",
  "ring-l": "Left Ring",
  "middle-l": "Left Middle",
  "index-l": "Left Index",
  "index-r": "Right Index",
  "middle-r": "Right Mid",
  "ring-r": "Right Ring",
  "pinky-r": "Right Pinky",
  "thumb": "Thumb",
};

interface Props {
  nextKey?: string;
  pressedKey?: string;
  guidedMode?: boolean;
}

export function VisualKeyboard({ nextKey, pressedKey, guidedMode = false }: Props) {
  const [flash, setFlash] = useState(false);
  const activeKey = pressedKey?.toUpperCase() ?? nextKey?.toUpperCase();
  const activeKeyNorm = activeKey === " " ? "SPACE" : activeKey;

  useEffect(() => {
    if (!activeKeyNorm) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 150);
    return () => clearTimeout(t);
  }, [activeKeyNorm]);

  const activeFinger = activeKeyNorm ? FINGER_MAP[activeKeyNorm] : undefined;
  const activeColor = activeFinger ? FINGER_COLORS[activeFinger] : undefined;

  return (
    <div className="bg-muted/30 rounded-xl p-3 select-none" aria-hidden="true">
      {/* Finger guide banner */}
      {guidedMode && activeKeyNorm && activeFinger && (
        <div
          className="text-center text-xs font-semibold mb-2 py-1.5 rounded-lg transition-all"
          style={{ background: `${activeColor}22`, color: activeColor, border: `1px solid ${activeColor}44` }}
        >
          Press <strong>{activeKeyNorm}</strong> with your <strong>{FINGER_LABELS[activeFinger]}</strong>
        </div>
      )}

      <div className="space-y-1">
        {ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1 justify-center" style={{ paddingLeft: ri === 1 ? "8px" : ri === 2 ? "16px" : ri === 3 ? "24px" : 0 }}>
            {row.map(key => {
              const finger = FINGER_MAP[key];
              const color = finger ? FINGER_COLORS[finger] : "#94a3b8";
              const isActive = key === activeKeyNorm;
              const isHomeRow = ["A","S","D","F","J","K","L",";"].includes(key);
              const isNextFingerKey = guidedMode && finger === activeFinger && !isActive;

              return (
                <div
                  key={key}
                  className={`rounded flex items-center justify-center text-[9px] font-mono font-bold transition-all duration-100 ${
                    key === "SPACE" ? "w-40 h-5" : "w-6 h-6"
                  } ${isActive ? "scale-125 shadow-xl text-white z-10" : isNextFingerKey ? "scale-105" : "text-foreground/70"} ${isHomeRow && !isActive ? "ring-1 ring-amber-400/50" : ""}`}
                  style={{
                    background: isActive
                      ? color
                      : isNextFingerKey
                      ? `${color}18`
                      : `${color}18`,
                    border: isActive
                      ? `2px solid ${color}`
                      : `1px solid ${color}44`,
                    boxShadow: isActive ? `0 0 12px ${color}99, 0 4px 8px rgba(0,0,0,0.2)` : undefined,
                    color: isActive ? "white" : undefined,
                    opacity: guidedMode && activeFinger && !isActive && !isNextFingerKey ? 0.5 : 1,
                  }}
                >
                  {key === "SPACE" ? "SPACE" : key}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-2.5 flex-wrap justify-center">
        {Object.entries(FINGER_LABELS).map(([finger, label]) => (
          <div
            key={finger}
            className={`flex items-center gap-1 transition-all ${activeFinger === finger ? "opacity-100" : "opacity-60"}`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-sm transition-all ${activeFinger === finger ? "scale-125" : ""}`}
              style={{ background: FINGER_COLORS[finger] }}
            />
            <span className={`text-[9px] ${activeFinger === finger ? "font-bold text-foreground" : "text-muted-foreground"}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
