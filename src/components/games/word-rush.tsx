import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Timer, Zap } from "lucide-react";

const ALL_WORDS = [
  "apple","brave","crane","dance","eagle","flame","grace","house","image","judge",
  "knife","lemon","major","night","ocean","piano","queen","river","smile","tiger",
  "ultra","voice","water","xenon","youth","zebra","amber","blaze","cloud","draft",
  "earth","frost","giant","honor","input","joker","karma","light","magic","nerve",
  "olive","power","quest","radar","storm","table","unity","valve","wheat","xenon",
  "yield","zones","alpha","brisk","carry","drawn","every","favor","green","heavy",
  "india","juice","keeps","later","model","novel","offer","proxy","quiet","range",
  "safer","trust","under","video","world","extra","young","zones","blank","crisp",
];

function getRandomWord(exclude: string[]): string {
  const available = ALL_WORDS.filter(w => !exclude.includes(w));
  if (available.length === 0) return ALL_WORDS[Math.floor(Math.random() * ALL_WORDS.length)];
  return available[Math.floor(Math.random() * available.length)];
}

interface Props { onEnd: (score: number, wordsTyped: number) => void; }

export function WordRushGame({ onEnd }: Props) {
  const [displayWords, setDisplayWords] = useState<{ word: string; done: boolean }[]>([]);
  const [typed, setTyped] = useState("");
  const [score, setScore] = useState(0);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);
  const [lastHit, setLastHit] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function initWords() {
    const ws: { word: string; done: boolean }[] = [];
    for (let i = 0; i < 8; i++) ws.push({ word: getRandomWord(ws.map(w => w.word)), done: false });
    return ws;
  }

  function start() {
    setDisplayWords(initWords());
    setTyped("");
    setScore(0);
    setWordsTyped(0);
    setTimeLeft(60);
    setStarted(true);
    setLastHit(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setStarted(false);
          onEnd(score, wordsTyped);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, score, wordsTyped, onEnd]);

  function handleChange(val: string) {
    setTyped(val);
    const match = displayWords.find(w => !w.done && w.word === val.trim().toLowerCase());
    if (match) {
      setLastHit(match.word);
      setTimeout(() => setLastHit(null), 500);
      setScore(s => s + match.word.length * 10);
      setWordsTyped(c => c + 1);
      setTyped("");
      setDisplayWords(prev => {
        const updated = prev.map(w => w.word === match.word ? { ...w, done: true } : w);
        const newWord = getRandomWord(updated.map(w => w.word));
        return updated.map(w => w.word === match.word ? { word: newWord, done: false } : w);
      });
    }
  }

  if (!started && timeLeft === 60) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🌪️</div>
        <h2 className="text-2xl font-bold mb-2">Word Rush</h2>
        <p className="text-muted-foreground mb-6">Eight words are displayed. Type any of them to score. Type fast!</p>
        <div className="flex items-center justify-center gap-6 mb-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Timer className="w-4 h-4 text-blue-500" /> 60 seconds</span>
          <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-amber-500" /> Any word scores!</span>
        </div>
        <Button size="lg" onClick={start} className="gold-gradient text-[hsl(222_47%_11%)] font-bold">Start Game</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-2">
        <span className="text-sm text-muted-foreground">{wordsTyped} typed</span>
        <span className="font-bold text-lg text-primary">{score} pts</span>
        <span className={`font-mono font-bold text-lg ${timeLeft <= 10 ? "text-red-500" : "text-foreground"}`}>{timeLeft}s</span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {displayWords.map((w, i) => (
          <div key={i} className={`p-3 rounded-xl text-center font-mono font-bold text-sm transition-all duration-300 ${lastHit === w.word ? "bg-emerald-500 text-white scale-105 shadow-lg" : "bg-card border border-border hover:border-primary/30"}`}>
            {w.word}
          </div>
        ))}
      </div>

      <Input
        ref={inputRef}
        value={typed}
        onChange={e => handleChange(e.target.value)}
        placeholder="Type any word above..."
        className="text-center font-mono text-xl h-12 border-2 border-primary/30 focus:border-primary"
        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
      />
      <p className="text-center text-xs text-muted-foreground">No Enter needed — just type any word exactly</p>
    </div>
  );
}
