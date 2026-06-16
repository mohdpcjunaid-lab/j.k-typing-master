import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Bookmark, BookOpen, Download, Search, MoonStar, SunMedium, ArrowRight, Languages } from "lucide-react";

const BOOKS = [
  { id: 1, title: "Touch Typing Fundamentals", author: "J.K Editorial", category: "Typing Books", language: "English", excerpt: "Touch typing is the foundation of speed and accuracy...", paragraph: "Touch typing is the foundation of speed and accuracy. By keeping your fingers on the home row and training each finger to reach its assigned keys, you build muscle memory that reduces hesitation and improves consistency. Daily practice with focused drills helps you move from conscious key-finding to fluid, automatic typing." },
  { id: 2, title: "Computer Basics for Learners", author: "Tech Desk", category: "Computer & IT", language: "English", excerpt: "Computers have become essential in modern offices...", paragraph: "Computers have become essential in modern offices, schools, and homes. Understanding file management, keyboard shortcuts, safe browsing, and basic digital security gives learners a strong foundation for professional use. A well-organized workspace and disciplined digital habits can significantly improve productivity." },
  { id: 3, title: "Success Habits Daily Guide", author: "A. Sharma", category: "Self Development", language: "Hindi", excerpt: "सफलता छोटी-छोटी आदतों से बनती है...", paragraph: "सफलता छोटी-छोटी आदतों से बनती है। यदि हम रोज़ समय पर उठें, नियमित अभ्यास करें, और अपने काम को प्राथमिकता दें, तो धीरे-धीरे हमारी कार्यक्षमता बढ़ती है। आत्मविश्वास, अनुशासन और निरंतरता जीवन में आगे बढ़ने के सबसे मजबूत साधन हैं।" },
  { id: 4, title: "Competitive Exam Notes", author: "Study Circle", category: "Competitive Exams", language: "Hindi", excerpt: "प्रतियोगी परीक्षाओं में गति और शुद्धता दोनों आवश्यक हैं...", paragraph: "प्रतियोगी परीक्षाओं में गति और शुद्धता दोनों आवश्यक हैं। अभ्यर्थियों को नियमित रूप से टाइपिंग, पठन और पुनरावृत्ति का अभ्यास करना चाहिए। समय प्रबंधन, ध्यान केंद्रित करना और परीक्षा के प्रारूप को समझना सफलता की कुंजी है।" },
  { id: 5, title: "Urdu Reading Practice", author: "N. Ahmed", category: "Language Learning", language: "Urdu", excerpt: "اردو زبان کی خوبصورتی اس کے ادب میں پوشیدہ ہے...", paragraph: "اردو زبان کی خوبصورتی اس کے ادب میں پوشیدہ ہے۔ اچھی پڑھائی اور باقاعدہ مشق سے زبان پر گرفت مضبوط ہوتی ہے۔ طلبہ کو چاہیے کہ وہ روزانہ چند صفحات پڑھیں اور نئے الفاظ کو لکھ کر یاد کریں۔" },
  { id: 6, title: "Office Typing Manual", author: "Admin Board", category: "Typing Books", language: "English", excerpt: "Official letters must be concise, clear, and correct...", paragraph: "Official letters must be concise, clear, and correct. When drafting office correspondence, the writer should use polite language, accurate references, and a logical sequence of paragraphs. Proper formatting and careful proofreading ensure a professional impression." },
];

const CATEGORIES = ["All", "Typing Books", "Computer & IT", "Self Development", "Competitive Exams", "Language Learning"];
const LANGUAGES = ["All", "English", "Hindi", "Urdu"];

function getStoredBookmarks(): number[] {
  try { return JSON.parse(localStorage.getItem("jktm_bookmarks") ?? "[]"); } catch { return []; }
}

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [language, setLanguage] = useState("All");
  const [reader, setReader] = useState<typeof BOOKS[number] | null>(null);
  const [fontSize, setFontSize] = useState(18);
  const [darkReader, setDarkReader] = useState(false);
  const [bookmarks, setBookmarks] = useState<number[]>(getStoredBookmarks);

  const filtered = useMemo(() => BOOKS.filter(book => {
    const matchesSearch = !search || [book.title, book.author, book.category, book.language].join(" ").toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || book.category === category;
    const matchesLanguage = language === "All" || book.language === language;
    return matchesSearch && matchesCategory && matchesLanguage;
  }), [search, category, language]);

  function toggleBookmark(id: number) {
    const next = bookmarks.includes(id) ? bookmarks.filter(v => v !== id) : [...bookmarks, id];
    setBookmarks(next);
    localStorage.setItem("jktm_bookmarks", JSON.stringify(next));
  }

  function openReader(book: typeof BOOKS[number]) {
    setReader(book);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="navy-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-amber-400" />
            <h1 className="font-display text-4xl font-bold text-white">Digital Library</h1>
          </div>
          <p className="text-slate-300">Search books, read full screen, bookmark pages, and convert reading into typing practice.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        <Card className="border-border">
          <CardContent className="p-5 grid lg:grid-cols-4 gap-3">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search books by name, author, or category" className="pl-10" />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger><SelectValue placeholder="Language" /></SelectTrigger>
              <SelectContent>{LANGUAGES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
            </Select>
          </CardContent>
        </Card>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(book => (
            <Card key={book.id} className="border-border hover:shadow-lg transition-all group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{book.title}</h3>
                    <p className="text-xs text-muted-foreground">by {book.author}</p>
                  </div>
                  <button onClick={() => toggleBookmark(book.id)} className="text-muted-foreground hover:text-primary">
                    <Bookmark className={`w-4 h-4 ${bookmarks.includes(book.id) ? "fill-current text-primary" : ""}`} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">{book.category}</Badge>
                  <Badge variant="outline"><Languages className="w-3 h-3 mr-1" />{book.language}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{book.excerpt}</p>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => openReader(book)}><BookOpen className="w-4 h-4 mr-2" /> Read</Button>
                  <Button variant="outline" className="flex-1"><Download className="w-4 h-4 mr-2" /> Download</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!reader} onOpenChange={(open) => !open && setReader(null)}>
        <DialogContent className={`max-w-5xl ${darkReader ? "bg-slate-950 text-white" : ""}`}>
          {reader && (
            <>
              <DialogHeader>
                <DialogTitle>{reader.title}</DialogTitle>
                <DialogDescription>{reader.author} · {reader.category} · {reader.language}</DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <Button variant="outline" size="sm" onClick={() => setDarkReader(v => !v)}>{darkReader ? <SunMedium className="w-4 h-4 mr-1" /> : <MoonStar className="w-4 h-4 mr-1" />} {darkReader ? "Light" : "Dark"}</Button>
                <Button variant="outline" size="sm" onClick={() => setFontSize(v => Math.max(14, v - 1))}>A-</Button>
                <Button variant="outline" size="sm" onClick={() => setFontSize(v => Math.min(24, v + 1))}>A+</Button>
                <Button variant="outline" size="sm" onClick={() => toggleBookmark(reader.id)}>{bookmarks.includes(reader.id) ? "Bookmarked" : "Bookmark"}</Button>
                <Button className="ml-auto"><ArrowRight className="w-4 h-4 mr-2" /> Read to Type</Button>
              </div>
              <div className="rounded-xl border border-border p-5 max-h-[55vh] overflow-auto" style={{ fontSize, lineHeight: 1.8 }}>
                {reader.paragraph}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
