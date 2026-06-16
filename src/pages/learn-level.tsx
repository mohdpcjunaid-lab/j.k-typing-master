import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { TypingEngine } from "@/components/typing/typing-engine";
import { VisualKeyboard } from "@/components/typing/visual-keyboard";
import { GuidedInstruction } from "@/components/typing/guided-instruction";
import { ResultStats } from "@/components/typing/result-stats";
import { KeyboardMappingGuide } from "@/components/typing/keyboard-mapping";
import {
  getExtendedPassage, getLevelLabel, getLevelColor,
  setLevelProgress, saveOfflineSession,
  SUPPORTED_LANGUAGES, TYPING_MODES,
  type Language, type TypingMode,
} from "@/lib/content-pool";
import type { TypingResult } from "@/lib/typing-result";
import {
  ChevronLeft, CheckCircle2, RefreshCw, Keyboard, ChevronRight,
  Star, Globe, Timer, Play,
} from "lucide-react";

const TIMER_OPTIONS = [
  { label: "No Limit", value: 0 },
  { label: "1 min",    value: 60 },
  { label: "2 min",    value: 120 },
  { label: "5 min",    value: 300 },
  { label: "10 min",   value: 600 },
  { label: "20 min",   value: 1200 },
  { label: "40 min",   value: 2400 },
  { label: "60 min",   value: 3600 },
  { label: "Custom",   value: -1 },
];

