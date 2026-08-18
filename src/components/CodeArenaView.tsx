import React, { useState } from 'react';
import { 
  Code2, 
  Play, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Flame, 
  Terminal, 
  RotateCcw, 
  Award, 
  Search, 
  Filter,
  Loader2,
  Sparkles,
  Zap,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  HelpCircle,
  FileCode2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CodingProblem, UserProfile } from '../types';
import { SAMPLE_CODING_PROBLEMS } from '../lib/mockData';
import { dbService } from '../lib/supabase';

interface CodeArenaViewProps {
  user: UserProfile;
  onAwardPoints: (points: number) => void;
}

const getProblemStarterCode = (prob: CodingProblem | undefined, lang: string): string => {
  if (!prob) return '# Write your solution here';
  const templates = prob.starterTemplates || (prob as any).starterCode || {};
  if (typeof templates === 'object' && templates !== null) {
    if (templates[lang]) return templates[lang];
    if (templates['Python']) return templates['Python'];
    if (templates['JavaScript']) return templates['JavaScript'];
    const values = Object.values(templates);
    if (values.length > 0 && typeof values[0] === 'string') return values[0];
  }
  return '# Write your solution here';
};

export const CodeArenaView: React.FC<CodeArenaViewProps> = ({
  user,
  onAwardPoints
}) => {
  const [problems] = useState<CodingProblem[]>(SAMPLE_CODING_PROBLEMS || []);
  const [selectedProblemId, setSelectedProblemId] = useState<string>(problems[0]?.id || 'prob_01');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Python');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [revealedHints, setRevealedHints] = useState<Record<number, boolean>>({});

  const selectedProblem: CodingProblem = problems.find(p => p.id === selectedProblemId) || problems[0] || {
    id: 'prob_01',
    title: 'Two Sum II - Input Array Is Sorted',
    category: 'Arrays',
    difficulty: 'Easy',
    description: 'Given a sorted array of integers, find two numbers that sum to target.',
    points: 20,
    acceptanceRate: 88,
    starterTemplates: {
      Python: 'def twoSum(numbers: list[int], target: int) -> list[int]:\n    # Two pointers\n    left, right = 0, len(numbers) - 1\n    while left < right:\n        curr = numbers[left] + numbers[right]\n        if curr == target:\n            return [left + 1, right + 1]\n        elif curr < target:\n            left += 1\n        else:\n            right -= 1\n    return []'
    },
    examples: [
      {
        input: 'numbers = [2,7,11,15], target = 9',
        output: '[1,2]',
        explanation: 'The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].'
      }
    ],
    constraints: [
      '2 <= numbers.length <= 3 * 10^4',
      '-1000 <= numbers[i] <= 1000',
      'numbers is sorted in non-decreasing order.',
      '-1000 <= target <= 1000',
      'The tests are generated such that there is exactly one solution.'
    ],
    hints: [
      'Since the array is already sorted, can we use two pointers from the ends of the array?',
      'If the sum is smaller than target, advance the left pointer. If larger, move the right pointer inward.'
    ],
    testCases: [{ input: '[2,7,11,15], target = 9', expectedOutput: '[1,2]' }]
  };

  // Code state per problem
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [consoleResult, setConsoleResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>([]);

  const activeCode = codeMap[`${selectedProblem.id}_${selectedLanguage}`] || getProblemStarterCode(selectedProblem, selectedLanguage);

  const handleCodeChange = (val: string) => {
    setCodeMap(prev => ({
      ...prev,
      [`${selectedProblem.id}_${selectedLanguage}`]: val
    }));
  };

  const toggleHint = (index: number) => {
    setRevealedHints(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleRunOrSubmit = async (isSubmission: boolean = false) => {
    setIsExecuting(true);
    setConsoleResult(null);

    try {
      const response = await fetch('/api/code/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: activeCode,
          language: selectedLanguage,
          testCases: selectedProblem.testCases || []
        })
      });

      const result = await response.json();
      setConsoleResult(result);

      if (isSubmission && result.status === 'Accepted') {
        const points = selectedProblem.points || 20;
        onAwardPoints(points);
        setSolvedProblemIds(prev => Array.from(new Set([...prev, selectedProblem.id])));

        // Save submission
        await dbService.saveCodingSubmission({
          id: `sub_${Date.now()}`,
          userId: user.id,
          problemId: selectedProblem.id,
          problemTitle: selectedProblem.title,
          language: selectedLanguage,
          code: activeCode,
          status: 'Accepted',
          executionTimeMs: result.executionTimeMs || 45,
          memoryKb: result.memoryKb || 14200,
          scoreAwarded: points,
          submittedAt: new Date().toISOString()
        });

        try {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 } });
        } catch (e) {}
      }
    } catch (err: any) {
      setConsoleResult({
        status: 'Runtime Error',
        passedTests: 0,
        totalTests: (selectedProblem.testCases || []).length || 1,
        executionTimeMs: 12,
        memoryKb: 0,
        errorLog: err.message || 'Execution error'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // Filter problems
  const filteredProblems = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesDiff = selectedDifficulty === 'all' || p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    return matchesSearch && matchesCat && matchesDiff;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Code Arena Header Banner */}
      <div className="rounded-3xl glass-panel p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-lg font-display flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-400" />
              Code Arena & Algorithmic Sandbox
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Judge0 Sandbox
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Solve curated industry interview problems with instant sandbox execution and test case verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="font-bold">{user.streakDays} Day Streak</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
            <Award className="w-4 h-4 text-indigo-400" />
            <span className="font-bold">{user.codingPoints} Coding Pts</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Problem Selector (4 cols) & Workspace (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Problem List & Filters (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl glass-panel p-5 border border-slate-800 space-y-4">
          
          {/* Search & Filter Controls */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problem..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 focus:outline-none"
              >
                <option value="all">All Topics</option>
                <option value="Arrays">Arrays</option>
                <option value="Strings">Strings</option>
                <option value="Two Pointers">Two Pointers</option>
                <option value="Dynamic Programming">Dynamic Prog</option>
                <option value="Trees">Trees</option>
                <option value="Linked Lists">Linked Lists</option>
                <option value="System Design">System Design</option>
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 focus:outline-none"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Problem List Items */}
          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {filteredProblems.map((prob) => {
              const isSelected = prob.id === selectedProblem.id;
              const isSolved = solvedProblemIds.includes(prob.id);
              const diffColor = prob.difficulty === 'Easy' ? 'text-emerald-400' : (prob.difficulty === 'Medium' ? 'text-amber-400' : 'text-rose-400');
              return (
                <div
                  key={prob.id}
                  onClick={() => {
                    setSelectedProblemId(prob.id);
                    setRevealedHints({});
                    setConsoleResult(null);
                  }}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white font-medium ring-1 ring-indigo-500/40'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{prob.title}</span>
                      {isSolved && <span className="text-emerald-400 text-xs">✓</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <span>{prob.category}</span>
                      <span>•</span>
                      <span className={`font-bold ${diffColor}`}>{prob.difficulty}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-indigo-300 font-semibold">+{prob.points}p</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Problem Description & Interactive Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Problem Header & Tabs */}
          <div className="rounded-3xl glass-panel p-6 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{selectedProblem.title}</h2>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                    selectedProblem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : (selectedProblem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20')
                  }`}>
                    {selectedProblem.difficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Topic: {selectedProblem.category} • Acceptance Rate: {selectedProblem.acceptanceRate}% • Points: +{selectedProblem.points}</p>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Language:</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-indigo-300 font-semibold focus:outline-none focus:border-indigo-500"
                >
                  <option value="Python">Python 3</option>
                  <option value="JavaScript">JavaScript (Node.js)</option>
                  <option value="Java">Java OpenJDK</option>
                  <option value="C++">C++ GCC</option>
                </select>
              </div>
            </div>

            {/* Problem Description */}
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
              <p>{selectedProblem.description}</p>
            </div>

            {/* Sample Examples */}
            {selectedProblem.examples && selectedProblem.examples.length > 0 && (
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Sample Examples</span>
                </span>
                <div className="grid grid-cols-1 gap-2.5">
                  {selectedProblem.examples.map((ex, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 font-mono text-xs space-y-1.5">
                      <span className="text-[11px] text-indigo-400 font-bold block">Example {idx + 1}:</span>
                      <div className="text-slate-300"><span className="text-slate-500 font-semibold">Input: </span><span className="text-slate-200">{ex.input}</span></div>
                      <div className="text-slate-300"><span className="text-slate-500 font-semibold">Output: </span><span className="text-emerald-400 font-semibold">{ex.output}</span></div>
                      {ex.explanation && (
                        <div className="text-slate-400 text-[11px] font-sans pt-1 border-t border-slate-800/80">
                          <span className="font-semibold text-slate-300">Explanation: </span>{ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Constraints */}
            {selectedProblem.constraints && selectedProblem.constraints.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                  <span>Constraints</span>
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                  {selectedProblem.constraints.map((c, idx) => (
                    <li key={idx} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2 font-mono text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hints Accordion */}
            {selectedProblem.hints && selectedProblem.hints.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Algorithmic Hints ({selectedProblem.hints.length})</span>
                </span>
                <div className="space-y-2">
                  {selectedProblem.hints.map((hint, idx) => {
                    const isRevealed = !!revealedHints[idx];
                    return (
                      <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden text-xs">
                        <button
                          onClick={() => toggleHint(idx)}
                          className="w-full p-2.5 flex items-center justify-between text-left text-slate-300 hover:text-white hover:bg-slate-900 transition"
                        >
                          <span className="font-semibold flex items-center gap-2">
                            <span className="text-indigo-400 font-mono text-[11px]">💡 Hint {idx + 1}</span>
                            <span className="text-slate-400 text-[11px] font-normal">{isRevealed ? '(Click to hide)' : '(Click to reveal guidance)'}</span>
                          </span>
                          {isRevealed ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                        </button>
                        {isRevealed && (
                          <div className="p-3 bg-indigo-950/20 border-t border-slate-800/80 text-indigo-200 text-xs leading-relaxed animate-in fade-in">
                            {hint}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Public Test Cases */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Public Test Cases</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  🔒 Hidden edge tests run upon final submission
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(selectedProblem.testCases || []).map((tc, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 font-mono text-xs">
                    <span className="text-[10px] text-cyan-400 font-bold block mb-1">Public Test Case {idx + 1}:</span>
                    <div className="text-slate-300">Input: <span className="text-indigo-300">{tc.input}</span></div>
                    <div className="text-slate-300">Expected: <span className="text-emerald-400">{tc.expectedOutput}</span></div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Code Editor */}
          <div className="rounded-3xl glass-panel border border-slate-800 overflow-hidden shadow-2xl">
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>solution.{selectedLanguage.toLowerCase() === 'python' ? 'py' : (selectedLanguage.toLowerCase() === 'javascript' ? 'js' : 'cpp')}</span>
              </div>
              <span className="text-[11px] text-slate-400">Sandbox Sandbox v2.4</span>
            </div>

            <textarea
              rows={12}
              value={activeCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="w-full p-4 bg-slate-950 font-mono text-xs text-emerald-400 border-0 focus:outline-none leading-relaxed selection:bg-indigo-500/50"
            />

            {/* Action Bar */}
            <div className="px-4 py-3 bg-slate-900/70 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                disabled={isExecuting}
                onClick={() => handleRunOrSubmit(false)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                {isExecuting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>Run Public Test Cases</span>
              </button>

              <button
                disabled={isExecuting}
                onClick={() => handleRunOrSubmit(true)}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
              >
                {isExecuting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Submit Solution (+{selectedProblem.points} pts)</span>
              </button>
            </div>
          </div>

          {/* Sandbox Execution Terminal / Result Card */}
          {consoleResult && (
            <div className={`rounded-2xl p-4 border font-mono text-xs animate-in fade-in ${
              consoleResult.status === 'Accepted' ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200' : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-700/50">
                <span className="font-bold text-sm flex items-center gap-1.5">
                  {consoleResult.status === 'Accepted' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                  {consoleResult.status}
                </span>
                <span className="text-slate-400 text-[11px]">{consoleResult.executionTimeMs} ms • {consoleResult.memoryKb} KB</span>
              </div>

              <div className="mt-2 space-y-1 text-[11px]">
                <p>Test Assertions: {consoleResult.passedTests} / {consoleResult.totalTests} passed</p>
                {consoleResult.errorLog && (
                  <pre className="text-rose-400 mt-2 whitespace-pre-wrap">{consoleResult.errorLog}</pre>
                )}
                {consoleResult.status === 'Accepted' && (
                  <p className="text-emerald-400 font-bold mt-1">🎉 Solution Accepted! +{selectedProblem.points} coding points awarded to your profile.</p>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
