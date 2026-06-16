import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLogin } from "@workspace/api-client-react";
import { setToken } from "@/lib/auth";
import { Keyboard, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const loginMutation = useLogin();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(data: FormData) {
    loginMutation.mutate({ data }, {
      onSuccess: (res) => {
        setToken(res.token);
        setLocation("/dashboard");
      },
      onError: (err: any) => {
        toast({ title: "Login failed", description: err?.data?.error ?? "Invalid credentials", variant: "destructive" });
      },
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(222_47%_8%)] to-[hsl(222_47%_14%)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl gold-gradient items-center justify-center mb-4 shadow-lg">
            <Keyboard className="w-7 h-7 text-[hsl(222_47%_11%)]" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-slate-400 mt-2 text-sm">Sign in to your J.K Typing Master account</p>
        </div>

        <Card className="bg-[hsl(222_40%_13%)] border-[hsl(222_30%_20%)] shadow-2xl">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 text-sm font-medium">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input {...field} type="email" placeholder="you@example.com" className="pl-10 bg-[hsl(222_35%_17%)] border-[hsl(222_30%_24%)] text-white placeholder:text-slate-600 focus:border-amber-400/50" data-testid="input-email" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 text-sm font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input {...field} type="password" placeholder="••••••••" className="pl-10 bg-[hsl(222_35%_17%)] border-[hsl(222_30%_24%)] text-white placeholder:text-slate-600 focus:border-amber-400/50" data-testid="input-password" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full gold-gradient text-[hsl(222_47%_11%)] font-bold h-11 text-sm" disabled={loginMutation.isPending} data-testid="button-submit">
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
            <p className="text-center text-sm text-slate-500 mt-6">
              No account?{" "}
              <Link href="/register" className="text-amber-400 hover:text-amber-300 font-medium">Register here</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
