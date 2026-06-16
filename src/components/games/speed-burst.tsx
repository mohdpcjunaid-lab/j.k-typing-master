import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Target } from "lucide-react";

const WORDS = [
  "the","be","to","of","and","in","that","have","it","for","not","on","with","he","as","you","do","at","this","but",
  "his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there","their","what",
  "so","up","out","if","about","who","get","which","go","me","when","make","can","like","time","no","just","him",
  "know","take","people","into","year","your","good","some","could","them","see","other","than","then","now","look",
  "only","come","its","over","think","also","back","after","use","two","how","our","work","first","well","way","even",
  "new","want","because","any","these","give","day","most","us","great","between","need","large","often","hand",
  "high","place","hold","real","life","few","north","open","seem","together","next","white","children","begin","got",
  "walk","example","ease","paper","group","always","music","those","both","mark","book","letter","until","mile",
  "river","car","feet","care","second","enough","plain","girl","usual","young","ready","above","ever","red","list",
  "though","feel","talk","bird","soon","body","dog","family","direct","pose","leave","song","measure","door","product",
  "black","short","numeral","class","wind","question","happen","complete","ship","area","half","rock","order","fire",
];

interface Props { onEnd: (score: number, wpm: number) => void; }

export function SpeedBurstGame({ onEnd }: Props) {
  const [currentWord, setCurrentWord] = useState("");
  const [typed, setTyped] = useState("");
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);
  const [flash, setFlash] = useState<"green" | "red" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const startTime = useRef<number>(0);
  const usedWords = useRef<Set<string>>(new Set());

  function nextWord() {
    let w: string;
    do { w = WORDS[Math.floor(Math.random() * WORDS.length)]; } while (usedWords.current.has(w) && usedWords.current.size < WORDS.length);
    usedWords.current.add(w);
    setCurrentWord(w);
  }

  function start() {
    setStarted(true);
    setScore(0);
    setCorrect(0);
    setTimeLeft(60);
    setTyped("");
    usedWords.current = new Set();
    startTime.current = Date.now();
    nextWord();
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setStarted(false);
          const elapsed = (Date.now() - startTime.current) / 1000 / 60;
          onEnd(score + (correct * 5), Math.round(correct / elapsed));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started]);

  function handleChange(val: string) {
    if (val.endsWith(" ") || val === currentWord) {
      const trimmed = val.trim();
      if (trimmed === currentWord) {
        setFlash("green");
        setScore(s => s + currentWord.length * 10 + 5);
        setCorrect(c => c + 1);
      } else {
        setFlash("red");
      }
      setTimeout(() => setFlash(null), 200);
      setTyped("");
      nextWord();
    } else {
      setTyped(val);
    }
  }

  const isWrong = typed.length > 0 && !currentWord.startsWith(typed);

  if (!started && timeLeft === 60) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚡</div>
        <h2 className="text-2xl font-bold mb-2">Speed Burst</h2>
        <p className="text-muted-foreground mb-6">Type as many words as you can in 60 seconds. Press Space or Enter to submit each word.</p>
        <div className="flex items-center justify-center gap-6 mb-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-amber-500" /> 60 seconds</span>
          <span className="flex items-center gap-1"><Target className="w-4 h-4 text-blue-500" /> +10pts per letter</span>
        </div>
        <Button size="lg" onClick={start} className="gold-gradient text-[hsl(222_47%_11%)] font-bold">Start Game</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-2">
        <span className="text-muted-foreground text-sm">{correct} words</span>
        <span className="font-bold text-lg text-primary">{score} pts</span>
        <span className={`font-mono font-bold text-lg ${timeLeft <= 10 ? "text-red-500" : "text-foreground"}`}>{timeLeft}s</span>
      </div>

      <div className={`flex items-center justify-center py-10 rounded-2xl transition-colors ${flash === "green" ? "bg-emerald-500/20" : flash === "red" ? "bg-red-500/20" : "bg-muted/30"}`}>
        <div className={`font-mono text-6xl font-bold tracking-wider transition-all ${flash === "green" ? "text-emerald-500 scale-110" : flash === "red" ? "text-red-500 shake" : "text-foreground"}`}>
          {currentWord}
        </div>
      </div>

      <Input
        ref={inputRef}
        value={typed}
        onChange={e => handleChange(e.target.value)}
        placeholder="Type the word above..."
        className={`text-center font-mono text-2xl h-14 border-2 transition-colors ${isWrong ? "border-red-500 bg-red-50/50 dark:bg-red-900/10" : "border-primary/30 focus:border-primary"}`}
        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
      />
      <p className="text-center text-xs text-muted-foreground">Press Space after each word</p>
    </div>
  );
}
