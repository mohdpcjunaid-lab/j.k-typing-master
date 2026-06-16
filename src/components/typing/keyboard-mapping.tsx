import { useState } from "react";
import type { Language } from "@/lib/content-pool";
import { ChevronDown, ChevronUp, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── INSCRIPT Hindi (Mangal/Unicode) keyboard layout ─────────────────────────
// Each array: [unshifted, shifted]
const INSCRIPT_MAP: [string, string][][] = [
  // Number row
  [["़","़"],["1","1"],["2","2"],["3","3"],["4","4"],["5","5"],["6","6"],["7","7"],["8","8"],["9","9"],["0","0"],["-","-"],["=","="]],
  // QWERTY row
  [["ौ","ओ"],["ै","ऐ"],["ा","आ"],["ी","ई"],["ू","ऊ"],["ब","भ"],["ह","ङ"],["ग","घ"],["द","ध"],["ज","झ"],["ड","ढ"],["़","ञ"],["\\","ण"]],
  // Home row
  [["ो","ओ"],["े","ए"],["् ","अ"],["ि","इ"],["ु","उ"],["प","फ"],["र","ड़"],["क","ख"],["त","थ"],["च","छ"],["ट","ठ"]],
  // Bottom row
  [["्","ॅ"],["ं","ः"],["म","ण"],["न","ञ"],["व","ँ"],["ल","ळ"],["स","श"],["्","।"],["।","…"],["य","य"]],
];

const INSCRIPT_KEYS = ["q","w","e","r","t","y","u","i","o","p","[","]","\\",
                       "a","s","d","f","g","h","j","k","l",";","'",
                       "z","x","c","v","b","n","m",",",".","/"  ];

// ─── Kruti Dev 010 keyboard map ──────────────────────────────────────────────
const KRUTI_MAP: { key: string; char: string; shifted?: string }[] = [
  { key: "q", char: "ध" }, { key: "w", char: "ड" }, { key: "e", char: "म" }, { key: "r", char: "ा" }, { key: "t", char: "ल" },
  { key: "y", char: "ब" }, { key: "u", char: "स" }, { key: "i", char: "व" }, { key: "o", char: "त" }, { key: "p", char: "य" },
  { key: "a", char: "ो" }, { key: "s", char: "ु" }, { key: "d", char: "ि" }, { key: "f", char: "ह" }, { key: "g", char: "अ" },
  { key: "h", char: "ए", shifted: "इ" }, { key: "j", char: "क" }, { key: "k", char: "ख" }, { key: "l", char: "ग", shifted: "घ" },
  { key: "z", char: "ॉ" }, { key: "x", char: "ं" }, { key: "c", char: "न" }, { key: "v", char: "प" }, { key: "b", char: "र" },
  { key: "n", char: "ज" }, { key: "m", char: "श" }, { key: ",", char: "," }, { key: ".", char: "।" },
  { key: "Q", char: "ध्" }, { key: "W", char: "ड़" }, { key: "E", char: "म्" }, { key: "R", char: "आ" }, { key: "T", char: "ल्" },
  { key: "Y", char: "भ" }, { key: "U", char: "स्" }, { key: "I", char: "व्" }, { key: "O", char: "त्" }, { key: "P", char: "य्" },
  { key: "A", char: "ौ" }, { key: "S", char: "ू" }, { key: "D", char: "ी" }, { key: "F", char: "ह्" }, { key: "G", char: "ए" },
  { key: "H", char: "ऐ" }, { key: "J", char: "क्" }, { key: "K", char: "ख्" }, { key: "L", char: "ग्" },
  { key: "Z", char: "ॅ" }, { key: "X", char: "ः" }, { key: "C", char: "ण" }, { key: "V", char: "फ" }, { key: "B", char: "ऋ" },
  { key: "N", char: "ञ" }, { key: "M", char: "ष" },
];

// ─── QWERTY row display helper for Latin scripts ─────────────────────────────
const QWERTY_ROWS = [
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["z","x","c","v","b","n","m"],
];

type MapVariant = "mangal" | "krutidev";

interface Props {
  language: Language;
}

export function KeyboardMappingGuide({ language }: Props) {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState<MapVariant>("mangal");

  const isNonLatin = ["hindi", "urdu", "arabic", "bengali", "tamil", "marathi"].includes(language);
  const isHindi = language === "hindi";
  const isUrdu  = language === "urdu";
  const isArabic= language === "arabic";

  // For Latin scripts just show a brief note
  if (!isNonLatin) return null;

  const rowLabels = ["QWERTY Row", "Home Row (ASDF)", "Bottom Row (ZXCV)"];

  return (
    <div className="border border-amber-200 dark:border-amber-800 rounded-xl overflow-hidden bg-amber-50 dark:bg-amber-950/20">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <span className="flex items-center gap-2">
          <Keyboard className="w-4 h-4" />
          Keyboard Mapping Guide
          {isHindi && (
            <span className="text-[10px] font-normal bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded">
              {variant === "mangal" ? "Mangal (INSCRIPT)" : "Kruti Dev 010"}
            </span>
          )}
        </span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4">
          {/* Hindi variant toggle */}
          {isHindi && (
            <div className="flex gap-2 mt-1">
              <Button
                size="sm"
                variant={variant === "mangal" ? "default" : "outline"}
                className="h-7 text-xs"
                onClick={() => setVariant("mangal")}
              >🔵 Mangal (Unicode)</Button>
              <Button
                size="sm"
                variant={variant === "krutidev" ? "default" : "outline"}
                className="h-7 text-xs"
                onClick={() => setVariant("krutidev")}
              >🟠 Kruti Dev 010</Button>
            </div>
          )}

          {/* Urdu / Arabic — show informational guide */}
          {(isUrdu || isArabic) && (
            <UrduArabicGuide language={language} />
          )}

          {/* Hindi Mangal (INSCRIPT) */}
          {isHindi && variant === "mangal" && (
            <div className="space-y-3">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Uses the <strong>INSCRIPT</strong> keyboard layout (standard for Mangal Unicode Hindi).
                Each key shows: <span className="bg-white dark:bg-gray-800 px-1 rounded">Normal → Shift</span>
              </p>
              {INSCRIPT_MAP.map((row, ri) => (
                <div key={ri}>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">{rowLabels[ri] ?? "Number Row"}</p>
                  <div className="flex flex-wrap gap-1">
                    {row.map(([norm, shift], ki) => {
                      const eng = INSCRIPT_KEYS[ri * 13 + ki] ?? "";
                      return (
                        <div key={ki} className="bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 rounded-md px-2 py-1.5 text-center min-w-[44px]">
                          <p className="text-[10px] text-muted-foreground font-mono">{eng.toUpperCase()}</p>
                          <p className="text-sm font-bold text-amber-800 dark:text-amber-200 leading-tight">{norm}</p>
                          {shift !== norm && <p className="text-[10px] text-amber-600 dark:text-amber-400 leading-tight">{shift}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-muted-foreground">
                💡 Tip: Enable Hindi (Mangal) input on Windows via <strong>Settings → Time &amp; Language → Language → Add Hindi → Devanagari INSCRIPT</strong>
              </p>
            </div>
          )}

          {/* Kruti Dev map */}
          {isHindi && variant === "krutidev" && (
            <div className="space-y-3">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Kruti Dev 010 uses a <strong>legacy phonetic mapping</strong>. Install the Kruti Dev font for correct rendering. 
                Press the English key shown to get the Hindi character.
              </p>
              {QWERTY_ROWS.map((rowKeys, ri) => (
                <div key={ri}>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">{rowLabels[ri]}</p>
                  <div className="flex flex-wrap gap-1">
                    {rowKeys.map(k => {
                      const entry = KRUTI_MAP.find(m => m.key === k);
                      const shiftEntry = KRUTI_MAP.find(m => m.key === k.toUpperCase());
                      return (
                        <div key={k} className="bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 rounded-md px-2 py-1.5 text-center min-w-[44px]">
                          <p className="text-[10px] text-muted-foreground font-mono">{k.toUpperCase()}</p>
                          <p className="text-sm font-bold text-amber-800 dark:text-amber-200 leading-tight">{entry?.char ?? "—"}</p>
                          {shiftEntry && shiftEntry.char !== entry?.char && (
                            <p className="text-[10px] text-amber-600 dark:text-amber-400 leading-tight">{shiftEntry.char}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              <p className="text-[10px] text-muted-foreground">
                💡 Tip: Download Kruti Dev font from the official source and set it as default in your typing test software.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function UrduArabicGuide({ language }: { language: Language }) {
  const isUrdu = language === "urdu";
  return (
    <div className="space-y-2">
      <p className="text-xs text-amber-700 dark:text-amber-400">
        {isUrdu
          ? "Urdu typing uses the Phonetic / NLA keyboard layout on Windows. Characters are typed phonetically — press the English key that sounds like the Urdu character."
          : "Arabic typing uses the Arabic keyboard layout. Characters are read right-to-left."
        }
      </p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {isUrdu ? (
          <>
            <KeyPair k="a" h="ا (Alif)" />  <KeyPair k="b" h="ب (Be)" />
            <KeyPair k="p" h="پ (Pe)" />    <KeyPair k="t" h="ت (Te)" />
            <KeyPair k="j" h="ج (Jeem)" />  <KeyPair k="H" h="ح (He)" />
            <KeyPair k="K" h="خ (Khe)" />   <KeyPair k="d" h="د (Dal)" />
            <KeyPair k="r" h="ر (Re)" />    <KeyPair k="z" h="ز (Zain)" />
            <KeyPair k="s" h="س (Seen)" />  <KeyPair k="x" h="ش (Sheen)" />
            <KeyPair k="S" h="ص (Suad)" />  <KeyPair k="e" h="ع (Ain)" />
            <KeyPair k="f" h="ف (Fe)" />    <KeyPair k="q" h="ق (Qaaf)" />
            <KeyPair k="k" h="ک (Kaf)" />   <KeyPair k="g" h="گ (Gaaf)" />
            <KeyPair k="l" h="ل (Laam)" />  <KeyPair k="m" h="م (Meem)" />
            <KeyPair k="n" h="ن (Noon)" />  <KeyPair k="w" h="و (Wao)" />
            <KeyPair k="c" h="ے (Chhotee)" /><KeyPair k="y" h="ی (Ye)" />
          </>
        ) : (
          <>
            <KeyPair k="a" h="ا" /> <KeyPair k="b" h="ب" />
            <KeyPair k="t" h="ت" /> <KeyPair k="j" h="ج" />
            <KeyPair k="H" h="ح" /> <KeyPair k="d" h="د" />
            <KeyPair k="r" h="ر" /> <KeyPair k="z" h="ز" />
            <KeyPair k="s" h="س" /> <KeyPair k="x" h="ش" />
            <KeyPair k="f" h="ف" /> <KeyPair k="q" h="ق" />
            <KeyPair k="k" h="ك" /> <KeyPair k="l" h="ل" />
            <KeyPair k="m" h="م" /> <KeyPair k="n" h="ن" />
            <KeyPair k="w" h="و" /> <KeyPair k="y" h="ي" />
          </>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground">
        💡 Enable {isUrdu ? "Urdu Phonetic" : "Arabic"} keyboard in Windows: Settings → Time &amp; Language → Language → Add {isUrdu ? "Urdu" : "Arabic"}
      </p>
    </div>
  );
}

function KeyPair({ k, h }: { k: string; h: string }) {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-700 rounded px-2 py-1">
      <span className="font-mono font-bold text-amber-700 dark:text-amber-300 w-5 text-center">{k}</span>
      <span className="text-muted-foreground">→</span>
      <span className="font-bold text-amber-900 dark:text-amber-200">{h}</span>
    </div>
  );
}