export default function LearnLevelPage() {
  const params = useParams<{ language: string; level: string }>();
  const [, setLocation] = useLocation();

  const language = (params.language ?? "english") as Language;
  const level = parseInt(params.level ?? "1", 10);
  const label = getLevelLabel(level);
  const colorClass = getLevelColor(level);
  const langMeta = SUPPORTED_LANGUAGES.find(l => l.id === language) ?? SUPPORTED_LANGUAGES[0];

  const [mode, setMode] = useState<TypingMode>(() => {
    return (localStorage.getItem("jktm_typing_mode") as TypingMode) ?? "guided";
  });

  // Timer state
  const [selectedTimer, setSelectedTimer] = useState<number>(0);   // seconds; 0 = no limit
  const [customMinutes, setCustomMinutes]   = useState<string>("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Setup screen shown before typing starts
  const [setupDone, setSetupDone] = useState(false);

  const [paragraph, setParagraph] = useState(() => getExtendedPassage(language, level));
  const [result, setResult] = useState<{ wpm: number; accuracy: number; timeSeconds: number } | null>(null);
  const [fullResult, setFullResult] = useState<TypingResult | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [nextKey, setNextKey] = useState<string | undefined>(undefined);
  const [autoRedirectCountdown, setAutoRedirectCountdown] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("jktm_typing_mode", mode);
  }, [mode]);

  // Effective time limit in seconds (null = no limit)
  const timeLimit: number | undefined =
    selectedTimer > 0 ? selectedTimer : undefined;

  function handleFinish(wpm: number, accuracy: number, timeSeconds: number) {
    setResult({ wpm, accuracy, timeSeconds });
    setLevelProgress(language, level);
    saveOfflineSession(wpm, Math.round(wpm * (timeSeconds / 60)));
  }

  function handleFinishFull(r: TypingResult) {
    setFullResult(r);
  }

  function goToNextLevel() {
    if (level < 150) {
      setLocation(`/learn/${language}/${level + 1}`);
    } else {
      setLocation("/learn");
    }
  }

  useEffect(() => {
    if (!result) return;
    setAutoRedirectCountdown(8);
    const tick = setInterval(() => {
      setAutoRedirectCountdown(c => {
        if (c === null || c <= 1) { clearInterval(tick); goToNextLevel(); return null; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [result]);

  function resetLevel() {
    setParagraph(getExtendedPassage(language, level));
    setResult(null);
    setSetupDone(false);
    setAutoRedirectCountdown(null);
  }

  function newPassage() {
    setParagraph(getExtendedPassage(language, level));
    setResult(null);
  }

  function startTyping() {
    if (showCustomInput) {
      const mins = parseFloat(customMinutes);
      if (!isNaN(mins) && mins > 0) {
        setSelectedTimer(Math.round(mins * 60));
      }
      setShowCustomInput(false);
    }
    setSetupDone(true);
  }

  function handleTimerSelect(val: number) {
    if (val === -1) {
      setShowCustomInput(true);
      setSelectedTimer(0);
    } else {
      setShowCustomInput(false);
      setSelectedTimer(val);
    }
  }

  const stageGroups = [
    { levels: [1, 30],   name: "Stage 1: Home Row (ASDF JKL;)" },
    { levels: [31, 60],  name: "Stage 2: Top Row (QWERTY UIOP)" },
    { levels: [61, 90],  name: "Stage 3: Bottom Row (ZXCVB NM)" },
    { levels: [91, 120], name: "Stage 4: Mixed Keys" },
    { levels: [121, 150],name: "Stage 5: Full Mastery" },
  ];
  const stageName = stageGroups.find(s => level >= s.levels[0] && level <= s.levels[1])?.name ?? "";

  // ── Completion screen ──────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-8 space-y-4">
          {/* Header */}
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-3 animate-bounce">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold">Level {level} Complete!</h2>
            <p className="text-muted-foreground text-sm mt-1">{label} — {langMeta.flag} {langMeta.label}</p>
            <div className="flex justify-center gap-1 mt-2">
              {[1,2,3].map(s => {
                const grade = fullResult ? (fullResult.accuracy >= 98 && fullResult.wpm >= 40 ? "A+" : fullResult.accuracy >= 95 && fullResult.wpm >= 30 ? "A" : fullResult.accuracy >= 90 ? "B" : "C") : "C";
                return <Star key={s} className={`w-5 h-5 ${s <= (grade === "A+" ? 3 : grade === "A" ? 2 : 1) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`} />;
              })}
            </div>
          </div>

          {/* Full result stats */}
          {fullResult && <ResultStats result={fullResult} level={level} language={language} />}

          {/* Auto-redirect */}
          {autoRedirectCountdown !== null && level < 150 && (
            <Card className="border-border">
              <CardContent className="p-3">
                <Progress value={((8 - autoRedirectCountdown) / 8) * 100} className="h-1.5 mb-1" />
                <p className="text-xs text-muted-foreground text-center">Auto-advancing to Level {level + 1} in {autoRedirectCountdown}s…</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {level < 150 ? (
              <Button onClick={goToNextLevel} className="gold-gradient text-[hsl(222_47%_11%)] font-bold" data-testid="btn-next-level">
                <ChevronRight className="w-4 h-4 mr-1" /> Next Level {level + 1}
              </Button>
            ) : (
              <Button onClick={() => setLocation("/learn")} className="gold-gradient text-[hsl(222_47%_11%)] font-bold">🎉 All Levels Complete!</Button>
            )}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={resetLevel}><RefreshCw className="w-4 h-4 mr-1" /> Try Again</Button>
              <Button variant="outline" className="flex-1" onClick={() => setLocation("/learn")}>Back to Levels</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Page header (always shown) ─────────────────────────────────────────────
  const header = (
    <div className="navy-gradient py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <button onClick={() => setLocation("/learn")} className="flex items-center gap-1 text-sm text-white/70 hover:text-white mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Levels
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`text-xs ${colorClass}`}>{label}</Badge>
              <span className="text-white/60 text-xs flex items-center gap-1">
                <Globe className="w-3 h-3" /> {langMeta.flag} {langMeta.label}
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white">Level {level}</h1>
            <p className="text-white/70 text-sm mt-0.5">{stageName}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {level > 1 && (
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 text-xs"
                onClick={() => setLocation(`/learn/${language}/${level - 1}`)}>← Prev</Button>
            )}
            {level < 150 && (
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 text-xs"
                onClick={() => setLocation(`/learn/${language}/${level + 1}`)}>Next →</Button>
            )}
            {setupDone && (
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 text-xs"
                onClick={() => setShowKeyboard(k => !k)}>
                <Keyboard className="w-3.5 h-3.5 mr-1" /> {showKeyboard ? "Hide" : "Show"} Keys
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ── Pre-start setup screen ─────────────────────────────────────────────────
  if (!setupDone) {
    const wordCount = paragraph.trim().split(/\s+/).length;
    return (
      <div className="min-h-screen bg-background">
        {header}
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 space-y-5">

          {/* Mode selector */}
          <Card className="border-border">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Typing Mode</p>
              <div className="flex flex-wrap gap-2">
                {TYPING_MODES.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    title={m.desc}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                      mode === m.id
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    <span>{m.icon}</span> {m.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {TYPING_MODES.find(m => m.id === mode)?.desc}
              </p>
            </CardContent>
          </Card>

          {/* Timer selector */}
          <Card className="border-border">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5" /> Timer
              </p>
              <div className="flex flex-wrap gap-2">
                {TIMER_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleTimerSelect(opt.value)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                      (opt.value === selectedTimer && !showCustomInput) ||
                      (opt.value === -1 && showCustomInput)
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {showCustomInput && (
                <div className="mt-3 flex items-center gap-2">
                  <Input
                    type="number"
                    min="0.5"
                    max="180"
                    step="0.5"
                    placeholder="Minutes (e.g. 15)"
                    value={customMinutes}
                    onChange={e => setCustomMinutes(e.target.value)}
                    className="w-40 h-8 text-sm"
                    autoFocus
                  />
                  <span className="text-xs text-muted-foreground">minutes</span>
                </div>
              )}
              {selectedTimer > 0 && !showCustomInput && (
                <p className="text-xs text-muted-foreground mt-2">
                  Typing will auto-submit after {selectedTimer >= 60 ? `${selectedTimer / 60} minute${selectedTimer > 60 ? "s" : ""}` : `${selectedTimer} seconds`}.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Keyboard mapping guide (for non-Latin scripts) */}
          <KeyboardMappingGuide language={language} />

          {/* Passage info */}
          <Card className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Passage Preview</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">~{wordCount} words</span>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={newPassage}>
                    <RefreshCw className="w-3 h-3 mr-1" /> New Passage
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 font-mono">
                {paragraph.slice(0, 220)}{paragraph.length > 220 ? "…" : ""}
              </p>
            </CardContent>
          </Card>

          {/* Start button */}
          <Button
            className="w-full gold-gradient text-[hsl(222_47%_11%)] font-bold text-base py-6"
            onClick={startTyping}
          >
            <Play className="w-5 h-5 mr-2" />
            Start Typing — Level {level}
            {selectedTimer > 0 && ` (${selectedTimer >= 60 ? `${selectedTimer / 60}m` : `${selectedTimer}s`})`}
          </Button>

          {/* Level navigator strip */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Level {level} of 150</span>
            <div className="flex gap-1">
              {[-2, -1, 0, 1, 2].map(offset => {
                const n = level + offset;
                if (n < 1 || n > 150) return null;
                return (
                  <button
                    key={n}
                    onClick={() => setLocation(`/learn/${language}/${n}`)}
                    className={`w-7 h-7 rounded-md text-xs font-bold transition-all ${n === level ? "bg-primary text-white" : "bg-card border border-border hover:border-primary"}`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
            <span>{150 - level} remaining</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Active typing screen ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {header}

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-4">
        {/* Mode + controls bar */}
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mr-1">Mode:</span>
              {TYPING_MODES.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    mode === m.id
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                  }`}
                  title={m.desc}
                >
                  <span>{m.icon}</span> {m.label}
                </button>
              ))}
              {timeLimit && (
                <span className="ml-auto flex items-center gap-1 text-xs text-amber-600 font-semibold bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">
                  <Timer className="w-3 h-3" />
                  {timeLimit >= 60 ? `${timeLimit / 60}m` : `${timeLimit}s`} limit
                </span>
              )}
              <Button variant="ghost" size="sm" className="h-7 text-xs ml-auto" onClick={newPassage}>
                <RefreshCw className="w-3 h-3 mr-1" /> New Passage
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={resetLevel}>
                ← Setup
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Guided instruction panel */}
        {(mode === "guided" || mode === "practice" || mode === "strict") && (
          <GuidedInstruction nextChar={nextKey} mode={mode} />
        )}

        {/* Typing engine */}
        <TypingEngine
          text={paragraph}
          onFinish={handleFinish}
          onFinishFull={handleFinishFull}
          onStart={() => {}}
          onKeyPress={setNextKey}
          title={`Level ${level}`}
          showTimer
          mode={mode}
          timeLimit={timeLimit}
        />

        {/* Visual keyboard */}
        {showKeyboard && !result && mode !== "expert" && mode !== "exam" && (
          <VisualKeyboard nextKey={nextKey} guidedMode={mode === "guided"} />
        )}

        {/* Level navigator strip */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span>Level {level} of 150</span>
          <div className="flex gap-1">
            {[-2, -1, 0, 1, 2].map(offset => {
              const n = level + offset;
              if (n < 1 || n > 150) return null;
              return (
                <button
                  key={n}
                  onClick={() => setLocation(`/learn/${language}/${n}`)}
                  className={`w-7 h-7 rounded-md text-xs font-bold transition-all ${n === level ? "bg-primary text-white" : "bg-card border border-border hover:border-primary"}`}
                >
                  {n}
                </button>
              );
            })}
          </div>
          <span>{150 - level} remaining</span>
        </div>
      </div>
    </div>
  );
}
