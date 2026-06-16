import { useParams } from "wouter";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useGetStudentAnalytics } from "@workspace/api-client-react";
import {
  AreaChart, Area, BarChart, Bar,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import {
  ArrowLeft, Zap, Target, Trophy, Flame, BookOpen,
  GraduationCap, TrendingUp, TrendingDown, Minus,
  CheckCircle2, XCircle, Users, Calendar,
} from "lucide-react";

export default function AdminStudentDetailPage() {
  const params = useParams<{ id: string }>();
  const studentId = parseInt(params.id, 10);
  const { data: analytics, isLoading, isError } = useGetStudentAnalytics(studentId);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="navy-gradient py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <Skeleton className="h-6 w-32 mb-4 bg-white/10" />
            <Skeleton className="h-10 w-64 bg-white/10" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 grid gap-5">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (isError || !analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">Student not found</p>
          <Link href="/admin/students"><Button variant="outline">Back to Students</Button></Link>
        </div>
      </div>
    );
  }

  /* ── Trend chart data ── */
  const trendData = analytics.wpmTrend.map((wpm, i) => ({
    session: i + 1,
    date: analytics.sessionDates?.[i]
      ? new Date(analytics.sessionDates[i]).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
      : `#${i + 1}`,
    wpm: Math.round(wpm),
    accuracy: Math.round(analytics.accuracyTrend[i] ?? 0),
  }));

  const improvScore = Math.round(analytics.improvementScore);
  const ImprovIcon = improvScore > 0 ? TrendingUp : improvScore < 0 ? TrendingDown : Minus;
  const improvColor = improvScore > 0 ? "text-emerald-500" : improvScore < 0 ? "text-red-500" : "text-muted-foreground";

  /* ── Stat cards ── */
  const statCards = [
    { label: "Level",        value: analytics.level,             icon: Trophy,       color: "text-amber-500",   bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "XP",           value: analytics.xp.toLocaleString(), icon: Zap,        color: "text-blue-500",    bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Best WPM",     value: Math.round(analytics.bestWpm), icon: Zap,        color: "text-purple-500",  bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: "Streak",       value: `${analytics.streak}d`,        icon: Flame,      color: "text-orange-500",  bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: "Lessons Done", value: analytics.lessonsCompleted,    icon: BookOpen,   color: "text-teal-500",    bg: "bg-teal-50 dark:bg-teal-900/20" },
    { label: "Exams Taken",  value: analytics.totalExams,          icon: Target,     color: "text-red-500",     bg: "bg-red-50 dark:bg-red-900/20" },
    { label: "Certificates", value: analytics.totalCertificates,   icon: GraduationCap, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    { label: "Improvement",  value: `${improvScore > 0 ? "+" : ""}${improvScore}%`, icon: ImprovIcon, color: improvColor, bg: "bg-muted" },
  ];

  const passRate = Math.round(analytics.examPassRate * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="navy-gradient py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <Link href="/admin/students">
            <button className="flex items-center gap-1.5 text-slate-300 hover:text-white text-sm mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Students
            </button>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-amber-400/20 border-2 border-amber-400/40 flex items-center justify-center text-2xl font-bold text-amber-300 flex-shrink-0">
              {analytics.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl font-bold text-white">{analytics.name}</h1>
              <p className="text-slate-300 text-sm mt-0.5">{analytics.email}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/30">Level {analytics.level}</Badge>
                {analytics.batchName && (
                  <Badge className="bg-white/10 text-slate-200 border-white/20">
                    <Users className="w-3 h-3 mr-1" />{analytics.batchName}
                  </Badge>
                )}
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Joined {new Date(analytics.joinedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Stat grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {statCards.map(card => (
            <Card key={card.label} className="border-border">
              <CardContent className="p-4 text-center">
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mx-auto mb-2`}>
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress bars row */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">Exam Pass Rate</p>
                <span className={`text-sm font-bold ${passRate >= 70 ? "text-emerald-500" : passRate >= 50 ? "text-amber-500" : "text-red-500"}`}>{passRate}%</span>
              </div>
              <Progress value={passRate} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{analytics.totalExams} exam{analytics.totalExams !== 1 ? "s" : ""} taken</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">Lesson Progress</p>
                <span className="text-sm font-bold text-teal-500">{analytics.lessonsCompleted} done</span>
              </div>
              <Progress value={Math.round(analytics.lessonCompletionRate * 100)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{Math.round(analytics.lessonCompletionRate * 100)}% of expected lessons</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">WPM Improvement</p>
                <span className={`text-sm font-bold flex items-center gap-1 ${improvColor}`}>
                  <ImprovIcon className="w-3.5 h-3.5" />
                  {improvScore > 0 ? "+" : ""}{improvScore}%
                </span>
              </div>
              <Progress value={Math.min(Math.abs(improvScore), 100)} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {trendData.length > 1
                  ? `${trendData[0].wpm} → ${trendData[trendData.length - 1].wpm} WPM across ${trendData.length} sessions`
                  : "Not enough sessions yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* WPM + Accuracy trend charts */}
        {trendData.length > 1 && (
          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" /> WPM Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="wpmGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                      formatter={(v: number) => [`${v} WPM`, "WPM"]}
                    />
                    <Area type="monotone" dataKey="wpm" stroke="#3b82f6" strokeWidth={2} fill="url(#wpmGrad)" dot={false} activeDot={{ r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-500" /> Accuracy Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                      formatter={(v: number) => [`${v}%`, "Accuracy"]}
                    />
                    <Area type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} fill="url(#accGrad)" dot={false} activeDot={{ r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Exams + Recent Sessions */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Exams */}
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Target className="w-4 h-4 text-red-500" /> Recent Exams
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.recentExams.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">No exams taken yet</p>
              ) : (
                <div className="space-y-2">
                  {analytics.recentExams.map((exam, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-lg border text-sm ${exam.passed ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10" : "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10"}`}>
                      <div className="flex items-center gap-2 min-w-0">
                        {exam.passed
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          : <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{exam.examName}</p>
                          <p className="text-xs text-muted-foreground">{new Date(exam.takenAt).toLocaleDateString("en-IN")}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <p className="font-semibold text-blue-500">{Math.round(exam.wpm)} WPM</p>
                        <p className="text-xs text-muted-foreground">{Math.round(exam.accuracy)}% acc</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" /> Recent Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.recentSessions.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">No sessions yet</p>
              ) : (
                <div className="space-y-2">
                  {analytics.recentSessions.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30 text-sm">
                      <div>
                        <p className="font-medium text-foreground capitalize">{s.type}</p>
                        <p className="text-xs text-muted-foreground">{new Date(s.completedAt).toLocaleDateString("en-IN")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-500">{Math.round(s.wpm)} WPM</p>
                        <p className="text-xs text-muted-foreground">{Math.round(s.accuracy)}% acc</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* No sessions at all */}
        {trendData.length <= 1 && analytics.recentSessions.length === 0 && (
          <Card className="border-border">
            <CardContent className="py-12 text-center text-muted-foreground">
              <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="font-medium">No typing sessions recorded yet</p>
              <p className="text-sm mt-1">Charts will appear once this student completes practice sessions</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
