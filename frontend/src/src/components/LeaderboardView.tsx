import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Award, 
  Medal, 
  Crown, 
  TrendingUp, 
  Search, 
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { LeaderboardEntry, UserProfile } from '../types';
import { SAMPLE_LEADERBOARD } from '../lib/mockData';

interface LeaderboardViewProps {
  user: UserProfile;
  onNavigateToArena: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  user,
  onNavigateToArena
}) => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const [searchQuery, setSearchQuery] = useState('');

  // Add current user to leaderboard list without duplicates
  const entries: LeaderboardEntry[] = [
    ...SAMPLE_LEADERBOARD.filter(e => e.userId !== user.id),
    {
      id: `current_user_${user.id}`,
      userId: user.id,
      name: `${user.name} (You)`,
      avatarUrl: user.avatarUrl,
      college: user.college,
      points: user.codingPoints,
      problemsSolved: 42,
      accuracy: 94,
      streakDays: user.streakDays,
      rank: 4,
      badges: user.badges || ['Speed Demon', 'Simulation Certified']
    }
  ].sort((a, b) => b.points - a.points).map((entry, idx) => ({
    ...entry,
    rank: idx + 1
  }));

  const filtered = entries.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.college.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Competitive Arena Standings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Developer Leaderboard & Streaks
          </h1>
          <p className="mt-1 text-sm text-slate-300 max-w-xl">
            Ranked by verified algorithmic problem solves, daily streaks, and completed simulation tickets.
          </p>
        </div>

        <button
          onClick={onNavigateToArena}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition self-start md:self-auto"
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Earn Arena Points</span>
        </button>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {entries.slice(0, 3).map((top, idx) => {
          const medals = [
            { bg: 'from-amber-500/20 to-yellow-500/10', border: 'border-amber-500/50', iconColor: 'text-amber-400', label: '1st Place' },
            { bg: 'from-slate-400/20 to-slate-500/10', border: 'border-slate-400/50', iconColor: 'text-slate-300', label: '2nd Place' },
            { bg: 'from-amber-700/20 to-amber-800/10', border: 'border-amber-700/50', iconColor: 'text-amber-600', label: '3rd Place' }
          ][idx];

          return (
            <div
              key={`podium_${top.userId || top.id || idx}_${idx}`}
              className={`rounded-3xl p-6 bg-gradient-to-b ${medals.bg} border ${medals.border} flex flex-col items-center text-center relative overflow-hidden shadow-xl`}
            >
              <div className="w-16 h-16 rounded-2xl ring-2 ring-indigo-500/40 p-0.5 relative mb-3">
                <img
                  src={top.avatarUrl}
                  alt={top.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-[14px] object-cover"
                />
                <span className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">
                  #{idx + 1}
                </span>
              </div>

              <span className={`text-[11px] font-bold uppercase tracking-wider ${medals.iconColor}`}>{medals.label}</span>
              <h3 className="font-bold text-base text-white mt-0.5">{top.name}</h3>
              <p className="text-xs text-slate-400">{top.college}</p>

              <div className="mt-4 pt-3 border-t border-white/10 w-full flex items-center justify-around text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Points</span>
                  <span className="font-bold text-white font-mono">{top.points}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Streak</span>
                  <span className="font-bold text-amber-400 font-mono">{top.streakDays}d 🔥</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leaderboard Table & Timeframe Switcher */}
      <div className="rounded-3xl glass-panel p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${timeframe === 'weekly' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Weekly Sprint
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${timeframe === 'monthly' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeframe('allTime')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${timeframe === 'allTime' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              All Time
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student or college..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Table Rows */}
        <div className="space-y-2">
          {filtered.map((item, idx) => {
            const isMe = item.userId === user.id;
            return (
              <div
                key={`lb_row_${item.userId || item.id || idx}_${idx}`}
                className={`p-4 rounded-2xl border text-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isMe
                    ? 'bg-indigo-950/40 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                    item.rank === 1 ? 'bg-amber-500/20 text-amber-300 font-mono' : 'bg-slate-800 text-slate-400 font-mono'
                  }`}>
                    #{item.rank}
                  </span>

                  <img
                    src={item.avatarUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{item.name}</span>
                      {isMe && <span className="px-2 py-0.2 rounded-full text-[10px] bg-indigo-500 text-white font-bold">YOU</span>}
                    </div>
                    <span className="text-[11px] text-slate-400">{item.college}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-auto text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Solved</span>
                    <span className="font-semibold text-slate-200 font-mono">{item.problemsSolved}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Streak</span>
                    <span className="font-semibold text-amber-400 font-mono">{item.streakDays}d</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Points</span>
                    <span className="font-bold text-indigo-300 font-mono text-sm">{item.points}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
