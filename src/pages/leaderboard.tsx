import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLeaderboard, useGetMe } from "@workspace/api-client-react";
import { Trophy, Medal, Star, Zap, Target } from "lucide-react";

const rankColors: Record<number, string> = {
  1: "text-amber-500",
  2: "text-slate-400",
  3: "text-amber-600",
};

const rankBg: Record<number, string> = {
  1: "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800",
  2: "bg-slate-50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-700",
  3: "bg-amber-50/50 dark:bg-amber-900/5 border-amber-100 dark:border-amber-900",
};

export default function LeaderboardPage() {
  const { data: board, isLoading } = useGetLeaderboard({ period: "all-time" });
  const { data: me } = useGetMe();

  const myRank = board?.findIndex((e: any) => e.userId === me?.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="navy-gradient py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h1 className="font-display text-4xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-slate-300">Top typists at J.K Typing Master</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
        {/* My rank */}
        {me && myRank !== undefined && myRank >= 0 && (
          <Card className="mb-6 navy-gradient border-0 text-white">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center font-bold text-[hsl(222_47%_11%)]">
                  #{myRank + 1}
                </div>
                <div>
                  <p className="font-semibold">Your Ranking</p>
                  <p className="text-xs text-slate-300">Keep practicing to climb higher!</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="font-bold">{Math.round((board?.[myRank] as any)?.wpm ?? 0)}</p>
                  <p className="text-xs text-slate-400">WPM</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{me?.xp ?? 0}</p>
                  <p className="text-xs text-slate-400">XP</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
          </div>
        ) : !board || board.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No students on the leaderboard yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {board.map((entry: any, index: number) => {
              const rank = entry.rank ?? index + 1;
              const isMe = entry.userId === me?.id;
              return (
                <Card key={entry.userId} className={`border transition-all ${rankBg[rank] ?? "border-border"} ${isMe ? "ring-2 ring-primary" : ""}`} data-testid={`card-leaderboard-${rank}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${rankColors[rank] ?? "text-muted-foreground"} bg-white dark:bg-card border`}>
                      {rank <= 3 ? <Medal className="w-4 h-4" /> : rank}
                    </div>
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                      {entry.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground truncate">{entry.name}{isMe && <span className="text-xs text-primary ml-1">(You)</span>}</p>
                        {entry.badge && <Badge className="bg-amber-100 text-amber-700 text-xs">{entry.badge}</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">Level {entry.level}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center hidden sm:block">
                        <p className="font-bold text-blue-600">{Math.round(entry.wpm)}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-0.5"><Zap className="w-3 h-3" />WPM</p>
                      </div>
                      <div className="text-center hidden sm:block">
                        <p className="font-bold text-green-600">{Math.round(entry.accuracy)}%</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-0.5"><Target className="w-3 h-3" />Acc</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-amber-600">{entry.xp}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-0.5"><Star className="w-3 h-3" />XP</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
