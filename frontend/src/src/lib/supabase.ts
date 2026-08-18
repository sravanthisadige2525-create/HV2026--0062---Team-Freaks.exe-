import { createClient, SupabaseClient, User as SupabaseAuthUser } from '@supabase/supabase-js';
import { 
  UserProfile, 
  AssessmentSubmission, 
  CareerRecommendation, 
  Internship, 
  InternshipSimulation, 
  SimulationSubmission, 
  InterviewSession, 
  InterviewReport,
  InternshipApplication,
  Course, 
  Certificate, 
  CodingProblem, 
  CodingSubmission, 
  Mentor, 
  MentorTip, 
  AppNotification, 
  SkillProfile,
  LeaderboardEntry
} from '../types';
import { 
  INITIAL_USER, 
  SAMPLE_ASSESSMENT_QUESTIONS, 
  SAMPLE_CAREERS, 
  SAMPLE_INTERNSHIPS, 
  SAMPLE_SIMULATIONS, 
  SAMPLE_COURSES, 
  SAMPLE_CODING_PROBLEMS, 
  SAMPLE_LEADERBOARD, 
  SAMPLE_MENTORS, 
  SAMPLE_MENTOR_TIPS, 
  SAMPLE_CERTIFICATES 
} from './mockData';

// Local storage key constants
const STORAGE_KEYS = {
  USER_PROFILE: 'aicareer_profile',
  ASSESSMENTS: 'aicareer_assessments',
  SKILL_PROFILES: 'aicareer_skill_profiles',
  CAREERS: 'aicareer_careers',
  INTERNSHIPS: 'aicareer_internships',
  SIMULATION_SUBMISSIONS: 'aicareer_simulation_submissions',
  INTERVIEW_SESSIONS: 'aicareer_interview_sessions',
  INTERVIEW_REPORTS: 'aicareer_interview_reports',
  INTERNSHIP_APPLICATIONS: 'aicareer_internship_applications',
  COURSES: 'aicareer_courses',
  COURSE_PROGRESS: 'aicareer_course_progress',
  CERTIFICATES: 'aicareer_certificates',
  CODING_PROBLEMS: 'aicareer_coding_problems',
  CODING_SUBMISSIONS: 'aicareer_coding_submissions',
  MENTORS: 'aicareer_mentors',
  MENTOR_TIPS: 'aicareer_mentor_tips',
  NOTIFICATIONS: 'aicareer_notifications',
  SUPABASE_CONFIG: 'aicareer_supabase_config'
};

// Check environment or stored credentials
export function getSupabaseConfig() {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
  
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return { url: parsed.url, anonKey: parsed.anonKey, isConfigured: true, source: 'localStorage' as const };
      }
    }
  } catch (e) {
    // Ignore storage parse error
  }

  if (envUrl && envKey && !envUrl.includes('placeholder')) {
    return { url: envUrl, anonKey: envKey, isConfigured: true, source: 'env' as const };
  }

  return { url: envUrl, anonKey: envKey, isConfigured: false, source: 'none' as const };
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.isConfigured || !config.url || !config.anonKey) {
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey);
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return supabaseInstance;
}

export function saveCustomSupabaseConfig(url: string, anonKey: string) {
  localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify({ url, anonKey }));
  try {
    supabaseInstance = createClient(url, anonKey);
    return true;
  } catch (e) {
    console.error('Error instantiating Supabase client:', e);
    return false;
  }
}

export const setCustomSupabaseConfig = saveCustomSupabaseConfig;

export async function testSupabaseConnection(url?: string, anonKey?: string): Promise<{ success: boolean; message: string }> {
  try {
    const client = url && anonKey ? createClient(url, anonKey) : getSupabaseClient();
    if (!client) {
      return { success: false, message: 'Supabase URL and Anon Key are missing or empty.' };
    }
    const { error } = await client.from('profiles').select('id').limit(1);
    if (error) {
      if (error.code === '42P01') {
        return { success: true, message: 'Connected to Supabase! (Tables need creation: run the SQL schema).' };
      }
      return { success: false, message: `Supabase returned: ${error.message}` };
    }
    return { success: true, message: 'Successfully connected and verified Supabase database!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Connection failed.' };
  }
}

// ==============================================================================
// SUPABASE AUTHENTICATION HELPERS
// ==============================================================================

