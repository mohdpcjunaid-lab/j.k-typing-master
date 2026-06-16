import { Link, useParams, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCourse, useGetLessons, useEnrollCourse } from "@workspace/api-client-react";
import { isLoggedIn } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, CheckCircle2, Lock, ChevronRight, Clock, Users, Award } from "lucide-react";

const levelColors: Record<string, string> = {
  basic: "bg-emerald-100 text-emerald-700",
  intermediate: "bg-blue-100 text-blue-700",
  advanced: "bg-purple-100 text-purple-700",
  government: "bg-amber-100 text-amber-700",
};

export default function CourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = parseInt(params.courseId, 10);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const loggedIn = isLoggedIn();

  const { data: course, isLoading } = useGetCourse(courseId);
  const { data: lessons, isLoading: lessonsLoading } = useGetLessons(courseId, { query: { enabled: loggedIn, queryKey: ["lessons", courseId] } });
  const enrollMutation = useEnrollCourse();

  const completedCount = lessons?.filter(l => l.isCompleted).length ?? 0;
  const progressPct = lessons && lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  function handleEnroll() {
    if (!loggedIn) { setLocation("/login"); return; }
    enrollMutation.mutate({ courseId }, {
      onSuccess: () => toast({ title: "Enrolled!", description: "You are now enrolled in this course." }),
      onError: () => toast({ title: "Error", description: "Could not enroll", variant: "destructive" }),
    });
  }

  if (isLoading) return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );

  if (!course) return (
    <div className="text-center py-20 text-muted-foreground">Course not found</div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="navy-gradient py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <Badge className={`mb-3 ${levelColors[course.level] ?? ""}`}>{course.level}</Badge>
          <h1 className="font-display text-4xl font-bold text-white mb-3">{course.title}</h1>
          <p className="text-slate-300 max-w-2xl">{course.description}</p>
          <div className="flex items-center gap-6 mt-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{course.totalLessons} lessons</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{course.totalStudents} students</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{course.durationWeeks} weeks</span>
            <span>{course.language}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        {loggedIn && lessons && lessons.length > 0 && (
          <Card className="mb-6 border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Course Progress</span>
                <span className="text-sm text-muted-foreground">{completedCount}/{lessons.length} lessons</span>
              </div>
              <Progress value={progressPct} className="h-2" />
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-lg text-foreground">Lessons</h2>
          {!loggedIn && (
            <Button onClick={handleEnroll} className="gold-gradient text-[hsl(222_47%_11%)] font-semibold" data-testid="btn-enroll">
              Enroll & Start Learning
            </Button>
          )}
          {loggedIn && (
            <Button onClick={handleEnroll} variant="outline" size="sm" disabled={enrollMutation.isPending} data-testid="btn-enroll">
              {enrollMutation.isPending ? "Enrolling..." : "Enroll"}
            </Button>
          )}
        </div>

        {lessonsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
          </div>
        ) : lessons && lessons.length > 0 ? (
          <div className="space-y-2">
            {lessons.map((lesson, i) => (
              <Card key={lesson.id} className={`border-border transition-all ${lesson.isCompleted ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800" : ""}`} data-testid={`card-lesson-${lesson.id}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${lesson.isCompleted ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}>
                      {lesson.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">{lesson.stageLabel} · Target: {lesson.targetKeys} · +{lesson.xpReward} XP</p>
                    </div>
                  </div>
                  {loggedIn ? (
                    <Link href={`/lessons/${lesson.id}`}>
                      <Button size="sm" variant={lesson.isCompleted ? "outline" : "default"} className="h-7 text-xs" data-testid={`btn-lesson-${lesson.id}`}>
                        {lesson.isCompleted ? "Redo" : "Start"} <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No lessons available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
