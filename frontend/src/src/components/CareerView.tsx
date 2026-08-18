import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Layers, 
  BookOpen, 
  Briefcase, 
  Code2, 
  Check, 
  Clock, 
  DollarSign, 
  TrendingUp,
  Award,
  Zap,
  Target
} from 'lucide-react';
import { CareerRecommendation, RoadmapStage, UserProfile } from '../types';

interface CareerViewProps {
  careers: CareerRecommendation[];
  user: UserProfile;
  onNavigateToCourses: (courseId?: string) => void;
  onNavigateToInternships: () => void;
  onNavigateToArena: () => void;
}

export const CareerView: React.FC<CareerViewProps> = ({
  careers,
  user,
  onNavigateToCourses,
  onNavigateToInternships,
  onNavigateToArena
}) => {
  const [selectedCareerId, setSelectedCareerId] = useState<string>(careers[0]?.id || 'car_fullstack');
  const selectedCareer = careers.find(c => c.id === selectedCareerId) || careers[0];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>AI Career Discovery & Roadmaps</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Personalized Career Paths & Action Plan
          </h1>
          <p className="mt-1 text-sm text-slate-300 max-w-2xl">
            Careers matched directly against your assessment depth, preferred language ({user.preferredLanguage}), and critical skill gaps.
          </p>
        </div>

        <button
          onClick={onNavigateToInternships}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition self-start md:self-auto"
        >
          <Briefcase className="w-4 h-4" />
          <span>Match with Internships</span>
        </button>
      </div>

      {/* Career Selection Pills / Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {careers.map((career) => {
          const isSelected = career.id === selectedCareerId;
          return (
            <div
              key={career.id}
              onClick={() => setSelectedCareerId(career.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                isSelected 
                  ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/50' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base text-white">{career.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold whitespace-nowrap ${
                    isSelected ? 'bg-indigo-500 text-white' : 'bg-indigo-500/20 text-indigo-300'
                  }`}>
                    {career.matchPercentage}% Match
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-medium">{career.field}</p>

                <p className="text-xs text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                  {career.reason}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{career.averageSalary}</span>
                <span className="text-emerald-400 font-medium">{career.growthOutlook}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep-Dive on Selected Career */}
      {selectedCareer && (
        <div className="space-y-6">
          
          {/* Skill Comparison Banner: Current vs Missing */}
          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Active Career Track</span>
                <h2 className="text-2xl font-bold font-display text-white mt-1">{selectedCareer.title}</h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">{selectedCareer.reason}</p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Est. Market Salary</span>
                  <span className="font-bold text-white text-sm">{selectedCareer.averageSalary}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Industry Growth</span>
                  <span className="font-bold text-emerald-400 text-sm">{selectedCareer.growthOutlook}</span>
                </div>
              </div>
            </div>

            {/* Current vs Missing Skills Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Acquired Skills */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4" /> Skills You Already Possess ({selectedCareer.currentSkills.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedCareer.currentSkills.map((sk, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
                      ✓ {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4" /> Missing Skills for Job Readiness ({selectedCareer.missingSkills.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedCareer.missingSkills.map((sk, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                      + {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 5-Stage Personalized Roadmap */}
          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-8">
              <div>
                <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  Personalized 5-Stage Learning Roadmap
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Dynamically adjusted to close your specific gaps: <strong>Foundation → Core Skills → Projects → Interview Prep → Internship Readiness</strong>
                </p>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                Adaptive Sequence
              </span>
            </div>

            {/* Stages Vertical Flow */}
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-slate-800 before:z-0">
              {selectedCareer.recommendedLearningPath.map((stage: RoadmapStage, idx: number) => {
                const stageColors = [
                  'border-cyan-500 bg-cyan-500/10 text-cyan-300',
                  'border-indigo-500 bg-indigo-500/10 text-indigo-300',
                  'border-amber-500 bg-amber-500/10 text-amber-300',
                  'border-purple-500 bg-purple-500/10 text-purple-300',
                  'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                ][idx % 5];

                return (
                  <div key={idx} className="relative z-10 flex items-start gap-4">
                    {/* Stage number circle */}
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border-2 border-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shrink-0 text-sm">
                      0{idx + 1}
                    </div>

                    {/* Stage Details Card */}
                    <div className="flex-1 rounded-2xl bg-slate-900/80 border border-slate-800 p-5 hover:border-indigo-500/40 transition">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${stageColors}`}>
                            Stage {idx + 1}: {stage.stage}
                          </span>
                          <h4 className="text-base font-bold text-white mt-1">{stage.title}</h4>
                        </div>

                        {stage.recommendedCourseIds?.[0] && (
                          <button
                            onClick={() => onNavigateToCourses(stage.recommendedCourseIds[0])}
                            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold self-start sm:self-auto"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Recommended Course</span>
                          </button>
                        )}
                      </div>

                      <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                        {stage.description}
                      </p>

                      {/* Milestones & Skills */}
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                        <div>
                          <span className="text-[11px] font-bold text-slate-400 block mb-1">Key Milestones:</span>
                          <ul className="space-y-1 text-slate-300">
                            {stage.milestones.map((m, mIdx) => (
                              <li key={mIdx} className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-indigo-400" />
                                <span>{m}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-slate-400 block mb-1">Target Skills:</span>
                          <div className="flex flex-wrap gap-1">
                            {stage.skills.map((sk, sIdx) => (
                              <span key={sIdx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={onNavigateToArena}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                <Code2 className="w-4 h-4" />
                <span>Practice Relevant DSA Problems</span>
              </button>

              <button
                onClick={onNavigateToInternships}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
              >
                <span>Experience {selectedCareer.title} Simulation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