export async function signUpWithEmail(email: string, password: string, metadata?: { name?: string; college?: string; branch?: string }) {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Please configure your Supabase credentials first in the Supabase Setup modal.');
  }

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: metadata?.name || email.split('@')[0],
        name: metadata?.name || email.split('@')[0],
        college: metadata?.college || 'Stanford University',
        branch: metadata?.branch || 'Computer Science'
      }
    }
  });

  if (error) throw error;
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Please configure your Supabase credentials first in the Supabase Setup modal.');
  }

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Please configure your Supabase credentials first in the Supabase Setup modal.');
  }

  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });

  if (error) throw error;
  return data;
}

export async function signInWithPhone(phone: string) {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Please configure your Supabase credentials first in the Supabase Setup modal.');
  }

  const { data, error } = await client.auth.signInWithOtp({
    phone
  });

  if (error) throw error;
  return data;
}

export async function verifyPhoneOtp(phone: string, token: string) {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error('Please configure your Supabase credentials first in the Supabase Setup modal.');
  }

  const { data, error } = await client.auth.verifyOtp({
    phone,
    token,
    type: 'sms'
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const client = getSupabaseClient();
  if (client) {
    await client.auth.signOut();
  }
}

export async function getCurrentAuthUser(): Promise<SupabaseAuthUser | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data } = await client.auth.getUser();
    return data?.user || null;
  } catch (e) {
    return null;
  }
}

export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const client = getSupabaseClient();
  if (!client) return { unsubscribe: () => {} };
  const { data: { subscription } } = client.auth.onAuthStateChange(callback);
  return subscription;
}

// ==============================================================================
// RESILIENT UNIFIED DATABASE & STATE SERVICE
// ==============================================================================

class DatabaseService {
  // Profiles
  async getProfile(id?: string): Promise<UserProfile> {
    const client = getSupabaseClient();
    if (client && id) {
      try {
        const { data, error } = await client
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
        
        if (data && !error) {
          const profile: UserProfile = {
            id: data.id,
            email: data.email || 'student@university.edu',
            name: data.name || 'Student',
            role: data.role || 'student',
            avatarUrl: data.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            education: data.education || 'B.Tech in Computer Science & Engineering',
            college: data.college || 'Stanford University',
            branch: data.branch || 'Computer Science',
            year: data.year || '3rd Year (Junior)',
            graduationYear: data.graduation_year || 2027,
            preferredLanguage: data.preferred_language || 'Python',
            currentSkillLevel: data.current_skill_level || 'Intermediate',
            careerInterests: data.career_interests || ['Full Stack Engineer', 'AI/ML Engineer'],
            badges: data.badges || ['Problem Solver', 'Fast Learner'],
            codingPoints: data.coding_points || 340,
            streakDays: data.streak_days || 5,
            careerReadinessScore: data.career_readiness_score || 82,
            bio: data.bio || '',
            githubUrl: data.github_url || 'https://github.com',
            linkedinUrl: data.linkedin_url || 'https://linkedin.com'
          };
          localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
          return profile;
        }
      } catch (err) {
        console.warn('Supabase fetch profile fallback:', err);
      }
    }
    return this.getUserProfile();
  }

  async saveProfile(profile: UserProfile): Promise<UserProfile> {
    return this.saveUserProfile(profile);
  }

