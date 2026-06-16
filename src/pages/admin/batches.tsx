import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBatches, useCreateBatch, useGetCourses } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users, Plus, Calendar, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  description: z.string().min(1, "Description required"),
  courseId: z.string().min(1, "Course required"),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().optional(),
});

export default function AdminBatchesPage() {
  const { data: batches, isLoading, refetch } = useGetBatches();
  const { data: courses } = useGetCourses();
  const createMutation = useCreateBatch();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const form = useForm({ resolver: zodResolver(schema), defaultValues: { name: "", description: "", courseId: "", startDate: "", endDate: "" } });

  function onSubmit(data: z.infer<typeof schema>) {
    createMutation.mutate({ data: { ...data, courseId: parseInt(data.courseId, 10) } }, {
      onSuccess: () => { toast({ title: "Batch created!" }); setOpen(false); form.reset(); refetch(); },
      onError: () => toast({ title: "Failed to create batch", variant: "destructive" }),
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="navy-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-white mb-2">Batches</h1>
            <p className="text-slate-300">Manage student batches and groups</p>
          </div>
          <Button className="gold-gradient text-[hsl(222_47%_11%)] font-semibold" onClick={() => setOpen(true)} data-testid="btn-create-batch">
            <Plus className="w-4 h-4 mr-2" /> Create Batch
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
          </div>
        ) : !batches || batches.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No batches yet</p>
            <Button className="mt-4" onClick={() => setOpen(true)}>Create First Batch</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches.map((batch: any) => (
              <Card key={batch.id} className="border-border hover:shadow-sm transition-all" data-testid={`card-batch-${batch.id}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-foreground">{batch.name}</h3>
                    <Badge variant="outline" className="text-xs">{batch.studentCount} students</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{batch.description}</p>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />{batch.courseName}</p>
                    <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{batch.startDate} {batch.endDate ? `→ ${batch.endDate}` : "(ongoing)"}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Batch</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch Name</FormLabel>
                  <FormControl><Input {...field} placeholder="e.g. Morning Batch - Jan 2026" data-testid="input-batch-name" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Input {...field} placeholder="Batch description" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="courseId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                    <SelectContent>
                      {courses?.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="startDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl><Input {...field} type="date" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="endDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date (optional)</FormLabel>
                    <FormControl><Input {...field} type="date" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Batch"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
