import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCompleteLesson } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, RefreshCw, ChevronLeft, Keyboard, Target, Zap } from "lucide-react";
import { TypingEngine } from "@/components/typing/typing-engine";
import { getToken } from "@/lib/auth";

interface Lesson {
  id: number;
  courseId: number;
  title: string;
  stage: number;
  stageLabel: string;
  targetKeys: string;
  practiceText: string;
  fingerGuide: string;
  xpReward: number;
  isCompleted?: boolean;
}

async function fetchLesson(lessonId: number): Promise<Lesson> {
  const token = getToken();
  const res = await fetch(`/api/lessons/${lessonId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Lesson not found");
  return res.json();
}

export default function LessonPage() {
  const params = useParams<{ lessonId: string }>();
  const lessonId = parseInt(params.lessonId, 10);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => fetchLesson(lessonId),
    enabled: !!lessonId,
  });
  const completeMutation = useCompleteLesson();

  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<{ wpm: number; accuracy: number; timeSeconds: number; xpEarned: number } | null>(null);

  function handleFinish(wpm: number, accuracy: number, timeSeconds: number) {
    completeMutation.mutate({ lessonId, data: { wpm, accuracy, timeSeconds } }, {
      onSuccess: (res) => {
        setResult({ wpm, accuracy, timeSeconds, xpEarned: res.xpEarned });
        setFinished(true);
      },
      onError: () => toast({ title: "Error saving result", variant: "destructive" }),
    });
  }

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center text-muted-foreground">Loading lesson...</div>
    </div>
  );

  if (!lesson) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center text-muted-foreground">Lesson not found</div>
    </div>
  );

  if (finished && result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-1">Lesson Complete!</h2>
            <p className="text-muted-foreground text-sm mb-6">{lesson.title}</p>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <p className="text-2xl font-bold text-blue-600">{Math.round(result.wpm)}</p>
                <p className="text-xs text-muted-foreground">WPM</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <p className="text-2xl font-bold text-green-600">{Math.round(result.accuracy)}%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                <p className="text-2xl font-bold text-amber-600">+{result.xpEarned}</p>
                <p className="text-xs text-muted-foreground">XP Earned</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setStarted(false); setFinished(false); setResult(null); }}>
                <RefreshCw className="w-4 h-4 mr-2" /> Retry
              </Button>
              <Button className="flex-1" onClick={() => setLocation(`/courses/${lesson.courseId}`)}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg border-border shadow-lg">
          <CardContent className="p-8">
            <button onClick={() => setLocation(`/courses/${lesson.courseId}`)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
              <ChevronLeft className="w-4 h-4" /> Back to Course
            </button>
            <Badge className="mb-3 bg-primary/10 text-primary">{lesson.stageLabel}</Badge>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">{lesson.title}</h1>
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-foreground mb-1">Target Keys</p>
              <p className="font-mono text-lg text-primary font-bold tracking-widest">{lesson.targetKeys}</p>
            </div>
            <div className="text-sm text-muted-foreground mb-6 space-y-2">
              <p className="flex items-center gap-2"><Keyboard className="w-4 h-4" /> Keep your fingers on the home row</p>
              <p className="flex items-center gap-2"><Target className="w-4 h-4" /> Focus on accuracy over speed</p>
              <p className="flex items-center gap-2"><Zap className="w-4 h-4" /> Earn up to {lesson.xpReward} XP</p>
            </div>
            <Button className="w-full h-11 font-semibold" onClick={() => setStarted(true)} data-testid="btn-start-lesson">
              Start Lesson
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <TypingEngine
          text={lesson.practiceText}
          onFinish={handleFinish}
          title={lesson.title}
          targetKeys={lesson.targetKeys}
          fingerGuide={lesson.fingerGuide}
        />
      </div>
    </div>
  );
}
