import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetExams, useCreateExam } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, Plus, Clock, Target, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_TEXT = "The quick brown fox jumps over the lazy dog. A good typist can type at least forty words per minute with high accuracy. Practice makes perfect and consistency is the key to improvement in any skill. Keep your fingers on the home row and use the correct finger for each key.";

const schema = z.object({
  title: z.string().min(2),
  type: z.enum(["ssc", "court", "office", "practice"]),
  description: z.string().min(2),
  durationMinutes: z.coerce.number().min(1),
  targetWpm: z.coerce.number().min(10),
  targetAccuracy: z.coerce.number().min(50).max(100),
  passMarkPercent: z.coerce.number().min(1).max(100),
  text: z.string().min(50),
  language: z.string().min(1),
});

const examTypeColors: Record<string, string> = {
  ssc: "bg-blue-100 text-blue-700",
  court: "bg-purple-100 text-purple-700",
  office: "bg-emerald-100 text-emerald-700",
  practice: "bg-slate-100 text-slate-700",
};

export default function AdminExamsPage() {
  const { data: exams, isLoading, refetch } = useGetExams();
  const createMutation = useCreateExam();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: "", type: "practice" as any, description: "", durationMinutes: 10, targetWpm: 30, targetAccuracy: 85, passMarkPercent: 60, text: DEFAULT_TEXT, language: "English" },
  });

  function onSubmit(data: z.infer<typeof schema>) {
    createMutation.mutate({ data }, {
      onSuccess: () => { toast({ title: "Exam created!" }); setOpen(false); form.reset(); refetch(); },
      onError: () => toast({ title: "Failed to create exam", variant: "destructive" }),
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="navy-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-white mb-2">Exam Management</h1>
            <p className="text-slate-300">Create and manage typing exams</p>
          </div>
          <Button className="gold-gradient text-[hsl(222_47%_11%)] font-semibold" onClick={() => setOpen(true)} data-testid="btn-create-exam">
            <Plus className="w-4 h-4 mr-2" /> Create Exam
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
          </div>
        ) : !exams || exams.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No exams yet</p>
            <Button className="mt-4" onClick={() => setOpen(true)}>Create First Exam</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {exams.map((exam: any) => (
              <Card key={exam.id} className="border-border hover:shadow-sm transition-all" data-testid={`card-exam-${exam.id}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={`uppercase text-xs ${examTypeColors[exam.type] ?? ""}`}>{exam.type}</Badge>
                      <Badge variant="outline" className="text-xs">{exam.status}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{exam.language}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{exam.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{exam.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{exam.durationMinutes}min</span>
                    <span className="flex items-center gap-1"><Target className="w-3 h-3" />{exam.targetWpm} WPM</span>
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" />{exam.targetAccuracy}% acc</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link href={`/exams/${exam.id}`}>
                      <Button variant="outline" size="sm" className="h-7 text-xs" data-testid={`btn-view-exam-${exam.id}`}>View</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Exam</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl><Input {...field} placeholder="SSC Typing Exam 2026" data-testid="input-exam-title" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ssc">SSC</SelectItem>
                        <SelectItem value="court">Court</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="practice">Practice</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="language" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="Urdu">Urdu</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Input {...field} placeholder="Exam description" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="durationMinutes" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (min)</FormLabel>
                    <FormControl><Input {...field} type="number" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="targetWpm" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target WPM</FormLabel>
                    <FormControl><Input {...field} type="number" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="targetAccuracy" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Accuracy %</FormLabel>
                    <FormControl><Input {...field} type="number" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="passMarkPercent" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pass Mark %</FormLabel>
                    <FormControl><Input {...field} type="number" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="text" render={({ field }) => (
                <FormItem>
                  <FormLabel>Typing Text</FormLabel>
                  <FormControl><Textarea {...field} rows={5} placeholder="The text students will type..." className="font-mono text-sm" data-testid="textarea-exam-text" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Exam"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
