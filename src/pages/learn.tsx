import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getLevelLabel, getLevelColor, getLevelProgress, getCompletedLevels, isLevelCompleted, SUPPORTED_LANGUAGES, type Language } from "@/lib/content-pool";
import { CheckCircle2, Lock, Keyboard, Globe, ChevronDown, ChevronUp } from "lucide-react";

const STAGE_GROUPS = [
  { label: "Stage 1 — Home Row", range: [1, 30] as [number,number], keys: "ASDF JKL;", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/10", border: "border-emerald-200 dark:border-emerald-800" },
  { label: "Stage 2 — Top Row", range: [31, 60] as [number,number], keys: "QWERTY UIOP", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/10", border: "border-blue-200 dark:border-blue-800" },
  { label: "Stage 3 — Bottom Row", range: [61, 90] as [number,number], keys: "ZXCVB NM,./", color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/10", border: "border-violet-200 dark:border-violet-800" },
  { label: "Stage 4 — Mixed Keys", range: [91, 120] as [number,number], keys: "Full keyboard combinations", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/10", border: "border-orange-200 dark:border-orange-800" },
  { label: "Stage 5 — Expert Mastery", range: [121, 150] as [number,number], keys: "Numbers + Symbols + Speed", color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/10", border: "border-red-200 dark:border-red-800" },
];

export default function LearnPage() {
  const [language, setLanguage] = useState<Language>("english");
  const [showAllLangs, setShowAllLangs] = useState(false);
  const [expandedStage, setExpandedStage] = useState<number | null>(0);

  const progress = getLevelProgress(language);
  const completedLevels = getCompletedLevels(language);
  const selectedLang = SUPPORTED_LANGUAGES.find(l => l.id === language)!;

  const primaryLangs: Language[] = ["english", "hindi", "urdu"];
  const moreLangs = SUPPORTED_LANGUAGES.filter(l => !primaryLangs.includes(l.id));
  const visibleLangs = showAllLangs ? SUPPORTED_LANGUAGES : SUPPORTED_LANGUAGES.filter(l => primaryLangs.includes(l.id));

  return (
    <div className="min-h-screen bg-background">
      <div className="navy-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Keyboard className="w-8 h-8 text-amber-400" />
            <h1 className="font-display text-4xl font-bold text-white">Learning Levels</h1>
          </div>
          <p className="text-slate-300 mb-6">150 structured levels from beginner to expert · Guided instruction · Offline ready</p>

          {/* Language picker */}
          <div className="flex flex-wrap gap-2 mb-3">
            {visibleLangs.map(lang => (
              <Button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                variant={language === lang.id ? "default" : "outline"}
                size="sm"
                className={language === lang.id
                  ? "gold-gradient text-[hsl(222_47%_11%)] font-bold"
                  : "border-white/20 text-white hover:bg-white/10 text-xs"}
              >
                {lang.flag} {lang.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white text-xs flex items-center gap-1"
              onClick={() => setShowAllLangs(v => !v)}
            >
              {showAllLangs ? <><ChevronUp className="w-3.5 h-3.5" /> Less</> : <><Globe className="w-3.5 h-3.5" /> +{moreLangs.length} more</>}
            </Button>
          </div>
          <p className="text-amber-300/70 text-xs">Currently learning: <strong className="text-amber-300">{selectedLang.flag} {selectedLang.label}</strong></p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Overall progress */}
        <Card className="border-border mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-foreground">{selectedLang.flag} {selectedLang.label} Typing Progress</p>
                <p className="text-sm text-muted-foreground">{progress} / 150 levels completed</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{Math.round((progress / 150) * 100)}%</p>
                <p className="text-xs text-muted-foreground">Complete</p>
              </div>
            </div>
            <Progress value={(progress / 150) * 100} className="h-3" />
            {progress === 0 && (
              <p className="text-xs text-muted-foreground mt-3 bg-muted/40 rounded-lg px-3 py-2">
                🎓 <strong>Tip:</strong> Start at Level 1 with <strong>Guided Mode</strong> for step-by-step key instructions and finger placement guidance.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Stage groups */}
        <div className="space-y-4">
          {STAGE_GROUPS.map((stage, si) => {
            const [from, to] = stage.range;
            const stageProgress = Math.max(0, Math.min(to - from + 1, progress - from + 1));
            const isUnlocked = progress >= from - 1;
            const isExpanded = expandedStage === si;

            return (
              <div key={stage.label} className="rounded-2xl border border-border overflow-hidden">
                <button
                  className={`w-full flex items-center justify-between p-4 ${stage.bg} border-b ${stage.border} transition-colors hover:opacity-90`}
                  onClick={() => setExpandedStage(isExpanded ? null : si)}
                >
                  <div className="text-left">
                    <h2 className={`font-bold text-base ${stage.color}`}>{stage.label}</h2>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{stage.keys}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`font-bold text-sm ${stage.color}`}>{Math.max(0, stageProgress)}/{to - from + 1}</p>
                      {!isUnlocked && <span className="text-xs text-muted-foreground flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>}
                    </div>
                    {isExpanded ? <ChevronUp className={`w-4 h-4 ${stage.color}`} /> : <ChevronDown className={`w-4 h-4 ${stage.color}`} />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 bg-background">
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                      {Array.from({ length: to - from + 1 }, (_, i) => {
                        const level = from + i;
                        const isCompleted = completedLevels.has(level);
                        const isCurrent = !isCompleted && (level === 1 || completedLevels.has(level - 1) || (completedLevels.size === 0 && level === 1));

                        return (
                          <Link key={level} href={`/learn/${language}/${level}`}>
                            <div
                              className={`aspect-square flex items-center justify-center rounded-xl text-sm font-bold transition-all cursor-pointer ${
                                isCompleted
                                  ? "bg-emerald-500 text-white shadow-sm hover:shadow-md hover:scale-105"
                                  : isCurrent
                                  ? "bg-primary text-white shadow-lg scale-110 ring-2 ring-primary/30"
                                  : "bg-card border border-border hover:border-primary hover:scale-105"
                              }`}
                              title={`Level ${level} — ${getLevelLabel(level)}`}
                              data-testid={`btn-level-${level}`}
                            >
                              {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : level}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Language guide */}
        <Card className="border-border mt-8 bg-muted/20">
          <CardContent className="p-5">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Globe className="w-4 h-4 text-primary" /> Available Languages</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SUPPORTED_LANGUAGES.map(lang => {
                const p = getLevelProgress(lang.id);
                return (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className={`p-2 rounded-lg border text-left transition-all hover:border-primary/50 ${language === lang.id ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    <p className="text-base mb-0.5">{lang.flag}</p>
                    <p className="text-xs font-medium text-foreground">{lang.label}</p>
                    <p className="text-[10px] text-muted-foreground">{p} / 150</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
