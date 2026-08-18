import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Award, 
  Bell, 
  User, 
  ChevronDown,
  BookOpen,
  Code2,
  Briefcase,
  Trophy,
  BrainCircuit,
  FileText,
  LogIn,
  LogOut,
  UserCheck
} from 'lucide-react';
import { UserProfile, AppNotification } from '../types';
import { signOut } from '../lib/supabase';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserProfile;
  notifications: AppNotification[];
  onOpenAuthModal: (mode?: 'signin' | 'signup' | 'profile') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  notifications,
  onOpenAuthModal
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const isGuest = user.id === 'user_demo_01' && user.email === 'alex.chen@university.edu' && !user.isRegisteredUser;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BrainCircuit },
    { id: 'assessment', label: 'AI Assessment', icon: Sparkles },
    { id: 'careers', label: 'Careers', icon: CompassIcon },
    { id: 'internships', label: 'Internship Hub', icon: Briefcase, badge: 'USP' },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'arena', label: 'Code Arena', icon: Code2 },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'mentorship', label: 'Mentorship', icon: UserGroupIcon },
    { id: 'resume', label: 'Resume ATS', icon: FileText },
    { id: 'certificates', label: 'Certificates', icon: Award }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e) {}
    setShowUserMenu(false);
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & USP Badge */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-lg text-white tracking-tight">
                  Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Sphere</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  AI Career Engine
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400">
                Experience the internship before you apply
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Readiness score pill */}
            <div 
              onClick={() => setCurrentTab('assessment')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs cursor-pointer hover:border-indigo-500/40 transition group"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-400">Readiness:</span>
              <span className="font-bold text-emerald-400 group-hover:underline">
                {user.careerReadinessScore}%
              </span>
            </div>

            {/* Streak */}
            <div 
              onClick={() => setCurrentTab('leaderboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs cursor-pointer hover:bg-amber-500/20 transition"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-amber-300">{user.streakDays} Day Streak</span>
            </div>

            {/* Coding Points */}
            <div 
              onClick={() => setCurrentTab('arena')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs cursor-pointer hover:bg-indigo-500/20 transition"
            >
              <Award className="w-4 h-4 text-indigo-400" />
              <span className="font-bold text-indigo-300">{user.codingPoints} pts</span>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                )}
              </button>

              {showNotifs && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl glass-panel p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <span className="font-semibold text-sm text-white">Notifications</span>
                    <span className="text-xs text-indigo-400 font-medium">{unreadCount} new</span>
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`p-3 rounded-xl border text-xs transition ${
                          notif.read ? 'bg-slate-900/40 border-slate-800/60 text-slate-400' : 'bg-indigo-950/30 border-indigo-500/30 text-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-medium text-white">{notif.title}</span>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.timestamp}</span>
                        </div>
                        <p className="mt-1 text-slate-300 leading-relaxed">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Standard User Authentication Controls */}
            {isGuest ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuthModal('signin')}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 hover:text-white hover:border-slate-700 transition flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => onOpenAuthModal('signup')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition hidden sm:inline-flex items-center gap-1"
                >
                  <span>Sign Up</span>
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition"
                >
                  <img 
                    src={user.avatarUrl} 
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/40" 
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-semibold text-white leading-tight truncate max-w-[100px]">{user.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel p-2 shadow-2xl z-50 border border-slate-800 animate-in fade-in">
                    <div className="p-2.5 border-b border-slate-800/80 mb-1">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenAuthModal('profile');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-900 hover:text-white transition"
                    >
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Edit Profile</span>
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/30 transition mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      <span>Sign Out / Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

// Fallback helper icons
function CompassIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function UserGroupIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

