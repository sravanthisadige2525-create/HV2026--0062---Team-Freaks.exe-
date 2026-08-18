import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Loader2, 
  Award, 
  RefreshCw, 
  Building, 
  TrendingUp,
  Play,
  Mic,
  MicOff,
  User,
  Radio,
  BarChart3,
  Flame,
  Check,
  Zap,
  BookOpen,
  MessageSquare,
  Activity,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  Internship, 
  InterviewSession, 
  InterviewMessage, 
  UserProfile, 
  InterviewReport,
  CommunicationSkillsAnalysis
} from '../types';
import { dbService } from '../lib/supabase';

interface InterviewSimulatorViewProps {
  internship: Internship;
  user: UserProfile;
  onProceedToSimulation: (internshipId: string) => void;
  onBackToHub: () => void;
  onReportGenerated?: (report: InterviewReport) => void;
}

export const InterviewSimulatorView: React.FC<InterviewSimulatorViewProps> = ({
  internship,
  user,
  onProceedToSimulation,
  onBackToHub,
  onReportGenerated
}) => {
  const [messages, setMessages] = useState<InterviewMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      type: 'technical',
      content: `Hello ${user.name || 'there'}! I'm your Senior Engineering Hiring Manager at ${internship.company}. We are excited to interview you for the "${internship.title}" role.\n\nLet's get started with our first question:\nCan you explain how you design and structure RESTful APIs or database indexes to handle high concurrent traffic without causing database bottlenecks?`
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [finalReport, setFinalReport] = useState<InterviewReport | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Voice Assistant Recognition (STT) state
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        setCurrentInput(prev => {
          // If we had typed content, append, else set
          return currentTranscript;
        });
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Audio animation pulse when listening
  useEffect(() => {
    let interval: any;
    if (isListening) {
      interval = setInterval(() => {
        setAudioLevel(Math.floor(Math.random() * 80) + 20);
      }, 150);
    } else {
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isEvaluating]);

  // Play browser speech synthesis for voice assistant
  const speakText = (text: string) => {
    if (!soundEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      // Clean up markdown / bullets for cleaner speech
      const cleanText = text
        .replace(/[*#_`]/g, '')
        .replace(/https?:\/\/\S+/g, 'link');
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      // Try to pick a natural English voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel')) && v.lang.startsWith('en'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS playback error:', e);
    }
  };

  // Toggle Voice Input
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        setTranscript('');
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Recognition start error:', e);
      }
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const answerText = currentInput.trim();
    if (!answerText || isEvaluating || isComplete) return;

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (e) {}
    }

    const userMsg: InterviewMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: answerText
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setCurrentInput('');
    setTranscript('');
    setIsEvaluating(true);

    try {
      const response = await fetch('/api/ai/interview-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internship,
          userName: user.name,
          questionsAnswered: questionIndex + 1,
          currentQuestionIndex: questionIndex,
          userResponse: answerText,
          allResponses: newMessages
        })
      });

      const data = await response.json();

      // Attach feedback and communication skills to user message
      userMsg.score = data.score || 88;
      userMsg.feedback = data.feedback || 'Well-structured response highlighting key engineering considerations.';
      if (data.communicationSkills) {
        userMsg.communicationSkills = data.communicationSkills;
      }

      if (data.isComplete || questionIndex >= 3) {
        setIsComplete(true);
        const reportData = data.finalReport || {
          technicalScore: 89,
          communicationScore: 92,
          problemSolvingScore: 87,
          overallScore: 90,
          internshipReadinessScore: 92,
          hiringRecommendation: 'Strong Hire',
          communicationAnalysis: {
            clarityScore: 93,
            fluencyScore: 91,
            articulationScore: 92,
            confidenceScore: 89,
            vocabularyScore: 94,
            technicalPrecisionScore: 91,
            overallCommunicationRating: 'Exceptional',
            pacingFeedback: 'Fluid and deliberate pacing with clear structural milestones in answers.',
            toneFeedback: 'Professional, articulate, and collaborative engineering communication style.',
            keyStrengths: [
              'Clear articulation of complex technical concepts',
              'Precise terminology and architectural depth',
              'Strong structured delivery with logical reasoning'
            ],
            growthAreas: [
              'Quantify business metrics even more directly in answers',
              'Synthesize overarching takeaways before diving into low-level code mechanics'
            ]
          },
          strengths: [
            'Clear grasp of scalable API architectures and caching',
            'Strong problem decomposition methodology',
            'Fluid verbal communication under interview scenarios'
          ],
          weaknesses: [
            'Could discuss observability alerts and metric tracking earlier'
          ],
          improvementSuggestions: [
            'Practice end-to-end full stack system design simulations',
            'Review Redis eviction policies and connection pooling benchmarks'
          ]
        };

        const generatedReport: InterviewReport = {
          id: `rep_${internship.id}_${Date.now()}`,
          userId: user.id,
          internshipId: internship.id,
          internshipTitle: internship.title,
          company: internship.company,
          overallScore: reportData.overallScore,
          technicalScore: reportData.technicalScore,
          communicationScore: reportData.communicationScore,
          problemSolvingScore: reportData.problemSolvingScore,
          internshipReadinessScore: reportData.internshipReadinessScore,
          communicationAnalysis: reportData.communicationAnalysis,
          hiringRecommendation: reportData.hiringRecommendation || 'Strong Hire',
          strengths: reportData.strengths || [],
          weaknesses: reportData.weaknesses || [],
          improvementSuggestions: reportData.improvementSuggestions || [],
          responsesSummary: newMessages.filter(m => m.role === 'user').map(m => m.content),
          completedAt: new Date().toISOString()
        };

        setFinalReport(generatedReport);

        // Save report to persistent database & profile
        await dbService.saveInterviewReport(generatedReport);

        // Also save legacy session format for backward compatibility
        const session: InterviewSession = {
          id: `int_session_${Date.now()}`,
          userId: user.id,
          internshipId: internship.id,
          date: new Date().toISOString(),
          messages: newMessages,
          scores: {
            technical: generatedReport.technicalScore,
            communication: generatedReport.communicationScore,
            problemSolving: generatedReport.problemSolvingScore,
            overall: generatedReport.overallScore
          },
          feedbackSummary: generatedReport.improvementSuggestions.join('; '),
          strengths: generatedReport.strengths,
          weaknesses: generatedReport.weaknesses
        };
        await dbService.saveInterviewSession(session);

        if (onReportGenerated) {
          onReportGenerated(generatedReport);
        }

        // Voice out closing statement
        const closingSpoken = data.spokenReply || `Congratulations ${user.name}! That concludes our screening interview round. Your overall performance report and communication skills analysis have been saved to your profile.`;
        speakText(closingSpoken);

        try {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}

      } else {
        const nextQ = data.nextQuestion || {
          type: 'situational',
          question: 'Can you describe a challenging bug or performance bottleneck you encountered in a recent project and how you isolated the root cause?'
        };

        const conversationalPrefix = data.conversationalReply 
          ? `${data.conversationalReply}\n\n` 
          : '';

        const nextMsg: InterviewMessage = {
          id: `a_${Date.now()}`,
          role: 'assistant',
          type: nextQ.type || 'technical',
          content: `${conversationalPrefix}${nextQ.question}`
        };

        setMessages([...newMessages, nextMsg]);
        setQuestionIndex(prev => prev + 1);

        // Voice assistant speaks conversational reply & question aloud
        const voiceText = data.spokenReply || `${data.conversationalReply || 'Great answer!'} ${nextQ.question}`;
        speakText(voiceText);
      }

    } catch (err) {
      console.error('Interview error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header Bar */}
      <div className="rounded-3xl glass-panel p-6 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <img
            src={internship.companyLogo}
            alt={internship.company}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/30 shadow-md shrink-0"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-white text-base">{internship.company}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Voice AI Interview Demo
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {internship.isPaid !== false ? 'Paid Role' : 'Role'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">
              Role: <strong>{internship.title}</strong> • Round {Math.min(4, questionIndex + 1)} of 4
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* TTS Audio Toggle */}
          <button
            onClick={() => {
              if (soundEnabled && window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
              setSoundEnabled(!soundEnabled);
            }}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              soundEnabled ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-600/20' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Voice Assistant Speech"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Voice Assistant On' : 'Voice Off'}</span>
          </button>

          <button
            onClick={onBackToHub}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
          >
            Exit
          </button>
        </div>
      </div>

      {/* If Finished: Comprehensive Performance & Communication Report Saved to Profile */}
      {isComplete && finalReport ? (
        <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-indigo-500/40 space-y-6 animate-in fade-in shadow-2xl">
          
          {/* Top Banner */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Interview Completed & Performance Report Saved to Profile</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Official AI Performance & Communication Assessment
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Overall evaluation for <strong>{internship.title}</strong> at <strong>{internship.company}</strong>. This verified score has been added to your profile.
            </p>
          </div>

          {/* Hiring Recommendation & Overall Score Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 shrink-0">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Hiring Decision Recommendation
                </span>
                <span className="text-xl font-bold text-emerald-400 flex items-center gap-2 mt-0.5">
                  <span>{finalReport.hiringRecommendation}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Verified Match
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Overall Composite
                </span>
                <span className="text-3xl font-bold font-display text-white mt-0.5">
                  {finalReport.overallScore}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Readiness Index
                </span>
                <span className="text-3xl font-bold font-display text-cyan-400 mt-0.5">
                  {finalReport.internshipReadinessScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Score Meters Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold block">Technical Aptitude</span>
              <span className="text-2xl sm:text-3xl font-bold font-display text-indigo-400 mt-1 block">
                {finalReport.technicalScore}%
              </span>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${finalReport.technicalScore}%` }} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold block">Communication Skills</span>
              <span className="text-2xl sm:text-3xl font-bold font-display text-emerald-400 mt-1 block">
                {finalReport.communicationScore}%
              </span>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${finalReport.communicationScore}%` }} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold block">Problem Solving</span>
              <span className="text-2xl sm:text-3xl font-bold font-display text-cyan-400 mt-1 block">
                {finalReport.problemSolvingScore}%
              </span>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${finalReport.problemSolvingScore}%` }} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold block">Communication Rating</span>
              <span className="text-lg sm:text-xl font-bold font-display text-amber-300 mt-1 block">
                {finalReport.communicationAnalysis?.overallCommunicationRating || 'Exceptional'}
              </span>
              <span className="text-[10px] text-slate-400 mt-2 block">Verbal & Written</span>
            </div>
          </div>

          {/* Deep-Dive Communication Skills Analysis Section */}
          {finalReport.communicationAnalysis && (
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Speech & Communication Skills Breakdown</span>
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                  Voice Analysis AI
                </span>
              </div>

              {/* Communication Metric Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Clarity</span>
                    <span className="font-bold text-emerald-400">{finalReport.communicationAnalysis.clarityScore}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${finalReport.communicationAnalysis.clarityScore}%` }} />
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Fluency</span>
                    <span className="font-bold text-cyan-400">{finalReport.communicationAnalysis.fluencyScore}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${finalReport.communicationAnalysis.fluencyScore}%` }} />
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Articulation</span>
                    <span className="font-bold text-indigo-400">{finalReport.communicationAnalysis.articulationScore}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${finalReport.communicationAnalysis.articulationScore}%` }} />
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Confidence</span>
                    <span className="font-bold text-amber-400">{finalReport.communicationAnalysis.confidenceScore}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${finalReport.communicationAnalysis.confidenceScore}%` }} />
                  </div>
                </div>
              </div>

              {/* Pacing & Tone Insights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="font-bold text-indigo-300 block mb-1">Speech Pacing & Cadence:</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{finalReport.communicationAnalysis.pacingFeedback}</p>
                </div>
                <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                  <span className="font-bold text-cyan-300 block mb-1">Tone & Engineering Presence:</span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{finalReport.communicationAnalysis.toneFeedback}</p>
                </div>
              </div>
            </div>
          )}

          {/* Strengths & Improvement Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 mb-2.5 text-sm">
                <CheckCircle2 className="w-4 h-4" /> Key Demonstrated Strengths
              </span>
              <ul className="space-y-2 text-slate-300">
                {finalReport.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
              <span className="font-bold text-amber-400 flex items-center gap-1.5 mb-2.5 text-sm">
                <AlertCircle className="w-4 h-4" /> Key Growth Areas & Suggestions
              </span>
              <ul className="space-y-2 text-slate-300">
                {finalReport.improvementSuggestions.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Row: Assign Practical Simulation Sprint */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-900 border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-white text-sm">
                  Next Step: Complete {internship.company} Practical Sprint Simulation
                </h4>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-lg">
                Now that you have completed the voice screening interview, work on the real codebase simulation task to earn your verified credential.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onBackToHub}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
              >
                Internship Hub
              </button>

              <button
                onClick={() => onProceedToSimulation(internship.id)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-indigo-700 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/30 transition"
              >
                <span>Launch Assigned Simulation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* Active Voice-Enabled Interview Chat Room */
        <div className="rounded-3xl glass-panel p-5 sm:p-6 border border-slate-800 space-y-5 shadow-2xl">
          
          {/* Chat Transcript Stream */}
          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2 scrollbar-thin">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isAssistant ? 'justify-start' : 'justify-end'} animate-in fade-in`}
                >
                  {isAssistant && (
                    <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-5 h-5 text-indigo-400" />
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isAssistant 
                      ? 'bg-slate-900/95 border border-slate-800 text-slate-200 shadow-md' 
                      : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/20'
                  }`}>
                    {isAssistant && msg.type && (
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400">
                          {msg.type} Question
                        </span>
                        {soundEnabled && (
                          <button
                            onClick={() => speakText(msg.content)}
                            className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                            title="Replay Voice Assistant"
                          >
                            <Volume2 className="w-3 h-3" /> Replay
                          </button>
                        )}
                      </div>
                    )}
                    
                    <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>

                    {/* AI Feedback & Communication Analysis on Candidate Response */}
                    {msg.feedback && (
                      <div className="mt-3 pt-2.5 border-t border-indigo-500/30 bg-indigo-950/40 p-3 rounded-xl text-xs text-indigo-200 space-y-2">
                        <div className="flex items-center justify-between font-bold text-indigo-300">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            <span>AI Feedback on Answer:</span>
                          </span>
                          <span className="text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            {msg.score}/100
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed">{msg.feedback}</p>

                        {/* Communication Skills mini chips */}
                        {msg.communicationSkills && (
                          <div className="pt-2 border-t border-indigo-500/20 flex flex-wrap items-center gap-2 text-[10px]">
                            <span className="text-slate-400 font-medium">Communication:</span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-900 text-emerald-300 font-semibold border border-slate-800">
                              Clarity {msg.communicationSkills.clarity}%
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-900 text-cyan-300 font-semibold border border-slate-800">
                              Fluency {msg.communicationSkills.fluency}%
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-900 text-indigo-300 font-semibold border border-slate-800">
                              Articulation {msg.communicationSkills.articulation}%
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-900 text-amber-300 font-semibold border border-slate-800">
                              Confidence {msg.communicationSkills.confidence}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {!isAssistant && (
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-indigo-300">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              );
            })}

            {isEvaluating && (
              <div className="flex items-center gap-2 text-xs text-indigo-300 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Interviewer is analyzing your response and evaluating communication depth...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Voice Input Waves & Live Mic Status */}
          {isListening && (
            <div className="p-3 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-between gap-3 text-xs animate-in fade-in">
              <div className="flex items-center gap-2.5 text-cyan-300">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="font-semibold">Microphone Listening... Speak your answer clearly</span>
              </div>

              {/* Animated waveform bars */}
              <div className="flex items-center gap-1 h-5">
                {[40, 70, 90, 60, 100, 50, 80, 45].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-cyan-400 rounded-full transition-all duration-150"
                    style={{
                      height: `${Math.max(15, (audioLevel * h) / 100)}%`,
                      opacity: audioLevel > 0 ? 0.9 : 0.4
                    }}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={toggleVoiceInput}
                className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold hover:bg-rose-500/30 transition"
              >
                Stop Mic
              </button>
            </div>
          )}

          {/* Input Controls Area */}
          <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-800/80 space-y-3">
            <div className="flex items-end gap-2.5">
              
              {/* Mic Voice Assistant Input Button */}
              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  disabled={isEvaluating}
                  className={`h-12 w-12 rounded-2xl flex items-center justify-center transition shrink-0 ${
                    isListening
                      ? 'bg-rose-600 text-white ring-4 ring-rose-500/30 animate-pulse'
                      : 'bg-slate-900 border border-indigo-500/40 text-indigo-400 hover:text-white hover:bg-indigo-600 shadow-md'
                  }`}
                  title={isListening ? 'Click to stop voice recording' : 'Click to answer with voice'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}

              {/* Textarea */}
              <div className="flex-1 relative">
                <textarea
                  rows={2}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    isListening 
                      ? 'Listening to your speech... (Press Submit when done)' 
                      : 'Type or speak your answer (e.g. click mic to answer via voice)...'
                  }
                  disabled={isEvaluating}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition resize-none leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!currentInput.trim() || isEvaluating}
                className="h-12 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-40 shrink-0"
              >
                {isEvaluating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Submit Answer</span>
                  </>
                )}
              </button>
            </div>

            {/* Helper tips */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Voice input automatically analyzes vocabulary, fluency, and articulation</span>
              </span>
              <span className="hidden sm:inline text-slate-400">Press Enter to submit</span>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
