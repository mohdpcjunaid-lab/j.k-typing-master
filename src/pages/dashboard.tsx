import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useGetMe, useGetMyProgress, useGetMyAchievements } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Zap, BookOpen, Target, Flame, Star, ChevronRight, Award, TrendingUp } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export default function DashboardPage() {
  const { data: user, isLoading: userLoading } = useGetMe();
  const { data: progress, isLoading: progressLoading } = useGetMyProgress();
  const enrollments: any[] = [];
  const { data: achievements } = useGetMyAchievements();

  const xpPercent = progress ? (progress.xp % (progress.currentLevel * 500)) / (progress.currentLevel * 500) * 100 : 0;

  const chartData = (progress?.weeklyWpm ?? [0, 0, 0, 0, 0, 0, 0]).map((wpm, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    wpm: Math.round(wpm),
    accuracy: Math.round((progress?.weeklyAccuracy?.[i] ?? 0)),
  }));

  const levelThresholds = [
    { min: 1, max: 2, label: "Beginner", color: "bg-slate-400" },
    { min: 3, max: 4, label: "Learner", color: "bg-blue-400" },
    { min: 5, max: 7, label: "Intermediate", color: "bg-green-400" },
    { min: 8, max: 10, label: "Advanced", color: "bg-purple-400" },
    { min: 11, max: 99, label: "Master", color: "bg-amber-400" },
  ];
  const levelBadge = levelThresholds.find(l => (user?.level ?? 1) >= l.min && (user?.level ?? 1) <= l.max);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-primary">
              {userLoading ? <Skeleton className="h-8 w-48" /> : `Welcome, ${user?.name?.split(" ")[0] ?? "Student"}`}
            </h1>
            <p className="text-muted-foreground mt-1">Track your progress and keep improving</p>
          </div>
          <Link href="/exams">
            <Button className="gold-gradient text-[hsl(222_47%_11%)] font-semibold" data-testid="btn-practice-now">
              Practice Now <Zap className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Level + XP card */}
        <Card className="mb-6 navy-gradient text-white border-0 shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center shadow-lg">
                  <Star className="w-8 h-8 text-[hsl(222_47%_11%)]" />
                </div>
                <div>
                  {progressLoading ? <Skeleton className="h-8 w-24 bg-white/10" /> : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-3xl font-bold">Level {progress?.currentLevel ?? 1}</span>
                        <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/30 text-xs">{levelBadge?.label}</Badge>
                      </div>
                      <p className="text-slate-300 text-sm">{progress?.xp ?? 0} XP · {(progress?.currentLevel ?? 1) * 500 - ((progress?.xp ?? 0) % ((progress?.currentLevel ?? 1) * 500))} to next level</p>
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{progress?.streak ?? 0}</p>
                  <p className="text-xs text-slate-400 flex items-center justify-center gap-1"><Flame className="w-3 h-3" />Day Streak</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{Math.round(progress?.bestWpm ?? 0)}</p>
                  <p className="text-xs text-slate-400">Best WPM</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{Math.round(progress?.averageAccuracy ?? 0)}%</p>
                  <p className="text-xs text-slate-400">Avg Accuracy</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>XP Progress</span>
                <span>{Math.round(xpPercent)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full gold-gradient rounded-full transition-all duration-700" style={{ width: `${xpPercent}%` }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Lessons Done", value: progress?.lessonsCompleted ?? 0, icon: BookOpen, color: "text-blue-500" },
            { label: "Exams Passed", value: progress?.examsPassed ?? 0, icon: Trophy, color: "text-amber-500" },
            { label: "Avg WPM", value: Math.round(progress?.averageWpm ?? 0), icon: Zap, color: "text-green-500" },
            { label: "Time (min)", value: progress?.totalTypingTimeMinutes ?? 0, icon: Target, color: "text-purple-500" },
          ].map(stat => (
            <Card key={stat.label} className="border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                {progressLoading ? <Skeleton className="h-8 w-16" /> : (
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* WPM Chart */}
          <Card className="lg:col-span-2 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Weekly Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {progressLoading ? <Skeleton className="h-40 w-full" /> : (
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="wpmGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(222 47% 20%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(222 47% 20%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="wpm" stroke="hsl(222 47% 20%)" fill="url(#wpmGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Achievements preview */}
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" /> Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievements?.earned && achievements.earned.length > 0 ? (
                <div className="space-y-3">
                  {achievements.earned.slice(0, 3).map(a => (
                    <div key={a.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-base">{a.icon}</div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{a.title}</p>
                        <p className="text-[10px] text-muted-foreground">+{a.xpReward} XP</p>
                      </div>
                    </div>
                  ))}
                  <Link href="/achievements">
                    <Button variant="ghost" size="sm" className="w-full text-xs h-8 mt-1">
                      View All <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Award className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">Complete lessons to earn achievements!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enrolled courses */}
        {enrollments && enrollments.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">My Courses</h2>
              <Link href="/courses">
                <Button variant="ghost" size="sm" className="text-xs">All Courses <ChevronRight className="w-3 h-3 ml-1" /></Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enrollments.slice(0, 3).map((e: any) => (
                <Card key={e.id} className="border-border hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-sm font-semibold text-foreground">{e.courseTitle ?? `Course #${e.courseId}`}</h3>
                      <Badge variant="secondary" className="text-xs">{Math.round((e.progress ?? 0) * 100)}%</Badge>
                    </div>
                    <Progress value={(e.progress ?? 0) * 100} className="h-1.5 mb-3" />
                    <Link href={`/courses/${e.courseId}`}>
                      <Button variant="outline" size="sm" className="w-full h-7 text-xs" data-testid={`btn-continue-course-${e.courseId}`}>Continue</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
