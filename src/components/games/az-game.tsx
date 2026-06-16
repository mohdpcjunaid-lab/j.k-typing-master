import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Timer, Trophy } from "lucide-react";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const ZA = "zyxwvutsrqponmlkjihgfedcba";

type Mode = "az" | "za" | "random";

function shuffle(arr: string[]): string[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

interface Props { onEnd: (score: number, timeMs: number) => void; }

export function AZGame({ onEnd }: Props) {
  const [mode, setMode] = useState<Mode>("az");
  const [sequence, setSequence] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState(false);
  const [finished, setFinished] = useState(false);
  const startTime = useRef<number>(0);

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => setElapsed(Date.now() - startTime.current), 100);
    return () => clearInterval(interval);
  }, [started]);

  function start(m: Mode) {
    setMode(m);
    let seq: string[];
    if (m === "az") seq = ALPHABET.split("");
    else if (m === "za") seq = ZA.split("");
    else seq = shuffle(ALPHABET.split(""));
    setSequence(seq);
    setIndex(0);
    setStarted(true);
    setElapsed(0);
    setError(false);
    setFinished(false);
    startTime.current = Date.now();
  }

  useEffect(() => {
    if (!started || finished) return;
    function onKey(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      if (key === sequence[index]) {
        setError(false);
        if (index + 1 >= sequence.length) {
          setFinished(true);
          setStarted(false);
          onEnd(Math.max(0, 5000 - Math.floor(elapsed / 100) * 10), elapsed);
        } else {
          setIndex(i => i + 1);
        }
      } else if (key.length === 1 && /[a-z]/.test(key)) {
        setError(true);
        setTimeout(() => setError(false), 300);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, index, sequence, elapsed, finished]);

  if (!started && !finished) {
    return (
      <div className="text-center py-8 space-y-6">
        <div className="text-5xl">🔤</div>
        <h2 className="text-2xl font-bold">A-Z Challenge</h2>
        <p className="text-muted-foreground">Type the letters in the correct sequence as fast as possible!</p>
        <div className="mx-auto w-56 h-56 rounded-full border border-border bg-muted/20 flex items-center justify-center">
          <div className="relative w-44 h-44">
            {ALPHABET.split("").map((letter, i) => {
              const angle = (i / 26) * Math.PI * 2 - Math.PI / 2;
              const x = 88 + Math.cos(angle) * 74;
              const y = 88 + Math.sin(angle) * 74;
              return (
                <div
                  key={letter}
                  className={`absolute w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-[10px] font-bold ${i < index ? "bg-emerald-500 text-white" : i === index ? "bg-primary text-white scale-110" : "bg-background border border-border"}`}
                  style={{ left: x, top: y }}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-center gap-3">
          {(["az", "za", "random"] as Mode[]).map(m => (
            <Button key={m} onClick={() => start(m)} variant="outline" className="uppercase text-sm font-bold" data-testid={`btn-${m}-mode`}>
              {m === "az" ? "A→Z" : m === "za" ? "Z→A" : "🔀 Random"}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (finished) {
    const secs = (elapsed / 1000).toFixed(2);
    return (
      <div className="text-center py-10">
        <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-1">Complete!</h2>
        <p className="text-muted-foreground mb-4">{mode === "az" ? "A→Z" : mode === "za" ? "Z→A" : "Random"} in {secs}s</p>
        <div className="flex justify-center gap-3">
          <Button onClick={() => start(mode)}>Play Again</Button>
          <Button variant="outline" onClick={() => { setFinished(false); setStarted(false); }}>Change Mode</Button>
        </div>
      </div>
    );
  }

  const currentLetter = sequence[index];
  const progress = (index / sequence.length) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{index}/{sequence.length} done</span>
        <span className="font-mono font-bold text-lg">{(elapsed / 1000).toFixed(1)}s</span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all duration-200" style={{ width: `${progress}%` }} />
      </div>

      {/* Letter display */}
      <div className={`flex items-center justify-center py-12 rounded-2xl transition-all ${error ? "bg-red-500/20" : "bg-muted/30"}`}>
        <span className={`font-mono text-8xl font-black tracking-wider uppercase transition-all ${error ? "text-red-500" : "text-primary"}`}>
          {currentLetter}
        </span>
      </div>

      {/* Remaining sequence */}
      <div className="flex flex-wrap gap-1 justify-center">
        {sequence.map((letter, i) => (
          <span key={i} className={`w-6 h-6 flex items-center justify-center text-xs font-mono font-bold rounded uppercase transition-all ${i < index ? "bg-emerald-500/20 text-emerald-600" : i === index ? "bg-primary text-white scale-110" : "bg-muted text-muted-foreground"}`}>
            {letter}
          </span>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground">Just press the key — no Enter needed</p>
    </div>
  );
}
