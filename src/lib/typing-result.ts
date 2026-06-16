export interface TypingResult {
  wpm: number;
  grossWpm: number;
  netWpm: number;
  cpm: number;
  accuracy: number;
  timeSeconds: number;
  totalCharsTyped: number;
  correctChars: number;
  incorrectChars: number;
  totalWords: number;
  correctWords: number;
  incorrectWords: number;
  errors: number;
  backspaceCount: number;
  backspacePerMin: number;
  wordsWithBackspace: number;
  pctCorrectedByBackspace: number;
  maxBackspaceStreak: number;
}

export function buildTypingResult(
  finalTyped: string,
  text: string,
  elapsedSecs: number,
  backspaceCount: number,
  grossCharsTyped: number,
  wordsWithBackspaceSet: Set<number>,
  maxBackspaceStreak: number,
): TypingResult {
  const secs = Math.max(1, elapsedSecs);
  const mins = secs / 60;

  const correct = finalTyped.split("").filter((c, i) => c === text[i]).length;
  const incorrect = finalTyped.length - correct;
  const accuracy = finalTyped.length > 0 ? (correct / finalTyped.length) * 100 : 0;
  const wpm = Math.max(0, Math.round((correct / 5) / mins));
  const grossWpm = Math.max(0, Math.round((grossCharsTyped / 5) / mins));
  const netWpm = wpm;
  const cpm = Math.max(0, Math.round(correct / mins));

  const textWords = text.trim().split(/\s+/);
  const typedWords = finalTyped.trim().split(/\s+/);
  let correctWords = 0;
  let incorrectWords = 0;
  textWords.forEach((tw, i) => {
    const tp = typedWords[i] ?? "";
    if (tp === tw) correctWords++;
    else if (tp.length > 0) incorrectWords++;
  });

  const bsPerMin = secs > 0 ? Math.round((backspaceCount / mins) * 10) / 10 : 0;
  const pctCorrected = grossCharsTyped > 0
    ? Math.round((backspaceCount / grossCharsTyped) * 1000) / 10
    : 0;

  return {
    wpm,
    grossWpm,
    netWpm,
    cpm,
    accuracy,
    timeSeconds: secs,
    totalCharsTyped: grossCharsTyped,
    correctChars: correct,
    incorrectChars: incorrect,
    totalWords: textWords.length,
    correctWords,
    incorrectWords,
    errors: incorrect,
    backspaceCount,
    backspacePerMin: bsPerMin,
    wordsWithBackspace: wordsWithBackspaceSet.size,
    pctCorrectedByBackspace: pctCorrected,
    maxBackspaceStreak,
  };
}
