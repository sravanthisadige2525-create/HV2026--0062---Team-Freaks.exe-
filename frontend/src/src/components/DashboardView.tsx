import React, { useState } from 'react';
import { 
  Sparkles, 
  Briefcase, 
  ArrowRight, 
  Play, 
  TrendingUp, 
  Award, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  BookOpen, 
  Code2, 
  Compass, 
  ShieldCheck, 
  FileCheck,
  Bot,
  Mic,
  MessageSquare
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { UserProfile, CareerRecommendation, Internship, Course, SkillProfile } from '../types';
import { InternshipApplicationModal } from './InternshipApplicationModal';

interface DashboardViewProps {
  user: UserProfile;
  careers: CareerRecommendation[];
  internships: Internship[];
  courses: Course[];
  skillProfile: SkillProfile;
  courseProgress: Record<string, { completedLessons: string[]; progress: number; isCompleted: boolean }>;
  onNavigate: (tab: string, context?: any) => void;
  onStartSimulation: (internshipId: string) => void;
  onStartInterview: (internshipId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  careers,
  internships,
  courses,
  skillProfile,
  courseProgress,
  onNavigate,
  onStartSimulation,
  onStartInterview
}) => {
  const [selectedInternshipForApply, setSelectedInternshipForApply] = useState<Internship | null>(null);
  const topCareer = careers[0];
  const featuredInternships = internships.slice(0, 2);

  // Workflow steps for the student journey
  const journeySteps = [
    { key: 'assessment', title: '1. Assess', desc: 'AI Skill evaluation', tab: 'assessment', active: true },
    { key: 'careers', title: '2. Discover', desc: 'Career matching', tab: 'careers', active: true },
    { key: 'learn', title: '3. Learn', desc: 'Personalized tracks', tab: 'learn', active: true },
    { key: 'arena', title: '4. Practice', desc: 'Code Arena & DSA', tab: 'arena', active: true },
    { key: 'internships', title: '5. Experience', desc: 'Internship Demo USP', tab: 'internships', active: true, highlight: true },
    { key: 'resume', title: '6. Improve', desc: 'ATS Resume check', tab: 'resume', active: true },
    { key: 'apply', title: '7. Apply', desc: 'Verified candidate', tab: 'internships', active: true }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Welcome & Journey Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900/80 to-slate-950 border border-indigo-500/20 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Career Acceleration Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-white tracking-tight leading-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-200 to-cyan-200">{user.name}</span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
              Your career readiness is <span className="text-emerald-400 font-bold">{user.careerReadinessScore}%</span>. Target role: <strong className="text-indigo-300">{topCareer?.title || 'Full Stack Engineer'}</strong>. Experience real company workflows before sending your application.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('internships')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 transition"
              >
                <Briefcase className="w-4 h-4" />
                <span>Explore Internship Demos</span>
              </button>

              <button
                onClick={() => onNavigate('assessment')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-sm font-medium border border-slate-700 hover:border-slate-600 transition"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Retake AI Assessment</span>
              </button>
            </div>
          </div>

          {/* Readiness Circular Metric Card */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md min-w-[240px]">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-indigo-500"
                  strokeDasharray={`${user.careerReadinessScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold font-display text-white">{user.careerReadinessScore}%</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Readiness</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-emerald-400 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> High Internship Competitiveness
            </p>
          </div>
        </div>

        {/* 7-Step Career Lifecycle Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Core Career Mastery Flow
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {journeySteps.map((s) => (
              <button
                key={s.key}
                onClick={() => onNavigate(s.tab)}
                className={`p-2.5 rounded-xl border text-left transition ${
                  s.highlight 
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-200 hover:bg-indigo-600/30' 
                    : 'bg-slate-900/40 border-slate-800/60 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{s.title}</span>
                  {s.highlight && <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">{s.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Skill Radar & Career Match */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Skill Radar & Gap Analysis (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl glass-panel p-6 sm:p-7 border border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
            <div>
              <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                AI Skill Radar & Gaps
              </h2>
              <p className="text-xs text-slate-400">Multi-vector analysis from your assessment and coding runs</p>
            </div>
            <button
              onClick={() => onNavigate('assessment')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>Full Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Recharts Radar */}
            <div className="md:col-span-7 h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillProfile.radarScores} outerRadius="75%">
                  <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                  <Radar name="Skills" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.45} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Strengths & Critical Gaps Summary */}
            <div className="md:col-span-5 space-y-4">
              <div>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4" /> Top Strengths
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skillProfile.primaryStrengths.slice(0, 3).map((st, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4" /> High-Priority Gaps
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skillProfile.criticalGaps.slice(0, 3).map((gap, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                      {gap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Career Recommendation (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl glass-panel p-6 sm:p-7 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
              <div>
                <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-cyan-400" />
                  Recommended Career
                </h2>
                <p className="text-xs text-slate-400">Best match based on your current skill profile</p>
              </div>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                {topCareer?.matchPercentage || 92}% Match
              </span>
            </div>

            <h3 className="text-xl font-bold font-display text-white">
              {topCareer?.title || 'Full Stack Software Engineer'}
            </h3>
            <p className="text-xs text-indigo-300 font-medium mt-0.5">{topCareer?.field || 'Software Engineering'}</p>

            <p className="mt-3 text-xs text-slate-300 leading-relaxed">
              {topCareer?.reason}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Avg Salary</span>
                <span className="font-semibold text-slate-200">{topCareer?.averageSalary}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Industry Demand</span>
                <span className="font-semibold text-emerald-400">{topCareer?.growthOutlook}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => onNavigate('careers')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
            >
              <span>View Personalized Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Internships Hub (USP Spotlight) */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-display text-white">
                Internship Hub
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                CORE USP
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Experience the actual daily sprint and AI interview before submitting your formal application!
            </p>
          </div>

          <button
            onClick={() => onNavigate('internships')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All Internships</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredInternships.map((internship) => (
            <div 
              key={internship.id}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 hover:border-indigo-500/40 transition flex flex-col justify-between relative overflow-hidden group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src={internship.companyLogo} 
                      alt={internship.company} 
                      className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-700" 
                    />
                    <div>
                      <h4 className="font-bold text-white text-base group-hover:text-indigo-300 transition">
                        {internship.title}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium">{internship.company} • {internship.location}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                    {internship.stipend}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {internship.jobDescription}
                </p>

                {/* Tech tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {internship.requiredSkills.slice(0, 4).map((sk, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md text-[11px] bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* TWO CORE OPTIONS: Apply Directly (Modal) OR Try Internship Demo (Voice Assistant) */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedInternshipForApply(internship)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Apply Directly</span>
                </button>

                <button
                  type="button"
                  onClick={() => onStartInterview(internship.id)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>Try Voice Demo</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Daily Code Arena & Course Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Daily Coding Challenge (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl glass-panel p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold font-display text-white text-base">Daily Coding Challenge</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                +20 Pts
              </span>
            </div>

            <h4 className="font-bold text-white text-sm">Two Sum II - Sorted Array</h4>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              Find two numbers in a sorted array that sum up to target in O(1) auxiliary space using Two Pointers.
            </p>

            <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
              <span>Category: <strong className="text-slate-200">Arrays</strong></span>
              <span>Difficulty: <strong className="text-emerald-400">Easy</strong></span>
              <span>Acceptance: <strong className="text-slate-200">88%</strong></span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-medium">
              <Flame className="w-4 h-4 text-amber-400 fill-current" />
              <span>Current Streak: {user.streakDays} Days</span>
            </div>
            <button
              onClick={() => onNavigate('arena')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Solve in Arena</span>
            </button>
          </div>
        </div>

        {/* Personalized Course Learning (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl glass-panel p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold font-display text-white text-base">Active Learning Track</h3>
              </div>
              <button
                onClick={() => onNavigate('learn')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                All Courses
              </button>
            </div>

            {courses.slice(0, 1).map(crs => {
              const prog = courseProgress[crs.id] || { progress: 50, completedLessons: ['les_1'] };
              return (
                <div key={crs.id}>
                  <h4 className="font-bold text-white text-sm">{crs.title}</h4>
                  <p className="mt-1 text-xs text-slate-400">{crs.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Course Progress</span>
                      <span className="font-bold text-indigo-300">{prog.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500" 
                        style={{ width: `${prog.progress}%` }} 
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Next: Lesson 2 • Route Handlers</span>
            <button
              onClick={() => onNavigate('learn')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <span>Continue Lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* AI Mentor Quick Insight Box */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-900/40 border border-indigo-500/20 p-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">AI Mentor Daily Directive</h4>
            <p className="mt-1 text-xs sm:text-sm text-slate-200 leading-relaxed">
              "Your JavaScript and REST scores are top tier. Completing the <strong>CloudScale Technologies Voice Interview & Simulation</strong> will increase your verified readiness score to 92%+ and unlock the verified internship endorsement badge."
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('mentorship')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shrink-0 self-center"
        >
          <span>Chat with Mentor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Direct Application & Enrollment Modal */}
      {selectedInternshipForApply && (
        <InternshipApplicationModal
          internship={selectedInternshipForApply}
          user={user}
          isOpen={true}
          onClose={() => setSelectedInternshipForApply(null)}
          onTryDemo={(internshipId) => {
            setSelectedInternshipForApply(null);
            onStartInterview(internshipId);
          }}
        />
      )}

    </div>
  );
};
