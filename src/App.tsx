import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  CareerRecommendation, 
  Internship, 
  Course, 
  SkillProfile, 
  AppNotification, 
  SimulationCertificate, 
  AssessmentSubmission 
} from './types';
import { 
  SAMPLE_USER_PROFILE, 
  SAMPLE_CAREER_RECOMMENDATIONS, 
  SAMPLE_INTERNSHIPS, 
  SAMPLE_COURSES, 
  SAMPLE_SKILL_PROFILE, 
  SAMPLE_NOTIFICATIONS, 
  SAMPLE_CERTIFICATES 
} from './lib/mockData';
import { dbService, onAuthStateChange, getCurrentAuthUser, getSupabaseConfig } from './lib/supabase';

// Components
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { AssessmentView } from './components/AssessmentView';
import { CareerView } from './components/CareerView';
import { InternshipHubView } from './components/InternshipHubView';
import { InterviewSimulatorView } from './components/InterviewSimulatorView';
import { SimulationLabView } from './components/SimulationLabView';
import { LearnCoursesView } from './components/LearnCoursesView';
import { CodeArenaView } from './components/CodeArenaView';
import { LeaderboardView } from './components/LeaderboardView';
import { MentorshipView } from './components/MentorshipView';
import { ResumeAnalyzerView } from './components/ResumeAnalyzerView';
import { CertificatesView } from './components/CertificatesView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { SupabaseSetupModal } from './components/SupabaseSetupModal';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [user, setUser] = useState<UserProfile>(SAMPLE_USER_PROFILE);
  const [careers, setCareers] = useState<CareerRecommendation[]>(SAMPLE_CAREER_RECOMMENDATIONS);
  const [internships, setInternships] = useState<Internship[]>(SAMPLE_INTERNSHIPS);
  const [courses, setCourses] = useState<Course[]>(SAMPLE_COURSES);
  const [skillProfile, setSkillProfile] = useState<SkillProfile>(SAMPLE_SKILL_PROFILE);
  const [notifications, setNotifications] = useState<AppNotification[]>(SAMPLE_NOTIFICATIONS);
  const [certificates, setCertificates] = useState<SimulationCertificate[]>(SAMPLE_CERTIFICATES);
  const [courseProgress, setCourseProgress] = useState<Record<string, { completedLessons: string[]; progress: number; isCompleted: boolean }>>({
    crs_web_fullstack: { completedLessons: ['les_1'], progress: 33, isCompleted: false },
    crs_sql_mastery: { completedLessons: ['les_sql_1'], progress: 50, isCompleted: false }
  });

  // Active sub-contexts
  const [activeInternshipId, setActiveInternshipId] = useState<string>('int_cloudscale');
  const [selectedCourseForNav, setSelectedCourseForNav] = useState<string | undefined>(undefined);

  // Modals
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Check URL pathname/hash for #admin or /admin access
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#admin' || hash === '#/admin') {
        setCurrentTab('admin');
      }
    };

    handleUrlRoute();
    window.addEventListener('hashchange', handleUrlRoute);
    window.addEventListener('popstate', handleUrlRoute);

    return () => {
      window.removeEventListener('hashchange', handleUrlRoute);
      window.removeEventListener('popstate', handleUrlRoute);
    };
  }, []);

  // Load initial profile & certificates from persistence service and listen to Supabase Auth
  useEffect(() => {
    async function loadData(targetUserId: string) {
      try {
        const savedProfile = await dbService.getProfile(targetUserId);
        if (savedProfile) {
          setUser(savedProfile);
        }
        const savedCerts = await dbService.getUserCertificates(targetUserId);
        if (savedCerts && savedCerts.length > 0) {
          setCertificates(savedCerts);
        }
        const savedSkill = await dbService.getSkillProfile(targetUserId);
        if (savedSkill) {
          setSkillProfile(savedSkill);
        }
      } catch (err) {
        console.warn('Initial persistence hydration:', err);
      }
    }

    // Check if Supabase already has an authenticated user
    getCurrentAuthUser().then((authUser) => {
      if (authUser) {
        loadData(authUser.id);
      } else {
        loadData(SAMPLE_USER_PROFILE.id);
      }
    });

    // Subscribe to auth state changes
    const subscription = onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const authUser = session.user;
        const profile = await dbService.getProfile(authUser.id);
        if (profile) {
          setUser(profile);
        } else {
          // Initialize new profile for the authenticated user
          const newProfile: UserProfile = {
            ...SAMPLE_USER_PROFILE,
            id: authUser.id,
            email: authUser.email || SAMPLE_USER_PROFILE.email,
            name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Student'
          };
          setUser(newProfile);
          await dbService.saveProfile(newProfile);
        }
        loadData(authUser.id);
      }
    });

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Handlers
  const handleAwardPoints = async (points: number) => {
    const updated = {
      ...user,
      codingPoints: user.codingPoints + points,
      careerReadinessScore: Math.min(98, user.careerReadinessScore + 1)
    };
    setUser(updated);
    await dbService.saveProfile(updated);
  };

  const handleAssessmentCompleted = async (submission: AssessmentSubmission, newSkillProfile: SkillProfile) => {
    const updatedUser = {
      ...user,
      careerReadinessScore: submission.overallScore
    };
    setUser(updatedUser);
    setSkillProfile(newSkillProfile);
    await dbService.saveProfile(updatedUser);

    // Add notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: 'AI Assessment Evaluated',
      message: `Your technical evaluation scored ${submission.overallScore}%. Top career path updated.`,
      timestamp: 'Just now',
      read: false,
      type: 'assessment'
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleUpdateCourseProgress = (courseId: string, lessonId: string) => {
    setCourseProgress(prev => {
      const crs = courses.find(c => c.id === courseId);
      const totalLessons = crs?.lessons.length || 3;
      const current = prev[courseId] || { completedLessons: [], progress: 0, isCompleted: false };
      const nextCompleted = Array.from(new Set([...current.completedLessons, lessonId]));
      const progressPct = Math.round((nextCompleted.length / totalLessons) * 100);
      return {
        ...prev,
        [courseId]: {
          completedLessons: nextCompleted,
          progress: progressPct,
          isCompleted: progressPct === 100
        }
      };
    });
  };

  const handleStartSimulation = (internshipId: string) => {
    setActiveInternshipId(internshipId);
    setCurrentTab('simulation');
  };

  const handleStartInterview = (internshipId: string) => {
    setActiveInternshipId(internshipId);
    setCurrentTab('interview');
  };

  const handleAddInternship = (newInternship: Internship) => {
    setInternships([newInternship, ...internships]);
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: 'New Internship Live',
      message: `${newInternship.title} at ${newInternship.company} is now open for application & simulation demos!`,
      timestamp: 'Just now',
      read: false,
      type: 'internship'
    };
    setNotifications([newNotif, ...notifications]);
  };

  // Find active internship object
  const activeInternship = internships.find(i => i.id === activeInternshipId) || internships[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        notifications={notifications}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {currentTab === 'dashboard' && (
          <DashboardView
            user={user}
            careers={careers}
            internships={internships}
            courses={courses}
            skillProfile={skillProfile}
            courseProgress={courseProgress}
            onNavigate={(tab, ctx) => {
              if (ctx?.courseId) setSelectedCourseForNav(ctx.courseId);
              setCurrentTab(tab);
            }}
            onStartSimulation={handleStartSimulation}
            onStartInterview={handleStartInterview}
          />
        )}

        {currentTab === 'assessment' && (
          <AssessmentView
            user={user}
            onAssessmentCompleted={handleAssessmentCompleted}
            onNavigateToCareers={() => setCurrentTab('careers')}
          />
        )}

        {currentTab === 'careers' && (
          <CareerView
            careers={careers}
            user={user}
            onNavigateToCourses={(courseId) => {
              setSelectedCourseForNav(courseId);
              setCurrentTab('learn');
            }}
            onNavigateToInternships={() => setCurrentTab('internships')}
            onNavigateToArena={() => setCurrentTab('arena')}
          />
        )}

        {currentTab === 'internships' && (
          <InternshipHubView
            internships={internships}
            user={user}
            onStartSimulation={handleStartSimulation}
            onStartInterview={handleStartInterview}
            onApplicationSubmitted={(app) => {
              const newNotif: AppNotification = {
                id: `notif_${Date.now()}`,
                title: 'Application Received',
                message: `Your enrollment for ${app.internshipTitle} has been submitted! Track status in your profile.`,
                timestamp: 'Just now',
                read: false,
                type: 'internship'
              };
              setNotifications([newNotif, ...notifications]);
            }}
          />
        )}

        {currentTab === 'interview' && (
          <InterviewSimulatorView
            internship={activeInternship}
            user={user}
            onProceedToSimulation={handleStartSimulation}
            onBackToHub={() => setCurrentTab('internships')}
          />
        )}

        {currentTab === 'simulation' && (
          <SimulationLabView
            internshipId={activeInternshipId}
            user={user}
            onBackToHub={() => setCurrentTab('internships')}
            onNavigateToCertificates={() => setCurrentTab('certificates')}
          />
        )}

        {currentTab === 'learn' && (
          <LearnCoursesView
            courses={courses}
            user={user}
            courseProgress={courseProgress}
            initialCourseId={selectedCourseForNav}
            onUpdateProgress={handleUpdateCourseProgress}
            onNavigateToCertificates={() => setCurrentTab('certificates')}
          />
        )}

        {currentTab === 'arena' && (
          <CodeArenaView
            user={user}
            onAwardPoints={handleAwardPoints}
          />
        )}

        {currentTab === 'leaderboard' && (
          <LeaderboardView
            user={user}
            onNavigateToArena={() => setCurrentTab('arena')}
          />
        )}

        {currentTab === 'mentorship' && (
          <MentorshipView user={user} />
        )}

        {currentTab === 'resume' && (
          <ResumeAnalyzerView user={user} />
        )}

        {currentTab === 'certificates' && (
          <CertificatesView
            certificates={certificates}
            user={user}
            onNavigateToInternships={() => setCurrentTab('internships')}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardView
            internships={internships}
            courses={courses}
            user={user}
            onAddInternship={handleAddInternship}
            onExitAdmin={() => {
              setCurrentTab('dashboard');
              if (window.location.hash.includes('admin')) {
                window.location.hash = '';
              }
            }}
          />
        )}

      </main>

      {/* Modals */}
      <SupabaseSetupModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigUpdated={async () => {
          const profile = await dbService.getProfile(user.id);
          if (profile) setUser(profile);
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onSaveProfile={async (updated) => {
          setUser(updated);
          await dbService.saveProfile(updated);
        }}
        onAuthSuccess={async (updated) => {
          setUser(updated);
          const certs = await dbService.getUserCertificates(updated.id);
          if (certs && certs.length > 0) setCertificates(certs);
          const skill = await dbService.getSkillProfile(updated.id);
          if (skill) setSkillProfile(skill);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">SkillSphere AI</span>
            <span>•</span>
            <span>Assess → Discover → Learn → Practice → Experience → Improve → Apply</span>
          </div>

          <div className="flex items-center gap-4">
            <span>v2.5.0 Production Ready</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
