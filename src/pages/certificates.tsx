import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMyCertificates } from "@workspace/api-client-react";
import { GraduationCap, Search, CheckCircle2, XCircle, Eye } from "lucide-react";
import { CertificateView } from "@/components/certificate/certificate-view";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getToken } from "@/lib/auth";

export default function CertificatesPage() {
  const { data: certs, isLoading } = useGetMyCertificates();
  const [verifyId, setVerifyId] = useState("");
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [viewCert, setViewCert] = useState<any>(null);

  async function handleVerify() {
    if (!verifyId.trim()) return;
    setVerifying(true);
    try {
      const token = getToken();
      const res = await fetch(`/api/certificates/verify/${verifyId.trim()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setVerifyResult(data);
    } catch {
      setVerifyResult({ valid: false, message: "Error verifying certificate" });
    } finally {
      setVerifying(false);
    }
  }

  const typeLabels: Record<string, string> = {
    course_completion: "Course Completion",
    exam_pass: "Exam Pass",
    rank: "Top Rank",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="navy-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <GraduationCap className="w-10 h-10 text-amber-400 mb-3" />
          <h1 className="font-display text-4xl font-bold text-white mb-2">Certificates</h1>
          <p className="text-slate-300">Official certifications from J.K Typing Master</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <Card className="mb-8 border-border">
          <CardContent className="p-6">
            <h2 className="font-semibold text-foreground mb-1">Verify a Certificate</h2>
            <p className="text-sm text-muted-foreground mb-4">Enter the certificate unique ID to verify its authenticity</p>
            <div className="flex gap-3">
              <Input placeholder="JKTM-1234567890-ABCD1234" value={verifyId} onChange={e => setVerifyId(e.target.value)} onKeyDown={e => e.key === "Enter" && handleVerify()} className="flex-1" data-testid="input-verify-id" />
              <Button onClick={handleVerify} disabled={verifying} data-testid="btn-verify">
                <Search className="w-4 h-4 mr-2" /> {verifying ? "Verifying..." : "Verify"}
              </Button>
            </div>
            {verifyResult && (
              <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${verifyResult.valid ? "bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800" : "bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800"}`}>
                {verifyResult.valid ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />}
                <div>
                  <p className={`font-semibold text-sm ${verifyResult.valid ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>{verifyResult.message}</p>
                  {verifyResult.valid && verifyResult.certificate && (
                    <div className="mt-1 text-xs text-muted-foreground space-y-0.5">
                      <p>Student: <strong>{verifyResult.certificate.studentName}</strong></p>
                      {verifyResult.certificate.courseName && <p>Course: {verifyResult.certificate.courseName}</p>}
                      {verifyResult.certificate.examName && <p>Exam: {verifyResult.certificate.examName}</p>}
                      <p>Issued: {new Date(verifyResult.certificate.issuedAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <h2 className="font-semibold text-foreground mb-4">My Certificates ({certs?.length ?? 0})</h2>
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}</div>
        ) : !certs || certs.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground"><GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-20" /><p className="font-medium">No certificates yet</p><p className="text-sm mt-1">Complete courses and pass exams to earn certificates</p></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certs.map((cert: any) => (
              <Card key={cert.id} className="border-amber-200 dark:border-amber-800 hover:shadow-md transition-all" data-testid={`card-cert-${cert.id}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className="bg-amber-100 text-amber-700 text-xs">{typeLabels[cert.type] ?? cert.type}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(cert.issuedAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{cert.courseName ?? cert.examName ?? "Certificate"}</h3>
                  <p className="text-xs text-muted-foreground mb-3">ID: {cert.uniqueId}</p>
                  {cert.wpm && (
                    <div className="flex gap-3 text-xs text-muted-foreground mb-3">
                      <span>{Math.round(cert.wpm)} WPM</span>
                      {cert.accuracy && <span>{Math.round(cert.accuracy)}% accuracy</span>}
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => setViewCert(cert)} data-testid={`btn-view-cert-${cert.id}`}>
                    <Eye className="w-3.5 h-3.5 mr-1" /> View Certificate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {viewCert && (
        <Dialog open={!!viewCert} onOpenChange={() => setViewCert(null)}>
          <DialogContent className="max-w-4xl p-0">
            <DialogHeader className="sr-only"><DialogTitle>Certificate</DialogTitle></DialogHeader>
            <CertificateView certificate={viewCert} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
