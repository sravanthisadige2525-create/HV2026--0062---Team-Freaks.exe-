import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Sparkles, 
  Building, 
  Send, 
  FileText, 
  Globe, 
  Linkedin, 
  Github, 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  Award, 
  ShieldCheck,
  Check,
  AlertCircle,
  Loader2,
  X,
  Play,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Internship, UserProfile, InternshipApplication } from '../types';
import { dbService } from '../lib/supabase';

interface InternshipApplicationModalProps {
  internship: Internship;
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onApplicationSubmitted?: (application: InternshipApplication) => void;
  onTryDemo?: (internshipId: string) => void;
}

export const InternshipApplicationModal: React.FC<InternshipApplicationModalProps> = ({
  internship,
  user,
  isOpen,
  onClose,
  onApplicationSubmitted,
  onTryDemo
}) => {
  const [applicantName, setApplicantName] = useState(user.name || '');
  const [applicantEmail, setApplicantEmail] = useState(user.email || '');
  const [applicantPhone, setApplicantPhone] = useState('+91 98765 43210');
  const [college, setCollege] = useState(user.college || 'IIT Bombay');
  const [branch, setBranch] = useState(user.branch || 'Computer Science & Engineering');
  const [graduationYear, setGraduationYear] = useState(user.graduationYear ? String(user.graduationYear) : '2027');
  const [githubUrl, setGithubUrl] = useState(user.githubUrl || 'https://github.com/alexchen');
  const [linkedinUrl, setLinkedinUrl] = useState(user.linkedinUrl || 'https://linkedin.com/in/alexchen');
  const [portfolioUrl, setPortfolioUrl] = useState('https://alexchen.dev');
  const [coverStatement, setCoverStatement] = useState(
    `I am excited to apply for the ${internship.title} role at ${internship.company}. With a strong background in ${internship.requiredSkills.slice(0, 3).join(', ')}, I am eager to build high-performance production features and contribute directly to your team's engineering roadmap.`
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<InternshipApplication | null>(null);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantEmail.trim()) return;

    setIsSubmitting(true);
    try {
      const newApp: InternshipApplication = {
        id: `app_${internship.id}_${Date.now()}`,
        internshipId: internship.id,
        internshipTitle: internship.title,
        company: internship.company,
        companyLogo: internship.companyLogo,
        applicantName,
        applicantEmail,
        applicantPhone,
        college,
        branch,
        graduationYear,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
        coverStatement,
        status: 'Enrolled & Under Review',
        submittedAt: new Date().toISOString(),
        stipend: internship.stipend,
        location: internship.location,
        duration: internship.duration,
        isPaid: internship.isPaid ?? true
      };

      await dbService.saveInternshipApplication(newApp);
      setSubmittedApp(newApp);
      setIsSubmitted(true);

      if (onApplicationSubmitted) {
        onApplicationSubmitted(newApp);
      }

      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err) {
      console.error('Failed to submit internship application:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[94vh] sm:max-h-[90vh] rounded-2xl sm:rounded-3xl glass-panel border border-indigo-500/40 shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-internship-title"
      >
        {/* STICKY MODAL HEADER with prominent Wrong Mark (X) button */}
        <div className="shrink-0 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md flex items-center justify-between z-20">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <img
              src={internship.companyLogo}
              alt={internship.company}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover ring-1 ring-indigo-500/30 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                  {internship.isPaid !== false ? 'Paid' : 'Unpaid'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                  {internship.type}
                </span>
              </div>
              <h2 id="modal-internship-title" className="text-sm sm:text-base font-bold text-white truncate">
                {internship.title} • <span className="text-slate-400 font-normal">{internship.company}</span>
              </h2>
            </div>
          </div>

          {/* Close ('Wrong Mark') Button */}
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-2 sm:p-2.5 rounded-xl bg-slate-900/90 hover:bg-rose-500/20 border border-slate-700 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 transition shadow-sm active:scale-95 flex items-center gap-1 group"
            title="Close modal and return to current page"
            aria-label="Close modal and return to current page"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-90 duration-200" />
            <span className="text-[11px] font-semibold hidden md:inline">Close</span>
          </button>
        </div>

        {/* SCROLLABLE MODAL BODY (Smooth sliding up and down across all devices) */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 md:p-8 space-y-6 text-slate-100 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900/40 touch-pan-y">
          
          {isSubmitted && submittedApp ? (
            /* Confirmation View */
            <div className="text-center py-6 sm:py-8 space-y-6 animate-in fade-in">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Application Enrolled Successfully</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                  You're Enrolled for {internship.title}!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                  Your application has been received and logged directly into <strong>{internship.company}</strong>'s candidate review queue.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="max-w-lg mx-auto p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-left text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-slate-400">Application Reference ID:</span>
                  <span className="font-mono font-bold text-indigo-300">{submittedApp.id}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-slate-400">Company & Role:</span>
                  <span className="font-semibold text-white">{internship.company} • {internship.title}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-slate-400">Compensation:</span>
                  <span className="font-bold text-emerald-400">{internship.stipend} ({internship.isPaid !== false ? 'Paid' : 'Unpaid'})</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-slate-400">Location / Duration:</span>
                  <span className="text-slate-200">{internship.location} • {internship.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Application Status:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                    {submittedApp.status}
                  </span>
                </div>
              </div>

              {/* Next Recommended Step */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 max-w-lg mx-auto text-left flex items-start gap-3.5">
                <Sparkles className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-white text-xs">Boost Your Application Shortlist Ranking</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                    Candidates who complete the <strong>Voice AI Technical Screening</strong> and <strong>Simulation Sprint</strong> are 4.5x more likely to receive an instant interview callback.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Close & Return to Hub
                </button>

                {onTryDemo && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onTryDemo(internship.id);
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch Voice Interview Demo Now</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Main Application & Details View */
            <div className="space-y-6">
              
              {/* Quick Metrics Bar: Stipend, Location, Duration, Deadline */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                <div className="p-2 rounded-xl bg-slate-950/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Monthly Stipend</span>
                  <span className="font-bold text-emerald-400 text-sm mt-0.5 block">{internship.stipend}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Work Location</span>
                  <span className="font-medium text-slate-200 text-xs mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{internship.location}</span>
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
                  <span className="font-medium text-slate-200 text-xs mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{internship.duration}</span>
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Deadline</span>
                  <span className="font-medium text-amber-300 text-xs mt-0.5 block truncate">
                    {internship.deadline || 'Rolling Admissions'}
                  </span>
                </div>
              </div>

              {/* Detailed Description & Responsibilities */}
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-400" />
                    <span>Role Description</span>
                  </h4>
                  <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800">
                    {internship.jobDescription}
                  </p>
                </div>

                {/* Responsibilities */}
                <div>
                  <h4 className="font-bold text-white text-xs mb-2">Key Responsibilities & Deliverables:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {internship.responsibilities.map((resp, i) => (
                      <div key={i} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span className="leading-snug text-[11px]">{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Required Skills & Perks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                    <span className="font-bold text-slate-200 block mb-2">Required Skills & Tech Stack:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {internship.requiredSkills.map((sk, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg text-[11px] bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                    <span className="font-bold text-slate-200 block mb-2">Internship Benefits & Perks:</span>
                    <ul className="space-y-1.5 text-[11px] text-emerald-300">
                      {(internship.perks || [
                        'Guaranteed Stipend & Certificate of Completion',
                        'Pre-Placement Offer (PPO) Consideration',
                        'Dedicated 1-on-1 Senior Staff Mentorship'
                      ]).map((perk, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Direct Enrollment Form */}
              <div className="pt-5 border-t border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <Send className="w-4 h-4 text-cyan-400" />
                      <span>Submit Candidate Details for Direct Enrollment</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Review and submit your profile details. All applications are directly synchronized with hiring managers.
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">Auto-filled from Profile</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Full Legal Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={applicantName}
                          onChange={(e) => setApplicantName(e.target.value)}
                          placeholder="e.g. Priya Sharma"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Contact Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={applicantEmail}
                          onChange={(e) => setApplicantEmail(e.target.value)}
                          placeholder="e.g. priya@university.edu"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone, College, Branch */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          value={applicantPhone}
                          onChange={(e) => setApplicantPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">College / University</label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          placeholder="e.g. IIT Bombay"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Degree & Branch</label>
                      <input
                        type="text"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="e.g. B.Tech Computer Science"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                      />
                    </div>
                  </div>

                  {/* Profiles: GitHub, LinkedIn, Portfolio */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">GitHub Profile</label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="url"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          placeholder="https://github.com/username"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">LinkedIn Profile</label>
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="url"
                          value={linkedinUrl}
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Portfolio / Link</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="url"
                          value={portfolioUrl}
                          onChange={(e) => setPortfolioUrl(e.target.value)}
                          placeholder="https://myportfolio.dev"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Candidate Cover Statement */}
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Why are you interested in this internship? (Candidate Pitch)
                    </label>
                    <textarea
                      rows={3}
                      value={coverStatement}
                      onChange={(e) => setCoverStatement(e.target.value)}
                      placeholder="Briefly describe your practical projects, why you'd like to work at this company, and your learning goals..."
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none text-xs"
                    />
                  </div>

                  {/* Submit Action Bar */}
                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80">
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Direct review with {internship.company} hiring team</span>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold transition text-xs"
                      >
                        Cancel & Return
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting || !applicantName.trim() || !applicantEmail.trim()}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold shadow-lg shadow-emerald-600/30 transition disabled:opacity-50 text-xs active:scale-95"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Submit Application & Enroll</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
