import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  UserCheck, 
  Lightbulb, 
  ArrowRight, 
  BookOpen, 
  Briefcase, 
  CheckCircle2, 
  MessageSquare,
  Loader2
} from 'lucide-react';
import { UserProfile, MentorTip } from '../types';
import { SAMPLE_MENTOR_TIPS } from '../lib/mockData';

interface MentorshipViewProps {
  user: UserProfile;
}

export const MentorshipView: React.FC<MentorshipViewProps> = ({ user }) => {
  const [tips] = useState<MentorTip[]>(SAMPLE_MENTOR_TIPS);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model'; content: string }>>([
    {
      role: 'model',
      content: `Hello ${user.name}! I am your AI Career & Engineering Mentor. Based on your current career readiness score of ${user.careerReadinessScore}%, I can help you prepare for technical rounds, optimize your portfolio architecture, or review salary negotiation strategies. What's on your mind today?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userText = inputMessage;
    const newChat = [...messages, { role: 'user' as const, content: userText }];
    setMessages(newChat);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/mentor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newChat,
          userProfile: user,
          targetCareer: user.careerInterests[0] || 'Software Engineer'
        })
      });

      const data = await res.json();
      setMessages([...newChat, { role: 'model', content: data.reply }]);
    } catch (err) {
      setMessages([...newChat, { role: 'model', content: 'I encountered an issue connecting to the AI Mentor network. Please check back shortly.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>Dedicated AI Career Mentor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            1-on-1 AI Mentorship & Engineering Insights
          </h1>
          <p className="mt-1 text-sm text-slate-300 max-w-2xl">
            Get personalized guidance on interview techniques, system design tradeoffs, resume highlights, and career transitions.
          </p>
        </div>
      </div>

      {/* Main Workspace (2 columns: Curated Tips & Live Chat) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Curated Expert Tips (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Curated Career Playbooks</span>
          </h3>

          <div className="space-y-3">
            {tips.map((tip) => (
              <div
                key={tip.id}
                className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2 hover:border-indigo-500/40 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {tip.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">By {tip.author} ({tip.authorRole})</span>
                </div>

                <h4 className="font-bold text-sm text-white">{tip.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{tip.content}</p>

                <button
                  onClick={() => handleQuickPrompt(`Can you explain more about "${tip.title}" and how I can apply it to my interview preparation?`)}
                  className="pt-2 text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <span>Discuss this with AI Mentor</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Mentor Interactive Chat (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl glass-panel p-6 border border-slate-800 flex flex-col justify-between space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Principal AI Mentor</h4>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Online • Tailored to your profile
                </p>
              </div>
            </div>

            <span className="text-[11px] text-slate-400 font-mono">Gemini 3.7 Flash</span>
          </div>

          {/* Chat Messages */}
          <div className="space-y-4 max-h-[440px] overflow-y-auto pr-1">
            {messages.map((m, idx) => {
              const isAssistant = m.role === 'model';
              return (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-indigo-400" />
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isAssistant
                      ? 'bg-slate-900/90 border border-slate-800 text-slate-200'
                      : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  }`}>
                    <p className="whitespace-pre-line">{m.content}</p>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 p-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI Mentor is composing actionable career advice...</span>
              </div>
            )}
          </div>

          {/* Suggested Quick Starters */}
          <div className="pt-2 flex flex-wrap gap-1.5">
            {[
              'How do I answer "Tell me about yourself"?',
              'What portfolio projects impress tech recruiters?',
              'Explain Redis caching tradeoffs simply.'
            ].map((qs, i) => (
              <button
                key={i}
                onClick={() => handleQuickPrompt(qs)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:border-indigo-500/40 transition"
              >
                {qs}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask your career or technical question..."
              disabled={isTyping}
              className="flex-1 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="h-11 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition disabled:opacity-40 shrink-0"
            >
              {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
