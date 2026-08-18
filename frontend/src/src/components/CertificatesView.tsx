import React, { useState, useEffect } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Building, 
  Printer, 
  QrCode,
  Share2
} from 'lucide-react';
import { SimulationCertificate, UserProfile } from '../types';

interface CertificatesViewProps {
  certificates: SimulationCertificate[];
  user: UserProfile;
  onNavigateToInternships: () => void;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({
  certificates,
  user,
  onNavigateToInternships
}) => {
  const [selectedCert, setSelectedCert] = useState<SimulationCertificate | null>(certificates[0] || null);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    const match = hash.match(/^verify\/([^/?]+)$/i);
    if (!match) return;

    const verificationId = decodeURIComponent(match[1]);
    const certFromUrl = certificates.find((cert) =>
      cert.certificateNumber === verificationId || cert.id === verificationId
    );

    if (certFromUrl) {
      setSelectedCert(certFromUrl);
    }
  }, [certificates]);

  const handlePrintCertificate = () => {
    window.print();
  };

  const getPublicVerificationUrl = (certificate: SimulationCertificate) => {
    const verificationId = encodeURIComponent(certificate.certificateNumber || certificate.id);
    return `${window.location.origin}${window.location.pathname}#/verify/${verificationId}`;
  };

  const handleViewOnWebsite = () => {
    if (!selectedCert) return;

    const publicUrl = getPublicVerificationUrl(selectedCert);
    window.open(publicUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Technical Credentials</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Simulation & Course Certificates
          </h1>
          <p className="mt-1 text-sm text-slate-300 max-w-xl">
            Proof of completed internship simulations, code reviews, and specialized technical mastery.
          </p>
        </div>

        <button
          onClick={onNavigateToInternships}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Earn New Simulation Certificate</span>
        </button>
      </div>

      {/* Grid: Certificates List & Full Certificate Renderer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Certificate Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="font-bold text-white text-sm">Issued Credentials ({certificates.length})</h3>

          {certificates.map((cert) => {
            const isSelected = selectedCert?.id === cert.id;
            return (
              <div
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-start justify-between ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Simulation</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{cert.internshipTitle}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{cert.company}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-2">{cert.certificateNumber}</p>
                </div>

                <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-indigo-500/20 text-indigo-300 font-mono">
                  {cert.score}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Column: Full Certificate Visual Display (8 cols) */}
        <div className="lg:col-span-8">
          {selectedCert ? (
            <div className="rounded-3xl glass-panel p-8 sm:p-12 border-2 border-indigo-500/30 relative overflow-hidden text-center shadow-2xl space-y-6">
              <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                <span className="text-xs font-bold text-slate-400 font-mono">ID: {selectedCert.certificateNumber}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified On-Chain
                </span>
              </div>

              {/* Certificate Inner Layout */}
              <div className="py-6 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mx-auto shadow-inner">
                  <Award className="w-8 h-8 text-indigo-400" />
                </div>

                <p className="text-xs uppercase tracking-widest text-indigo-300 font-bold">SkillSphere Technical Verification</p>
                <h2 className="text-2xl sm:text-4xl font-bold font-display text-white">
                  Certificate of Competency
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                  This certifies that <strong className="text-indigo-300 text-base">{user.name}</strong> has passed all technical requirements and senior engineering pull request reviews for:
                </p>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-md mx-auto">
                  <h3 className="font-bold text-lg text-white">{selectedCert.internshipTitle}</h3>
                  <p className="text-xs text-indigo-400 font-semibold">{selectedCert.company}</p>
                </div>

                {/* Skills Badges */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 max-w-lg mx-auto">
                  {(selectedCert.skillsDemonstrated || selectedCert.skills || []).map((sk, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-slate-900 text-slate-300 border border-slate-800">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-400 font-mono">Issued: {new Date(selectedCert.issueDate || selectedCert.issuedAt || Date.now()).toLocaleDateString()}</span>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handlePrintCertificate}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save PDF</span>
                  </button>

                  <a
                    href={getPublicVerificationUrl(selectedCert)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Public Verification Link</span>
                  </a>

                  <button
                    onClick={handleViewOnWebsite}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View in Website</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-left space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-bold text-white">Public certificate preview</h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                  <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
                    <p className="text-slate-400 mb-1">User</p>
                    <p className="font-bold text-white">{user.name}</p>
                  </div>
                  <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
                    <p className="text-slate-400 mb-1">Certificate ID</p>
                    <p className="font-bold text-white font-mono">{selectedCert.certificateNumber}</p>
                  </div>
                  <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
                    <p className="text-slate-400 mb-1">Program</p>
                    <p className="font-bold text-white">{selectedCert.internshipTitle || selectedCert.courseOrSimulationTitle || 'SkillSphere Certificate'}</p>
                  </div>
                  <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3">
                    <p className="text-slate-400 mb-1">Grade</p>
                    <p className="font-bold text-white">{selectedCert.score}%</p>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="rounded-3xl glass-panel p-12 border border-slate-800 text-center text-slate-400 space-y-3">
              <Award className="w-12 h-12 mx-auto text-slate-600" />
              <h3 className="font-bold text-slate-300">No Certificate Selected</h3>
              <p className="text-xs">Select a certificate from the left or complete a simulation to earn one.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
