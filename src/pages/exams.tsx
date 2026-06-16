import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetExams } from "@workspace/api-client-react";
import { FileText, Target, Clock, CheckCircle, ChevronRight, Shield } from "lucide-react";

const examTypeColors: Record<string, string> = {
  ssc: "bg-blue-100 text-blue-700",
  court: "bg-purple-100 text-purple-700",
  office: "bg-emerald-100 text-emerald-700",
  practice: "bg-slate-100 text-slate-700",
};

const examTypeIcons: Record<string, React.ReactNode> = {
  ssc: <Shield className="w-4 h-4" />,
  court: <Shield className="w-4 h-4" />,
  office: <FileText className="w-4 h-4" />,
  practice: <Target className="w-4 h-4" />,
};

export default function ExamsPage() {
  const [type, setType] = useState("all");
  const { data: exams, isLoading } = useGetExams({ type: type !== "all" ? (type as any) : undefined });

  return (
    <div className="min-h-screen bg-background">
      <div className="navy-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h1 className="font-display text-4xl font-bold text-white mb-2">Exam Center</h1>
          <p className="text-slate-300">Official typing exams — SSC, Court, Office, and Practice</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">Government-grade simulation</Badge>
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Exam type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="ssc">SSC</SelectItem>
              <SelectItem value="court">Court</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="practice">Practice</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
          </div>
        ) : !exams || exams.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No exams available right now</p>
            <p className="text-sm mt-1">Check back soon for upcoming exams</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {exams.map(exam => (
              <Card key={exam.id} className="hover:shadow-md transition-all border-border group" data-testid={`card-exam-${exam.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs font-medium uppercase ${examTypeColors[exam.type] ?? ""}`}>
                        <span className="mr-1">{examTypeIcons[exam.type]}</span>
                        {exam.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{exam.status}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{exam.language}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{exam.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{exam.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{exam.durationMinutes} min</span>
                    <span className="flex items-center gap-1"><Target className="w-3 h-3" />{exam.targetWpm} WPM target</span>
                    <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />{exam.targetAccuracy}% accuracy</span>
                    <span className="flex items-center gap-1">Pass: {exam.passMarkPercent}%</span>
                  </div>
                  <Link href={`/exams/${exam.id}`}>
                    <Button className="w-full h-9 text-sm" disabled={exam.status !== "live"} data-testid={`btn-take-exam-${exam.id}`}>
                      {exam.status === "live" ? <>Take Exam <ChevronRight className="w-3.5 h-3.5 ml-1" /></> : "Not Available"}
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
