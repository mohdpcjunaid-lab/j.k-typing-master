import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetStudents } from "@workspace/api-client-react";
import { Users, Search, GraduationCap, BookOpen, Trophy, Zap } from "lucide-react";

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");
  const { data: students, isLoading } = useGetStudents();

  const filtered = (students ?? []).filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="navy-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h1 className="font-display text-4xl font-bold text-white mb-2">Students</h1>
          <p className="text-slate-300">Manage all enrolled students</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search students..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Badge variant="outline">{filtered.length} students</Badge>
        </div>

        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No students found</p>
          </div>
        ) : (
          <Card className="border-border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Level / XP</TableHead>
                    <TableHead className="hidden sm:table-cell">Best WPM</TableHead>
                    <TableHead className="hidden md:table-cell">Courses</TableHead>
                    <TableHead className="hidden md:table-cell">Exams</TableHead>
                    <TableHead className="hidden lg:table-cell">Certificates</TableHead>
                    <TableHead className="hidden lg:table-cell">Batch</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(student => (
                    <TableRow key={student.id} data-testid={`row-student-${student.id}`}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {student.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-foreground">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <span className="font-bold text-primary">Lv.{student.level}</span>
                          <span className="text-muted-foreground text-xs">· {student.xp} XP</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-sm font-medium text-blue-600 flex items-center gap-1"><Zap className="w-3 h-3" />{Math.round(student.bestWpm)} WPM</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{student.coursesEnrolled}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{student.totalExamsTaken}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{student.certificatesEarned}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{student.batchName ?? <span className="text-muted-foreground">–</span>}</TableCell>
                      <TableCell>
                        <Link href={`/admin/students/${student.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" data-testid={`btn-view-student-${student.id}`}>
                            View <GraduationCap className="w-3 h-3" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
