import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Target, AlertCircle } from "lucide-react";

const PARAGRAPHS = [
  "The quick brown fox jumps over the lazy dog. A good typist focuses on accuracy before speed. Every character must be typed correctly. Take your time and think before each keystroke.",
  "Practice makes perfect. A typist who aims for zero errors will naturally develop excellent accuracy. Slow down and focus. Speed will come naturally with time and consistent effort.",
  "Home row keys are the foundation of touch typing. Keep your fingers on A S D F and J K L semicolon at all times. Return to home position after every keystroke for maximum efficiency.",
  "Government typing examinations require both speed and accuracy. A single error can cost valuable marks. Train yourself to type carefully and build the habit of accuracy from the very beginning.",
];

interface Props { onEnd: (accuracy: number, wpm: number, errors: number) => void; }

export function AccuracyChallenge({ onEnd }: Props) {
  const [text] = useState(() => PARAGRAPHS[Math.floor(Math.random() * PARAGRAPHS.length)]);
  const [typed, setTyped] = useState("");
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [strictMode, setStrictMode] = useState(false);
  const [penalty, setPenalty] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const correctCount = typed.split("").filter((c, i) => c === text[i]).length;
  const accuracy = typed.length > 0 ? (correctCount / typed.length) * 100 : 100;
  const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
  const wpm = startTime && elapsed > 0 ? Math.round((typed.trim().split(/\s+/).length / elapsed) * 60) : 0;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (!startTime) setStartTime(Date.now());
    if (val.length > text.length) return;

    if (strictMode) {
      const newChar = val[val.length - 1];
      const expectedChar = text[val.length - 1];
      if (newChar !== expectedChar) {
        setPenalty(true);
        setTimeout(() => setPenalty(false), 500);
        setErrors(e => e + 1);
        return; // Reject the wrong character
      }
    } else {
      if (val.length > typed.length) {
        const idx = val.length - 1;
        if (val[idx] !== text[idx]) {
          setErrors(e => e + 1);
          setPenalty(true);
          setTimeout(() => setPenalty(false), 200);
        }
      }
    }

    setTyped(val);
    if (val.length === text.length) {
      const finalElapsed = (Date.now() - (startTime ?? Date.now())) / 1000;
      const finalCorrect = val.split("").filter((c, i) => c === text[i]).length;
      const finalWpm = Math.round((text.trim().split(/\s+/).length / finalElapsed) * 60);
      const finalAccuracy = (finalCorrect / val.length) * 100;
      setTimeout(() => onEnd(finalAccuracy, finalWpm, errors), 300);
    }
  }

  if (!started) {
    return (
      <div className="text-center py-8 space-y-6">
        <div className="text-5xl">🎯</div>
        <h2 className="text-2xl font-bold">Accuracy Challenge</h2>
        <p className="text-muted-foreground">Type the passage with maximum accuracy. Every error is penalized.</p>
        <div className="flex items-center justify-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={() => setStrictMode(s => !s)} className={`w-10 h-6 rounded-full transition-colors relative ${strictMode ? "bg-red-500" : "bg-muted"}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${strictMode ? "translate-x-5" : "translate-x-1"}`} />
            </div>
            <span className="text-sm font-medium">Strict Mode {strictMode ? "(no wrong keys!)" : ""}</span>
          </label>
        </div>
        <Button size="lg" onClick={() => { setStarted(true); setTimeout(() => inputRef.current?.focus(), 50); }} className="gold-gradient text-[hsl(222_47%_11%)] font-bold">Start Challenge</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`flex items-center justify-between rounded-lg px-4 py-2 transition-colors ${penalty ? "bg-red-500/10 border border-red-500/30" : "bg-card border border-border"}`}>
        <span className={`font-bold ${errors > 0 ? "text-red-500" : "text-emerald-500"}`}>{errors} errors</span>
        <span className="font-bold text-primary">{Math.round(accuracy)}% accuracy</span>
        <span className="font-bold text-foreground">{wpm} WPM</span>
        {strictMode && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">STRICT</span>}
      </div>

      {penalty && (
        <div className="flex items-center gap-2 text-red-500 text-sm font-medium px-1">
          <AlertCircle className="w-4 h-4" /> Wrong key! {strictMode ? "That keystroke was blocked." : "Error counted."}
        </div>
      )}

      <div
        className={`p-6 rounded-xl cursor-text font-mono text-base leading-relaxed transition-colors ${penalty ? "bg-red-50/50 dark:bg-red-900/5" : "bg-card border border-border"}`}
        onClick={() => inputRef.current?.focus()}
      >
        {text.split("").map((char, i) => {
          let cls = "text-muted-foreground";
          if (i < typed.length) cls = typed[i] === char ? "text-emerald-600" : "bg-red-200 dark:bg-red-900/40 text-red-600";
          else if (i === typed.length) cls = "bg-primary/20 text-foreground border-l-2 border-primary";
          return <span key={i} className={cls}>{char}</span>;
        })}
        <input
          ref={inputRef}
          value={typed}
          onChange={handleChange}
          className="opacity-0 absolute w-0 h-0"
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
        />
      </div>

      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${(typed.length / text.length) * 100}%` }} />
      </div>
      <p className="text-center text-xs text-muted-foreground">Click on the text and start typing. {strictMode ? "Wrong keys are blocked in Strict Mode." : "Red = wrong character."}</p>
    </div>
  );
}
