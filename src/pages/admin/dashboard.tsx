import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { Users, BookOpen, FileText, GraduationCap, BarChart2, Trophy, TrendingUp, Clock, Zap, Target } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  const { data, isLoading } = useGetDashboardStats();

  const stats = [
    { label: "Total Students", value: data?.totalStudents ?? 0, icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", href: "/admin/students" },
    { label: "Courses", value: data?.totalCourses ?? 0, icon: BookOpen, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20", href: "/courses" },
    { label: "Batches", value: data?.totalBatches ?? 0, icon: Users, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20", href: "/admin/batches" },
    { label: "Exams", value: data?.totalExams ?? 0, icon: FileText, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20", href: "/admin/exams" },
    { label: "Certificates Issued", value: data?.totalCertificates ?? 0, icon: GraduationCap, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20", href: "/admin/certificates" },
    { label: "Platform Avg WPM", value: Math.round(data?.averageWpmPlatform ?? 0), icon: Zap, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
  ];

  const completionData = data?.courseCompletionRates?.map(c => ({
    name: c.courseName.length > 15 ? c.courseName.slice(0, 15) + "…" : c.courseName,
    rate: Math.round((c.completionRate ?? 0) * 100),
    enrolled: c.totalEnrolled ?? 0,
  })) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="navy-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-slate-300">J.K Typing Master — Institute Management</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/exams">
                <Button className="gold-gradient text-[hsl(222_47%_11%)] font-semibold" data-testid="btn-create-exam">Create Exam</Button>
              </Link>
              <Link href="/admin/students">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/5" data-testid="btn-manage-students">Manage Students</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {stats.map(stat => (
            <Card key={stat.label} className={`border-border hover:shadow-sm transition-all ${stat.href ? "cursor-pointer" : ""}`} data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}>
              {stat.href ? (
                <Link href={stat.href}>
                  <CardContent className="p-4 text-center">
                    <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    {isLoading ? <Skeleton className="h-7 w-12 mx-auto" /> : <p className="text-xl font-bold text-foreground">{stat.value}</p>}
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Link>
              ) : (
                <CardContent className="p-4 text-center">
                  <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  {isLoading ? <Skeleton className="h-7 w-12 mx-auto" /> : <p className="text-xl font-bold text-foreground">{stat.value}</p>}
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Top students */}
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" /> Top Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
              ) : data?.topStudents && data.topStudents.length > 0 ? (
                <div className="space-y-3">
                  {data.topStudents.map((s: any, i: number) => (
                    <div key={s.userId} className="flex items-center gap-3">
                      <span className="w-5 text-xs font-bold text-muted-foreground">#{i + 1}</span>
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {s.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{s.name}</p>
                        <p className="text-[10px] text-muted-foreground">{s.xp} XP · Lv.{s.level}</p>
                      </div>
                      <span className="text-xs font-medium text-blue-600">{Math.round(s.wpm)} WPM</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No students yet</p>
              )}
            </CardContent>
          </Card>

          {/* Course completion rates */}
          <Card className="lg:col-span-2 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-primary" /> Course Completion Rates
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-48 w-full" /> : completionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={completionData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} unit="%" />
                    <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v) => [`${v}%`, "Completion"]} />
                    <Bar dataKey="rate" name="Completion %" fill="hsl(222 47% 20%)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No course data yet</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent activity */}
        {data?.recentActivity && data.recentActivity.length > 0 && (
          <Card className="mt-6 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recentActivity.map((a: any) => (
                  <div key={a.id} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                    <span className="text-muted-foreground flex-1">{a.message}</span>
                    <span className="text-xs text-muted-foreground font-medium">{a.userName}</span>
                    <span className="text-xs text-muted-foreground">{new Date(a.timestamp).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
