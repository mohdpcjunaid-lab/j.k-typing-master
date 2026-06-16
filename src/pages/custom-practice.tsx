import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TypingEngine } from "@/components/typing/typing-engine";
import { VisualKeyboard } from "@/components/typing/visual-keyboard";
import { GuidedInstruction } from "@/components/typing/guided-instruction";
import { saveOfflineSession, SUPPORTED_LANGUAGES, TYPING_MODES, type Language, type TypingMode } from "@/lib/content-pool";
import { getNextPassage, EXAM_PASSAGES, type PassageCategory } from "@/lib/exam-passages";
import { FileText, ClipboardPaste, Trash2, Play, Keyboard, CheckCircle2, RefreshCw, Maximize2, Minimize2, Globe, Shuffle, BookOpen, Timer } from "lucide-react";
import { ResultStats } from "@/components/typing/result-stats";
import { KeyboardMappingGuide } from "@/components/typing/keyboard-mapping";
import type { TypingResult } from "@/lib/typing-result";

const SAMPLE_TEXTS: { label: string; lang: Language; text: string }[] = [
  { label: "SSC CGL (English)", lang: "english", text: "India is a land of diverse cultures and traditions spanning thousands of years of recorded history. The country has a rich heritage that has significantly influenced civilizations across Asia and the world. From the Indus Valley Civilization to the Mughal Empire and the British colonial period, India's history is a tapestry of remarkable events, great rulers, philosophers, and saints. Today, India stands as the world's largest democracy and one of its fastest-growing major economies. Its achievements in space research, information technology, pharmaceuticals, and agriculture continue to inspire nations worldwide." },
  { label: "Court Typing (English)", lang: "english", text: "In the matter of the petition filed before this Honourable Court, the petitioner most respectfully submits that the impugned order dated the first day of March passed by the learned District Judge is contrary to the settled principles of law and is liable to be set aside forthwith. The petitioner has been gravely and irreparably prejudiced by the said order, which has been passed without proper application of mind and in complete disregard of the statutory provisions applicable to the present case. It is therefore prayed that this Honourable Court may be pleased to grant appropriate relief." },
  { label: "Hindi Typing (सरकारी)", lang: "hindi", text: "भारत सरकार के विभिन्न विभागों में कार्यरत कर्मचारियों को हिंदी टाइपिंग में निपुण होना आवश्यक है। राजभाषा नीति के अनुसार केंद्र सरकार के कार्यालयों में हिंदी में कार्य करना अनिवार्य है। हिंदी टाइपिंग परीक्षा में उत्तीर्ण होने के लिए अभ्यर्थियों को प्रति मिनट पच्चीस शब्द की गति से पाँच प्रतिशत से अधिक त्रुटि के बिना टाइप करना होता है। नियमित अभ्यास और सही विधि से सीखने पर यह लक्ष्य प्राप्त करना संभव है।" },
  { label: "Urdu Practice", lang: "urdu", text: "اردو زبان میں ٹائپنگ کی مہارت حاصل کرنا آج کے ڈیجیٹل دور میں بہت ضروری ہے۔ سرکاری دفاتر اور عدالتوں میں اردو ٹائپنگ کی خاص ضرورت ہوتی ہے۔ روزانہ کم از کم تیس منٹ مشق کرنے سے ٹائپنگ کی رفتار اور درستگی میں نمایاں بہتری آتی ہے۔" },
  { label: "French Practice", lang: "french", text: "La maîtrise de la frappe au clavier est devenue une compétence indispensable dans le monde professionnel moderne. Que ce soit pour rédiger des courriels, des rapports ou des documents administratifs, la capacité à taper rapidement et sans fautes représente un avantage concurrentiel considérable. La méthode dactylo, qui consiste à utiliser tous les doigts de façon systématique, permet d'atteindre des vitesses impressionnantes après quelques mois de pratique régulière." },
  { label: "German Practice", lang: "german", text: "Das Zehnfingersystem ist die effizienteste Methode, um schnell und fehlerfrei auf der Tastatur zu schreiben. Mit konsequentem Training lässt sich die Tippgeschwindigkeit innerhalb weniger Wochen erheblich steigern. Wichtig ist dabei, die korrekte Fingerposition auf der Grundreihe zu erlernen und konsequent beizubehalten." },
  { label: "Government Notice (English)", lang: "english", text: "The Government of India hereby notifies all concerned persons that applications are invited from eligible candidates for recruitment to the posts mentioned herein for the current recruitment year. Candidates must be citizens of India and should fulfill the prescribed educational qualifications, age limits, and other eligibility criteria as specified in the official notification. Applications that are incomplete, incorrect, or received after the stipulated last date shall be summarily rejected without any communication to the applicant." },
  { label: "Legal Text (English)", lang: "english", text: "Whereas the party of the first part, hereinafter referred to as the Vendor, has agreed to sell and transfer, and the party of the second part, hereinafter referred to as the Purchaser, has agreed to purchase the immovable property described herein, subject to the terms, conditions, representations, and warranties set forth in this agreement. Both parties acknowledge and confirm that this contract constitutes the entire agreement between them." },
];

