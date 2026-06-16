import type { TypingResult } from "@/lib/typing-result";

interface Props {
  result: TypingResult;
  level?: number;
  language?: string;
}

function StatBox({ value, label, sub, color = "text-foreground", small = false }: {
  value: string | number;
  label: string;
  sub?: string;
  color?: string;
  small?: boolean;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-3 text-center">
      <p className={`font-bold leading-none ${small ? "text-xl" : "text-2xl"} ${color}`}>
        {value}{sub && <span className="text-xs font-normal text-muted-foreground ml-0.5">{sub}</span>}
      </p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">{label}</p>
    </div>
  );
}

function gradeFromResult(r: TypingResult) {
  if (r.accuracy >= 98 && r.wpm >= 40) return "A+";
  if (r.accuracy >= 95 && r.wpm >= 30) return "A";
  if (r.accuracy >= 90) return "B";
  if (r.accuracy >= 80) return "C";
  return "D";
}

export function ResultStats({ result }: Props) {
  const grade = gradeFromResult(result);
  const gradeColor =
    grade === "A+" ? "text-emerald-600" :
    grade === "A"  ? "text-blue-600"    :
    grade === "B"  ? "text-violet-600"  :
    grade === "C"  ? "text-amber-600"   : "text-red-600";

  const fmt = (n: number) => n.toLocaleString();
  const pct = (n: number) => `${Math.round(n)}%`;
  const fmtTime = (s: number) => s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <div className="space-y-4">
      {/* Primary stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatBox
          value={fmt(result.netWpm)}
          label="Net WPM"
          color={result.netWpm >= 60 ? "text-emerald-600" : result.netWpm >= 30 ? "text-blue-600" : "text-primary"}
        />
        <StatBox
          value={fmt(result.grossWpm)}
          label="Gross WPM"
          color="text-violet-600"
          small
        />
        <StatBox
          value={pct(result.accuracy)}
          label="Accuracy"
          color={result.accuracy >= 98 ? "text-emerald-600" : result.accuracy >= 90 ? "text-blue-600" : "text-red-500"}
        />
        <StatBox
          value={grade}
          label="Grade"
          color={gradeColor}
        />
      </div>

      {/* Secondary stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatBox value={fmt(result.cpm)}           label="CPM"               color="text-sky-600" small />
        <StatBox value={fmtTime(result.timeSeconds)} label="Time Taken"      color="text-foreground" small />
        <StatBox value={fmt(result.errors)}         label="Total Errors"     color={result.errors === 0 ? "text-emerald-600" : "text-red-500"} small />
        <StatBox value={`${result.correctWords}/${result.totalWords}`} label="Correct Words" color="text-foreground" small />
      </div>

      {/* Character breakdown */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Character Breakdown</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{fmt(result.totalCharsTyped)}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Typed</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-emerald-600">{fmt(result.correctChars)}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Correct Chars</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-red-500">{fmt(result.incorrectChars)}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Incorrect Chars</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-amber-600">{pct(result.accuracy)}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Char Accuracy</p>
          </div>
        </div>
        <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, result.accuracy)}%` }}
          />
        </div>
      </div>

      {/* Word breakdown */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Word Breakdown</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <p className="text-xl font-bold text-foreground">{result.totalWords}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Words</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-emerald-600">{result.correctWords}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Correct</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-red-500">{result.incorrectWords}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Incorrect</p>
          </div>
        </div>
      </div>

      {/* Backspace analysis */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-3">
          ⌫ Backspace Analysis
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-xl font-bold text-amber-700 dark:text-amber-300">{result.backspaceCount}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Backspaces</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-amber-700 dark:text-amber-300">{result.backspacePerMin}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Per Minute</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-amber-700 dark:text-amber-300">{result.wordsWithBackspace}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Words Edited</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-amber-700 dark:text-amber-300">{result.pctCorrectedByBackspace}%</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Correction Rate</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-amber-700 dark:text-amber-300">{result.maxBackspaceStreak}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Max BS Streak</p>
          </div>
          <div className="text-center">
            <p className={`text-xl font-bold ${result.backspaceCount === 0 ? "text-emerald-600" : result.backspaceCount < 10 ? "text-blue-600" : "text-amber-700 dark:text-amber-300"}`}>
              {result.backspaceCount === 0 ? "Perfect" : result.backspaceCount < 10 ? "Good" : result.backspaceCount < 30 ? "Average" : "Needs Work"}
            </p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">BS Rating</p>
          </div>
        </div>
        {result.backspaceCount === 0 && (
          <p className="mt-3 text-xs text-emerald-600 font-semibold text-center">
            🎯 Zero backspaces — flawless typing!
          </p>
        )}
      </div>
    </div>
  );
}
