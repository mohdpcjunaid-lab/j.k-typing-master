import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCourses } from "@workspace/api-client-react";
import { BookOpen, Search, Users, Clock, ChevronRight } from "lucide-react";

const LEVELS = ["all", "basic", "intermediate", "advanced", "government"];
const LANGUAGES = ["all", "English", "Hindi", "Urdu"];

const levelColors: Record<string, string> = {
  basic: "bg-emerald-100 text-emerald-700",
  intermediate: "bg-blue-100 text-blue-700",
  advanced: "bg-purple-100 text-purple-700",
  government: "bg-amber-100 text-amber-700",
};

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");
  const [language, setLanguage] = useState("all");

  const { data: courses, isLoading } = useGetCourses({
    level: level !== "all" ? (level as any) : undefined,
    language: language !== "all" ? language : undefined,
  });

  const filtered = (courses ?? []).filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="navy-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h1 className="font-display text-4xl font-bold text-white mb-2">Typing Courses</h1>
          <p className="text-slate-300">Choose your learning path — from basics to government exam preparation</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map(l => <SelectItem key={l} value={l}>{l === "all" ? "All Levels" : l.charAt(0).toUpperCase() + l.slice(1)}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map(l => <SelectItem key={l} value={l}>{l === "all" ? "All Languages" : l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No courses found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(course => (
              <Card key={course.id} className="hover:shadow-md transition-all border-border group" data-testid={`card-course-${course.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`text-xs font-medium capitalize ${levelColors[course.level] ?? "bg-gray-100 text-gray-600"}`}>{course.level}</Badge>
                    <span className="text-xs text-muted-foreground">{course.language}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.totalLessons} lessons</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.totalStudents} enrolled</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.durationWeeks}w</span>
                  </div>
                  <Link href={`/courses/${course.id}`}>
                    <Button className="w-full h-9 text-sm" data-testid={`btn-view-course-${course.id}`}>
                      View Course <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