const EXAM_CATEGORIES: { id: PassageCategory; label: string; icon: string; color: string }[] = [
  { id: "government", label: "Government",  icon: "🏛️", color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800" },
  { id: "legal",      label: "Legal",       icon: "⚖️", color: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" },
  { id: "office",     label: "Office",      icon: "📋", color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800" },
  { id: "formal",     label: "Formal",      icon: "📄", color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800" },
];

function cleanText(raw: string): string {
  return raw.replace(/\r\n/g, " ").replace(/\n/g, " ").replace(/\t/g, " ").replace(/\s{2,}/g, " ").trim();
}

const TIMER_OPTIONS: { label: string; minutes: number | null }[] = [
  { label: "No Limit", minutes: null },
  { label: "1 min",    minutes: 1   },
  { label: "2 min",    minutes: 2   },
  { label: "5 min",    minutes: 5   },
  { label: "10 min",   minutes: 10  },
  { label: "20 min",   minutes: 20  },
  { label: "40 min",   minutes: 40  },
  { label: "60 min",   minutes: 60  },
];

export default function CustomPracticePage() {
  const [rawText, setRawText] = useState("");
  const [selectedLang, setSelectedLang] = useState<Language>("english");
  const [practiceText, setPracticeText] = useState<string | null>(null);
  const [result, setResult] = useState<{ wpm: number; accuracy: number; timeSeconds: number; errors: number } | null>(null);
  const [fullResult, setFullResult] = useState<TypingResult | null>(null);
  const [nextKey, setNextKey] = useState<string | undefined>(undefined);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<TypingMode>("practice");
  const [activeTab, setActiveTab] = useState<"own" | "exam">("own");
  const [examCategory, setExamCategory] = useState<PassageCategory>("government");
  const [timerMinutes, setTimerMinutes] = useState<number | null>(null);
  const [customTimerInput, setCustomTimerInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleStart() {
    const cleaned = cleanText(rawText);
    if (cleaned.length < 10) return;
    setPracticeText(cleaned);
    setResult(null);
    setStarted(false);
  }

  function handleLoadRandomPassage(category: PassageCategory) {
    const p = getNextPassage(category);
    setRawText(p.text);
    setExamCategory(category);
  }

  function handleFinish(wpm: number, accuracy: number, timeSeconds: number) {
    const correct = Math.round((accuracy / 100) * practiceText!.split("").length);
    const errors = practiceText!.length - correct;
    setResult({ wpm, accuracy, timeSeconds, errors: Math.max(0, errors) });
    saveOfflineSession(wpm, Math.round(wpm * (timeSeconds / 60)));
  }

  function handleFinishFull(r: TypingResult) {
    setFullResult(r);
  }

  function handleReset() {
    setPracticeText(null);
    setResult(null);
    setNextKey(undefined);
    setStarted(false);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setRawText((ev.target?.result as string) ?? ""); };
    reader.readAsText(file);
    e.target.value = "";
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      setRawText(text);
    } catch { /* fallback */ }
  }

  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;
  const charCount = rawText.length;

  if (practiceText && !result) {
    return (
      <div className={`bg-background ${fullscreen ? "fixed inset-0 z-50 overflow-auto p-4" : "min-h-screen"}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <h1 className="font-display text-2xl font-bold">Custom Practice</h1>
              <p className="text-sm text-muted-foreground">{practiceText.split(/\s+/).length} words · {practiceText.length} characters</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {TYPING_MODES.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${mode === m.id ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"}`}
                >
                  {m.icon} {m.label}
                </button>
              ))}
              <Button variant="outline" size="sm" onClick={() => setShowKeyboard(k => !k)}>
                <Keyboard className="w-4 h-4 mr-1" /> {showKeyboard ? "Hide" : "Show"} Keys
              </Button>
              <Button variant="outline" size="sm" onClick={() => setFullscreen(f => !f)}>
                {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RefreshCw className="w-4 h-4 mr-1" /> Change
              </Button>
            </div>
          </div>

          {mode !== "expert" && (
            <div className="mb-4">
              <GuidedInstruction nextChar={nextKey} mode={mode} />
            </div>
          )}

          <TypingEngine
            text={practiceText}
            onFinish={handleFinish}
            onFinishFull={handleFinishFull}
            onStart={() => setStarted(true)}
            onKeyPress={setNextKey}
            showTimer
            mode={mode}
            timeLimit={timerMinutes !== null ? timerMinutes * 60 : undefined}
          />

          {showKeyboard && mode !== "expert" && (
            <div className="mt-4">
              <VisualKeyboard nextKey={nextKey} guidedMode={mode === "guided"} />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-8 space-y-4">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-3 animate-bounce">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold">Practice Complete!</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {practiceText?.split(/\s+/).length ?? 0} words · {selectedLang}
            </p>
          </div>
          {fullResult && <ResultStats result={fullResult} />}
          <div className="flex flex-col gap-2">
            <Button onClick={() => { setResult(null); setFullResult(null); }} className="gold-gradient text-[hsl(222_47%_11%)] font-bold">
              <RefreshCw className="w-4 h-4 mr-1" /> Practice Again
            </Button>
            <Button variant="outline" onClick={handleReset}>Try Different Text</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="navy-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-amber-400" />
            <h1 className="font-display text-4xl font-bold text-white">Custom Practice</h1>
          </div>
          <p className="text-slate-300">Paste any text, use long exam passages, or upload a file — in any language!</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-6">

        {/* Tab switcher */}
        <div className="flex gap-2 p-1 bg-muted/50 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("own")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "own" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <FileText className="w-4 h-4" /> My Text
          </button>
          <button
            onClick={() => setActiveTab("exam")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "exam" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            <BookOpen className="w-4 h-4" /> Exam Passages
            <Badge className="text-[10px] px-1.5 py-0.5 bg-amber-400/20 text-amber-600 border-0">{EXAM_PASSAGES.length}</Badge>
          </button>
        </div>

        {activeTab === "exam" ? (
          /* ── EXAM PASSAGE PICKER ── */
          <div className="space-y-4">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" /> Long Exam Passages (200–400 words)
                </CardTitle>
                <p className="text-xs text-muted-foreground">Each button loads a fresh, unique passage — no repetition tracked across attempts.</p>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {EXAM_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { handleLoadRandomPassage(cat.id); setActiveTab("own"); }}
                      className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all hover:shadow-md ${cat.color}`}
                    >
                      <span className="text-2xl flex-shrink-0">{cat.icon}</span>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{cat.label} Passage</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {EXAM_PASSAGES.filter(p => p.category === cat.id).length} passages · click to load random
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <Shuffle className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">Auto-rotates, no repeat</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Individual passage list */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Browse All Passages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {EXAM_PASSAGES.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { setRawText(p.text); setActiveTab("own"); }}
                      className="w-full flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 text-left transition-all group"
                    >
                      <span className="text-base flex-shrink-0 mt-0.5">
                        {EXAM_CATEGORIES.find(c => c.id === p.category)?.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{p.title}</p>
                          <Badge className="text-[10px] capitalize px-1.5 py-0 border-0 bg-muted text-muted-foreground">{p.category}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{p.text.substring(0, 100)}…</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{p.text.split(/\s+/).length} words</p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* ── OWN TEXT TAB ── */
          <>
            {/* Language filter */}
            <Card className="border-border">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Sample Passages by Language</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {SUPPORTED_LANGUAGES.filter(l => SAMPLE_TEXTS.some(s => s.lang === l.id)).map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => setSelectedLang(lang.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedLang === lang.id ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"}`}
                    >
                      {lang.flag} {lang.label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_TEXTS.filter(s => s.lang === selectedLang).map(s => (
                    <Button key={s.label} variant="outline" size="sm" onClick={() => setRawText(s.text)} className="text-xs">
                      {s.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Text input */}
            <Card className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Your Text</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-xs h-7" onClick={handlePaste}>
                      <ClipboardPaste className="w-3.5 h-3.5 mr-1" /> Paste
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => fileInputRef.current?.click()}>
                      <FileText className="w-3.5 h-3.5 mr-1" /> Upload .txt
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs h-7 text-red-500 hover:text-red-600" onClick={() => setRawText("")} disabled={!rawText}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                  placeholder="Paste or type your text here… Supports English, Hindi, Urdu, Arabic, French, German, Spanish, and more."
                  className="min-h-[180px] font-mono text-sm resize-y"
                  data-testid="custom-text-input"
                />
                <input ref={fileInputRef} type="file" accept=".txt,.text" className="hidden" onChange={handleFileUpload} />
                {rawText.length > 0 && (
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{wordCount} words</span>
                    <span>{charCount} characters</span>
                    <span>~{Math.ceil(wordCount / 40)} min at 40 WPM</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Mode selector */}
        <Card className="border-border">
          <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">Typing Mode</CardTitle></CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-3">
              {TYPING_MODES.map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${mode === m.id ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/40"}`}
                >
                  <p className="text-lg mb-1">{m.icon}</p>
                  <p className="text-sm font-semibold text-foreground">{m.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{m.desc}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Timer selector */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Timer className="w-4 h-4 text-primary" /> Custom Timer
              {timerMinutes !== null && (
                <span className="ml-auto text-xs text-amber-600 font-normal bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-full">
                  ⏱ {timerMinutes} min limit active
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {TIMER_OPTIONS.map(opt => (
                <button
                  key={opt.label}
                  onClick={() => setTimerMinutes(opt.minutes)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${timerMinutes === opt.minutes ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={180}
                value={customTimerInput}
                onChange={e => setCustomTimerInput(e.target.value)}
                placeholder="Custom minutes…"
                className="w-36 px-3 py-1.5 text-xs rounded-lg border border-border bg-background focus:border-primary outline-none"
              />
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-8"
                disabled={!customTimerInput || isNaN(Number(customTimerInput)) || Number(customTimerInput) < 1}
                onClick={() => { const v = Number(customTimerInput); if (v >= 1) { setTimerMinutes(v); setCustomTimerInput(""); } }}
              >
                Set
              </Button>
              {timerMinutes !== null && (
                <Button size="sm" variant="ghost" className="text-xs h-8 text-muted-foreground" onClick={() => setTimerMinutes(null)}>
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Preview & start */}
        {rawText.trim().length >= 10 && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">PREVIEW — {wordCount} words</p>
                  <p className="text-sm font-mono line-clamp-3 text-foreground">{cleanText(rawText)}</p>
                </div>
                <Button onClick={handleStart} className="gold-gradient text-[hsl(222_47%_11%)] font-bold flex-shrink-0" data-testid="btn-start-custom-practice">
                  <Play className="w-4 h-4 mr-2" /> Start Practice
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        <Card className="border-border bg-muted/30">
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm mb-3">Tips for Custom Practice</h3>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>• Works fully <strong>offline</strong> — no internet needed</li>
              <li>• Use <strong>Exam Passages</strong> tab for 200–400 word real-world texts</li>
              <li>• Supports <strong>English, Hindi, Urdu, Arabic, French, German, Spanish</strong> and more</li>
              <li>• Use <strong>Guided Mode</strong> for step-by-step key and finger instructions</li>
              <li>• Use the <strong>fullscreen mode</strong> for distraction-free practice</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
