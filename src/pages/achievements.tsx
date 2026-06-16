import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyAchievements } from "@workspace/api-client-react";
import { Award, Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categoryColors: Record<string, string> = {
  speed: "bg-blue-100 text-blue-700",
  accuracy: "bg-green-100 text-green-700",
  streak: "bg-orange-100 text-orange-700",
  completion: "bg-purple-100 text-purple-700",
  exam: "bg-red-100 text-red-700",
};

export default function AchievementsPage() {
  const { data, isLoading } = useGetMyAchievements();

  const earned = data?.earned ?? [];
  const locked = data?.locked ?? [];
  const totalXp = data?.totalXpFromAchievements ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="navy-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Award className="w-10 h-10 text-amber-400" />
            <div>
              <h1 className="font-display text-4xl font-bold text-white">Achievements</h1>
              <p className="text-slate-300">{earned.length} earned · {totalXp} XP from achievements</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <Tabs defaultValue="earned">
          <TabsList className="mb-6">
            <TabsTrigger value="earned">Earned ({earned.length})</TabsTrigger>
            <TabsTrigger value="locked">Locked ({locked.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="earned">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
              </div>
            ) : earned.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Award className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-medium">No achievements yet</p>
                <p className="text-sm mt-1">Complete lessons and exams to earn your first achievement!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {earned.map(a => (
                  <Card key={a.id} className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/5" data-testid={`card-achievement-${a.id}`}>
                    <CardContent className="p-4 flex items-start gap-3">
                      <div className="text-3xl">{a.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm text-foreground">{a.title}</p>
                          <Badge className={`text-xs ${categoryColors[a.category] ?? ""}`}>{a.category}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{a.description}</p>
                        <p className="text-xs text-amber-600 font-medium mt-1">+{a.xpReward} XP</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="locked">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)
              ) : locked.map(a => (
                <Card key={a.id} className="border-border opacity-60" data-testid={`card-locked-achievement-${a.id}`}>
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="text-3xl grayscale">{a.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm text-foreground">{a.title}</p>
                        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground">{a.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">+{a.xpReward} XP</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
