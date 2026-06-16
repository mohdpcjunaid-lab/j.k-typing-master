import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetCourses } from "@workspace/api-client-react";
import { BookOpen, Award, Trophy, Shield, Zap, Users, ChevronRight, GraduationCap, Flame, LibraryBig, Gamepad2, PenLine, FileText, Brain, TrendingUp, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { isLoggedIn } from "@/lib/auth";

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

const quickLinks = [
  { href: "/learn", label: "Learn Typing", icon: BookOpen, desc: "Step-by-step mastery" },
  { href: "/practice", label: "Practice Typing", icon: PenLine, desc: "Custom drills & exams" },
  { href: "/games", label: "Typing Games", icon: Gamepad2, desc: "Fun speed training" },
  { href: "/exams", label: "Exam Mode", icon: FileText, desc: "Government-style tests" },
  { href: "/courses", label: "Courses", icon: GraduationCap, desc: "Structured learning paths" },
  { href: "/library", label: "Library", icon: LibraryBig, desc: "Books & read-to-type" },
];

const recentActivity = [
  { label: "Last practice", value: "Typing accuracy drill", meta: "2 hours ago" },
  { label: "Last game", value: "Word Rush", meta: "Yesterday" },
  { label: "Last exam", value: "SSC typing passage", meta: "3 days ago" },
];

export default function HomePage() {
  const { data: courses } = useGetCourses();
  const loggedIn = isLoggedIn();

  const stats = [
    { label: "Active Students", value: "10,000+", icon: Users },
    { label: "Courses Available", value: "12+", icon: BookOpen },
    { label: "Certificates Issued", value: "5,000+", icon: Award },
    { label: "Avg WPM Achieved", value: "65+", icon: Zap },
  ];

  const features = [
    { title: "Stage-Based Learning", desc: "5-stage progression from home row keys to full keyboard mastery.", icon: BookOpen },
    { title: "Government Exam Prep", desc: "SSC, Court, and Office typing exams with real simulation environments.", icon: Shield },
    { title: "Official Certification", desc: "Authority-grade certificates with QR verification and unique IDs.", icon: Award },
    { title: "Gamified Progress", desc: "XP points, levels, badges, streaks, and leaderboards.", icon: Trophy },
    { title: "Adaptive Learning", desc: "The system identifies your weak keys and personalizes lessons.", icon: Brain },
    { title: "Multi-Language Support", desc: "English, Hindi, Urdu, and more — each with dedicated content.", icon: GraduationCap },
  ];

  return (
    <div className="min-h-screen">
      <section className="navy-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,.05) 40px, rgba(255,255,255,.05) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,.05) 40px, rgba(255,255,255,.05) 41px)" }} />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <motion.div {...fadeIn} className="mb-4">
              <Badge className="bg-amber-400/10 text-amber-400 border border-amber-400/20 text-xs font-medium tracking-wider uppercase px-3 py-1">
                India's Premier Digital Typing Institute
              </Badge>
            </motion.div>
            <motion.h1 {...fadeIn} transition={{ delay: 0.1, duration: 0.6 }} className="font-display text-5xl md:text-7xl font-bold text-white leading-none mb-5">
              J.K<br /><span className="gold-text">Typing Master</span>
            </motion.h1>
            <motion.p {...fadeIn} transition={{ delay: 0.2, duration: 0.6 }} className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
              A complete typing ecosystem — learn, practice, play, pass exams, and read from a digital library.
            </motion.p>
            <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 flex-wrap">
              <Link href={loggedIn ? "/dashboard" : "/register"}>
                <Button size="lg" className="gold-gradient text-[hsl(222_47%_11%)] font-bold text-base h-12 px-8 hover:opacity-90 shadow-lg">
                  {loggedIn ? "Go to Dashboard" : "Start Learning Free"} <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/library">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 h-12 px-8 text-base">
                  Open Library
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="flex justify-center mb-2"><stat.icon className="w-6 h-6 text-amber-500" /></div>
                <p className="text-3xl font-bold text-primary font-display">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">Quick Access</h2>
              <p className="text-muted-foreground">Jump into any core area of the platform</p>
            </div>
            <Link href="/library">
              <Button variant="outline" className="hidden sm:flex">Library <ChevronRight className="ml-1 w-4 h-4" /></Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((item, i) => (
              <motion.div key={item.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={item.href}>
                  <Card className="group h-full border-border hover:shadow-lg transition-all cursor-pointer overflow-hidden">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.label}</h3>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="border-border lg:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Performance Overview</p>
                    <h3 className="text-2xl font-bold text-foreground">Current progress</h3>
                  </div>
                  <TrendingUp className="w-8 h-8 text-emerald-500" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4 mb-5">
                  <div className="rounded-xl border border-border p-4 bg-background"><p className="text-xs text-muted-foreground">Current WPM</p><p className="text-3xl font-bold text-primary">68</p></div>
                  <div className="rounded-xl border border-border p-4 bg-background"><p className="text-xs text-muted-foreground">Accuracy</p><p className="text-3xl font-bold text-emerald-600">96%</p></div>
                  <div className="rounded-xl border border-border p-4 bg-background"><p className="text-xs text-muted-foreground">Last Test</p><p className="text-2xl font-bold text-foreground">82 WPM</p></div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-2"><span>Weekly goal</span><span>78%</span></div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full w-[78%] bg-gradient-to-r from-amber-400 to-orange-500" /></div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Keep practicing daily to unlock your next badge.</div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Daily Challenge</p>
                    <h3 className="text-xl font-bold text-foreground">Speed burst</h3>
                  </div>
                  <Flame className="w-7 h-7 text-amber-500" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">Type the following without mistakes:</p>
                <div className="rounded-lg border border-dashed border-border bg-background p-3 font-mono text-sm mb-4">The quick brown fox jumps over the lazy dog.</div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4"><span>Reward</span><span>+25 XP · Flame Badge</span></div>
                <Button className="w-full gold-gradient text-[hsl(222_47%_11%)] font-bold">Start Challenge</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardContent className="p-6">
              <h3 className="font-display text-2xl font-bold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map(item => (
                  <div key={item.label} className="flex items-center justify-between rounded-lg border border-border p-3 bg-muted/20">
                    <div>
                      <p className="font-medium text-foreground text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.value}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.meta}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-6">
              <h3 className="font-display text-2xl font-bold mb-4">Continue Learning</h3>
              <p className="text-sm text-muted-foreground mb-4">Resume your last lesson and stay on track.</p>
              <Link href="/learn/english/1"><Button className="w-full h-11 gold-gradient text-[hsl(222_47%_11%)] font-bold">Resume Last Lesson</Button></Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary mb-4">Everything You Need to Master Typing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">A complete ecosystem — from beginner lessons to government exam certification.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Card className="h-full hover:shadow-md transition-shadow border-border">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center mb-4">
                      <f.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {courses && courses.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl font-bold text-primary">Available Courses</h2>
                <p className="text-muted-foreground mt-1">Choose your learning path</p>
              </div>
              <Link href="/courses"><Button variant="outline">View All <ChevronRight className="ml-1 w-4 h-4" /></Button></Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 3).map(course => (
                <Card key={course.id} className="hover:shadow-md transition-all border-border group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={`text-xs font-medium capitalize ${course.level}`}>{course.level}</Badge>
                      <span className="text-xs text-muted-foreground">{course.durationWeeks}w</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{course.totalLessons} lessons</span>
                      <span>{course.totalStudents} students</span>
                    </div>
                    <Link href={`/courses/${course.id}`}><Button className="w-full mt-4 h-8 text-sm">View Course</Button></Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="navy-gradient py-20">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Ready to Earn Your <span className="gold-text">Certificate?</span></h2>
          <p className="text-slate-300 mb-8">Join thousands of students who have transformed their typing skills with J.K Typing Master.</p>
          <Link href="/register"><Button size="lg" className="gold-gradient text-[hsl(222_47%_11%)] font-bold h-12 px-10">Enroll Today — It's Free</Button></Link>
        </div>
      </section>
    </div>
  );
}
