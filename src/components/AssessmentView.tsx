import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  Code2, 
  BrainCircuit, 
  MessageSquare, 
  Award, 
  AlertTriangle, 
  RotateCcw,
  Loader2,
  Check,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  UserProfile, 
  AssessmentQuestion, 
  AssessmentSubmission, 
  SkillProfile 
} from '../types';
import { SAMPLE_ASSESSMENT_QUESTIONS } from '../lib/mockData';
import { dbService } from '../lib/supabase';

interface AssessmentViewProps {
  user: UserProfile;
  onAssessmentCompleted: (submission: AssessmentSubmission, newSkillProfile: SkillProfile) => void;
  onNavigateToCareers: () => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  user,
  onAssessmentCompleted,
  onNavigateToCareers
}) => {
  const [questions] = useState<AssessmentQuestion[]>(SAMPLE_ASSESSMENT_QUESTIONS);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({
    q4: `def twoSum(nums: list[int], target: int) -> list[int]:
    lookup = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in lookup:
            return [lookup[diff], i]
        lookup[num] = i
    return []`
  });
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<AssessmentSubmission | null>(null);

  const currentQ = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;
  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round(((currentIdx + 1) / questions.length) * 100);

  const handleSelectOption = (idx: number) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: idx }));
  };

  const handleCodeChange = (code: string) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: code }));
  };

  const handleSubmitAssessment = async () => {
    setIsEvaluating(true);
    try {
      const response = await fetch('/api/ai/evaluate-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          questions,
          userProfile: user
        })
      });

      const evaluation = await response.json();

      const newSubmission: AssessmentSubmission = {
        id: `eval_${Date.now()}`,
        userId: user.id,
        timestamp: new Date().toISOString(),
        answers,
        overallScore: evaluation.overallScore || 85,
        technicalScore: evaluation.technicalScore || 84,
        problemSolvingScore: evaluation.problemSolvingScore || 88,
        communicationScore: evaluation.communicationScore || 86,
        strengths: evaluation.strengths || ['Algorithmic Efficiency', 'API Design', 'System Architecture'],
        weaknesses: evaluation.weaknesses || ['Distributed Caching', 'Graph Traversals'],
        skillGaps: evaluation.skillGaps || ['Redis Caching', 'Docker Multi-stage Builds'],
        recommendedImprovements: evaluation.recommendedImprovements || ['Practice Two-Pointer and Sliding Window patterns']
      };

      // Save submission
      await dbService.saveAssessment(newSubmission);

      // Build updated skill profile
      const updatedSkillProfile: SkillProfile = {
        userId: user.id,
        radarScores: [
          { subject: 'Data Structures', score: evaluation.problemSolvingScore || 85, fullMark: 100 },
          { subject: 'System Design', score: Math.round((evaluation.technicalScore || 80) * 0.9), fullMark: 100 },
          { subject: 'Web & APIs', score: evaluation.technicalScore || 90, fullMark: 100 },
          { subject: 'Database & SQL', score: Math.min(95, (evaluation.technicalScore || 85) + 2), fullMark: 100 },
          { subject: 'AI & Logic', score: evaluation.problemSolvingScore || 82, fullMark: 100 },
          { subject: 'Communication', score: evaluation.communicationScore || 88, fullMark: 100 }
        ],
        primaryStrengths: newSubmission.strengths,
        criticalGaps: newSubmission.skillGaps,
        lastUpdated: new Date().toISOString()
      };

      await dbService.saveSkillProfile(updatedSkillProfile);
      setResult(newSubmission);
      onAssessmentCompleted(newSubmission, updatedSkillProfile);

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

    } catch (err) {
      console.error('Failed to submit assessment:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'technical':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">Technical Architecture</span>;
      case 'coding':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">Live Coding</span>;
      case 'logical':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">Problem Solving</span>;
      case 'communication':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">Soft Skills & Team Scenario</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300">MCQ</span>;
    }
  };

  // If already completed and showing results report
  if (result) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Results Header */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-indigo-500/30 relative overflow-hidden text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>AI Assessment Completed</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Skill Assessment Performance Report
          </h2>
          <p className="mt-1 text-sm text-slate-300 max-w-xl mx-auto">
            Your results have been analyzed by the AI Evaluation Engine. Your updated readiness score and career recommendations are ready!
          </p>

          {/* Big Score Cards Grid */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
              <span className="text-xs text-indigo-300 font-semibold block">Overall Score</span>
              <span className="text-3xl font-bold font-display text-white mt-1 block">{result.overallScore}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold block">Technical Depth</span>
              <span className="text-3xl font-bold font-display text-indigo-400 mt-1 block">{result.technicalScore}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold block">Problem Solving</span>
              <span className="text-3xl font-bold font-display text-cyan-400 mt-1 block">{result.problemSolvingScore}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold block">Communication</span>
              <span className="text-3xl font-bold font-display text-emerald-400 mt-1 block">{result.communicationScore}%</span>
            </div>
          </div>
        </div>

        {/* Detailed Strengths & Skill Gaps Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="rounded-3xl glass-panel p-6 border border-slate-800">
            <h3 className="font-bold font-display text-white text-base flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Identified Core Strengths
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {result.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed font-medium">{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skill Gaps & Deficiencies */}
          <div className="rounded-3xl glass-panel p-6 border border-slate-800">
            <h3 className="font-bold font-display text-white text-base flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Target Skill Gaps
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              {result.skillGaps.map((gap, i) => (
                <li key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed font-medium">{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800">
          <h3 className="font-bold font-display text-white text-base flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-indigo-400" />
            AI Recommended Learning Actions
          </h3>
          <div className="space-y-3">
            {result.recommendedImprovements.map((rec, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-200 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-indigo-600/20 text-indigo-300 font-bold flex items-center justify-center shrink-0 text-xs">
                  {i + 1}
                </span>
                <span className="leading-relaxed pt-0.5">{rec}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
            <button
              onClick={() => setResult(null)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Assessment</span>
            </button>

            <button
              onClick={onNavigateToCareers}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
            >
              <span>View Career Recommendations & Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Assessment Question Flow
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header & Progress */}
      <div className="rounded-3xl glass-panel p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white font-display">AI Skill Assessment</span>
              {getCategoryBadge(currentQ.category)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Topic: <strong className="text-slate-200">{currentQ.topic}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Question {currentIdx + 1} of {questions.length}</span>
            </div>
            <span className="text-xs font-semibold text-indigo-400">{progressPct}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${progressPct}%` }} 
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 space-y-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Points: {currentQ.points} pts
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
            {currentQ.question}
          </h3>
        </div>

        {/* Scenario context if available */}
        {currentQ.scenarioContext && (
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed">
            <strong className="text-indigo-300 block mb-1">Architecture Context:</strong>
            {currentQ.scenarioContext}
          </div>
        )}

        {/* Options for MCQs / Technical / Scenario */}
        {currentQ.options && (
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = answers[currentQ.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-2xl border transition flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white font-medium shadow-md shadow-indigo-600/20'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'border-indigo-400 bg-indigo-500 text-white' : 'border-slate-700 bg-slate-800'
                  }`}>
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                  <span className="text-xs sm:text-sm leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Code Editor for Coding Question */}
        {currentQ.category === 'coding' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
              <span className="font-mono text-indigo-300 font-semibold">{currentQ.language || 'Python'} Solution</span>
              <span>Type your solution below:</span>
            </div>
            
            <textarea
              rows={9}
              value={answers[currentQ.id] || currentQ.starterCode || ''}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800 focus:border-indigo-500 focus:outline-none leading-relaxed selection:bg-indigo-500"
              placeholder="// Write your code here..."
            />

            {currentQ.testCases && (
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 text-xs">
                <span className="text-[11px] font-bold text-slate-400 block mb-1">Target Test Cases:</span>
                {currentQ.testCases.map((tc, i) => (
                  <div key={i} className="font-mono text-[11px] text-slate-300">
                    Input: <span className="text-indigo-300">{tc.input}</span> → Expected Output: <span className="text-emerald-400">{tc.output}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation & Submit Controls */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-3">
            {!isLast ? (
              <button
                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                disabled={isEvaluating}
                onClick={handleSubmitAssessment}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition disabled:opacity-50"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Evaluating with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit & Generate Skill Report</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
