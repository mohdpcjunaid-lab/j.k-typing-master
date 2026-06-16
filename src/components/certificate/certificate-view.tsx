import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Download, Image } from "lucide-react";
import html2canvas from "html2canvas";

interface CertificateProps {
  certificate: {
    uniqueId: string;
    type: string;
    studentName: string;
    courseName?: string | null;
    examName?: string | null;
    wpm?: number | null;
    accuracy?: number | null;
    rank?: number | null;
    directorName?: string;
    instituteName?: string;
    issuedAt: string;
    qrData?: string;
  };
}

/* ── Achievement rank label ── */
function getAchievementRank(wpm?: number | null, accuracy?: number | null): string {
  const w = wpm ?? 0;
  const a = accuracy ?? 0;
  if (w >= 60 && a >= 98) return "Expert Typist";
  if (w >= 50 && a >= 97) return "Professional Typist";
  if (w >= 40 && a >= 95) return "Advanced Typist";
  if (w >= 30 && a >= 90) return "Certified Typist";
  return "Typist";
}

/* ── Test type label ── */
function getTestType(cert: CertificateProps["certificate"]): string {
  if (cert.courseName) return cert.courseName;
  if (cert.examName) return cert.examName;
  const t: Record<string, string> = {
    course_completion: "Course Completion",
    exam_pass: "Typing Proficiency",
    rank: "Merit Examination",
  };
  return t[cert.type] ?? "Typing Assessment";
}

/* ── Pseudo-QR SVG (deterministic pattern from uniqueId) ── */
function QRCodeSVG({ value, size = 90 }: { value: string; size?: number }) {
  const cells = 21;
  const cellSize = size / cells;
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = ((hash << 5) - hash) + value.charCodeAt(i);

  const isFinderPattern = (r: number, c: number) => {
    const inTL = r < 7 && c < 7;
    const inTR = r < 7 && c > cells - 8;
    const inBL = r > cells - 8 && c < 7;
    if (inTL || inTR || inBL) {
      const lr = inTR ? r : inBL ? r - (cells - 7) : r;
      const lc = inTR ? c - (cells - 7) : c;
      return (lr === 0 || lr === 6 || lc === 0 || lc === 6) || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4);
    }
    return false;
  };

  const isModule = (r: number, c: number): boolean => {
    if (isFinderPattern(r, c)) return true;
    const seed = (r * cells + c + hash) & 0xFFFFFF;
    return (seed % 3) === 0;
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <rect width={size} height={size} fill="white" />
      {Array.from({ length: cells }, (_, r) =>
        Array.from({ length: cells }, (_, c) =>
          isModule(r, c) ? (
            <rect key={`${r}-${c}`} x={c * cellSize} y={r * cellSize} width={cellSize} height={cellSize} fill="#0f172a" />
          ) : null
        )
      )}
    </svg>
  );
}

