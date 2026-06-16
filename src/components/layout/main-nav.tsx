import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { clearToken, isLoggedIn } from "@/lib/auth";
import {
  BookOpen, LayoutDashboard, Trophy, FileText, BarChart2, Users, LogOut, Menu, X,
  GraduationCap, Keyboard, Gamepad2, Layers, PenLine, Palette, ChevronLeft
} from "lucide-react";
import { useGetMe } from "@workspace/api-client-react";
import { useTheme, THEMES, type ThemeId } from "@/lib/theme-context";

const publicLinks = [
  { href: "/learn",        label: "Learn",        icon: Layers },
  { href: "/games",        label: "Games",        icon: Gamepad2 },
  { href: "/practice",     label: "Practice",     icon: PenLine },
  { href: "/exams",        label: "Exams",        icon: FileText },
  { href: "/courses",      label: "Courses",      icon: BookOpen },
  { href: "/leaderboard",  label: "Leaderboard",  icon: Trophy },
];

const studentLinks = [
  { href: "/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
  { href: "/learn",        label: "Learn",        icon: Layers },
  { href: "/games",        label: "Games",        icon: Gamepad2 },
  { href: "/practice",     label: "Practice",     icon: PenLine },
  { href: "/courses",      label: "Courses",      icon: BookOpen },
  { href: "/exams",        label: "Exams",        icon: FileText },
  { href: "/progress",     label: "Progress",     icon: BarChart2 },
  { href: "/leaderboard",  label: "Leaderboard",  icon: Trophy },
  { href: "/certificates", label: "Certificates", icon: GraduationCap },
];

const adminLinks = [
  { href: "/admin",              label: "Dashboard",    icon: LayoutDashboard },
  { href: "/admin/students",     label: "Students",     icon: Users },
  { href: "/admin/batches",      label: "Batches",      icon: BookOpen },
  { href: "/admin/exams",        label: "Exams",        icon: FileText },
  { href: "/admin/certificates", label: "Certificates", icon: GraduationCap },
];

// Maps location patterns → back button destination
const BACK_MAP: Record<string, { label: string; href: string }> = {
  "/learn":        { label: "Home",      href: "/" },
  "/games":        { label: "Home",      href: "/" },
  "/practice":     { label: "Home",      href: "/" },
  "/exams":        { label: "Home",      href: "/" },
  "/courses":      { label: "Home",      href: "/" },
  "/leaderboard":  { label: "Home",      href: "/" },
  "/dashboard":    { label: "Home",      href: "/" },
  "/progress":     { label: "Dashboard", href: "/dashboard" },
  "/achievements": { label: "Dashboard", href: "/dashboard" },
  "/certificates": { label: "Dashboard", href: "/dashboard" },
};

function getBackTarget(location: string): { label: string; href: string } | null {
  if (BACK_MAP[location]) return BACK_MAP[location];
  if (location.startsWith("/learn/"))   return { label: "Learning Levels", href: "/learn" };
  if (location.startsWith("/courses/")) return { label: "Courses",         href: "/courses" };
  if (location.startsWith("/lessons/")) return { label: "Course",          href: "/courses" };
  if (location.startsWith("/exams/"))   return { label: "Exams",           href: "/exams" };
  if (location.startsWith("/admin/"))   return { label: "Admin",           href: "/admin" };
  return null;
}

function ThemeSwitcher({ theme, setTheme }: { theme: ThemeId; setTheme: (t: ThemeId) => void }) {
  const [open, setOpen] = useState(false);
  const current = THEMES.find(t => t.id === theme) ?? THEMES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
        title="Change Theme"
      >
        <Palette className="w-3.5 h-3.5" />
        <span className="hidden sm:inline ml-0.5">{current.icon}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-[hsl(222_35%_18%)] bg-[hsl(222_47%_11%)] shadow-xl z-50 p-1.5">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider px-2 py-1.5 font-semibold">Choose Theme</p>
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition-all ${
                  theme === t.id
                    ? "bg-amber-400/10 text-amber-400"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-base flex-shrink-0">{t.icon}</span>
                <div>
                  <p className="font-semibold leading-none">{t.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{t.desc}</p>
                </div>
                {theme === t.id && <span className="ml-auto text-amber-400">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function MainNav() {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const loggedIn = isLoggedIn();
  const { data: user } = useGetMe({ query: { enabled: loggedIn, queryKey: ["auth", "me"] } });

  const isAdmin = user?.role === "admin";
  const links = isAdmin ? adminLinks : loggedIn ? studentLinks : publicLinks;
  const backTarget = getBackTarget(location);

  function handleLogout() {
    clearToken();
    setLocation("/login");
    setMobileOpen(false);
  }

  function isActive(href: string) {
    return location === href || (href !== "/" && location.startsWith(href + "/"));
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[hsl(222_47%_11%)] border-b border-[hsl(222_35%_18%)] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo + contextual back button */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {backTarget && (
                <button
                  onClick={() => setLocation(backTarget.href)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white hover:bg-white/5 px-2 py-1.5 rounded-md transition-all"
                  title={`Back to ${backTarget.label}`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{backTarget.label}</span>
                </button>
              )}
              <Link href="/" className="flex items-center gap-2.5 ml-1">
                <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
                  <Keyboard className="w-4 h-4 text-[hsl(222_47%_11%)]" />
                </div>
                <div className="leading-none hidden sm:block">
                  <span className="font-display text-sm font-bold text-white tracking-tight">J.K</span>
                  <span className="block text-[10px] font-semibold tracking-[0.2em] text-amber-400 uppercase">Typing Master</span>
                </div>
              </Link>
            </div>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-0.5 overflow-x-auto">
              {links.slice(0, 8).map(l => (
                <Link key={l.href} href={l.href}>
                  <button
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                      isActive(l.href) ? "bg-amber-400/10 text-amber-400" : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                    data-testid={`nav-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <l.icon className="w-3.5 h-3.5" />
                    {l.label}
                  </button>
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <ThemeSwitcher theme={theme} setTheme={setTheme} />

              {loggedIn ? (
                <>
                  <div className="hidden md:flex items-center gap-2">
                    <div className="text-right hidden lg:block">
                      <p className="text-xs font-semibold text-white leading-none">{user?.name ?? "Loading..."}</p>
                      <p className="text-[10px] text-amber-400/70 mt-0.5">Lv.{user?.level ?? 1} · {user?.xp ?? 0} XP</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-xs flex-shrink-0">
                      {user?.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-400 hover:text-white hover:bg-white/5 h-8 px-2" title="Logout">
                      <LogOut className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <button className="lg:hidden text-white p-1" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white h-8 text-xs">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="gold-gradient text-[hsl(222_47%_11%)] font-semibold h-8 text-xs hover:opacity-90">Register</Button>
                  </Link>
                  <button className="lg:hidden text-white p-1 ml-1" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[hsl(222_35%_18%)] bg-[hsl(222_47%_8%)] px-4 py-3">
            <div className="grid grid-cols-2 gap-1 mb-3">
              {links.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(l.href) ? "bg-amber-400/10 text-amber-400" : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}>
                    <l.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{l.label}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile theme row */}
            <div className="border-t border-[hsl(222_35%_18%)] pt-2 mb-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 px-1 font-semibold">Theme</p>
              <div className="flex flex-wrap gap-1">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
                      theme === t.id
                        ? "border-amber-400/50 bg-amber-400/10 text-amber-400"
                        : "border-[hsl(222_35%_20%)] text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {loggedIn && (
              <div className="pt-2 border-t border-[hsl(222_35%_18%)] flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white">{user?.name}</p>
                  <p className="text-[10px] text-amber-400/70">Lv.{user?.level} · {user?.xp} XP</p>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-400 hover:text-white">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
