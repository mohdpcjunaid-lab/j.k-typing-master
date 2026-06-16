import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link2, Timer, Trophy } from "lucide-react";

const WORD_LIST = [
  "apple", "elephant", "tiger", "rabbit", "table", "every", "year", "rain", "night", "train",
  "name", "engine", "enter", "road", "door", "river", "rain", "north", "horse", "earth",
  "home", "eagle", "end", "dog", "great", "tall", "long", "game", "energy", "yesterday",
  "yellow", "west", "tower", "real", "lamp", "park", "king", "good", "dark", "keep",
  "paper", "red", "dream", "map", "piano", "open", "nice", "express", "stamp", "play",
  "yard", "dance", "egg", "gold", "day", "young", "glass", "silver", "run", "never",
  "ring", "giant", "team", "make", "earth", "hand", "dictionary", "year", "run", "new",
  "wood", "deer", "river", "rose", "east", "true", "echo", "orange", "eye", "end",
  "nail", "lion", "note", "eagle", "earth", "help", "paint", "tiger", "red", "door",
];

function getWordStartingWith(letter: string, used: string[]): string | null {
  const candidates = WORD_LIST.filter(w => w.startsWith(letter) && !used.includes(w));
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

interface Props { onEnd: (score: number, chain: number) => void; }

export function WordChainGame({ onEnd }: Props) {
  const [started, setStarted] = useState(false);
  const [chain, setChain] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState("");
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => {
      setTimeLeft(tl => {
        if (tl <= 1) { clearInterval(t); onEnd(score, chain.length); return 0; }
        return tl - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, score, chain.length]);

  function start() {
    const first = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setChain([first]);
    setCurrentWord(first);
    setTyped("");
    setTimeLeft(60);
    setScore(0);
    setError("");
    setStarted(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function handleSubmit() {
    const word = typed.trim().toLowerCase();
    if (!word) return;

  const expectedStart = currentWord[currentWord.length - 1]?.toLowerCase();
    if (!word.startsWith(expectedStart)) {
      setError(`Word must start with "${expectedStart.toUpperCase()}"`);
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    if (chain.includes(word)) {
      setError("Word already used!");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    if (!WORD_LIST.includes(word)) {
      setError("Word not in list, try another.");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    const newChain = [...chain, word];
    const pts = word.length * 10;
    setChain(newChain);
    setCurrentWord(word);
    setScore(s => s + pts);
    setTyped("");
    setError("");
  }

  if (!started) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔗</div>
        <h2 className="text-2xl font-bold mb-2">Word Chain</h2>
        <p className="text-muted-foreground mb-4">Type a word that starts with the last letter of the previous word!</p>
        <div className="bg-muted/30 rounded-xl p-4 mb-6 max-w-sm mx-auto text-left text-sm space-y-1.5">
          <p>• <strong>60 seconds</strong> to build the longest chain</p>
          <p>• Each word must start with the <strong>last letter</strong> of the previous word</p>
          <p>• Longer words = <strong>more points</strong></p>
          <p>• No repeated words allowed</p>
        </div>
        <Button size="lg" onClick={start} className="gold-gradient text-[hsl(222_47%_11%)] font-bold">Start Game</Button>
      </div>
    );
  }

  if (timeLeft === 0) {
    return (
      <div className="text-center py-8">
        <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-2xl font-bold mb-1">Game Over!</h2>
        <p className="text-muted-foreground mb-4">Chain of {chain.length} words</p>
        <div className="flex justify-center gap-4 mb-6">
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{score}</p>
            <p className="text-xs text-muted-foreground">Score</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{chain.length}</p>
            <p className="text-xs text-muted-foreground">Words</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 justify-center mb-6 max-h-24 overflow-y-auto">
          {chain.map((w, i) => (
            <Badge key={i} variant="outline" className="text-xs">{w}</Badge>
          ))}
        </div>
        <Button onClick={start}>Play Again</Button>
      </div>
    );
  }

  const nextLetter = currentWord[currentWord.length - 1].toUpperCase();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-2">
        <span className="flex items-center gap-1.5 text-sm"><Link2 className="w-4 h-4 text-blue-500" /> Chain: <strong>{chain.length}</strong></span>
        <span className="font-bold text-lg text-primary">{score} pts</span>
        <span className={`font-mono font-bold text-lg flex items-center gap-1 ${timeLeft <= 10 ? "text-red-500" : ""}`}>
          <Timer className="w-4 h-4" />{timeLeft}s
        </span>
      </div>

      {/* Last 5 words in chain */}
      <div className="flex flex-wrap gap-1 min-h-[32px]">
        {chain.slice(-5).map((w, i, arr) => (
          <Badge key={i} variant={i === arr.length - 1 ? "default" : "outline"} className="text-xs capitalize">{w}</Badge>
        ))}
      </div>

      {/* Current prompt */}
      <div className="text-center py-6 bg-muted/30 rounded-xl">
        <p className="text-sm text-muted-foreground mb-1">Type a word starting with</p>
        <p className="font-display text-6xl font-black text-primary">{nextLetter}</p>
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <div className={`flex gap-2 ${shake ? "animate-[shake_0.3s_ease-in-out]" : ""}`}>
        <Input
          ref={inputRef}
          value={typed}
          onChange={e => { setTyped(e.target.value.toLowerCase()); setError(""); }}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          placeholder={`Type a word starting with "${nextLetter}"…`}
          className="font-mono text-lg h-12 border-2 border-primary/30 focus:border-primary"
          autoComplete="off" autoCorrect="off" spellCheck={false}
        />
          <Button onClick={() => handleSubmit()} className="h-12 px-6">Enter</Button>
      </div>
    </div>
  );
}
