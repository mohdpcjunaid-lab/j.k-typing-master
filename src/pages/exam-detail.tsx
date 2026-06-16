import { useParams, useLocation } from "wouter";
import { useState } from "react";
import { useGetExam, useSubmitExam } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { TypingEngine } from "@/components/typing/typing-engine";
import { CheckCircle2, XCircle, ChevronLeft, Shield, Target, Clock, AlertTriangle } from "lucide-react";

export default function ExamDetailPage() {
  const params = useParams<{ examId: string }>();
  const examId = parseInt(params.examId, 10);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: exam, isLoading } = useGetExam(examId);
  const submitMutation = useSubmitExam();

  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<any>(null);

  function handleFinish(wpm: number, accuracy: number, timeSeconds: number) {
    submitMutation.mutate({
      examId,
      data: { wpm, accuracy, rawText: exam?.text ?? "", timeSeconds },
    }, {
      onSuccess: (res) => setResult(res),
      onError: () => toast({ title: "Failed to submit exam", variant: "destructive" }),
    });
  }

  if (isLoading) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );

  if (!exam) return (
    <div className="text-center py-20 text-muted-foreground">Exam not found</div>
  );

  if (result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-border shadow-lg">
          <CardContent className="p-8 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${result.passed ? "bg-emerald-500" : "bg-red-500"}`}>
              {result.passed ? <CheckCircle2 className="w-8 h-8 text-white" /> : <XCircle className="w-8 h-8 text-white" />}
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-1">
              {result.passed ? "Exam Passed!" : "Exam Failed"}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">{exam.title}</p>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xl font-bold text-foreground">{Math.round(result.wpm)}</p>
                <p className="text-xs text-muted-foreground">WPM</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xl font-bold text-foreground">{Math.round(result.accuracy)}%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xl font-bold text-foreground">{Math.round(result.score)}%</p>
                <p className="text-xs text-muted-foreground">Score</p>
              </div>
            </div>
            {!result.passed && (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4 text-sm text-red-700 dark:text-red-400">
                Required: {exam.targetWpm} WPM & {exam.targetAccuracy}% accuracy
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setResult(null); setStarted(false); }}>Retry</Button>
              <Button className="flex-1" onClick={() => setLocation("/exams")}>Back to Exams</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (started) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <TypingEngine
            text={exam.text}
            onFinish={handleFinish}
            title={exam.title}
            timeLimit={exam.durationMinutes * 60}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg border-border shadow-lg">
        <CardContent className="p-8">
          <button onClick={() => setLocation("/exams")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ChevronLeft className="w-4 h-4" /> Back to Exams
          </button>
          <Badge className="mb-3 uppercase bg-primary/10 text-primary">{exam.type}</Badge>
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">{exam.title}</h1>
          <p className="text-muted-foreground text-sm mb-6">{exam.description}</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: "Duration", value: `${exam.durationMinutes} minutes`, icon: Clock },
              { label: "Target WPM", value: `${exam.targetWpm} WPM`, icon: Target },
              { label: "Min Accuracy", value: `${exam.targetAccuracy}%`, icon: Shield },
              { label: "Pass Mark", value: `${exam.passMarkPercent}%`, icon: CheckCircle2 },
            ].map(item => (
              <div key={item.label} className="bg-muted/50 rounded-lg p-3 flex items-center gap-2">
                <item.icon className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-6 flex gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">Once started, the timer cannot be paused. Ensure you are in a quiet environment before beginning.</p>
          </div>

          <Button className="w-full h-11 font-semibold" onClick={() => setStarted(true)} data-testid="btn-start-exam">
            Start Exam
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
