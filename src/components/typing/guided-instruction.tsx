import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Hand } from "lucide-react";
import type { TypingMode } from "@/lib/content-pool";

const FINGER_NAMES: Record<string, { name: string; color: string }> = {
  "pinky-l":  { name: "Left Pinky",   color: "#ef4444" },
  "ring-l":   { name: "Left Ring",    color: "#f97316" },
  "middle-l": { name: "Left Middle",  color: "#eab308" },
  "index-l":  { name: "Left Index",   color: "#22c55e" },
  "index-r":  { name: "Right Index",  color: "#3b82f6" },
  "middle-r": { name: "Right Middle", color: "#8b5cf6" },
  "ring-r":   { name: "Right Ring",   color: "#ec4899" },
  "pinky-r":  { name: "Right Pinky",  color: "#06b6d4" },
  "thumb":    { name: "Thumb",        color: "#94a3b8" },
};

const FINGER_MAP: Record<string, string> = {
  "`":"pinky-l","1":"pinky-l","q":"pinky-l","a":"pinky-l","z":"pinky-l",
  "2":"ring-l","w":"ring-l","s":"ring-l","x":"ring-l",
  "3":"middle-l","e":"middle-l","d":"middle-l","c":"middle-l",
  "4":"index-l","r":"index-l","f":"index-l","v":"index-l",
  "5":"index-l","t":"index-l","g":"index-l","b":"index-l",
  "6":"index-r","y":"index-r","h":"index-r","n":"index-r",
  "7":"index-r","u":"index-r","j":"index-r","m":"index-r",
  "8":"middle-r","i":"middle-r","k":"middle-r",",":"middle-r",
  "9":"ring-r","o":"ring-r","l":"ring-r",".":"ring-r",
  "0":"pinky-r","p":"pinky-r",";":"pinky-r","/":"pinky-r",
  "-":"pinky-r","[":"pinky-r","'":"pinky-r","=":"pinky-r","]":"pinky-r","\\":"pinky-r",
  " ":"thumb",
};

const KEY_TIPS: Record<string, string> = {
  "a":"Left pinky — home position, the base key for your left pinky",
  "s":"Left ring — home position",
  "d":"Left middle — home position",
  "f":"Left index — home position, feel the bump on this key!",
  "j":"Right index — home position, feel the bump!",
  "k":"Right middle — home position",
  "l":"Right ring — home position",
  ";":"Right pinky — home position",
  " ":"Press with either thumb. Keep other fingers on home row!",
  "e":"Left middle — stretch up from D",
  "i":"Right middle — stretch up from K",
  "t":"Left index — stretch right from F",
  "y":"Right index — stretch left from J",
  "q":"Left pinky — top row",
  "p":"Right pinky — top row",
  "r":"Left index — stretch up from F",
  "u":"Right index — stretch up from J",
  "o":"Right ring — stretch up from L",
  "w":"Left ring — stretch up from S",
  "z":"Left pinky — bottom row",
  "/":"Right pinky — bottom row",
  "x":"Left ring — bottom row",
  ".":"Right ring — bottom row",
  "c":"Left middle — bottom row",
  ",":"Right middle — bottom row",
  "v":"Left index — bottom row",
  "m":"Right index — bottom row",
  "b":"Left index — stretch from F to B",
  "n":"Right index — stretch from J to N",
  "g":"Left index — stretch to the right",
  "h":"Right index — stretch to the left",
};

interface Props {
  nextChar?: string;
  mode: TypingMode;
}

export function GuidedInstruction({ nextChar, mode }: Props) {
  const [flash, setFlash] = useState(false);
  const [prevChar, setPrevChar] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (nextChar !== prevChar) {
      setPrevChar(nextChar);
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 200);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [nextChar]);

  if (mode === "expert" || mode === "no-backspace" || mode === "exam") return null;

  // For strict mode, show guidance same as "practice" (finger colour, no tips)
  const displayMode: "guided" | "practice" = mode === "guided" ? "guided" : "practice";

  const key = nextChar?.toLowerCase() ?? "";
  const finger = FINGER_MAP[key];
  const fingerInfo = finger ? FINGER_NAMES[finger] : null;
  const tip = KEY_TIPS[key];
  const displayKey = nextChar === " " ? "SPACE" : (nextChar ?? "?");

  return (
    <div
      className={`rounded-xl border transition-all duration-150 overflow-hidden ${
        flash && fingerInfo ? "shadow-md" : ""
      }`}
      style={{
        borderColor: flash && fingerInfo ? `${fingerInfo.color}88` : undefined,
      }}
    >
      <div className="flex items-stretch min-h-[72px]">
        {/* Key display */}
        <div
          className="flex flex-col items-center justify-center px-6 py-3 min-w-[110px] transition-all duration-150"
          style={{ background: fingerInfo && flash ? `${fingerInfo.color}15` : "hsl(var(--muted) / 0.3)" }}
        >
          <p className="text-[10px] text-muted-foreground mb-1.5 font-medium tracking-wider uppercase">
            {displayMode === "guided" ? "Press this key" : "Next key"}
          </p>
          <div
            className={`rounded-xl flex items-center justify-center font-display font-black border-2 transition-all duration-150 ${
              displayKey === "SPACE" ? "w-20 h-9 text-xs" : "w-12 h-12 text-xl"
            } ${flash ? "scale-110" : "scale-100"}`}
            style={{
              background: fingerInfo ? `${fingerInfo.color}20` : "hsl(var(--muted))",
              borderColor: fingerInfo ? `${fingerInfo.color}80` : "hsl(var(--border))",
              color: fingerInfo ? fingerInfo.color : "hsl(var(--foreground))",
              boxShadow: flash && fingerInfo ? `0 0 18px ${fingerInfo.color}50` : undefined,
            }}
          >
            {displayKey}
          </div>
        </div>

        {/* Finger + tip */}
        <div className="flex-1 flex flex-col justify-center px-5 py-3 border-l border-border">
          {displayMode === "guided" && fingerInfo ? (
            <>
              <div className="flex items-center gap-2 mb-1.5">
                <Hand className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-muted-foreground font-medium">Use your</span>
                <Badge
                  className="text-xs font-semibold px-2 py-0.5"
                  style={{
                    background: `${fingerInfo.color}20`,
                    color: fingerInfo.color,
                    borderColor: `${fingerInfo.color}50`,
                  }}
                  variant="outline"
                >
                  {fingerInfo.name}
                </Badge>
              </div>
              {tip && (
                <p className="text-xs text-muted-foreground leading-relaxed">{tip}</p>
              )}
            </>
          ) : displayMode === "practice" && fingerInfo ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: fingerInfo.color }} />
              <span className="text-sm font-medium" style={{ color: fingerInfo.color }}>{fingerInfo.name}</span>
            </div>
          ) : !nextChar ? (
            <p className="text-xs text-muted-foreground italic">Click the text area to start typing</p>
          ) : (
            <p className="text-xs text-muted-foreground">Non-standard key — use appropriate finger</p>
          )}
        </div>

        {/* Home row reminder */}
        {displayMode === "guided" && (
          <div className="flex flex-col items-center justify-center px-4 border-l border-border bg-amber-50/50 dark:bg-amber-900/5 min-w-[80px]">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wide mb-1">Home Row</p>
            <div className="flex gap-0.5">
              {["A","S","D","F","·","J","K","L"].map((k, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded text-[8px] flex items-center justify-center font-bold transition-all ${
                    k !== "·" && k.toLowerCase() === key
                      ? "bg-amber-400 text-white scale-110"
                      : k === "·"
                      ? "opacity-0"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {k}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
