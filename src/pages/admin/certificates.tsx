import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  useGetStudents,
  useIssueCertificate,
  useBulkIssueCertificates,
  useGetCourses,
} from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  GraduationCap, Plus, Eye, Users, Search,
  CheckCircle2, XCircle, ChevronRight, Layers,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CertificateView } from "@/components/certificate/certificate-view";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

/* ─── Types ─────────────────────────────────────────────────── */
type BulkResultItem = {
  studentId: number;
  studentName: string;
  success: boolean;
  certificate?: any;
  error?: string | null;
};

type IssuedCert = any;

const singleSchema = z.object({
  studentId: z.string().min(1, "Student required"),
  type: z.enum(["course_completion", "exam_pass", "rank"]),
  courseId: z.string().optional(),
});

const CERT_TYPES = [
  { value: "course_completion", label: "Course Completion" },
  { value: "exam_pass",         label: "Exam Pass" },
  { value: "rank",              label: "Merit / Rank" },
] as const;

/* ─── Component ─────────────────────────────────────────────── */
export default function AdminCertificatesPage() {
  const { data: students, isLoading: studentsLoading } = useGetStudents();
  const { data: courses } = useGetCourses();
  const issueMutation = useIssueCertificate();
  const bulkMutation = useBulkIssueCertificates();
  const { toast } = useToast();

  /* dialog state */
  const [singleOpen, setSingleOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkResults, setBulkResults] = useState<BulkResultItem[] | null>(null);
  const [viewCert, setViewCert] = useState<IssuedCert | null>(null);

  /* session-issued certs (both single + bulk) */
  const [issued, setIssued] = useState<IssuedCert[]>([]);

  /* ── Bulk dialog state ── */
  const [bulkSearch, setBulkSearch] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkType, setBulkType] = useState<"course_completion" | "exam_pass" | "rank">("course_completion");
  const [bulkCourseId, setBulkCourseId] = useState<string>("");

  const filteredStudents = useMemo(() =>
    (students ?? []).filter(s =>
      !bulkSearch ||
      s.name.toLowerCase().includes(bulkSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(bulkSearch.toLowerCase())
    ), [students, bulkSearch]);

  function toggleStudent(id: number) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(filteredStudents.map(s => s.id)));
  }

  function clearAll() { setSelected(new Set()); }

  function resetBulkDialog() {
    setBulkSearch("");
    setSelected(new Set());
    setBulkType("course_completion");
    setBulkCourseId("");
    setBulkResults(null);
  }

  /* ── Single issue ── */
  const form = useForm({
    resolver: zodResolver(singleSchema),
    defaultValues: { studentId: "", type: "course_completion" as any, courseId: "" },
  });

  function onSingleSubmit(data: z.infer<typeof singleSchema>) {
    issueMutation.mutate({
      data: {
        studentId: parseInt(data.studentId, 10),
        type: data.type,
        courseId: data.courseId ? parseInt(data.courseId, 10) : undefined,
      }
    }, {
      onSuccess: cert => {
        toast({ title: "Certificate issued!" });
        setIssued(prev => [cert, ...prev]);
        setSingleOpen(false);
        form.reset();
      },
      onError: () => toast({ title: "Failed to issue certificate", variant: "destructive" }),
    });
  }

  /* ── Bulk issue ── */
  function onBulkSubmit() {
    if (selected.size === 0) return;
    bulkMutation.mutate({
      data: {
        students: Array.from(selected).map(id => ({ studentId: id })),
        type: bulkType,
        courseId: bulkCourseId ? parseInt(bulkCourseId, 10) : undefined,
      }
    }, {
      onSuccess: result => {
        setBulkResults(result.results);
        const newCerts = result.results.filter(r => r.success && r.certificate).map(r => r.certificate);
        setIssued(prev => [...newCerts, ...prev]);
        toast({
          title: `Bulk issue complete: ${result.succeeded}/${result.total} succeeded`,
          variant: result.failed > 0 ? "destructive" : "default",
        });
      },
      onError: () => toast({ title: "Bulk issue failed", variant: "destructive" }),
    });
  }

  /* ── Helpers ── */
  const typeLabel = (t: string) => CERT_TYPES.find(c => c.value === t)?.label ?? t;

  /* ═══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="navy-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold text-white mb-2">Certificates</h1>
            <p className="text-slate-300">Issue and manage official certificates for your students</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-semibold"
              onClick={() => { resetBulkDialog(); setBulkOpen(true); }}
              data-testid="btn-bulk-issue"
            >
              <Layers className="w-4 h-4 mr-2" /> Bulk Issue
            </Button>
            <Button
              className="gold-gradient text-[hsl(222_47%_11%)] font-semibold"
              onClick={() => setSingleOpen(true)}
              data-testid="btn-issue-certificate"
            >
              <Plus className="w-4 h-4 mr-2" /> Issue Single
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {issued.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="font-medium text-lg mb-2">No certificates issued this session</p>
            <p className="text-sm mb-6">Issue certificates individually or select multiple students for bulk issue</p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => { resetBulkDialog(); setBulkOpen(true); }}>
                <Layers className="w-4 h-4 mr-2" /> Bulk Issue
              </Button>
              <Button onClick={() => setSingleOpen(true)}>Issue Single</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Issued This Session ({issued.length})</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {issued.map((cert: IssuedCert) => (
                <Card key={cert.id} className="border-amber-200 dark:border-amber-800" data-testid={`card-issued-cert-${cert.id}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className="bg-amber-100 text-amber-700 text-xs">{typeLabel(cert.type)}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(cert.issuedAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{cert.studentName}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{cert.courseName ?? cert.examName ?? "Certificate"}</p>
                    <p className="text-xs font-mono text-amber-600 mb-3 break-all">{cert.uniqueId}</p>
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => setViewCert(cert)}>
                      <Eye className="w-3.5 h-3.5 mr-1" /> View Certificate
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Single Issue Dialog ── */}
      <Dialog open={singleOpen} onOpenChange={setSingleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Certificate</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSingleSubmit)} className="space-y-4">
              <FormField control={form.control} name="studentId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Student</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                    <SelectContent>
                      {(students ?? []).map((s: any) =>
                        <SelectItem key={s.id} value={String(s.id)}>{s.name} — {s.email}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CERT_TYPES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="courseId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Course (optional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select course (optional)" /></SelectTrigger>
                    <SelectContent>
                      {(courses ?? []).map(c => <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={issueMutation.isPending}>
                {issueMutation.isPending ? "Issuing..." : "Issue Certificate"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ── Bulk Issue Dialog ── */}
      <Dialog open={bulkOpen} onOpenChange={open => { if (!open) resetBulkDialog(); setBulkOpen(open); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              Bulk Issue Certificates
            </DialogTitle>
          </DialogHeader>

          {/* After results */}
          {bulkResults ? (
            <div className="flex-1 overflow-y-auto space-y-4 py-2">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{bulkResults.length}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{bulkResults.filter(r => r.success).length}</p>
                  <p className="text-xs text-muted-foreground">Succeeded</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-red-500">{bulkResults.filter(r => !r.success).length}</p>
                  <p className="text-xs text-muted-foreground">Failed</p>
                </div>
              </div>
              <Progress
                value={(bulkResults.filter(r => r.success).length / bulkResults.length) * 100}
                className="h-2"
              />

              {/* Per-student results */}
              <div className="space-y-2">
                {bulkResults.map(r => (
                  <div
                    key={r.studentId}
                    className={`flex items-center justify-between p-3 rounded-lg border text-sm ${
                      r.success
                        ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800"
                        : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {r.success
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        : <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                      <div>
                        <p className="font-medium text-foreground">{r.studentName}</p>
                        {r.error && <p className="text-xs text-red-500">{r.error}</p>}
                        {r.certificate && (
                          <p className="text-xs text-muted-foreground font-mono">{r.certificate.uniqueId}</p>
                        )}
                      </div>
                    </div>
                    {r.certificate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs flex-shrink-0"
                        onClick={() => setViewCert(r.certificate)}
                      >
                        <Eye className="w-3 h-3 mr-1" /> View
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button className="w-full" onClick={() => { resetBulkDialog(); setBulkOpen(false); }}>
                Done
              </Button>
            </div>
          ) : (
            /* Selection UI */
            <div className="flex-1 overflow-hidden flex flex-col gap-4 py-2">
              {/* Type + course */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Certificate Type</p>
                  <Select value={bulkType} onValueChange={v => setBulkType(v as typeof bulkType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CERT_TYPES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Course (optional)</p>
                  <Select value={bulkCourseId} onValueChange={setBulkCourseId}>
                    <SelectTrigger><SelectValue placeholder="No course" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {(courses ?? []).map(c => <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Student search + select all */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search students…"
                    value={bulkSearch}
                    onChange={e => setBulkSearch(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-9" onClick={selectAll}>All</Button>
                <Button variant="ghost" size="sm" className="text-xs h-9" onClick={clearAll}>None</Button>
                <Badge variant={selected.size > 0 ? "default" : "outline"} className="text-xs">
                  {selected.size} selected
                </Badge>
              </div>

              {/* Scrollable student list */}
              <div className="flex-1 overflow-y-auto border border-border rounded-lg divide-y divide-border min-h-0" style={{ maxHeight: 320 }}>
                {studentsLoading ? (
                  <div className="p-4 space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 rounded" />)}
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    No students found
                  </div>
                ) : (
                  filteredStudents.map(s => (
                    <label
                      key={s.id}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                        selected.has(s.id) ? "bg-primary/5" : ""
                      }`}
                    >
                      <Checkbox
                        checked={selected.has(s.id)}
                        onCheckedChange={() => toggleStudent(s.id)}
                        className="flex-shrink-0"
                      />
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                        {s.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs text-muted-foreground">Lv.{s.level}</p>
                        <p className="text-xs text-blue-500">{Math.round(s.bestWpm)} WPM</p>
                      </div>
                    </label>
                  ))
                )}
              </div>

              <Button
                className="w-full gold-gradient text-[hsl(222_47%_11%)] font-bold"
                disabled={selected.size === 0 || bulkMutation.isPending}
                onClick={onBulkSubmit}
                data-testid="btn-bulk-submit"
              >
                {bulkMutation.isPending ? (
                  <>Issuing {selected.size} certificates…</>
                ) : (
                  <><ChevronRight className="w-4 h-4 mr-1" /> Issue {selected.size} Certificate{selected.size !== 1 ? "s" : ""}</>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Certificate preview dialog */}
      {viewCert && (
        <Dialog open={!!viewCert} onOpenChange={() => setViewCert(null)}>
          <DialogContent className="max-w-4xl p-0">
            <DialogHeader className="sr-only">
              <DialogTitle>Certificate</DialogTitle>
            </DialogHeader>
            <CertificateView certificate={viewCert} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
