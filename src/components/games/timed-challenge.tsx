import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Timer, Zap, Target, Trophy } from "lucide-react";

const CHALLENGES = [
  { duration: 15, label: "15 Seconds", words: ["the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog", "type", "fast", "now", "key", "board", "speed", "test", "aim", "hit", "win"] },
  { duration: 30, label: "30 Seconds", words: ["typing", "master", "speed", "accuracy", "keyboard", "practice", "improve", "lesson", "course", "skill", "finger", "position", "focus", "target", "challenge", "score", "level", "progress", "boost", "reach"] },
  { duration: 60, label: "1 Minute", words: ["government", "examination", "competition", "certificate", "accuracy", "proficiency", "performance", "improvement", "administration", "keyboard", "efficiency", "consistent", "dedication", "technique", "position", "important", "remember", "practice", "difficult", "technology"] },
];

interface Props { onEnd: (wpm: number, score: number) => void; }

export function TimedChallengeGame({ onEnd }: Props) {
  const [selectedChallenge, setSelectedChallenge] = useState(1);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [wordQueue, setWordQueue] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState("");
  const [typed, setTyped] = useState("");
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const challenge = CHALLENGES[selectedChallenge] ?? CHALLENGES[0];

  function buildQueue(words: string[], count = 40) {
    const q: string[] = [];
    for (let i = 0; i < count; i++) q.push(words[Math.floor(Math.random() * words.length)]);
    return q;
  }

  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => {
      setTimeLeft(tl => {
        if (tl <= 1) {
          clearInterval(t);
          setDone(true);
          return 0;
        }
        return tl - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started]);

  useEffect(() => {
    if (done) {
      const wpm = Math.round((correct / challenge.duration) * 60);
      const score = correct * 15 + Math.round((correct / Math.max(total, 1)) * 100) * 2;
      onEnd(wpm, score);
    }
  }, [done]);

  function start() {
    const queue = buildQueue(challenge.words);
    setWordQueue(queue.slice(1));
    setCurrentWord(queue[0]);
    setTyped("");
    setCorrect(0);
    setTotal(0);
    setTimeLeft(challenge.duration);
    setDone(false);
    setStarted(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function handleChange(val: string) {
    setTyped(val);
    if (val.endsWith(" ")) {
      const word = val.trim();
      const isCorrect = word === currentWord;
      if (isCorrect) setCorrect(c => c + 1);
      setTotal(t => t + 1);
      const next = wordQueue[0] ?? challenge.words[0];
      setCurrentWord(next);
      setWordQueue(q => [...q.slice(1), challenge.words[Math.floor(Math.random() * challenge.words.length)]]);
      setTyped("");
    }
  }

  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100;
  const wpm = started && challenge.duration - timeLeft > 0 ? Math.round((correct / (challenge.duration - timeLeft)) * 60) : 0;

  if (!started) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">⏱️</div>
        <h2 className="text-2xl font-bold mb-2">Timed Challenge</h2>
        <p className="text-muted-foreground mb-6">Type as many words as possible before time runs out!</p>
        <div className="flex justify-center gap-3 mb-6">
          {CHALLENGES.map((c, i) => (
            <Button key={i} variant={selectedChallenge === i ? "default" : "outline"} onClick={() => setSelectedChallenge(i)} className={selectedChallenge === i ? "gold-gradient text-[hsl(222_47%_11%)] font-bold" : ""}>
              {c.label}
            </Button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mb-6">Type the displayed word and press space to advance</p>
        <Button size="lg" onClick={start} className="gold-gradient text-[hsl(222_47%_11%)] font-bold">
          <Timer className="w-4 h-4 mr-2" />Start {challenge.label} Challenge
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* HUD */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-card border border-border rounded-lg p-2 text-center">
          <p className={`font-bold text-xl ${timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-foreground"}`}>{timeLeft}s</p>
          <p className="text-[10px] text-muted-foreground">LEFT</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-2 text-center">
          <p className="font-bold text-xl text-blue-600">{wpm}</p>
          <p className="text-[10px] text-muted-foreground">WPM</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-2 text-center">
          <p className="font-bold text-xl text-emerald-600">{correct}</p>
          <p className="text-[10px] text-muted-foreground">CORRECT</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-2 text-center">
          <p className="font-bold text-xl text-amber-600">{accuracy}%</p>
          <p className="text-[10px] text-muted-foreground">ACC</p>
        </div>
      </div>

      {/* Upcoming words */}
      <div className="flex gap-2 overflow-hidden py-2">
        {wordQueue.slice(0, 5).map((w, i) => (
          <span key={i} className={`px-3 py-1 rounded-lg text-sm font-mono transition-all ${i === 0 ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted text-muted-foreground"}`}>{w}</span>
        ))}
      </div>

      {/* Current word */}
      <div className="text-center py-8 bg-muted/30 rounded-xl">
        <p className="font-display text-5xl font-black tracking-wider text-primary">{currentWord}</p>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${(1 - timeLeft / challenge.duration) * 100}%` }} />
      </div>

      <input
        ref={inputRef}
        value={typed}
        onChange={e => handleChange(e.target.value)}
        className="w-full font-mono text-xl p-3 rounded-xl border-2 border-primary/30 focus:border-primary bg-background text-center outline-none"
        autoComplete="off" autoCorrect="off" spellCheck={false}
        placeholder="Type the word above and press Space"
      />
    </div>
  );
}