  async getUserCertificates(userId: string): Promise<Certificate[]> {
    const client = getSupabaseClient();
    if (client && userId) {
      try {
        const { data, error } = await client
          .from('certificates')
          .select('*')
          .eq('user_id', userId)
          .order('issued_at', { ascending: false });
        
        if (data && !error && data.length > 0) {
          const mapped: Certificate[] = data.map((d: any) => ({
            id: d.id,
            certificateNumber: d.certificate_number || d.id,
            userId: d.user_id,
            userName: d.user_name || 'Alex Chen',
            courseOrSimulationTitle: d.course_or_simulation_title || 'Internship Simulation',
            internshipTitle: d.internship_title || d.course_or_simulation_title,
            company: d.company || 'Tech Partner',
            type: d.type || 'Internship Simulation Mastery',
            score: d.score || 90,
            skills: d.skills || [],
            skillsDemonstrated: d.skills_demonstrated || d.skills || [],
            verificationUrl: d.verification_url || `#/verify/${d.certificate_number || d.id}`,
            issuedAt: d.issued_at,
            issueDate: d.issued_at
          }));
          localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(mapped));
          return mapped;
        }
      } catch (e) {
        console.warn('Supabase getCertificates fallback:', e);
      }
    }
    return this.getCertificates(userId);
  }

  async saveCertificate(cert: Certificate): Promise<Certificate> {
    return this.issueCertificate(cert);
  }

  async saveCodingSubmission(sub: any): Promise<void> {
    return this.recordCodingSubmission({
      id: sub.id || `sub_${Date.now()}`,
      problemId: sub.problemId,
      problemTitle: sub.problemTitle || sub.problemId,
      userId: sub.userId,
      language: sub.language || 'Python',
      code: sub.code || '',
      status: sub.status || 'Accepted',
      passedTests: sub.passedTests || 0,
      totalTests: sub.totalTests || 0,
      executionTimeMs: sub.executionTimeMs || 0,
      memoryKb: sub.memoryKb || 0,
      scoreAwarded: sub.scoreAwarded || sub.score || 20,
      submittedAt: sub.submittedAt || new Date().toISOString()
    });
  }

  getUserProfile(): UserProfile {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(INITIAL_USER));
    return INITIAL_USER;
  }

  async saveUserProfile(profile: UserProfile): Promise<UserProfile> {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    
    // Supabase push
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('profiles').upsert({
          id: profile.id,
          email: profile.email,
          name: profile.name,
          role: profile.role,
          avatar_url: profile.avatarUrl,
          education: profile.education,
          college: profile.college,
          branch: profile.branch,
          year: profile.year,
          graduation_year: profile.graduationYear,
          preferred_language: profile.preferredLanguage,
          career_interests: profile.careerInterests,
          current_skill_level: profile.currentSkillLevel,
          streak_days: profile.streakDays,
          coding_points: profile.codingPoints,
          career_readiness_score: profile.careerReadinessScore,
          bio: profile.bio,
          github_url: profile.githubUrl,
          linkedin_url: profile.linkedinUrl,
          badges: profile.badges,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Supabase profile sync skipped:', err);
      }
    }
    return profile;
  }

  // Assessments
  getAssessments(): AssessmentSubmission[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  }

  async saveAssessment(submission: AssessmentSubmission): Promise<AssessmentSubmission> {
    const list = this.getAssessments();
    list.unshift(submission);
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(list));

    // Update user career readiness score
    const user = this.getUserProfile();
    user.careerReadinessScore = Math.min(98, Math.max(60, submission.overallScore));
    await this.saveUserProfile(user);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('assessment_submissions').insert({
          id: submission.id,
          user_id: submission.userId,
          overall_score: submission.overallScore,
          technical_score: submission.technicalScore,
          aptitude_score: submission.problemSolvingScore,
          strengths: submission.strengths,
          weaknesses: submission.weaknesses,
          recommendations: submission.recommendedImprovements,
          submitted_at: submission.timestamp || new Date().toISOString()
        });
      } catch (e) {
        console.warn('Supabase assessment insert error:', e);
      }
    }
    return submission;
  }

  // Skill Profile / Radar
  async getSkillProfile(userId: string): Promise<SkillProfile> {
    const client = getSupabaseClient();
    if (client && userId) {
      try {
        const { data, error } = await client
          .from('skill_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();
        if (data && !error) {
          const profile: SkillProfile = {
            userId: data.user_id,
            radarScores: data.radar_scores || [],
            primaryStrengths: data.primary_strengths || [],
            criticalGaps: data.critical_gaps || [],
            lastUpdated: data.updated_at || new Date().toISOString()
          };
          return profile;
        }
      } catch (e) {}
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SKILL_PROFILES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed[userId]) return parsed[userId];
      }
    } catch (e) {}

    // Default radar scores
    const defaultProfile: SkillProfile = {
      userId,
      radarScores: [
        { subject: 'Data Structures', score: 85, fullMark: 100 },
        { subject: 'System Design', score: 70, fullMark: 100 },
        { subject: 'Web & APIs', score: 90, fullMark: 100 },
        { subject: 'Database & SQL', score: 82, fullMark: 100 },
        { subject: 'AI & Logic', score: 76, fullMark: 100 },
        { subject: 'Communication', score: 88, fullMark: 100 }
      ],
      primaryStrengths: ['API Architecture', 'React State Design', 'Analytical SQL Queries', 'Team Collaboration'],
      criticalGaps: ['Distributed Caching with Redis', 'Docker Containerization', 'Graph Algorithms', 'CI/CD Pipelines'],
      lastUpdated: new Date().toISOString()
    };
    return defaultProfile;
  }

  async saveSkillProfile(profile: SkillProfile): Promise<void> {
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.SKILL_PROFILES) || '{}');
      current[profile.userId] = profile;
      localStorage.setItem(STORAGE_KEYS.SKILL_PROFILES, JSON.stringify(current));
    } catch (e) {}

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('skill_profiles').upsert({
          user_id: profile.userId,
          radar_scores: profile.radarScores,
          primary_strengths: profile.primaryStrengths,
          critical_gaps: profile.criticalGaps,
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Supabase skill profile error:', e);
      }
    }
  }

  // Careers & Roadmaps
  getCareers(): CareerRecommendation[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CAREERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    localStorage.setItem(STORAGE_KEYS.CAREERS, JSON.stringify(SAMPLE_CAREERS));
    return SAMPLE_CAREERS;
  }

  async saveCareers(careers: CareerRecommendation[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.CAREERS, JSON.stringify(careers));
    const client = getSupabaseClient();
    if (client) {
      try {
        for (const c of careers) {
          await client.from('career_recommendations').upsert({
            id: c.id,
            title: c.title,
            field: c.field,
            match_percentage: c.matchPercentage,
            reason: c.reason,
            current_skills: c.currentSkills,
            missing_skills: c.missingSkills,
            average_salary: c.averageSalary,
            growth_outlook: c.growthOutlook,
            recommended_learning_path: c.recommendedLearningPath
          });
        }
      } catch (e) {}
    }
  }

  // Internships
  getInternships(): Internship[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INTERNSHIPS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    localStorage.setItem(STORAGE_KEYS.INTERNSHIPS, JSON.stringify(SAMPLE_INTERNSHIPS));
    return SAMPLE_INTERNSHIPS;
  }

  async saveInternship(internship: Internship): Promise<void> {
    const list = this.getInternships();
    const idx = list.findIndex(i => i.id === internship.id);
    if (idx >= 0) list[idx] = internship;
    else list.unshift(internship);
    localStorage.setItem(STORAGE_KEYS.INTERNSHIPS, JSON.stringify(list));

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('internships').upsert({
          id: internship.id,
          title: internship.title,
          company: internship.company,
          company_logo: internship.companyLogo,
          location: internship.location,
          type: internship.type,
          stipend: internship.stipend,
          duration: internship.duration,
          role: internship.role,
          job_description: internship.jobDescription,
          required_skills: internship.requiredSkills,
          responsibilities: internship.responsibilities,
          technologies: internship.technologies,
          apply_url: internship.applyUrl,
          deadline: internship.deadline,
          simulation_available: internship.simulationAvailable,
          has_demo: internship.hasDemo,
          simulation_project_id: internship.simulationProjectId,
          featured: internship.featured
        });
      } catch (e) {}
    }
  }

  // Simulations
  getSimulation(internshipId: string): InternshipSimulation {
    if (SAMPLE_SIMULATIONS[internshipId]) {
      return SAMPLE_SIMULATIONS[internshipId];
    }
    const internship = this.getInternships().find(i => i.id === internshipId) || SAMPLE_INTERNSHIPS[0];
    return {
      id: `sim_${internship.id}`,
      internshipId: internship.id,
      title: `${internship.company} Practical Sprint Simulation`,
      company: internship.company,
      role: internship.role || 'Software Engineer',
      scenario: `Welcome to the ${internship.title} simulation! Complete real-world code tickets, test suites, and system reviews matching this position's daily engineering responsibilities.`,
      skillsTested: internship.requiredSkills,
      tasks: [
        {
          id: 'sim_task_1',
          stepNumber: 1,
          title: 'Step 1: Production Bug Isolation & Feature Implementation',
          description: `Implement the core ${internship.role || 'engineer'} module requirements handling boundary edge cases.`,
          instructions: [
            'Review the specifications for ' + internship.title,
            'Implement type-safe helper methods',
            'Handle runtime error exceptions gracefully'
          ],
          language: (internship.technologies && internship.technologies[0]) || 'TypeScript',
          initialCode: `// ${internship.company} - Technical Task\nexport function processWorkload(payload: any) {\n  if (!payload) throw new Error("Invalid payload");\n  return { status: "processed", count: Array.isArray(payload) ? payload.length : 1 };\n}`,
          expectedDeliverable: 'Robust tested module matching company standards.',
          hints: ['Validate all inputs and return structured results.']
        }
      ]
    };
  }

  getSimulationSubmissions(userId: string): SimulationSubmission[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SIMULATION_SUBMISSIONS);
      if (saved) {
        const list: SimulationSubmission[] = JSON.parse(saved);
        return list.filter(s => s.userId === userId);
      }
    } catch (e) {}
    return [];
  }

  async saveSimulationSubmission(sub: SimulationSubmission): Promise<void> {
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.SIMULATION_SUBMISSIONS) || '[]');
      list.unshift(sub);
      localStorage.setItem(STORAGE_KEYS.SIMULATION_SUBMISSIONS, JSON.stringify(list));
    } catch (e) {}

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('simulation_submissions').insert({
          id: sub.id,
          simulation_id: sub.simulationId,
          user_id: sub.userId,
          step_number: sub.stepNumber,
          code_or_response: sub.codeOrResponse,
          ai_review: sub.aiReview,
          submitted_at: sub.submittedAt
        });
      } catch (e) {}
    }
  }

  // AI Interview Sessions
  getInterviewSessions(userId: string): InterviewSession[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INTERVIEW_SESSIONS);
      if (saved) {
        const list: InterviewSession[] = JSON.parse(saved);
        return list.filter(s => s.userId === userId);
      }
    } catch (e) {}
    return [];
  }

  async saveInterviewSession(session: InterviewSession): Promise<void> {
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.INTERVIEW_SESSIONS) || '[]');
      const idx = list.findIndex((s: InterviewSession) => s.id === session.id);
      if (idx >= 0) list[idx] = session;
      else list.unshift(session);
      localStorage.setItem(STORAGE_KEYS.INTERVIEW_SESSIONS, JSON.stringify(list));
    } catch (e) {}

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('interview_sessions').upsert({
          id: session.id,
          internship_id: session.internshipId,
          user_id: session.userId,
          scores: session.scores,
          feedback_summary: session.feedbackSummary,
          responses: session.responses,
          technical_score: session.technicalScore || session.scores?.technical,
          communication_score: session.communicationScore || session.scores?.communication,
          problem_solving_score: session.problemSolvingScore || session.scores?.problemSolving,
          overall_score: session.overallScore || session.scores?.overall,
          strengths: session.strengths,
          weaknesses: session.weaknesses,
          improvement_suggestions: session.improvementSuggestions,
          internship_readiness_score: session.internshipReadinessScore,
          created_at: session.date || session.startedAt || new Date().toISOString()
        });
      } catch (e) {}
    }
  }

  // AI Voice Interview Reports (Overall Performance & Communication)
  getInterviewReports(userId: string): InterviewReport[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INTERVIEW_REPORTS);
      if (saved) {
        const list: InterviewReport[] = JSON.parse(saved);
        return list.filter(r => r.userId === userId);
      }
    } catch (e) {}
    return [];
  }

  async saveInterviewReport(report: InterviewReport): Promise<void> {
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.INTERVIEW_REPORTS) || '[]');
      const idx = list.findIndex((r: InterviewReport) => r.id === report.id);
      if (idx >= 0) list[idx] = report;
      else list.unshift(report);
      localStorage.setItem(STORAGE_KEYS.INTERVIEW_REPORTS, JSON.stringify(list));

      // Also attach to cached user profile
      const prof = this.getUserProfile();
      if (prof.id === report.userId) {
        const reports = prof.interviewReports || [];
        const rIdx = reports.findIndex(r => r.id === report.id);
        if (rIdx >= 0) reports[rIdx] = report;
        else reports.unshift(report);
        prof.interviewReports = reports;
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(prof));
      }
    } catch (e) {}

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('interview_reports').upsert({
          id: report.id,
          user_id: report.userId,
          internship_id: report.internshipId,
          internship_title: report.internshipTitle,
          company: report.company,
          overall_score: report.overallScore,
          technical_score: report.technicalScore,
          communication_score: report.communicationScore,
          problem_solving_score: report.problemSolvingScore,
          internship_readiness_score: report.internshipReadinessScore,
          communication_analysis: report.communicationAnalysis,
          hiring_recommendation: report.hiringRecommendation,
          strengths: report.strengths,
          weaknesses: report.weaknesses,
          improvement_suggestions: report.improvementSuggestions,
          responses_summary: report.responsesSummary,
          completed_at: report.completedAt
        });
      } catch (e) {}
    }
  }

  // Direct Internship Applications / Enrollments
  getInternshipApplications(userId: string): InternshipApplication[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INTERNSHIP_APPLICATIONS);
      if (saved) {
        const list: InternshipApplication[] = JSON.parse(saved);
        return list.filter(a => !userId || a.applicantEmail === userId || a.id.includes(userId));
      }
    } catch (e) {}
    return [];
  }

  async saveInternshipApplication(app: InternshipApplication): Promise<void> {
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.INTERNSHIP_APPLICATIONS) || '[]');
      const idx = list.findIndex((a: InternshipApplication) => a.id === app.id);
      if (idx >= 0) list[idx] = app;
      else list.unshift(app);
      localStorage.setItem(STORAGE_KEYS.INTERNSHIP_APPLICATIONS, JSON.stringify(list));

      // Also attach to cached user profile
      const prof = this.getUserProfile();
      const apps = prof.appliedInternships || [];
      const aIdx = apps.findIndex(a => a.id === app.id);
      if (aIdx >= 0) apps[aIdx] = app;
      else apps.unshift(app);
      prof.appliedInternships = apps;
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(prof));
    } catch (e) {}

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('internship_applications').upsert({
          id: app.id,
          internship_id: app.internshipId,
          internship_title: app.internshipTitle,
          company: app.company,
          applicant_name: app.applicantName,
          applicant_email: app.applicantEmail,
          applicant_phone: app.applicantPhone,
          college: app.college,
          branch: app.branch,
          graduation_year: app.graduationYear,
          github_url: app.githubUrl,
          linkedin_url: app.linkedinUrl,
          portfolio_url: app.portfolioUrl,
          cover_statement: app.coverStatement,
          status: app.status,
          submitted_at: app.submittedAt,
          stipend: app.stipend,
          location: app.location,
          duration: app.duration,
          is_paid: app.isPaid
        });
      } catch (e) {}
    }
  }

  // Courses & Progress
  getCourses(): Course[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(SAMPLE_COURSES));
    return SAMPLE_COURSES;
  }

  getCourseProgress(userId: string): Record<string, { completedLessons: string[]; progress: number; isCompleted: boolean }> {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COURSE_PROGRESS);
      if (saved) {
        const all = JSON.parse(saved);
        return all[userId] || {
          'crs_web_fullstack': { completedLessons: ['les_1'], progress: 33, isCompleted: false },
          'crs_sql_mastery': { completedLessons: ['les_sql_1'], progress: 50, isCompleted: false }
        };
      }
    } catch (e) {}
    return {
      'crs_web_fullstack': { completedLessons: ['les_1'], progress: 33, isCompleted: false },
      'crs_sql_mastery': { completedLessons: ['les_sql_1'], progress: 50, isCompleted: false }
    };
  }

  async updateCourseProgress(userId: string, courseId: string, lessonId: string, totalLessons: number): Promise<void> {
    const current = this.getCourseProgress(userId);
    const courseRec = current[courseId] || { completedLessons: [], progress: 0, isCompleted: false };
    if (!courseRec.completedLessons.includes(lessonId)) {
      courseRec.completedLessons.push(lessonId);
    }
    courseRec.progress = Math.round((courseRec.completedLessons.length / totalLessons) * 100);
    if (courseRec.progress >= 100) {
      courseRec.isCompleted = true;
    }
    current[courseId] = courseRec;

    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.COURSE_PROGRESS) || '{}');
    all[userId] = current;
    localStorage.setItem(STORAGE_KEYS.COURSE_PROGRESS, JSON.stringify(all));

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('user_course_progress').upsert({
          id: `${userId}_${courseId}`,
          user_id: userId,
          course_id: courseId,
          completed_lessons: courseRec.completedLessons,
          progress: courseRec.progress,
          is_completed: courseRec.isCompleted,
          updated_at: new Date().toISOString()
        });
      } catch (e) {}
    }
  }

  // Certificates
  getCertificates(userId: string): Certificate[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
      if (saved) {
        const list: Certificate[] = JSON.parse(saved);
        return list.filter(c => c.userId === userId);
      }
    } catch (e) {}
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(SAMPLE_CERTIFICATES));
    return SAMPLE_CERTIFICATES;
  }

  async issueCertificate(cert: Certificate): Promise<Certificate> {
    const list = this.getCertificates(cert.userId);
    list.unshift(cert);
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(list));

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('certificates').insert({
          id: cert.id,
          certificate_number: cert.certificateNumber,
          user_id: cert.userId,
          user_name: cert.userName,
          course_or_simulation_title: cert.courseOrSimulationTitle,
          internship_title: cert.internshipTitle,
          company: cert.company,
          type: cert.type,
          issued_at: cert.issuedAt || cert.issueDate || new Date().toISOString(),
          score: cert.score,
          skills: cert.skills || cert.skillsDemonstrated,
          skills_demonstrated: cert.skillsDemonstrated || cert.skills,
          verification_url: cert.verificationUrl
        });
      } catch (e) {}
    }
    return cert;
  }

  // Coding Problems & Submissions
  getCodingProblems(): CodingProblem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CODING_PROBLEMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    localStorage.setItem(STORAGE_KEYS.CODING_PROBLEMS, JSON.stringify(SAMPLE_CODING_PROBLEMS));
    return SAMPLE_CODING_PROBLEMS;
  }

  getCodingSubmissions(userId: string): CodingSubmission[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CODING_SUBMISSIONS);
      if (saved) {
        const list: CodingSubmission[] = JSON.parse(saved);
        return list.filter(s => s.userId === userId);
      }
    } catch (e) {}
    return [];
  }

  async recordCodingSubmission(sub: CodingSubmission): Promise<void> {
    const list = this.getCodingSubmissions(sub.userId);
    list.unshift(sub);
    localStorage.setItem(STORAGE_KEYS.CODING_SUBMISSIONS, JSON.stringify(list));

    // Update user points if accepted
    if (sub.status === 'Accepted') {
      const user = this.getUserProfile();
      user.codingPoints += (sub.scoreAwarded || 20);
      await this.saveUserProfile(user);
    }

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('coding_submissions').insert({
          id: sub.id,
          problem_id: sub.problemId,
          problem_title: sub.problemTitle,
          user_id: sub.userId,
          language: sub.language,
          code: sub.code,
          status: sub.status,
          passed_tests: sub.passedTests,
          total_tests: sub.totalTests,
          execution_time_ms: sub.executionTimeMs,
          memory_kb: sub.memoryKb,
          score_awarded: sub.scoreAwarded,
          submitted_at: sub.submittedAt
        });
      } catch (e) {}
    }
  }

  // Leaderboard
  getLeaderboard(): LeaderboardEntry[] {
    return SAMPLE_LEADERBOARD;
  }

  // Mentors & Tips
  getMentors(): Mentor[] {
    return SAMPLE_MENTORS;
  }

  getMentorTips(): MentorTip[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENTOR_TIPS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    localStorage.setItem(STORAGE_KEYS.MENTOR_TIPS, JSON.stringify(SAMPLE_MENTOR_TIPS));
    return SAMPLE_MENTOR_TIPS;
  }

  async addMentorTip(tip: MentorTip): Promise<void> {
    const tips = this.getMentorTips();
    tips.unshift(tip);
    localStorage.setItem(STORAGE_KEYS.MENTOR_TIPS, JSON.stringify(tips));

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('mentor_tips').insert({
          id: tip.id,
          category: tip.category,
          title: tip.title,
          summary: tip.summary,
          content: tip.content,
          author_name: tip.authorName,
          author_role: tip.authorRole,
          likes: tip.likes,
          created_at: new Date().toISOString()
        });
      } catch (e) {}
    }
  }

  // Notifications
  getNotifications(userId: string): AppNotification[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    const defaultNotifs: AppNotification[] = [
      {
        id: 'notif_1',
        title: 'New Internship Demo Available',
        message: 'CloudScale Technologies released their Summer 2026 Full Stack simulation sprint!',
        timestamp: '1 hour ago',
        read: false,
        type: 'internship'
      },
      {
        id: 'notif_2',
        title: 'Daily Coding Streak: Day 6',
        message: 'Solve today’s challenge to unlock your 7-Day Streak badge!',
        timestamp: '3 hours ago',
        read: false,
        type: 'coding'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(defaultNotifs));
    return defaultNotifs;
  }

  markNotificationAsRead(id: string): void {
    const list = this.getNotifications('usr_student_01');
    const item = list.find(n => n.id === id);
    if (item) {
      item.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    }
  }
}

export const dbService = new DatabaseService();
