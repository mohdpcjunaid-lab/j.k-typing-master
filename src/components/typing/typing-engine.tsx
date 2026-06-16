import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  RotateCcw, Maximize2, Minimize2, Focus, Eye, Type, Contrast, Gauge,
  SlidersHorizontal, X,
} from "lucide-react";
import type { TypingMode } from "@/lib/content-pool";
import {
  loadTypingSettings, saveTypingSettings, type TypingSettings,
} from "@/lib/typing-settings";
import { buildTypingResult, type TypingResult } from "@/lib/typing-result";

interface Props {
  text: string;
  onFinish: (wpm: number, accuracy: number, timeSeconds: number) => void;
  onFinishFull?: (result: TypingResult) => void;
  onStart?: () => void;
  onKeyPress?: (key: string | undefined) => void;
  title?: string;
  targetKeys?: string;
  fingerGuide?: string;
  timeLimit?: number;
  showTimer?: boolean;
  mode?: TypingMode;
}

export function TypingEngine({
  text, onFinish, onFinishFull, onStart, onKeyPress, title, targetKeys, timeLimit, mode = "practice",
}: Props) {
  // ── core refs ────────────────────────────────────────────────────────────
  const typedRef            = useRef<string>("");
  const startTimeRef        = useRef<number | null>(null);
  const timerRef            = useRef<ReturnType<typeof setInterval> | null>(null);
  const cursorRef           = useRef<HTMLSpanElement>(null);
  const textareaRef         = useRef<HTMLTextAreaElement>(null);
  const containerRef        = useRef<HTMLDivElement>(null);
  const wrapperRef          = useRef<HTMLDivElement>(null);
  // scroll engine refs
  const scrollRafRef        = useRef<number | undefined>(undefined);
  const scrollAnimRafRef    = useRef<number | undefined>(undefined);
  const lastScrolledLineRef = useRef<number>(-1);
  // backspace tracking
  const backspaceCountRef   = useRef<number>(0);
  const grossCharsRef       = useRef<number>(0);
  const bsStreakRef         = useRef<number>(0);
  const maxBsStreakRef      = useRef<number>(0);
  const wordBsSetRef        = useRef<Set<number>>(new Set());

  // ── state ─────────────────────────────────────────────────────────────────
  const [typed,      setTyped]      = useState("");
  const [elapsed,    setElapsed]    = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [strictBlocked, setStrictBlocked] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings,   setSettings]   = useState<TypingSettings>(loadTypingSettings);

  function updateSetting<K extends keyof TypingSettings>(key: K, value: TypingSettings[K]) {
    setSettings(prev => {
      const next = { ...prev, [key]: value };
      saveTypingSettings(next);
      return next;
    });
  }

  // ── derived ───────────────────────────────────────────────────────────────
  const totalChars    = text.length;
  const currentTyped  = typed;
  const correctChars  = currentTyped.split("").filter((c, i) => c === text[i]).length;
  const wrongChars    = currentTyped.length - correctChars;
  const accuracy      = currentTyped.length > 0 ? (correctChars / currentTyped.length) * 100 : 100;
  const progress      = Math.min((currentTyped.length / totalChars) * 100, 100);
  const wpm           = startTimeRef.current && elapsed > 0 ? Math.max(0, Math.round((correctChars / 5) / (elapsed / 60))) : 0;
  const cpm           = startTimeRef.current && elapsed > 0 ? Math.max(0, Math.round(correctChars / (elapsed / 60))) : 0;
  const timeLeft      = timeLimit ? Math.max(0, timeLimit - elapsed) : null;
  const nextChar      = text[currentTyped.length];
  const remainingWords = text.slice(currentTyped.length).trim().split(/\s+/).filter(Boolean).length;
  const timerWarning  = timeLeft !== null && timeLeft <= 10;

  // ── notify keyboard ───────────────────────────────────────────────────────
  useEffect(() => { onKeyPress?.(nextChar); }, [nextChar]);

  // ── smooth scroll engine ──────────────────────────────────────────────────
  // Animates container.scrollTop from start → target using easeOutCubic
  function smoothScrollContainer(container: HTMLElement, targetTop: number) {
    if (scrollAnimRafRef.current) cancelAnimationFrame(scrollAnimRafRef.current);
    const startTop = container.scrollTop;
    const diff = targetTop - startTop;
    if (Math.abs(diff) < 1) return;
    const duration = settings.scrollSpeed === "slow" ? 450 : settings.scrollSpeed === "fast" ? 150 : 280;
    const startTime = performance.now();
    function step(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      container.scrollTop = startTop + diff * eased;
      if (t < 1) scrollAnimRafRef.current = requestAnimationFrame(step);
    }
    scrollAnimRafRef.current = requestAnimationFrame(step);
  }

  // Threshold-based scroll: fires only when cursor crosses a new line
  // and only when cursor is past 65% of the visible container height.
  useEffect(() => {
    if (!settings.autoScroll || !hasStarted) return;
    if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);

    scrollRafRef.current = requestAnimationFrame(() => {
      const cursor    = cursorRef.current;
      const container = containerRef.current;
      if (!cursor || !container) return;

      // Compute cursor's top offset inside the container (accounting for current scroll)
      const containerRect = container.getBoundingClientRect();
      const cursorRect    = cursor.getBoundingClientRect();

      // Cursor position relative to container's visible top
      const cursorVisTop = cursorRect.top - containerRect.top;

      // Detect line (using cursorRect.top absolute, rounded to line-height grid)
      const lineHeight = cursorRect.height || 28;
      const currentLine = Math.round(cursorRect.top / lineHeight);
      if (currentLine === lastScrolledLineRef.current) return; // same line — no scroll
      lastScrolledLineRef.current = currentLine;

      const containerH  = container.clientHeight;
      const threshold   = containerH * 0.65; // trigger when cursor passes 65% down

      if (cursorVisTop > threshold) {
        // Target: keep cursor at ~30% from top of container
        const desired     = container.scrollTop + cursorVisTop - containerH * 0.30;
        smoothScrollContainer(container, Math.max(0, desired));
      } else if (cursorVisTop < 0) {
        // Cursor scrolled above visible area (e.g. after reset) — bring it back
        const desired = container.scrollTop + cursorVisTop - 16;
        smoothScrollContainer(container, Math.max(0, desired));
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typed.length, hasStarted, settings.autoScroll, settings.scrollSpeed]);

  // ── timer ─────────────────────────────────────────────────────────────────
  function finish(finalTyped: string, finalElapsed: number) {
    if (timerRef.current) clearInterval(timerRef.current);
    if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    if (scrollAnimRafRef.current) cancelAnimationFrame(scrollAnimRafRef.current);
    const secs = Math.max(1, finalElapsed);
    const correct = finalTyped.split("").filter((c, i) => c === text[i]).length;
    const finalWpm = Math.max(0, Math.round((correct / 5) / (secs / 60)));
    const finalAcc = finalTyped.length > 0 ? (correct / finalTyped.length) * 100 : 0;
    setIsFinished(true);
    onFinish(finalWpm, finalAcc, secs);
    if (onFinishFull) {
      const fullResult = buildTypingResult(
        finalTyped, text, secs,
        backspaceCountRef.current, grossCharsRef.current,
        wordBsSetRef.current, maxBsStreakRef.current,
      );
      onFinishFull(fullResult);
    }
  }

  useEffect(() => {
    textareaRef.current?.focus();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
      if (scrollAnimRafRef.current) cancelAnimationFrame(scrollAnimRafRef.current);
    };
  }, []);

  // ── fullscreen ────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    if (fullscreen) {
      el.requestFullscreen?.().catch(() => {});
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  }, [fullscreen]);

  useEffect(() => {
    function onFSChange() {
      if (!document.fullscreenElement) setFullscreen(false);
    }
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, []);

  // ── input handler ─────────────────────────────────────────────────────────
  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (isFinished) return;
    const val = e.target.value.replace(/\n/g, "");
    if (val.length > text.length) return;

    const noBackspace = mode === "no-backspace" || mode === "exam";
    if (noBackspace && val.length < typedRef.current.length) return;

    // Word-backspace: allow delete only within the current word
    if (mode === "word-backspace" && val.length < typedRef.current.length) {
      const cur = typedRef.current;
      const lastSpace = cur.trimEnd().lastIndexOf(" ");
      const wordStart = lastSpace === -1 ? 0 : lastSpace + 1;
      if (val.length < wordStart) return;
    }

    if (mode === "strict") {
      const newWrong = val.split("").filter((c, i) => c !== text[i]).length;
      if (newWrong >= 2 && val.length > typedRef.current.length) { setStrictBlocked(true); return; }
      if (newWrong < 2) setStrictBlocked(false);
    }

    // ── backspace tracking ─────────────────────────────────────────────────
    const isBackspace = val.length < typedRef.current.length;
    if (isBackspace) {
      backspaceCountRef.current++;
      bsStreakRef.current++;
      if (bsStreakRef.current > maxBsStreakRef.current) {
        maxBsStreakRef.current = bsStreakRef.current;
      }
      // record which "word slot" this backspace happened in
      const wordIdx = typedRef.current.slice(0, typedRef.current.length).trim().split(/\s+/).length - 1;
      wordBsSetRef.current.add(Math.max(0, wordIdx));
    } else {
      bsStreakRef.current = 0;
      if (val.length > typedRef.current.length) {
        grossCharsRef.current += val.length - typedRef.current.length;
      }
    }

    if (!startTimeRef.current && val.length > 0) {
      startTimeRef.current = Date.now();
      setHasStarted(true);
      onStart?.();
      timerRef.current = setInterval(() => {
        const secs = Math.floor((Date.now() - startTimeRef.current!) / 1000);
        setElapsed(secs);
        if (timeLimit && secs >= timeLimit) {
          if (timerRef.current) clearInterval(timerRef.current);
          finish(typedRef.current, secs);
        }
      }, 250);
    }

    typedRef.current = val;
    setTyped(val);

    if (val.length === text.length) {
      const secs = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 1;
      setTimeout(() => finish(val, secs), 100);
    }
  }

  function reset() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    if (scrollAnimRafRef.current) cancelAnimationFrame(scrollAnimRafRef.current);
    typedRef.current = "";
    startTimeRef.current = null;
    backspaceCountRef.current = 0;
    grossCharsRef.current = 0;
    bsStreakRef.current = 0;
    maxBsStreakRef.current = 0;
    wordBsSetRef.current = new Set();
    lastScrolledLineRef.current = -1;
    // Snap container scroll back to top immediately (no animation)
    if (containerRef.current) containerRef.current.scrollTop = 0;
    setTyped(""); setElapsed(0); setIsFinished(false); setHasStarted(false); setStrictBlocked(false);
    onKeyPress?.(text[0]);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const timeDisplay = timeLeft !== null ? formatTime(timeLeft) : formatTime(elapsed);
  const timeLabel   = timeLeft !== null ? "Remaining" : "Elapsed";

  const modeLabel: Partial<Record<TypingMode, string>> = {
    "no-backspace":   "No Backspace",
    "word-backspace": "Word Backspace",
    "exam":           "Exam Mode",
    "strict":         "Strict Mode",
  };

  const totalWords  = text.trim().split(/\s+/).length;
  const typedWords  = typed.trim() === "" ? 0 : typed.trim().split(/\s+/).length;
  const progressPct = text.length > 0 ? Math.round((typed.length / text.length) * 100) : 0;

  // ── text font / contrast classes ──────────────────────────────────────────
  const textSizeClass = settings.largeText ? "text-2xl sm:text-3xl leading-loose" : "text-lg sm:text-xl leading-relaxed";
  const containerBg   = settings.highContrast ? "bg-black border-white/30" : settings.focusMode ? "bg-gray-950 border-primary/20" : "";
  const correctClass  = settings.highContrast ? "text-lime-400 font-semibold" : "text-emerald-500 dark:text-emerald-400";
  const wrongClass    = settings.highContrast
    ? "text-red-400 font-semibold bg-red-900/60 rounded-sm px-px"
    : "text-red-500 bg-red-100/80 dark:bg-red-900/30 rounded-sm px-px";
  const pendingClass  = settings.highContrast ? "text-white/50" : settings.focusMode ? "text-white/25" : "text-muted-foreground/60";
  const cursorClass   = settings.highContrast ? "text-yellow-300" : "text-foreground";

  return (
    <div
      ref={wrapperRef}
      className={`space-y-3 ${fullscreen ? "fixed inset-0 z-50 bg-background overflow-auto p-6" : ""}`}
    >
      {/* ── Stats bar ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 gap-2 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          <Stat value={wpm}  label="WPM"  color={wpm  >= 60 ? "text-emerald-500" : wpm  >= 30 ? "text-blue-500"  : "text-primary"} size="lg" />
          <Stat value={cpm}  label="CPM"  color="text-violet-600" size="md" />
          <Stat value={`${Math.round(accuracy)}%`} label="Accuracy"
            color={accuracy >= 98 ? "text-emerald-500" : accuracy >= 90 ? "text-blue-500" : "text-red-500"} size="lg" />
          <Stat
            value={timeDisplay}
            label={timeLabel}
            color={timerWarning ? "text-red-500 animate-pulse" : "text-foreground"}
            size="lg"
          />
          {wrongChars > 0 && <Stat value={wrongChars} label="Errors" color="text-red-500" size="lg" />}
          {hasStarted && (
            <div className="text-center hidden sm:block">
              <p className="font-display font-bold text-xl leading-none text-sky-500">{typedWords}<span className="text-xs text-muted-foreground font-normal">/{totalWords}</span></p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Words</p>
            </div>
          )}
          {hasStarted && (
            <div className="text-center hidden md:block">
              <p className="font-display font-bold text-xl leading-none text-amber-600">{progressPct}%</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Progress</p>
            </div>
          )}
          {targetKeys && (
            <div className="text-center hidden sm:block">
              <p className="font-mono font-bold text-sm text-amber-600 tracking-widest leading-none">{targetKeys}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">Target Keys</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {modeLabel[mode] && (
            <span className="hidden sm:inline text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {modeLabel[mode]}
            </span>
          )}
          {/* Settings toggle */}
          <Button variant="ghost" size="sm" onClick={() => setShowSettings(s => !s)}
            className={`h-8 w-8 p-0 ${showSettings ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            title="Typing settings">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </Button>
          {/* Fullscreen */}
          <Button variant="ghost" size="sm" onClick={() => setFullscreen(f => !f)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" title="Fullscreen">
            {fullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={reset}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground" title="Reset"
            data-testid="btn-reset-typing">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Settings panel ──────────────────────────────────────────────── */}
      {showSettings && (
        <div className="bg-card border border-border rounded-xl px-4 py-3 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Typing Settings</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground" onClick={() => setShowSettings(false)}>
              <X className="w-3 h-3" />
            </Button>
          </div>

          {/* Auto Scroll row */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Gauge className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium">Auto Scroll</span>
              <ToggleBtn active={settings.autoScroll} onClick={() => updateSetting("autoScroll", !settings.autoScroll)}>
                {settings.autoScroll ? "ON" : "OFF"}
              </ToggleBtn>
            </div>
            {settings.autoScroll && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground mr-1">Speed:</span>
                {(["slow", "normal", "fast"] as const).map(sp => (
                  <button key={sp}
                    onClick={() => updateSetting("scrollSpeed", sp)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all capitalize ${
                      settings.scrollSpeed === sp
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}>
                    {sp}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accessibility row */}
          <div className="flex flex-wrap gap-2">
            <AccessBtn
              icon={<Focus className="w-3 h-3" />}
              label="Focus Mode"
              active={settings.focusMode}
              onClick={() => updateSetting("focusMode", !settings.focusMode)}
            />
            <AccessBtn
              icon={<Contrast className="w-3 h-3" />}
              label="High Contrast"
              active={settings.highContrast}
              onClick={() => updateSetting("highContrast", !settings.highContrast)}
            />
            <AccessBtn
              icon={<Type className="w-3 h-3" />}
              label="Large Text"
              active={settings.largeText}
              onClick={() => updateSetting("largeText", !settings.largeText)}
            />
            <AccessBtn
              icon={<Eye className="w-3 h-3" />}
              label="Fullscreen"
              active={fullscreen}
              onClick={() => setFullscreen(f => !f)}
            />
          </div>
        </div>
      )}

      {/* ── Progress bar ────────────────────────────────────────────────── */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-amber-500 transition-all duration-150"
          style={{ width: `${progress}%` }} />
      </div>

      {/* ── Strict blocked warning ───────────────────────────────────────── */}
      {strictBlocked && (
        <div className="text-center text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg py-2">
          ⚠️ Strict Mode — Fix your errors before continuing (Backspace allowed)
        </div>
      )}

      {/* ── Focus mode overlay ───────────────────────────────────────────── */}
      {settings.focusMode && hasStarted && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {/* Top fade */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
      )}

      {/* ── Text display ────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className={`relative border rounded-xl p-5 sm:p-6 cursor-text transition-colors ${
          settings.highContrast || settings.focusMode
            ? containerBg
            : isFinished ? "bg-card border-emerald-500/50"
            : hasStarted ? "bg-card border-primary/40"
            : "bg-card border-border hover:border-primary/20"
        } ${settings.focusMode ? "relative z-50" : ""}`}
        style={{
          overflowY: "hidden",
          minHeight: "160px",
          maxHeight: settings.largeText ? "340px" : "260px",
        }}
        onClick={() => textareaRef.current?.focus()}
        data-testid="typing-display"
      >
        {!hasStarted && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/40 z-10 pointer-events-none">
            <p className="text-muted-foreground text-sm font-medium bg-card border border-border rounded-lg px-4 py-2 shadow-sm">
              Click here and start typing
            </p>
          </div>
        )}

        <p
          className={`font-mono select-none break-words whitespace-pre-wrap ${textSizeClass}`}
          lang={text.match(/[\u0900-\u097F\u0600-\u06FF]/) ? "hi" : "en"}
        >
          {text.split("").map((char, i) => {
            const isTyped   = i < currentTyped.length;
            const isCursor  = i === currentTyped.length;
            const isCorrect = isTyped && currentTyped[i] === char;
            const isWrong   = isTyped && currentTyped[i] !== char;

            return (
              <span
                key={i}
                ref={isCursor ? cursorRef : undefined}
                className={`relative transition-colors duration-75 ${
                  isCorrect ? correctClass
                  : isWrong  ? wrongClass
                  : isCursor ? cursorClass
                  : pendingClass
                }`}
              >
                {isCursor && (
                  <span
                    className={`absolute left-0 top-0 h-full w-0.5 animate-pulse ${settings.highContrast ? "bg-yellow-300" : "bg-primary"}`}
                    style={{ animation: "blink 1s step-end infinite" }}
                    aria-hidden="true"
                  />
                )}
                {isWrong && char === " " ? "·" : char}
              </span>
            );
          })}
        </p>

        <textarea
          ref={textareaRef}
          value={typed}
          onChange={handleInput}
          className="absolute opacity-0 top-0 left-0 w-full h-full resize-none"
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
          aria-label="Typing input"
          data-testid="typing-input"
          tabIndex={0}
        />
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>

      <p className="text-xs text-center text-muted-foreground">
        {isFinished
          ? "✅ Complete! Press reset to try again."
          : hasStarted
          ? `Green = correct · Red = wrong${settings.autoScroll ? " · Auto-scrolling active" : ""}`
          : "Click the text area above and start typing"}
      </p>
    </div>
  );
}

// ── Small helper components ────────────────────────────────────────────────

function Stat({
  value, label, color, size,
}: { value: string | number; label: string; color: string; size: "lg" | "md" }) {
  return (
    <div className="text-center">
      <p className={`font-display font-bold leading-none ${color} ${size === "lg" ? "text-2xl" : "text-xl"}`}>
        {value}
      </p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">{label}</p>
    </div>
  );
}

function ToggleBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-all ${
        active ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function AccessBtn({
  icon, label, active, onClick,
}: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
        active
          ? "bg-primary/10 text-primary border-primary/40 shadow-sm"
          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
      }`}
    >
      {icon} {label} {active && <span className="text-[9px] ml-0.5 opacity-70">●</span>}
    </button>
  );
}