/* ── Barcode SVG ── */
function BarcodeSVG({ value, width = 140, height = 40 }: { value: string; width?: number; height?: number }) {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) hash = ((hash << 5) + hash) + value.charCodeAt(i);

  const bars: { x: number; w: number; fill: string }[] = [];
  let x = 0;
  const totalBars = 60;
  const unitW = width / totalBars;

  for (let i = 0; i < totalBars; i++) {
    const seed = (hash + i * 37) & 0xFFF;
    const w = unitW * (1 + (seed % 2));
    bars.push({ x, w, fill: i % 2 === 0 ? "#0f172a" : "transparent" });
    x += w;
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect width={width} height={height} fill="white" />
      {bars.map((b, i) => b.fill !== "transparent" && (
        <rect key={i} x={b.x} y={0} width={b.w} height={height} fill={b.fill} />
      ))}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
export function CertificateView({ certificate: cert }: CertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const issued = new Date(cert.issuedAt);
  const issuedStr = issued.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const examDateStr = issued.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const rank = getAchievementRank(cert.wpm, cert.accuracy);
  const testType = getTestType(cert);
  const verifyUrl = cert.qrData ?? `${window.location.origin}/certificates/verify/${cert.uniqueId}`;

  /* ── Print / Save as PDF ── */
  function handlePrint() {
    const content = certRef.current?.outerHTML;
    if (!content) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head>
      <title>Certificate — ${cert.studentName}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Playfair+Display:wght@400;700;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: white; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        @media print {
          html, body { width: 297mm; height: 210mm; }
          @page { size: A4 landscape; margin: 0; }
          body { background: white; }
        }
      </style></head><body>${content}</body></html>`);
    w.document.close();
    w.onload = () => { w.focus(); w.print(); };
  }

  /* ── Download PNG ── */
  async function handleDownloadPNG() {
    if (!certRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `JK_CERTIFICATE_${cert.uniqueId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setExporting(false);
    }
  }

  /* ────────────────────────────────────────────────── */
  const NAVY = "#0f172a";
  const GOLD = "#c9a227";
  const GOLD_LIGHT = "#f0c040";
  const CREAM = "#fffef8";
  const GOLD_DARK = "#8b6914";

  return (
    <div style={{ padding: "16px", background: "#f1f5f9" }}>
      {/* Action buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginBottom: "12px" }}>
        <Button variant="outline" size="sm" onClick={handlePrint} className="h-8 text-xs gap-1.5" data-testid="btn-print-cert">
          <Printer className="w-3.5 h-3.5" /> Print / PDF
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownloadPNG} disabled={exporting} className="h-8 text-xs gap-1.5" data-testid="btn-download-png">
          <Image className="w-3.5 h-3.5" /> {exporting ? "Exporting…" : "Download PNG"}
        </Button>
      </div>

      {/* ═══════ CERTIFICATE ═══════ */}
      <div
        ref={certRef}
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          aspectRatio: "1.414 / 1",
          background: CREAM,
          position: "relative",
          overflow: "hidden",
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
        }}
      >
        {/* ── Outer navy border ── */}
        <div style={{ position: "absolute", inset: 0, border: `18px solid ${NAVY}`, zIndex: 10, pointerEvents: "none" }} />
        {/* ── Gold inner border ── */}
        <div style={{ position: "absolute", inset: "22px", border: `3px solid ${GOLD}`, zIndex: 10, pointerEvents: "none" }} />
        {/* ── Thin gold line inside ── */}
        <div style={{ position: "absolute", inset: "28px", border: `1px solid ${GOLD}50`, zIndex: 10, pointerEvents: "none" }} />

        {/* ── Corner ornaments (gold fleur) ── */}
        {([["top","left"],["top","right"],["bottom","left"],["bottom","right"]] as [string,string][]).map(([v, h], i) => (
          <div key={i} style={{
            position: "absolute", [v]: "30px", [h]: "30px",
            width: "36px", height: "36px", zIndex: 11,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="36" height="36" viewBox="0 0 36 36">
              <text x="18" y="26" textAnchor="middle" fontSize="24" fill={GOLD} style={{ fontFamily: "serif" }}>✦</text>
            </svg>
          </div>
        ))}

        {/* ── Watermark ── */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%) rotate(-25deg)",
          fontSize: "52px", fontWeight: 900, color: `${NAVY}06`,
          whiteSpace: "nowrap", userSelect: "none", pointerEvents: "none",
          fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "6px", zIndex: 1,
        }}>
          J.K TYPING MASTER
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ position: "relative", zIndex: 5, height: "100%", display: "flex", flexDirection: "column", padding: "36px 48px 28px" }}>

          {/* TOP ROW: Cert No + Date of Issue */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
            <div style={{ fontSize: "9px", color: NAVY, fontWeight: 600, letterSpacing: "0.5px" }}>
              <span style={{ color: "#6b7280" }}>Certificate No. : </span>
              <span style={{ color: NAVY, fontWeight: 700, fontFamily: "monospace" }}>{cert.uniqueId}</span>
            </div>
            <div style={{ fontSize: "9px", color: NAVY, fontWeight: 600, letterSpacing: "0.5px" }}>
              <span style={{ color: "#6b7280" }}>Date of Issue : </span>
              <span style={{ color: NAVY, fontWeight: 700 }}>{issuedStr}</span>
            </div>
          </div>

          {/* HEADER SECTION */}
          <div style={{ textAlign: "center", marginBottom: "6px" }}>
            {/* Ashoka-style emblem */}
            <div style={{ fontSize: "28px", lineHeight: 1, marginBottom: "1px" }}>🏛️</div>
            <div style={{ fontSize: "7px", letterSpacing: "3px", color: NAVY, fontWeight: 600, marginBottom: "2px" }}>सत्यमेव जयते</div>

            {/* Title row with logos */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "2px" }}>
              {/* JK circle badge */}
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: NAVY, border: `2px solid ${GOLD}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                flexDirection: "column",
              }}>
                <span style={{ fontSize: "11px", fontWeight: 900, color: GOLD, lineHeight: 1 }}>J.K</span>
                <span style={{ fontSize: "5px", color: GOLD_LIGHT, letterSpacing: "0.5px" }}>TYPING</span>
              </div>

              <div>
                <h1 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(18px, 3.5vw, 30px)", fontWeight: 900,
                  color: NAVY, letterSpacing: "2px", lineHeight: 1,
                }}>J.K TYPING MASTER</h1>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center", marginTop: "2px" }}>
                  <span style={{ color: GOLD, fontSize: "8px" }}>★ ★ ★</span>
                  <span style={{ fontSize: "8px", color: "#6b7280", letterSpacing: "2px" }}>A Government Recognized Typing Certification</span>
                  <span style={{ color: GOLD, fontSize: "8px" }}>★ ★ ★</span>
                </div>
              </div>

              {/* Keyboard icon */}
              <div style={{
                width: "40px", height: "40px", borderRadius: "6px",
                background: NAVY, border: `2px solid ${GOLD}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <span style={{ fontSize: "20px" }}>⌨️</span>
              </div>
            </div>

            {/* Banner */}
            <div style={{
              background: NAVY, padding: "5px 24px", display: "inline-block",
              marginTop: "4px", borderLeft: `4px solid ${GOLD}`, borderRight: `4px solid ${GOLD}`,
            }}>
              <p style={{
                color: GOLD_LIGHT, fontWeight: 800, letterSpacing: "4px",
                fontSize: "clamp(9px, 1.5vw, 13px)", textTransform: "uppercase",
              }}>
                Certificate of Typing Proficiency
              </p>
            </div>
          </div>

          {/* MIDDLE SECTION */}
          <div style={{ display: "flex", flex: 1, gap: "16px", alignItems: "stretch", minHeight: 0 }}>

            {/* LEFT: Certification Details */}
            <div style={{ width: "180px", flexShrink: 0 }}>
              <div style={{ background: NAVY, padding: "4px 8px", marginBottom: "6px" }}>
                <p style={{ color: GOLD_LIGHT, fontSize: "8px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>Certification Details</p>
              </div>
              {[
                ["Typing Speed", cert.wpm ? `${Math.round(cert.wpm)} WPM` : "—"],
                ["Accuracy",     cert.accuracy ? `${Math.round(cert.accuracy)}%` : "—"],
                ["Test Type",    testType],
                ["Rank",         rank],
                ["Date of Test", examDateStr],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", gap: "4px", marginBottom: "4px", fontSize: "8.5px", alignItems: "flex-start" }}>
                  <span style={{ color: "#6b7280", minWidth: "72px", flexShrink: 0 }}>{label}</span>
                  <span style={{ color: NAVY }}>:</span>
                  <span style={{ color: NAVY, fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* CENTER: Name + body text */}
            <div style={{ flex: 1, textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: "6px" }}>
              <p style={{ fontSize: "9px", fontStyle: "italic", color: "#6b7280", letterSpacing: "2px" }}>This is to certify that</p>

              {/* Candidate Name in cursive-style */}
              <div style={{
                fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                fontSize: "clamp(22px, 4vw, 38px)", fontWeight: 700,
                color: NAVY, lineHeight: 1.1, padding: "2px 0",
              }}>
                {cert.studentName}
              </div>

              {/* Underline */}
              <div style={{ width: "60%", height: "1.5px", background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: "0 auto" }} />

              <p style={{ fontSize: "8.5px", color: "#374151", lineHeight: 1.6, maxWidth: "340px", margin: "0 auto" }}>
                has successfully completed the typing assessment conducted by{" "}
                <strong>J.K Typing Master</strong> and is awarded this certificate for demonstrating
                excellent typing skills and accuracy.
              </p>

              {/* Watermark text in center */}
              <div style={{ position: "relative", margin: "2px 0" }}>
                <p style={{
                  fontSize: "20px", fontWeight: 900, color: `${NAVY}10`,
                  letterSpacing: "6px", userSelect: "none", pointerEvents: "none",
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}>
                  TYPING MASTER
                </p>
              </div>

              <p style={{ fontSize: "7.5px", color: "#6b7280", lineHeight: 1.5, maxWidth: "300px", margin: "0 auto" }}>
                This certificate is issued in recognition of the candidate's<br />
                proficiency in typing and commitment to excellence.
              </p>

              {/* Digital India footer */}
              <div style={{ marginTop: "4px" }}>
                <div style={{ fontSize: "14px", marginBottom: "1px" }}>🏛️</div>
                <p style={{ fontSize: "8px", fontWeight: 700, color: NAVY }}>Digital India | Skill India</p>
                <p style={{ fontSize: "7px", color: "#6b7280" }}>Empowering Skills, Empowering India</p>
              </div>
            </div>

            {/* RIGHT: Skills Certified */}
            <div style={{ width: "140px", flexShrink: 0 }}>
              <div style={{ background: NAVY, padding: "4px 8px", marginBottom: "6px" }}>
                <p style={{ color: GOLD_LIGHT, fontSize: "8px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>Skills Certified</p>
              </div>
              {["Typing Speed", "Accuracy", "Consistency", "Time Management", "Professional Typing"].map(skill => (
                <div key={skill} style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "5px" }}>
                  <div style={{
                    width: "13px", height: "13px", borderRadius: "50%",
                    border: `1.5px solid ${GOLD}`, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ fontSize: "8px", color: GOLD }}>✓</span>
                  </div>
                  <span style={{ fontSize: "8px", color: NAVY }}>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: "8px" }}>

            {/* LEFT: Gold seal */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
              <div style={{
                width: "68px", height: "68px", borderRadius: "50%",
                background: `radial-gradient(circle at 35% 35%, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DARK})`,
                border: `3px solid ${GOLD_DARK}`,
                boxShadow: `0 0 0 2px ${GOLD_LIGHT}, 0 3px 10px rgba(0,0,0,0.3)`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: "18px" }}>⌨️</span>
                <p style={{ fontSize: "4.5px", fontWeight: 800, color: NAVY, letterSpacing: "1px", textAlign: "center", lineHeight: 1.2 }}>J.K<br />TYPING<br />MASTER</p>
              </div>
              <div style={{ display: "flex", gap: "2px" }}>
                {[...Array(5)].map((_, i) => <span key={i} style={{ fontSize: "6px", color: GOLD }}>★</span>)}
              </div>
            </div>

            {/* CENTER: Signature */}
            <div style={{ textAlign: "center" }}>
              {/* Signature */}
              <div style={{
                fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
                fontSize: "22px", color: NAVY, lineHeight: 1, marginBottom: "3px",
              }}>
                Mohd Junaid
              </div>
              <div style={{ width: "130px", height: "1.5px", background: NAVY, margin: "0 auto 3px" }} />
              <p style={{ fontSize: "8.5px", fontWeight: 700, color: NAVY }}>Mohd Junaid</p>
              <p style={{ fontSize: "7.5px", color: "#6b7280" }}>Founder &amp; Developer</p>
              <p style={{ fontSize: "7.5px", fontWeight: 600, color: NAVY }}>J.K Typing Master</p>
            </div>

            {/* RIGHT: QR + Barcode */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <div style={{ border: `2px solid ${GOLD}`, borderRadius: "4px", padding: "3px", background: "white" }}>
                <QRCodeSVG value={verifyUrl} size={60} />
              </div>
              <div style={{ background: "white", padding: "2px 4px", borderRadius: "3px" }}>
                <BarcodeSVG value={cert.uniqueId} width={100} height={22} />
              </div>
              <p style={{ fontSize: "6px", letterSpacing: "1px", color: "#9ca3af", textTransform: "uppercase" }}>Scan to Verify</p>
            </div>
          </div>

          {/* FOOTER BANNER */}
          <div style={{
            background: NAVY, margin: "8px -48px -28px",
            padding: "5px 48px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
          }}>
            <span style={{ color: GOLD, fontSize: "10px" }}>★ ★ ★</span>
            <p style={{ color: GOLD_LIGHT, fontSize: "9px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" }}>
              Verified &amp; Issued by J.K Typing Master
            </p>
            <span style={{ color: GOLD, fontSize: "10px" }}>★ ★ ★</span>
          </div>
        </div>
      </div>
    </div>
  );
}
