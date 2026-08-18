import React, { useState } from 'react';
import { 
  Briefcase, 
  Play, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Sparkles, 
  Bot, 
  Code2, 
  ArrowRight,
  ShieldCheck,
  Send,
  MessageSquare,
  X,
  Volume2,
  Mic,
  Award,
  FileCheck,
  Check
} from 'lucide-react';
import { Internship, UserProfile, InternshipApplication } from '../types';
import { InternshipApplicationModal } from './InternshipApplicationModal';

interface InternshipHubViewProps {
  internships: Internship[];
  user: UserProfile;
  onStartSimulation: (internshipId: string) => void;
  onStartInterview: (internshipId: string) => void;
  onApplicationSubmitted?: (app: InternshipApplication) => void;
}

interface ChatbotMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const InternshipHubView: React.FC<InternshipHubViewProps> = ({
  internships,
  user,
  onStartSimulation,
  onStartInterview,
  onApplicationSubmitted
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  
  // Application Modal state
  const [selectedInternshipForApply, setSelectedInternshipForApply] = useState<Internship | null>(null);
  
  // Demo Choice Modal state
  const [demoModalInternship, setDemoModalInternship] = useState<Internship | null>(null);

  // Responsive AI Advisor Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatbotMessage[]>([
    {
      id: 'c1',
      sender: 'ai',
      text: `Hi ${user.name || 'there'}! I'm your Internship Career Advisor. Looking for high-stipend roles, wondering about the voice interview screening, or need help picking between Full Stack and AI/ML internships? Ask me anything!`,
      time: 'Just now'
    }
  ]);

  const filteredInternships = internships.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || item.type.toLowerCase() === selectedType.toLowerCase();
    const matchesRole = selectedRole === 'all' || item.role.toLowerCase().includes(selectedRole.toLowerCase());
    return matchesSearch && matchesType && matchesRole;
  });

  // Humanized responsive chatbot response generator
  const handleSendChatMessage = (textToSend?: string) => {
    const userText = (textToSend || chatInput).trim();
    if (!userText || isAiTyping) return;

    const userMsg: ChatbotMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsAiTyping(true);

    setTimeout(() => {
      let aiReply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('stipend') || lower.includes('paid') || lower.includes('salary') || lower.includes('money')) {
        aiReply = `All listed partner internships are verified paid positions with monthly stipends ranging between ₹40,000 and ₹55,000/month! Plus, top performers who finish the practical simulation sprint often receive Pre-Placement Offers (PPOs).`;
      } else if (lower.includes('voice') || lower.includes('interview') || lower.includes('assistant') || lower.includes('mic')) {
        aiReply = `The Voice AI Assistant conducts a live 4-round technical screening. You can speak your answers directly into the microphone! It analyzes your speech clarity, fluency, technical vocabulary, and architectural depth, then generates an official score report saved right to your profile.`;
      } else if (lower.includes('simulation') || lower.includes('demo') || lower.includes('task')) {
        aiReply = `When you launch an Internship Demo, you first take the Voice Screening Interview. Upon completion, the system automatically assigns the company's real Sprint Simulation where you solve practical tickets and receive Staff Engineer PR reviews!`;
      } else if (lower.includes('apply') || lower.includes('direct') || lower.includes('enroll')) {
        aiReply = `Clicking 'Apply Directly' opens our direct candidate enrollment portal with the full job description, location, duration, and stipend breakdown. You can submit your details right here without being redirected to external forms!`;
      } else if (lower.includes('cloudscale') || lower.includes('full stack')) {
        aiReply = `The Full Stack role at CloudScale Technologies focuses on React 19, Node.js, and PostgreSQL indexing. I recommend trying their Voice Interview Demo to get familiar with their API concurrency questions!`;
      } else {
        aiReply = `That's a great question! For internships at ${internships[0]?.company || 'our partners'}, we recommend completing the Voice AI screening and the practical code simulation. It helps hiring managers review your verified performance and fast-tracks your direct enrollment!`;
      }

      const aiMsg: ChatbotMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, aiMsg]);
      setIsAiTyping(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 relative">
      
      {/* Major USP Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-cyan-950/70 border border-indigo-500/30 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform Core Feature</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-display text-white tracking-tight">
            Experience the Internship <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Before You Apply</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Eliminate interview anxiety and prove your technical readiness. Every internship lets you run an interactive <strong>Voice AI Technical Screening</strong> (with live speech & communication skills analysis), execute <strong>Practical Sprint Simulations</strong>, or submit your direct enrollment profile instantly!
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl glass-panel p-4 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, title, or skills..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1 rounded-lg font-medium transition ${selectedType === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedType('remote')}
              className={`px-3 py-1 rounded-lg font-medium transition ${selectedType === 'remote' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Remote
            </button>
            <button
              onClick={() => setSelectedType('hybrid')}
              className={`px-3 py-1 rounded-lg font-medium transition ${selectedType === 'hybrid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Hybrid
            </button>
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Roles</option>
            <option value="Full Stack">Full Stack</option>
            <option value="Data Analyst">Data Analyst</option>
            <option value="AI/ML">AI / Machine Learning</option>
            <option value="Cloud">Cloud / DevOps</option>
            <option value="Cybersecurity">Cybersecurity</option>
          </select>
        </div>
      </div>

      {/* Internships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredInternships.map((internship) => (
          <div
            key={internship.id}
            className="rounded-3xl glass-panel p-6 border border-slate-800 hover:border-indigo-500/50 transition flex flex-col justify-between relative group shadow-xl"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={internship.companyLogo}
                    alt={internship.company}
                    className="w-12 h-12 rounded-2xl object-cover ring-1 ring-slate-700 shadow-md shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-indigo-300 transition">
                      {internship.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">{internship.company}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap block">
                    {internship.stipend}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">
                    {internship.isPaid !== false ? 'Paid Internship' : 'Unpaid'}
                  </span>
                </div>
              </div>

              {/* Meta Tags */}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {internship.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {internship.duration}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                  {internship.type}
                </span>
              </div>

              {/* Job Description */}
              <p className="mt-3 text-xs text-slate-300 leading-relaxed line-clamp-3">
                {internship.jobDescription}
              </p>

              {/* Responsibilities Preview */}
              <div className="mt-4 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 block">Core Responsibilities:</span>
                {internship.responsibilities.slice(0, 2).map((resp, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                    <span className="leading-snug text-[11px]">{resp}</span>
                  </div>
                ))}
              </div>

              {/* Skills Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {internship.requiredSkills.map((sk, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-900 text-indigo-300 border border-slate-800 font-medium">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* TWO CRITICAL ACTIONS: Apply Directly (Modal) OR Try Internship Demo (Voice Assistant) */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Option 1: Apply Directly (Opens Job Details & Direct Enrollment Form Modal) */}
              <button
                type="button"
                onClick={() => setSelectedInternshipForApply(internship)}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 hover:border-slate-600 transition shadow-sm"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Apply Directly</span>
              </button>

              {/* Option 2: Try Internship Demo (Launches Voice AI Interview & Sprint Simulation) */}
              <button
                type="button"
                onClick={() => setDemoModalInternship(internship)}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Try Internship Demo</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating / Embedded Responsive Humanized Chatbot */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-bold text-xs shadow-2xl hover:scale-105 transition group"
          >
            <Bot className="w-5 h-5 group-hover:animate-bounce" />
            <span>Internship AI Assistant</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </button>
        ) : (
          <div className="w-80 sm:w-96 rounded-3xl glass-panel p-4 border border-indigo-500/40 shadow-2xl flex flex-col h-[460px] animate-in fade-in slide-in-from-bottom-5">
            {/* Chatbot Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Internship Career Advisor</h4>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Humanized AI Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Message List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 scrollbar-thin text-xs pr-1">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-200 shadow-sm'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[9px] text-slate-400 block text-right mt-1">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}

              {isAiTyping && (
                <div className="flex items-center gap-1.5 text-xs text-indigo-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-slate-400 ml-1">Advisor is thinking...</span>
                </div>
              )}
            </div>

            {/* Quick Suggestion Chips */}
            <div className="py-2 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
              <button
                onClick={() => handleSendChatMessage('How does the voice interview work?')}
                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-800 whitespace-nowrap"
              >
                Voice Interview Details
              </button>
              <button
                onClick={() => handleSendChatMessage('Are all internships paid?')}
                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-800 whitespace-nowrap"
              >
                Stipends & PPOs
              </button>
            </div>

            {/* Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage();
              }}
              className="flex items-center gap-2 pt-2 border-t border-slate-800/80"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about internships, interview tips..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isAiTyping}
                className="p-2 rounded-xl bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-500 transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Internship Demo Choice Modal (Voice AI Interview OR Practical Simulation Sprint) */}
      {demoModalInternship && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDemoModalInternship(null);
          }}
        >
          <div className="relative w-full max-w-lg rounded-3xl glass-panel p-5 sm:p-7 border border-indigo-500/40 shadow-2xl space-y-5 text-slate-100 animate-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={demoModalInternship.companyLogo}
                  alt={demoModalInternship.company}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700 shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-white text-base leading-tight">{demoModalInternship.title}</h3>
                  <p className="text-xs text-slate-400">{demoModalInternship.company} Demo Pipeline</p>
                </div>
              </div>

              <button
                onClick={() => setDemoModalInternship(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
                title="Close modal"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Experience the complete recruiting & onboarding pipeline for this role. Complete the <strong>Voice AI Technical Screening</strong>, receive an official communication skills report saved to your profile, and then tackle the practical codebase simulation!
            </p>

            <div className="space-y-3">
              {/* Option A: Voice AI Interview Simulator */}
              <button
                onClick={() => {
                  const id = demoModalInternship.id;
                  setDemoModalInternship(null);
                  onStartInterview(id);
                }}
                className="w-full p-4 rounded-2xl bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/40 text-left transition flex items-start gap-4 group shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center shrink-0 text-indigo-300 group-hover:scale-110 transition">
                  <Mic className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">1. Voice AI Screening Interview</h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                      Step 1 (Recommended)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Answer questions in voice or text. Get live feedback on communication clarity, fluency, and technical accuracy. Saves overall report to your profile!
                  </p>
                </div>
              </button>

              {/* Option B: Internship Simulation Sprint */}
              <button
                onClick={() => {
                  const id = demoModalInternship.id;
                  setDemoModalInternship(null);
                  onStartSimulation(id);
                }}
                className="w-full p-4 rounded-2xl bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/30 text-left transition flex items-start gap-4 group shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center shrink-0 text-cyan-300 group-hover:scale-110 transition">
                  <Code2 className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">2. Practical Sprint Simulation Lab</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Work on actual engineering tasks, write production code, resolve performance bugs, and earn verified simulation certificates.
                  </p>
                </div>
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setDemoModalInternship(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Application & Enrollment Modal (Triggered by Apply Directly) */}
      {selectedInternshipForApply && (
        <InternshipApplicationModal
          internship={selectedInternshipForApply}
          user={user}
          isOpen={true}
          onClose={() => setSelectedInternshipForApply(null)}
          onApplicationSubmitted={(app) => {
            if (onApplicationSubmitted) onApplicationSubmitted(app);
          }}
          onTryDemo={(internshipId) => {
            setSelectedInternshipForApply(null);
            onStartInterview(internshipId);
          }}
        />
      )}

    </div>
  );
};
