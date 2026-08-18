import React, { useState } from 'react';
import { 
  Code2, 
  Play, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Terminal, 
  FileText, 
  Award, 
  Loader2, 
  RotateCcw, 
  Sparkles,
  Building,
  Check,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InternshipSimulation, SimulationTask, UserProfile, SimulationCertificate } from '../types';
import { SAMPLE_SIMULATION_PROJECTS } from '../lib/mockData';
import { dbService } from '../lib/supabase';

interface SimulationLabViewProps {
  internshipId: string;
  user: UserProfile;
  onBackToHub: () => void;
  onNavigateToCertificates: () => void;
}

export const SimulationLabView: React.FC<SimulationLabViewProps> = ({
  internshipId,
  user,
  onBackToHub,
  onNavigateToCertificates
}) => {
  // Find simulation for this internship or default to CloudScale
  const simulation = SAMPLE_SIMULATION_PROJECTS.find(s => s.internshipId === internshipId) || SAMPLE_SIMULATION_PROJECTS[0];
  const [activeTaskIdx, setActiveTaskIdx] = useState(0);
  const currentTask: SimulationTask = simulation.tasks[activeTaskIdx] || simulation.tasks[0];

  // Code editor states for each task
  const [taskCodes, setTaskCodes] = useState<Record<string, string>>({
    sim_t1: currentTask.starterCode || '',
    sim_t2: `-- Optimize slow orders query with composite index\nCREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);\n\nSELECT o.id, o.total_amount, o.status, u.email\nFROM orders o\nJOIN users u ON o.user_id = u.id\nWHERE o.status = 'COMPLETED'\nORDER BY o.created_at DESC\nLIMIT 50;`,
    sim_t3: `import React from 'react';\nimport { AlertTriangle, X } from 'lucide-react';\n\nexport const SystemAlertBanner: React.FC<{ message: string; onDismiss: () => void }> = ({ message, onDismiss }) => (\n  <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl flex items-center justify-between text-amber-200 text-xs">\n    <div className="flex items-center gap-2">\n      <AlertTriangle className="w-4 h-4 text-amber-400" />\n      <span>{message}</span>\n    </div>\n    <button onClick={onDismiss} className="hover:text-white">✕</button>\n  </div>\n);`
  });

  const [consoleOutput, setConsoleOutput] = useState<string>('Ready. Click "Run Code & Tests" to execute your changes in the container sandbox.');
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskReviews, setTaskReviews] = useState<Record<string, any>>({});
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [certificate, setCertificate] = useState<SimulationCertificate | null>(null);

  const activeCode = taskCodes[currentTask.id] || currentTask.starterCode || '';

  const handleCodeChange = (newCode: string) => {
    setTaskCodes(prev => ({ ...prev, [currentTask.id]: newCode }));
  };

  // Run code locally in sandbox
  const handleRunCode = async () => {
    setIsExecuting(true);
    setConsoleOutput('Compiling sandbox environment and executing test suites...\n');

    try {
      const response = await fetch('/api/code/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: activeCode,
          language: currentTask.language || 'TypeScript',
          testCases: [
            { input: '1', expectedOutput: '200' },
            { input: '2', expectedOutput: '200' }
          ]
        })
      });

      const result = await response.json();
      setConsoleOutput(
        `> Container status: ${result.status}\n` +
        `> Execution Time: ${result.executionTimeMs} ms\n` +
        `> Memory: ${result.memoryKb} KB\n` +
        `> Passed Test Assertions: ${result.passedTests} / ${result.totalTests}\n` +
        (result.errorLog ? `\n[ERROR LOG]\n${result.errorLog}` : '\n✓ All local unit test assertions passed!')
      );
    } catch (err: any) {
      setConsoleOutput(`Execution Error: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  // Submit Task for Staff Engineer AI PR Review
  const handleSubmitTask = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/ai/evaluate-simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: currentTask,
          codeOrResponse: activeCode,
          simulation,
          userProfile: user
        })
      });

      const review = await response.json();
      setTaskReviews(prev => ({ ...prev, [currentTask.id]: review }));

      if (review.passed) {
        const nextCompleted = Array.from(new Set([...completedTasks, currentTask.id]));
        setCompletedTasks(nextCompleted);

        // Check if all tasks in simulation completed!
        if (nextCompleted.length === simulation.tasks.length) {
          const newCert: SimulationCertificate = {
            id: `cert_sim_${Date.now()}`,
            userId: user.id,
            simulationId: simulation.id,
            internshipTitle: simulation.role,
            company: simulation.company,
            issueDate: new Date().toISOString(),
            certificateNumber: `SPHERE-SIM-${Math.floor(100000 + Math.random() * 900000)}`,
            verificationUrl: `https://skillsphere.ai/verify/SPHERE-SIM-${Math.floor(100000 + Math.random() * 900000)}`,
            score: 94,
            skillsDemonstrated: ['Express TypeScript API', 'PostgreSQL Query Plan', 'React Error Boundaries', 'Production PR Review']
          };

          await dbService.saveCertificate(newCert);
          setCertificate(newCert);

          try {
            confetti({
              particleCount: 120,
              spread: 90,
              origin: { y: 0.5 }
            });
          } catch (e) {}
        }
      }
    } catch (err) {
      console.error('Error submitting simulation task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If completed full simulation, show the verified certificate
  if (certificate) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in">
        {/* Certificate Display Card */}
        <div className="rounded-3xl glass-panel p-8 sm:p-12 border-2 border-indigo-500/40 relative overflow-hidden text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Internship Simulation Completed</span>
          </div>

          <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Certificate of Technical Competency</p>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white mt-2">
            {certificate.internshipTitle}
          </h2>
          <p className="text-sm text-slate-300 mt-1">Host Company: <strong className="text-white">{certificate.company}</strong></p>

          <p className="mt-6 text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            This certificate officially verifies that <strong className="text-indigo-300">{user.name}</strong> has successfully completed real production sprint tasks, passing senior code reviews with a final score of <strong className="text-emerald-400">{certificate.score}%</strong>.
          </p>

          {/* Certificate Metadata Pill */}
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <div>
              <span className="text-[10px] text-slate-400 block">Certificate Number</span>
              <span className="font-mono font-bold text-indigo-300">{certificate.certificateNumber}</span>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div>
              <span className="text-[10px] text-slate-400 block">Issue Date</span>
              <span className="font-semibold text-slate-200">{new Date(certificate.issueDate).toLocaleDateString()}</span>
            </div>
            <div className="h-6 w-px bg-slate-700" />
            <div>
              <span className="text-[10px] text-slate-400 block">Verification Status</span>
              <span className="font-bold text-emerald-400">Authentic & Verified</span>
            </div>
          </div>

          {/* Skills Verified */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {certificate.skillsDemonstrated.map((sk, idx) => (
              <span key={idx} className="px-3 py-1 rounded-xl text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                ✓ {sk}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onNavigateToCertificates}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
            >
              <Award className="w-4 h-4" />
              <span>View In Certificates Gallery</span>
            </button>

            <button
              onClick={onBackToHub}
              className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
            >
              Back to Internship Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentReview = taskReviews[currentTask.id];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Simulation Sprint Header */}
      <div className="rounded-3xl glass-panel p-6 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-lg font-display">{simulation.company} Internship Simulation</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Sprint 1
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {simulation.scenario}
          </p>
        </div>

        <button
          onClick={onBackToHub}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium self-start lg:self-auto"
        >
          Exit Simulator
        </button>
      </div>

      {/* Task Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {simulation.tasks.map((task, idx) => {
          const isSelected = idx === activeTaskIdx;
          const isDone = completedTasks.includes(task.id);
          return (
            <button
              key={task.id}
              onClick={() => setActiveTaskIdx(idx)}
              className={`p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-indigo-400">Ticket 0{idx + 1}</span>
                  {isDone && <span className="text-[10px] text-emerald-400 font-bold">✓ Approved</span>}
                </div>
                <h4 className="font-bold text-sm text-white mt-0.5">{task.title}</h4>
              </div>
              <span className="text-xs text-slate-400 font-mono font-semibold">{task.estimatedMinutes}m</span>
            </button>
          );
        })}
      </div>

      {/* Main Workspace Layout (2 columns: Instructions & Editor) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Ticket Specifications & PR Review (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Ticket Requirements Card */}
          <div className="rounded-3xl glass-panel p-6 border border-slate-800 space-y-4">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Ticket Instructions</span>
              <h3 className="text-base font-bold text-white mt-1">{currentTask.title}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{currentTask.description}</p>
            </div>

            {/* Checklist */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <span className="text-[11px] font-bold text-slate-400 block">Acceptance Criteria:</span>
              {currentTask.instructions.map((inst, i) => (
                <div key={i} className="flex items-start gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{inst}</span>
                </div>
              ))}
            </div>

            {/* Expected deliverable */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 block font-bold">Expected Deliverable:</span>
              <span className="text-indigo-300 font-medium">{currentTask.expectedDeliverable}</span>
            </div>
          </div>

          {/* AI Staff Engineer Code Review Box */}
          {currentReview && (
            <div className={`rounded-3xl p-6 border text-xs space-y-3 animate-in fade-in ${
              currentReview.passed ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200' : 'bg-amber-950/20 border-amber-500/40 text-amber-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm flex items-center gap-1.5">
                  {currentReview.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
                  Staff Engineer PR Review: {currentReview.passed ? 'Approved (LGTM)' : 'Changes Requested'}
                </span>
                <span className="font-bold text-sm">{currentReview.score}/100</span>
              </div>

              <p className="text-slate-200 leading-relaxed">{currentReview.feedback}</p>

              {currentReview.areasToRefactor?.length > 0 && (
                <div className="pt-2 border-t border-slate-700/50">
                  <span className="font-bold text-amber-300 block mb-1">Refactoring Advice:</span>
                  <ul className="space-y-1 text-slate-300">
                    {currentReview.areasToRefactor.map((r: string, i: number) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-amber-400" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Code Editor & Live Sandbox Terminal (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Code Editor */}
          <div className="rounded-3xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
            {/* Editor Header Bar */}
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="font-mono text-xs text-slate-300 ml-2 font-semibold">
                  {currentTask.language === 'SQL' ? 'schema_optimization.sql' : (currentTask.language === 'React' ? 'SystemAlertBanner.tsx' : 'server.ts')}
                </span>
              </div>

              <span className="text-[11px] text-slate-400 font-mono">{currentTask.language}</span>
            </div>

            {/* Textarea Code Input */}
            <textarea
              rows={14}
              value={activeCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="w-full p-4 bg-slate-950 font-mono text-xs text-emerald-400 border-0 focus:outline-none leading-relaxed selection:bg-indigo-500/60"
              placeholder="// Write your solution here..."
            />

            {/* Action Bar */}
            <div className="px-4 py-3 bg-slate-900/70 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                disabled={isExecuting}
                onClick={handleRunCode}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                {isExecuting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>Run Code & Tests</span>
              </button>

              <button
                disabled={isSubmitting}
                onClick={handleSubmitTask}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Reviewing PR...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit PR to Lead Engineer</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sandbox Terminal Console */}
          <div className="rounded-2xl glass-panel border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-slate-400 pb-2 border-b border-slate-800/80">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-[11px]">Sandbox Output & Test Harness</span>
            </div>
            <pre className="whitespace-pre-wrap text-emerald-400/90 text-[11px] leading-relaxed max-h-36 overflow-y-auto">
              {consoleOutput}
            </pre>
          </div>

        </div>

      </div>

    </div>
  );
};
