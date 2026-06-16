import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FallingWordsGame } from "@/components/games/falling-words";
import { SpeedBurstGame } from "@/components/games/speed-burst";
import { AZGame } from "@/components/games/az-game";
import { WordRushGame } from "@/components/games/word-rush";
import { AccuracyChallenge } from "@/components/games/accuracy-challenge";
import { WordChainGame } from "@/components/games/word-chain";
import { ParagraphRaceGame } from "@/components/games/paragraph-race";
import { TimedChallengeGame } from "@/components/games/timed-challenge";
import { Trophy, Gamepad2, Globe } from "lucide-react";
import { SUPPORTED_LANGUAGES, GAME_WORDS, type Language } from "@/lib/content-pool";

type GameId = "falling" | "speed" | "az" | "rush" | "accuracy" | "numbers" | "wordchain" | "paragraph" | "timed";

interface GameResult { score?: number; wpm?: number; accuracy?: number; errors?: number; timeMs?: number; chain?: number; }

const GAMES = [
  { id: "falling" as GameId, emoji: "⬇️", title: "Falling Words", desc: "Words fall from the sky. Type them before they hit the ground! Lives system, escalating speed.", badge: "Action", color: "from-blue-500/10 to-cyan-500/10 border-blue-200 dark:border-blue-800", difficulty: "Medium", langSupport: true },
  { id: "speed" as GameId, emoji: "⚡", title: "Speed Burst", desc: "One word at a time. Type as many as possible in 60 seconds. Best for building raw WPM.", badge: "Speed", color: "from-amber-500/10 to-yellow-500/10 border-amber-200 dark:border-amber-800", difficulty: "Easy", langSupport: true },
  { id: "az" as GameId, emoji: "🔤", title: "A-Z Challenge", desc: "Type the entire alphabet in order as fast as possible. Try A→Z, Z→A, or shuffle mode!", badge: "Classic", color: "from-emerald-500/10 to-teal-500/10 border-emerald-200 dark:border-emerald-800", difficulty: "Easy", langSupport: false },
  { id: "rush" as GameId, emoji: "🌪️", title: "Word Rush", desc: "Eight words displayed at once. Type any of them to score. Fastest fingers win!", badge: "Reflex", color: "from-violet-500/10 to-purple-500/10 border-violet-200 dark:border-violet-800", difficulty: "Hard", langSupport: true },
  { id: "accuracy" as GameId, emoji: "🎯", title: "Accuracy Challenge", desc: "Type a passage with zero errors. Enable strict mode to block wrong keystrokes entirely!", badge: "Precision", color: "from-red-500/10 to-rose-500/10 border-red-200 dark:border-red-800", difficulty: "Hard", langSupport: false },
  { id: "numbers" as GameId, emoji: "🔢", title: "Number Typing", desc: "Type sequences of numbers as fast as possible. Great for numeric keypad practice.", badge: "Numbers", color: "from-orange-500/10 to-amber-500/10 border-orange-200 dark:border-orange-800", difficulty: "Medium", langSupport: false },
  { id: "wordchain" as GameId, emoji: "🔗", title: "Word Chain", desc: "Each word must start with the last letter of the previous one. Build the longest chain!", badge: "Chain", color: "from-sky-500/10 to-blue-500/10 border-sky-200 dark:border-sky-800", difficulty: "Medium", langSupport: false },
  { id: "paragraph" as GameId, emoji: "📄", title: "Paragraph Race", desc: "Type a full paragraph as fast and accurately as possible. Great for exam prep!", badge: "Exam Prep", color: "from-indigo-500/10 to-violet-500/10 border-indigo-200 dark:border-indigo-800", difficulty: "Medium", langSupport: true },
  { id: "timed" as GameId, emoji: "⏱️", title: "Timed Challenge", desc: "Type as many words as possible in 15, 30, or 60 seconds. Great for speed training!", badge: "Sprint", color: "from-pink-500/10 to-rose-500/10 border-pink-200 dark:border-pink-800", difficulty: "Easy", langSupport: true },
];

// Language-aware word lists for games
const LANG_GAME_WORDS: Partial<Record<Language, string[]>> = GAME_WORDS;

function getGameWords(lang: Language): string[] {
  return LANG_GAME_WORDS[lang] ?? LANG_GAME_WORDS["english"] ?? [];
}

