import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import { isLoggedIn, getToken } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme-context";
import { AnimatedBackground } from "@/components/layout/animated-bg";
import { MainNav } from "@/components/layout/main-nav";

import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import DashboardPage from "@/pages/dashboard";
import CoursesPage from "@/pages/courses";
import CourseDetailPage from "@/pages/course-detail";
import LessonPage from "@/pages/lesson";
import ExamsPage from "@/pages/exams";
import ExamDetailPage from "@/pages/exam-detail";
import ProgressPage from "@/pages/progress";
import LeaderboardPage from "@/pages/leaderboard";
import AchievementsPage from "@/pages/achievements";
import CertificatesPage from "@/pages/certificates";
import GamesPage from "@/pages/games";
import LearnPage from "@/pages/learn";
import LearnLevelPage from "@/pages/learn-level";
import CustomPracticePage from "@/pages/custom-practice";
import LibraryPage from "@/pages/library";
import AdminDashboardPage from "@/pages/admin/dashboard";
import AdminStudentsPage from "@/pages/admin/students";
import AdminBatchesPage from "@/pages/admin/batches";
import AdminExamsPage from "@/pages/admin/exams";
import AdminCertificatesPage from "@/pages/admin/certificates";
import AdminStudentDetailPage from "@/pages/admin/student-detail";

function parseRole(): string | null {
  try {
    const token = getToken();
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.role ?? null;
  } catch {
    return null;
  }
}

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 30_000 } } });

function WithNav({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen relative z-10">
      <MainNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType; adminOnly?: boolean }) {
  const [, setLocation] = useLocation();
  const loggedIn = isLoggedIn();
  const role = parseRole();

  useEffect(() => {
    if (!loggedIn) setLocation("/login");
    else if (adminOnly && role !== "admin") setLocation("/dashboard");
  }, [loggedIn, role]);

  if (!loggedIn) return null;
  if (adminOnly && role !== "admin") return null;

  return <WithNav><Component /></WithNav>;
}

function PublicRoute({ component: Component }: { component: React.ComponentType }) {
  return <WithNav><Component /></WithNav>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <PublicRoute component={HomePage} />} />
      <Route path="/login" component={() => <PublicRoute component={LoginPage} />} />
      <Route path="/register" component={() => <PublicRoute component={RegisterPage} />} />

      <Route path="/courses" component={() => <ProtectedRoute component={CoursesPage} />} />
      <Route path="/courses/:courseId" component={() => <ProtectedRoute component={CourseDetailPage} />} />
      <Route path="/lessons/:lessonId" component={() => <ProtectedRoute component={LessonPage} />} />
      <Route path="/exams" component={() => <ProtectedRoute component={ExamsPage} />} />
      <Route path="/exams/:examId" component={() => <ProtectedRoute component={ExamDetailPage} />} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={DashboardPage} />} />
      <Route path="/progress" component={() => <ProtectedRoute component={ProgressPage} />} />
      <Route path="/leaderboard" component={() => <PublicRoute component={LeaderboardPage} />} />
      <Route path="/achievements" component={() => <ProtectedRoute component={AchievementsPage} />} />
      <Route path="/certificates" component={() => <ProtectedRoute component={CertificatesPage} />} />

      <Route path="/games" component={() => <PublicRoute component={GamesPage} />} />
      <Route path="/learn" component={() => <PublicRoute component={LearnPage} />} />
      <Route path="/learn/:language/:level" component={() => <PublicRoute component={LearnLevelPage} />} />
      <Route path="/practice" component={() => <PublicRoute component={CustomPracticePage} />} />
      <Route path="/library" component={() => <PublicRoute component={LibraryPage} />} />

      <Route path="/admin" component={() => <ProtectedRoute component={AdminDashboardPage} adminOnly />} />
      <Route path="/admin/students" component={() => <ProtectedRoute component={AdminStudentsPage} adminOnly />} />
      <Route path="/admin/students/:id" component={() => <ProtectedRoute component={AdminStudentDetailPage} adminOnly />} />
      <Route path="/admin/batches" component={() => <ProtectedRoute component={AdminBatchesPage} adminOnly />} />
      <Route path="/admin/exams" component={() => <ProtectedRoute component={AdminExamsPage} adminOnly />} />
      <Route path="/admin/certificates" component={() => <ProtectedRoute component={AdminCertificatesPage} adminOnly />} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AnimatedBackground />
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
