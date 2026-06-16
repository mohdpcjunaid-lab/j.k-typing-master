import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useGetMyProgress, useGetMyTypingHistory } from "@workspace/api-client-react";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Zap, Target, Clock, Trophy, Flame, TrendingUp, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProgressPage() {
  const { data: progress, isLoading } = useGetMyProgress();
  const { data: history } = useGetMyTypingHistory();

  const weeklyData = (progress?.weeklyWpm ?? []).map((wpm, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    wpm: Math.round(wpm),
    accuracy: Math.round(progress?.weeklyAccuracy?.[i] ?? 0),
  }));

  const historyData = (history ?? []).slice(0, 20).map((s: any, i: number) => ({
    session: i + 1,
    date: new Date(s.createdAt ?? s.date ?? Date.now()).toLocaleDateString(),
    wpm: Math.round(s.wpm),
    accuracy: Math.round(s.accuracy),
    errors: s.errors ?? 0,
    type: s.type ?? "practice",
  })).reverse();

  const stats = [
    { label: "Best WPM", value: Math.round(progress?.bestWpm ?? 0), icon: Zap, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Avg Accuracy", value: `${Math.round(progress?.averageAccuracy ?? 0)}%`, icon: Target, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "Total Time (min)", value: progress?.totalTypingTimeMinutes ?? 0, icon: Clock, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: "Exams Passed", value: progress?.examsPassed ?? 0, icon: Trophy, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Day Streak", value: progress?.streak ?? 0, icon: Flame, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: "Lessons Done", value: progress?.lessonsCompleted ?? 0, icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
  ];

  function handlePrint() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="navy-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h1 className="font-display text-4xl font-bold text-white mb-2">My Progress</h1>
          <p className="text-slate-300">Track your typing journey and growth</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="w-4 h-4 mr-2" />Print Report</Button>
        </div>

        <Card className="mb-6 border-border overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl navy-gradient flex items-center justify-center">
                <span className="text-amber-400 font-display text-2xl font-bold">{progress?.currentLevel ?? 1}</span>
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">Level {progress?.currentLevel ?? 1}</h2>
                <p className="text-sm text-muted-foreground">{progress?.xp ?? 0} XP total</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="outline" className="text-orange-600 border-orange-300"><Flame className="w-3 h-3 mr-1" />{progress?.streak ?? 0} day streak</Badge>
                <Badge variant="outline">Best streak: {progress?.longestStreak ?? 0} days</Badge>
              </div>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full gold-gradient rounded-full transition-all duration-700" style={{ width: `${Math.round(((progress?.xp ?? 0) % 500) / 500 * 100)}%` }} />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {stats.map(stat => (
            <Card key={stat.label} className="border-border">
              <CardContent className="p-4 text-center">
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mx-auto mb-2`}><stat.icon className={`w-4 h-4 ${stat.color}`} /></div>
                {isLoading ? <Skeleton className="h-7 w-12 mx-auto" /> : <p className="text-xl font-bold text-foreground">{stat.value}</p>}
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Weekly WPM & Accuracy</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-48 w-full" /> : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="wpm" name="WPM" fill="hsl(222 47% 20%)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="accuracy" name="Accuracy %" fill="hsl(43 96% 56%)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Session History</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-48 w-full" /> : historyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={historyData}>
                    <defs>
                      <linearGradient id="wpmG" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(222 47% 20%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(222 47% 20%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="session" tick={{ fontSize: 11 }} label={{ value: "Session", position: "insideBottom", fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="wpm" name="WPM" stroke="hsl(222 47% 20%)" fill="url(#wpmG)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">Complete lessons and exams to see your history</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