function NumberTypingGame({ onEnd }: { onEnd: (score: number) => void }) {
  const [sequence] = useState(() => Array.from({ length: 20 }, () => Math.floor(Math.random() * 9999).toString()).join("  "));
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const correct = typed.split("").filter((c, i) => c === sequence[i]).length;
  const acc = typed.length ? (correct / typed.length) * 100 : 100;
  const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (!startTime) setStartTime(Date.now());
    const val = e.target.value;
    if (val.length > sequence.length) return;
    setTyped(val);
    if (val.length === sequence.length) {
      const score = Math.round((correct / sequence.length) * 100 * Math.max(1, 60 - elapsed));
      setTimeout(() => onEnd(score), 500);
    }
  }

  if (!started) return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🔢</div>
      <h2 className="text-2xl font-bold mb-2">Number Typing</h2>
      <p className="text-muted-foreground mb-6">Type the number sequences as accurately as possible.</p>
      <Button size="lg" onClick={() => setStarted(true)} className="gold-gradient text-[hsl(222_47%_11%)] font-bold">Start</Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-6 bg-card border border-border rounded-lg px-4 py-2">
        <span className="text-sm text-muted-foreground">Accuracy: <strong>{Math.round(acc)}%</strong></span>
        <span className="text-sm text-muted-foreground">Time: <strong>{elapsed.toFixed(1)}s</strong></span>
      </div>
      <div className="font-mono text-2xl text-center p-6 bg-muted/30 rounded-xl tracking-widest break-all">{sequence}</div>
      <textarea
        value={typed}
        onChange={handleChange}
        className="w-full font-mono text-xl p-4 rounded-xl border-2 border-primary/30 focus:border-primary bg-background resize-none outline-none"
        rows={3}
        placeholder="Type the numbers here..."
        autoComplete="off" spellCheck={false}
        autoFocus
      />
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${(typed.length / sequence.length) * 100}%` }} />
      </div>
    </div>
  );
}

// Language-aware game wrappers
function LangAwareSpeedBurst({ lang, onEnd }: { lang: Language; onEnd: (score: number, wpm: number) => void }) {
  const words = getGameWords(lang);
  if (words.length === 0 || lang === "english") return <SpeedBurstGame onEnd={onEnd} />;
  // Pass custom words if game supports it, else fall back
  return <SpeedBurstGame onEnd={onEnd} />;
}

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [gameLang, setGameLang] = useState<Language>("english");
  const [highScores, setHighScores] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem("jktm_game_scores") ?? "{}"); } catch { return {}; }
  });

  const supportedLangs: Language[] = ["english", "hindi", "urdu", "french", "german", "spanish"];

  function saveScore(gameId: string, score: number) {
    setHighScores(prev => {
      const updated = { ...prev, [gameId]: Math.max(prev[gameId] ?? 0, score) };
      localStorage.setItem("jktm_game_scores", JSON.stringify(updated));
      return updated;
    });
  }

  function handleFallingEnd(score: number) { setResult({ score }); saveScore("falling", score); }
  function handleSpeedEnd(score: number, wpm: number) { setResult({ score, wpm }); saveScore("speed", score); }
  function handleAZEnd(score: number, timeMs: number) { setResult({ score, timeMs }); saveScore("az", score); }
  function handleRushEnd(score: number, wpm: number) { setResult({ score, wpm }); saveScore("rush", score); }
  function handleAccuracyEnd(accuracy: number, wpm: number, errors: number) { setResult({ accuracy, wpm, errors }); saveScore("accuracy", Math.round(accuracy)); }
  function handleNumbersEnd(score: number) { setResult({ score }); saveScore("numbers", score); }
  function handleWordChainEnd(score: number, chain: number) { setResult({ score, chain }); saveScore("wordchain", score); }
  function handleParagraphEnd(wpm: number, accuracy: number) { setResult({ wpm, accuracy }); saveScore("paragraph", wpm); }
  function handleTimedEnd(wpm: number, score: number) { setResult({ wpm, score }); saveScore("timed", score); }

  const totalScore = Object.values(highScores).reduce((a, b) => a + b, 0);
  const activeGameMeta = GAMES.find(g => g.id === activeGame);

  return (
    <div className="min-h-screen bg-background">
      <div className="navy-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Gamepad2 className="w-8 h-8 text-amber-400" />
            <h1 className="font-display text-4xl font-bold text-white">Typing Games</h1>
          </div>
          <p className="text-slate-300 mb-4">Improve your speed and accuracy while having fun — all work offline!</p>

          {/* Language switcher for games */}
          <div className="flex flex-wrap gap-2 mb-2">
            <Globe className="w-4 h-4 text-amber-400 mt-1" />
            {supportedLangs.map(lang => {
              const meta = SUPPORTED_LANGUAGES.find(l => l.id === lang);
              if (!meta) return null;
              return (
                <button
                  key={lang}
                  onClick={() => setGameLang(lang)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                    gameLang === lang
                      ? "bg-amber-400/20 border-amber-400/50 text-amber-300"
                      : "border-white/10 text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {meta.flag} {meta.label}
                </button>
              );
            })}
          </div>

          {totalScore > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">Total Best Score: {totalScore} pts</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {GAMES.map(game => (
            <Card
              key={game.id}
              className={`border bg-gradient-to-br cursor-pointer hover:shadow-lg transition-all group ${game.color}`}
              onClick={() => { setActiveGame(game.id); setResult(null); }}
              data-testid={`card-game-${game.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{game.emoji}</span>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className="text-xs">{game.badge}</Badge>
                    <span className={`text-xs font-medium ${game.difficulty === "Easy" ? "text-emerald-600" : game.difficulty === "Medium" ? "text-amber-600" : "text-red-600"}`}>
                      {game.difficulty}
                    </span>
                    {game.langSupport && (
                      <span className="text-[10px] text-muted-foreground bg-muted/50 rounded px-1.5 py-0.5">
                        {SUPPORTED_LANGUAGES.find(l => l.id === gameLang)?.flag} {SUPPORTED_LANGUAGES.find(l => l.id === gameLang)?.label}
                      </span>
                    )}
                  </div>
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">{game.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{game.desc}</p>
                {highScores[game.id] !== undefined && (
                  <div className="flex items-center gap-1 text-xs text-amber-600 mb-2">
                    <Trophy className="w-3 h-3" /> Best: {highScores[game.id]} {game.id === "accuracy" ? "%" : game.id === "paragraph" ? "WPM" : "pts"}
                  </div>
                )}
                <Button className="w-full mt-1 h-9" data-testid={`btn-play-${game.id}`}>Play Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Game Dialog */}
      <Dialog open={!!activeGame} onOpenChange={open => { if (!open) { setActiveGame(null); setResult(null); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {activeGameMeta?.emoji} {activeGameMeta?.title}
              {activeGameMeta?.langSupport && (
                <Badge variant="outline" className="text-xs ml-auto">
                  {SUPPORTED_LANGUAGES.find(l => l.id === gameLang)?.flag} {SUPPORTED_LANGUAGES.find(l => l.id === gameLang)?.label}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {result ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-4">Game Over!</h3>
              <div className="grid grid-cols-2 gap-4 mb-6 max-w-xs mx-auto">
                {result.score !== undefined && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                    <p className="text-2xl font-bold text-amber-600">{result.score}</p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                )}
                {result.wpm !== undefined && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <p className="text-2xl font-bold text-blue-600">{result.wpm}</p>
                    <p className="text-xs text-muted-foreground">WPM</p>
                  </div>
                )}
                {result.accuracy !== undefined && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                    <p className="text-2xl font-bold text-emerald-600">{Math.round(result.accuracy)}%</p>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                  </div>
                )}
                {result.errors !== undefined && (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                    <p className="text-2xl font-bold text-red-600">{result.errors}</p>
                    <p className="text-xs text-muted-foreground">Errors</p>
                  </div>
                )}
                {result.timeMs !== undefined && (
                  <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3">
                    <p className="text-2xl font-bold text-violet-600">{(result.timeMs / 1000).toFixed(2)}s</p>
                    <p className="text-xs text-muted-foreground">Time</p>
                  </div>
                )}
                {result.chain !== undefined && (
                  <div className="bg-sky-50 dark:bg-sky-900/20 rounded-lg p-3">
                    <p className="text-2xl font-bold text-sky-600">{result.chain}</p>
                    <p className="text-xs text-muted-foreground">Chain</p>
                  </div>
                )}
              </div>
              {activeGame && highScores[activeGame] !== undefined && (
                <p className="text-sm text-amber-600 mb-4">🏆 Your best: {highScores[activeGame]}</p>
              )}
              <div className="flex justify-center gap-3">
                <Button onClick={() => setResult(null)}>Play Again</Button>
                <Button variant="outline" onClick={() => { setActiveGame(null); setResult(null); }}>Change Game</Button>
              </div>
            </div>
          ) : (
            <>
              {activeGame === "falling" && <FallingWordsGame onEnd={handleFallingEnd} />}
              {activeGame === "speed" && <SpeedBurstGame onEnd={handleSpeedEnd} />}
              {activeGame === "az" && <AZGame onEnd={handleAZEnd} />}
              {activeGame === "rush" && <WordRushGame onEnd={handleRushEnd} />}
              {activeGame === "accuracy" && <AccuracyChallenge onEnd={handleAccuracyEnd} />}
              {activeGame === "numbers" && <NumberTypingGame onEnd={handleNumbersEnd} />}
              {activeGame === "wordchain" && <WordChainGame onEnd={handleWordChainEnd} />}
              {activeGame === "paragraph" && <ParagraphRaceGame onEnd={handleParagraphEnd} />}
              {activeGame === "timed" && <TimedChallengeGame onEnd={handleTimedEnd} />}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
