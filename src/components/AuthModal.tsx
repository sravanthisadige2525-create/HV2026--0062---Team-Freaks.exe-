import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Lock,
  Phone,
  GraduationCap, 
  Code2, 
  Compass, 
  Sparkles, 
  Check, 
  ShieldCheck,
  LogIn,
  UserPlus,
  ArrowRight,
  LogOut,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  FileText,
  Mic,
  Award,
  Calendar,
  Briefcase
} from 'lucide-react';
import { UserProfile, InterviewReport, InternshipApplication } from '../types';
import { 
  signUpWithEmail, 
  signInWithEmail, 
  signInWithGoogle, 
  signInWithPhone, 
  verifyPhoneOtp, 
  signOut,
  getSupabaseConfig,
  dbService
} from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveProfile: (updated: UserProfile) => void;
  onAuthSuccess?: (user: UserProfile) => void;
}

type AuthTab = 'signin' | 'signup' | 'phone' | 'profile' | 'reports';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveProfile,
  onAuthSuccess
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Email / Password Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [collegeInput, setCollegeInput] = useState('Stanford University');
  const [branchInput, setBranchInput] = useState('Computer Science & Engineering');

  // Phone OTP Form State
  const [phone, setPhone] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Profile preferences state
  const [profName, setProfName] = useState(user.name);
  const [profEmail, setProfEmail] = useState(user.email);
  const [profCollege, setProfCollege] = useState(user.college || 'Stanford University');
  const [profBranch, setProfBranch] = useState(user.branch || 'Computer Science & Engineering');
  const [profYear, setProfYear] = useState(user.year || '3rd Year (Junior)');
  const [preferredLanguage, setPreferredLanguage] = useState(user.preferredLanguage || 'Python');
  const [currentSkillLevel, setCurrentSkillLevel] = useState(user.currentSkillLevel || 'Intermediate');
  const [interests, setInterests] = useState<string[]>(user.careerInterests || ['Full Stack Engineer', 'AI/ML Engineer']);

  // Saved reports & applications
  const [savedReports, setSavedReports] = useState<InterviewReport[]>([]);
  const [savedApps, setSavedApps] = useState<InternshipApplication[]>([]);

  useEffect(() => {
    if (isOpen) {
      const reports = dbService.getInterviewReports(user.id);
      const apps = dbService.getInternshipApplications(user.id);
      setSavedReports(reports);
      setSavedApps(apps);
    }
  }, [isOpen, user.id]);

  const supabaseConfig = getSupabaseConfig();

  if (!isOpen) return null;

  const careerOptions = [
    'Full Stack Engineer',
    'AI/ML Engineer',
    'Data Analyst',
    'Data Scientist',
    'Cloud & DevOps Engineer',
    'Cybersecurity Analyst',
    'Mobile Developer (React Native/Flutter)'
  ];

  const toggleInterest = (opt: string) => {
    if (interests.includes(opt)) {
      setInterests(interests.filter(i => i !== opt));
    } else {
      setInterests([...interests, opt]);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (supabaseConfig.isConfigured) {
        const data = await signInWithEmail(email, password);
        const authUser = data.user;
        const updated: UserProfile = {
          ...user,
          id: authUser?.id || user.id,
          email: authUser?.email || email,
          name: authUser?.user_metadata?.full_name || authUser?.user_metadata?.name || email.split('@')[0]
        };
        onSaveProfile(updated);
        if (onAuthSuccess) onAuthSuccess(updated);
        setSuccessMsg('Successfully signed in to your account!');
        setTimeout(() => onClose(), 800);
      } else {
        // Fallback local auth simulation
        const updated: UserProfile = {
          ...user,
          email: email,
          name: email.split('@')[0]
        };
        onSaveProfile(updated);
        setSuccessMsg('Successfully signed in to your account!');
        setTimeout(() => onClose(), 800);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (supabaseConfig.isConfigured) {
        const data = await signUpWithEmail(email, password, {
          name: fullName,
          college: collegeInput,
          branch: branchInput
        });
        const authUser = data.user;
        const updated: UserProfile = {
          ...user,
          id: authUser?.id || `usr_${Date.now()}`,
          email,
          name: fullName || email.split('@')[0],
          college: collegeInput,
          branch: branchInput
        };
        onSaveProfile(updated);
        if (onAuthSuccess) onAuthSuccess(updated);
        setSuccessMsg('Account created successfully! Profile initialized.');
        setTimeout(() => onClose(), 800);
      } else {
        const updated: UserProfile = {
          ...user,
          email,
          name: fullName || email.split('@')[0],
          college: collegeInput,
          branch: branchInput
        };
        onSaveProfile(updated);
        setSuccessMsg('Account created successfully! Profile initialized.');
        setTimeout(() => onClose(), 800);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (supabaseConfig.isConfigured) {
        await signInWithGoogle();
      } else {
        setErrorMsg('Please configure your Supabase URL & Anon Key to enable real Google OAuth.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google OAuth failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setErrorMsg('Please enter a valid phone number with country code (e.g., +1234567890).');
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    try {
      if (supabaseConfig.isConfigured) {
        await signInWithPhone(phone);
        setOtpSent(true);
        setSuccessMsg(`OTP successfully dispatched to ${phone}`);
      } else {
        setOtpSent(true);
        setSuccessMsg(`[Demo Mode] OTP sent to ${phone}. Enter 123456 to continue.`);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to send OTP. Ensure Supabase SMS provider is enabled.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (supabaseConfig.isConfigured) {
        const data = await verifyPhoneOtp(phone, otpToken);
        const authUser = data.user;
        const updated: UserProfile = {
          ...user,
          id: authUser?.id || user.id,
          name: user.name || `User ${phone.slice(-4)}`
        };
        onSaveProfile(updated);
        if (onAuthSuccess) onAuthSuccess(updated);
        setSuccessMsg('Phone verified! Authentication complete.');
        setTimeout(() => onClose(), 800);
      } else {
        const updated: UserProfile = {
          ...user,
          name: `User ${phone.slice(-4)}`
        };
        onSaveProfile(updated);
        setSuccessMsg('Phone verified!');
        setTimeout(() => onClose(), 800);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfilePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name: profName,
      email: profEmail,
      college: profCollege,
      branch: profBranch,
      year: profYear,
      preferredLanguage,
      currentSkillLevel: currentSkillLevel as any,
      careerInterests: interests
    };
    onSaveProfile(updated);
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => onClose(), 600);
  };

  const handleSignOut = async () => {
    await signOut();
    setSuccessMsg('Signed out successfully.');
    setTimeout(() => onClose(), 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-3xl glass-panel p-6 sm:p-8 border border-indigo-500/40 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-[1px] flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">Student & Career Account</h2>
              <p className="text-xs text-slate-400">Access your synchronized profile, skill assessments & certificates</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg text-lg">
            ✕
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => { setActiveTab('signin'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2 rounded-xl transition ${
              activeTab === 'signin'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2 rounded-xl transition ${
              activeTab === 'signup'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => { setActiveTab('phone'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2 rounded-xl transition ${
              activeTab === 'phone'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Phone / OTP
          </button>
          <button
            onClick={() => { setActiveTab('profile'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2 rounded-xl transition ${
              activeTab === 'profile'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => { setActiveTab('reports'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2 rounded-xl transition ${
              activeTab === 'reports'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            My Reports
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: SIGN IN */}
        {activeTab === 'signin' && (
          <div className="space-y-4">
            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google OAuth</span>
            </button>

            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-[1px] bg-slate-800" />
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">or email</span>
              <div className="flex-1 h-[1px] bg-slate-800" />
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In with Supabase'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: SIGN UP */}
        {activeTab === 'signup' && (
          <form onSubmit={handleEmailSignUp} className="space-y-3 text-xs">
            {/* Google OAuth Quick Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition shadow-sm mb-3"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Quick Sign Up with Google</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Alex Chen"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="alex.chen@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">College / University</label>
                <input
                  type="text"
                  value={collegeInput}
                  onChange={(e) => setCollegeInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Branch / Major</label>
                <input
                  type="text"
                  value={branchInput}
                  onChange={(e) => setBranchInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="Choose a secure password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
            >
              {loading ? 'Creating Profile...' : 'Sign Up & Initialize Profile'}
              <UserPlus className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* TAB 3: PHONE / OTP */}
        {activeTab === 'phone' && (
          <div className="space-y-4 text-xs">
            {!otpSent ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000 or +91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">We will send a 6-digit one-time verification code via SMS.</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
                >
                  {loading ? 'Sending OTP...' : 'Send Verification OTP'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOtp} className="space-y-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Enter 6-Digit OTP Code</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="123456"
                      value={otpToken}
                      onChange={(e) => setOtpToken(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-center tracking-widest font-mono text-base focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Sent to {phone}</span>
                    <button type="button" onClick={() => setOtpSent(false)} className="text-indigo-400 hover:underline">
                      Change Number
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify OTP & Authenticate'}
                  <Check className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE PREFERENCES */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfilePreferences} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={profEmail}
                  onChange={(e) => setProfEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">College / University</label>
                <input
                  type="text"
                  value={profCollege}
                  onChange={(e) => setProfCollege(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Branch / Major</label>
                <input
                  type="text"
                  value={profBranch}
                  onChange={(e) => setProfBranch(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Preferred Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Python">Python</option>
                  <option value="TypeScript">TypeScript / JavaScript</option>
                  <option value="Java">Java</option>
                  <option value="C++">C++</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Skill Level</label>
                <select
                  value={currentSkillLevel}
                  onChange={(e) => setCurrentSkillLevel(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Beginner">Beginner (1st - 2nd Year)</option>
                  <option value="Intermediate">Intermediate (Junior / Senior)</option>
                  <option value="Advanced">Advanced (Job Ready)</option>
                </select>
              </div>
            </div>

            {/* Career Interests Multi-select */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Career Interests & Target Roles</label>
              <div className="flex flex-wrap gap-1.5">
                {careerOptions.map((opt) => {
                  const isSelected = interests.includes(opt);
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => toggleInterest(opt)}
                      className={`px-3 py-1 rounded-xl border text-xs transition ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-500 text-white font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isSelected ? `✓ ${opt}` : `+ ${opt}`}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleSignOut}
                className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md shadow-indigo-600/30"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 5: SAVED INTERVIEW REPORTS & APPLICATIONS */}
        {activeTab === 'reports' && (
          <div className="space-y-5 text-xs max-h-[480px] overflow-y-auto pr-1">
            {/* Top Stat Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
                <span className="text-[10px] text-slate-400 block font-medium">Voice AI Screenings</span>
                <span className="text-lg font-bold text-indigo-300">{savedReports.length} Completed</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                <span className="text-[10px] text-slate-400 block font-medium">Direct Enrollments</span>
                <span className="text-lg font-bold text-emerald-400">{savedApps.length} Submitted</span>
              </div>
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 block font-medium">Verified Readiness</span>
                <span className="text-lg font-bold text-cyan-300">{user.careerReadinessScore}%</span>
              </div>
            </div>

            {/* Section 1: AI Voice Interview Performance Reports */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Mic className="w-4 h-4 text-indigo-400" />
                <h4 className="font-bold text-white text-xs">AI Voice Interview Reports & Communication Skills</h4>
              </div>

              {savedReports.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400">
                  <p>No voice interview screening reports recorded yet.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Click 'Try Internship Demo' on any internship to complete a voice screening and generate your report!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedReports.map(rep => (
                    <div key={rep.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h5 className="font-bold text-white text-sm">{rep.roleTitle}</h5>
                          <p className="text-[11px] text-indigo-400 font-medium">{rep.company} • {rep.date}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                            rep.overallScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-300'
                          }`}>
                            Score: {rep.overallScore}%
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{rep.status}</span>
                        </div>
                      </div>

                      {/* Communication Skills Breakdown */}
                      {rep.communicationSkills && (
                        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                          <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                            Communication Skills Metrics (STT Voice Analyzed)
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                              <span className="text-[10px] text-slate-400 block">Clarity</span>
                              <span className="font-bold text-indigo-300">{rep.communicationSkills.clarityScore}%</span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                              <span className="text-[10px] text-slate-400 block">Fluency</span>
                              <span className="font-bold text-cyan-300">{rep.communicationSkills.fluencyScore}%</span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                              <span className="text-[10px] text-slate-400 block">Confidence</span>
                              <span className="font-bold text-emerald-300">{rep.communicationSkills.confidenceScore}%</span>
                            </div>
                            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                              <span className="text-[10px] text-slate-400 block">Grammar</span>
                              <span className="font-bold text-amber-300">{rep.communicationSkills.grammarScore}%</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Feedback */}
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {rep.feedback}
                      </p>

                      {/* Strengths & Improvements */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        {rep.strengths && rep.strengths.length > 0 && (
                          <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-300">
                            <span className="font-semibold block mb-1">Key Strengths:</span>
                            <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                              {rep.strengths.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                          </div>
                        )}
                        {rep.areasForImprovement && rep.areasForImprovement.length > 0 && (
                          <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20 text-amber-300">
                            <span className="font-semibold block mb-1">Focus Areas:</span>
                            <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                              {rep.areasForImprovement.map((a, i) => <li key={i}>{a}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 2: Direct Enrolled Applications */}
            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2 mb-2.5">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-white text-xs">Direct Internship Enrollments</h4>
              </div>

              {savedApps.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400">
                  <p>No direct internship applications submitted yet.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Click 'Apply Directly' on any internship listing to review all details and enroll with your details.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {savedApps.map(app => (
                    <div key={app.id} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3">
                      <div>
                        <h5 className="font-bold text-white text-xs">{app.internshipTitle}</h5>
                        <p className="text-[11px] text-slate-400">{app.company} • Applied on {app.appliedAt}</p>
                        <p className="text-[11px] text-indigo-300 mt-1">Contact: {app.candidateEmail} | {app.candidatePhone}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 whitespace-nowrap">
                        {app.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
