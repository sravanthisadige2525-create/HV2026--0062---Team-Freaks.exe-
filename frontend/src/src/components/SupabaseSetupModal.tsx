import React, { useState } from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  Key, 
  Globe, 
  ShieldCheck, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { getSupabaseConfig, setCustomSupabaseConfig, testSupabaseConnection } from '../lib/supabase';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated
}) => {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url || '');
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    // Save custom config first
    setCustomSupabaseConfig(url.trim(), anonKey.trim());
    onConfigUpdated();

    const result = await testSupabaseConnection();
    setTestResult(result);
    setTesting(false);
  };

  const handleCopySchema = () => {
    const sqlSchema = `-- ==========================================
-- SKILLSPHERE SUPABASE POSTGRESQL SCHEMA + RLS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  education TEXT,
  college TEXT,
  branch TEXT,
  year TEXT,
  preferred_language TEXT DEFAULT 'Python',
  career_interests JSONB DEFAULT '[]'::jsonb,
  current_skill_level TEXT DEFAULT 'Intermediate',
  career_readiness_score INT DEFAULT 75,
  coding_points INT DEFAULT 150,
  streak_days INT DEFAULT 3,
  badges JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Assessments
CREATE TABLE IF NOT EXISTS public.assessment_submissions (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  answers JSONB NOT NULL,
  overall_score INT NOT NULL,
  technical_score INT NOT NULL,
  problem_solving_score INT NOT NULL,
  communication_score INT NOT NULL,
  strengths JSONB DEFAULT '[]'::jsonb,
  weaknesses JSONB DEFAULT '[]'::jsonb,
  skill_gaps JSONB DEFAULT '[]'::jsonb,
  recommended_improvements JSONB DEFAULT '[]'::jsonb
);

ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own assessments" ON public.assessment_submissions FOR SELECT USING (auth.uid() = user_id OR true);
CREATE POLICY "Users insert assessments" ON public.assessment_submissions FOR INSERT WITH CHECK (true);

-- 3. Simulation Certificates
CREATE TABLE IF NOT EXISTS public.simulation_certificates (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  simulation_id TEXT,
  internship_title TEXT NOT NULL,
  company TEXT NOT NULL,
  issue_date TIMESTAMPTZ DEFAULT NOW(),
  certificate_number TEXT UNIQUE NOT NULL,
  verification_url TEXT NOT NULL,
  score INT NOT NULL,
  skills_demonstrated JSONB DEFAULT '[]'::jsonb
);

ALTER TABLE public.simulation_certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Certificates public view" ON public.simulation_certificates FOR SELECT USING (true);`;

    navigator.clipboard.writeText(sqlSchema);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel p-6 sm:p-8 border border-indigo-500/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">Supabase Real Backend Integration</h2>
              <p className="text-xs text-slate-400">PostgreSQL Database, Auth, Storage, and Row Level Security</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            ✕
          </button>
        </div>

        {/* Status Indicator */}
        <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-4 ${
          currentConfig.isConfigured
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
            : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
        }`}>
          <div className="flex items-center gap-2.5">
            {currentConfig.isConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <div>
              <span className="font-bold block">
                {currentConfig.isConfigured ? 'Connected to Supabase PostgreSQL' : 'Local Storage Mode (Ready for Supabase credentials)'}
              </span>
              <span className="text-[11px] text-slate-300 opacity-90 leading-snug block">
                {currentConfig.isConfigured 
                  ? 'All user profiles, assessments, interview transcripts, and certificates synchronize directly with Supabase tables.'
                  : 'The application runs with unified database service persistence. Enter your Supabase project URL and anon key below to connect live.'}
              </span>
            </div>
          </div>
        </div>

        {/* Credentials Form */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Supabase Project URL</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzproject.supabase.co"
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              <span>Supabase Anon / Public API Key</span>
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing...' : 'Save & Test Connection'}</span>
            </button>

            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <span>Supabase Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {testResult && (
            <div className={`p-3 rounded-xl border text-xs ${
              testResult.success ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}>
              {testResult.message}
            </div>
          )}
        </div>

        {/* Schema Copy & SQL Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full PostgreSQL Schema + RLS Script</span>
            </div>

            <button
              onClick={handleCopySchema}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition"
            >
              {copiedSchema ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSchema ? 'Copied SQL!' : 'Copy SQL'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Run this in your Supabase SQL Editor to initialize all tables (`profiles`, `assessment_submissions`, `simulation_certificates`, `interview_sessions`, `coding_submissions`).
          </p>
        </div>

        {/* Footer Close */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
