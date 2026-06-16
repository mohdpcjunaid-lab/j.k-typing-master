import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Zap, Trophy } from "lucide-react";

const WORD_BANK = [
  "type", "fast", "quick", "brown", "fox", "jump", "lazy", "dog", "key", "board",
  "finger", "home", "row", "speed", "word", "press", "skill", "learn", "master", "level",
  "score", "game", "hit", "miss", "save", "win", "race", "time", "aim", "fire",
  "class", "test", "exam", "pass", "fail", "mark", "grade", "rank", "best", "top",
  "read", "write", "spell", "copy", "text", "note", "page", "book", "font", "size",
  "left", "right", "hand", "thumb", "ring", "index", "pinky", "touch", "feel", "flow",
];

interface FallingWord { id: number; word: string; x: number; y: number; speed: number; }

let nextId = 0;

interface Props { onEnd: (score: number) => void; }

export function FallingWordsGame({ onEnd }: Props) {
  const [words, setWords] = useState<FallingWord[]>([]);
  const [typed, setTyped] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [started, setStarted] = useState(false);
  const [hit, setHit] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);
  const wordsRef = useRef<FallingWord[]>([]);
  const livesRef = useRef(3);
  const spawnTimer = useRef(0);

  wordsRef.current = words;
  livesRef.current = lives;

  const addWord = useCallback(() => {
    const word = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
    const x = 5 + Math.random() * 75;
    const base = difficulty === "easy" ? 0.8 : difficulty === "medium" ? 1.3 : 1.9;
    const speed = base + Math.random() * (difficulty === "easy" ? 0.6 : difficulty === "medium" ? 1 : 1.4) + Math.max(0, (60 - timeLeft) / 45);
    setWords(prev => [...prev, { id: nextId++, word, x, y: 0, speed }]);
  }, [timeLeft, difficulty]);

  const tick = useCallback((ts: number) => {
    if (!lastRef.current) lastRef.current = ts;
    const delta = (ts - lastRef.current) / 1000;
    lastRef.current = ts;
    spawnTimer.current += delta;
    const spawnDelay = difficulty === "easy" ? 3.4 : difficulty === "medium" ? 2.2 : 1.4;
    if (spawnTimer.current > spawnDelay) { spawnTimer.current = 0; addWord(); }
    setWords(prev => {
      const fallen: FallingWord[] = [];
      const alive = prev.map(w => {
        const ny = w.y + w.speed * delta * 30;
        if (ny > 95) { fallen.push(w); return { ...w, y: 200 }; }
        return { ...w, y: ny };
      }).filter(w => w.y <= 100);
      if (fallen.length > 0) {
        setLives(l => { const nl = l - fallen.length; if (nl <= 0) { setStarted(false); return 0; } return nl; });
      }
      return alive;
    });
    rafRef.current = requestAnimationFrame(tick);
  }, [addWord]);

  useEffect(() => {
    if (!started) return;
    rafRef.current = requestAnimationFrame(tick);
    const timer = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { setStarted(false); return 0; } return t - 1; });
    }, 1000);
    return () => { cancelAnimationFrame(rafRef.current); clearInterval(timer); };
  }, [started, tick]);

  useEffect(() => {
    if (!started && (timeLeft === 0 || lives === 0)) onEnd(score);
  }, [started]);

  function handleInput(val: string) {
    setTyped(val);
    const match = wordsRef.current.find(w => w.word === val.trim().toLowerCase());
    if (match) {
      setHit(match.id);
      setTimeout(() => setHit(null), 300);
      setWords(prev => prev.filter(w => w.id !== match.id));
      setScore(s => s + match.word.length * 10);
      setTyped("");
    }
  }

  function start() {
    setStarted(true);
    setScore(0);
    setLives(3);
    setTimeLeft(60);
    setDifficulty("easy");
    setWords([]);
    setTyped("");
    spawnTimer.current = 0;
    lastRef.current = 0;
    setTimeout(() => inputRef.current?.focus(), 100);
    addWord();
  }

  if (!started && timeLeft === 60 && score === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⬇️</div>
        <h2 className="text-2xl font-bold mb-2">Falling Words</h2>
        <p className="text-muted-foreground mb-6">Words fall from the sky. Type them before they hit the ground!</p>
        <div className="flex items-center justify-center gap-6 mb-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-red-500" /> 3 lives</span>
          <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-amber-500" /> 60 seconds</span>
          <span className="flex items-center gap-1"><Trophy className="w-4 h-4 text-yellow-500" /> Score per letter</span>
        </div>
        <div className="flex justify-center gap-2 mb-6">
          {(["easy", "medium", "hard"] as const).map(d => (
            <Button key={d} variant={difficulty === d ? "default" : "outline"} size="sm" onClick={() => setDifficulty(d)} className="capitalize">
              {d}
            </Button>
          ))}
        </div>
        <Button size="lg" onClick={start} className="gold-gradient text-[hsl(222_47%_11%)] font-bold">Start Game</Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* HUD */}
      <div className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-2">
        <div className="flex items-center gap-1">{Array.from({ length: 3 }).map((_, i) => <Heart key={i} className={`w-5 h-5 ${i < lives ? "text-red-500" : "text-muted-foreground/30"}`} fill={i < lives ? "currentColor" : "none"} />)}</div>
        <span className="font-bold text-lg text-primary">{score} pts</span>
        <span className={`font-mono font-bold text-lg ${timeLeft <= 10 ? "text-red-500" : "text-foreground"}`}>{timeLeft}s</span>
      </div>

      {/* Game field */}
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl overflow-hidden" style={{ height: "300px" }}>
        {words.map(w => (
          <div
            key={w.id}
            className={`absolute px-3 py-1 rounded-full text-sm font-bold transition-colors ${hit === w.id ? "bg-emerald-400 text-black scale-110" : "bg-amber-400/90 text-slate-900"}`}
            style={{ left: `${w.x}%`, top: `${w.y}%`, transform: "translateX(-50%)", transition: "background 0.15s" }}
          >
            {w.word}
          </div>
        ))}
        {words.length === 0 && started && (
          <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm">Words incoming...</div>
        )}
      </div>

      {/* Input */}
      <Input
        ref={inputRef}
        value={typed}
        onChange={e => handleInput(e.target.value)}
        placeholder="Type the falling words here..."
        className="text-center font-mono text-lg h-12 border-2 border-primary/30 focus:border-primary"
        autoComplete="off" autoCorrect="off" spellCheck={false}
      />
    </div>
  );
}
