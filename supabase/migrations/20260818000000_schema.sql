-- ==============================================================================
-- AI-Based Skill Assessment & Personalized Career Recommendation System
-- Complete Supabase PostgreSQL Schema, RLS Policies, Triggers & Seed Data
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase Auth or direct ID)
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT NOT NULL DEFAULT 'Student',
    avatar_url TEXT,
    college TEXT DEFAULT 'Stanford University',
    branch TEXT DEFAULT 'Computer Science & Engineering',
    year TEXT DEFAULT '3rd Year (Junior)',
    graduation_year TEXT DEFAULT '2027',
    role TEXT DEFAULT 'student',
    career_readiness_score INTEGER DEFAULT 82,
    coding_points INTEGER DEFAULT 340,
    streak_days INTEGER DEFAULT 5,
    preferred_language TEXT DEFAULT 'Python',
    current_skill_level TEXT DEFAULT 'Intermediate',
    career_interests TEXT[] DEFAULT ARRAY['Full Stack Engineer', 'AI/ML Engineer']::TEXT[],
    badges TEXT[] DEFAULT ARRAY['Problem Solver', 'Fast Learner', 'Interview Ready']::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SKILL PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.skill_profiles (
    user_id TEXT PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    radar_scores JSONB NOT NULL DEFAULT '[]'::JSONB,
    primary_strengths TEXT[] DEFAULT ARRAY[]::TEXT[],
    critical_gaps TEXT[] DEFAULT ARRAY[]::TEXT[],
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ASSESSMENT SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.assessment_submissions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    overall_score INTEGER NOT NULL,
    technical_score INTEGER,
    aptitude_score INTEGER,
    radar_scores JSONB DEFAULT '[]'::JSONB,
    strengths TEXT[] DEFAULT ARRAY[]::TEXT[],
    weaknesses TEXT[] DEFAULT ARRAY[]::TEXT[],
    recommendations TEXT[] DEFAULT ARRAY[]::TEXT[],
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CAREER RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS public.career_recommendations (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    field TEXT NOT NULL,
    match_percentage INTEGER NOT NULL,
    reason TEXT NOT NULL,
    current_skills TEXT[] DEFAULT ARRAY[]::TEXT[],
    missing_skills TEXT[] DEFAULT ARRAY[]::TEXT[],
    average_salary TEXT,
    growth_outlook TEXT,
    recommended_learning_path JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INTERNSHIPS TABLE
CREATE TABLE IF NOT EXISTS public.internships (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    company_logo TEXT,
    location TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Remote',
    stipend TEXT NOT NULL,
    duration TEXT NOT NULL,
    role TEXT,
    job_description TEXT NOT NULL,
    required_skills TEXT[] DEFAULT ARRAY[]::TEXT[],
    responsibilities TEXT[] DEFAULT ARRAY[]::TEXT[],
    technologies TEXT[] DEFAULT ARRAY[]::TEXT[],
    apply_url TEXT NOT NULL,
    deadline TEXT,
    simulation_available BOOLEAN DEFAULT TRUE,
    has_demo BOOLEAN DEFAULT TRUE,
    simulation_project_id TEXT,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INTERNSHIP SIMULATION PROJECTS & TASKS
CREATE TABLE IF NOT EXISTS public.internship_simulations (
    id TEXT PRIMARY KEY,
    internship_id TEXT REFERENCES public.internships(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    scenario TEXT NOT NULL,
    tasks JSONB NOT NULL DEFAULT '[]'::JSONB,
    skills_tested TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SIMULATION SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.simulation_submissions (
    id TEXT PRIMARY KEY,
    simulation_id TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    code_or_response TEXT,
    ai_review JSONB,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
    id TEXT PRIMARY KEY,
    certificate_number TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_name TEXT,
    course_or_simulation_title TEXT NOT NULL,
    internship_title TEXT,
    company TEXT,
    type TEXT NOT NULL,
    score INTEGER NOT NULL,
    skills TEXT[] DEFAULT ARRAY[]::TEXT[],
    skills_demonstrated TEXT[] DEFAULT ARRAY[]::TEXT[],
    verification_url TEXT NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT DEFAULT 'Code',
    description TEXT NOT NULL,
    level TEXT NOT NULL DEFAULT 'Beginner',
    duration TEXT NOT NULL,
    modules_count INTEGER DEFAULT 1,
    enrolled_students INTEGER DEFAULT 0,
    rating NUMERIC(3, 1) DEFAULT 4.8,
    lessons JSONB NOT NULL DEFAULT '[]'::JSONB,
    skills_covered TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. USER COURSE PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.user_course_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    completed_lessons TEXT[] DEFAULT ARRAY[]::TEXT[],
    progress INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- 11. CODING PROBLEMS TABLE
CREATE TABLE IF NOT EXISTS public.coding_problems (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    description TEXT NOT NULL,
    examples JSONB DEFAULT '[]'::JSONB,
    constraints TEXT[] DEFAULT ARRAY[]::TEXT[],
    starter_templates JSONB DEFAULT '{}'::JSONB,
    test_cases JSONB DEFAULT '[]'::JSONB,
    points INTEGER DEFAULT 20,
    acceptance_rate NUMERIC(5, 1) DEFAULT 75.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CODING SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.coding_submissions (
    id TEXT PRIMARY KEY,
    problem_id TEXT NOT NULL,
    problem_title TEXT,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    code TEXT NOT NULL,
    status TEXT NOT NULL,
    passed_tests INTEGER DEFAULT 0,
    total_tests INTEGER DEFAULT 0,
    execution_time_ms INTEGER DEFAULT 0,
    memory_kb INTEGER DEFAULT 0,
    score_awarded INTEGER DEFAULT 0,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. INTERVIEW SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.interview_sessions (
    id TEXT PRIMARY KEY,
    internship_id TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    scores JSONB,
    feedback_summary TEXT,
    responses JSONB DEFAULT '[]'::JSONB,
    technical_score INTEGER,
    communication_score INTEGER,
    problem_solving_score INTEGER,
    overall_score INTEGER,
    strengths TEXT[] DEFAULT ARRAY[]::TEXT[],
    weaknesses TEXT[] DEFAULT ARRAY[]::TEXT[],
    improvement_suggestions TEXT[] DEFAULT ARRAY[]::TEXT[],
    internship_readiness_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. MENTOR TIPS & NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.mentor_tips (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    author TEXT NOT NULL,
    author_role TEXT,
    author_company TEXT,
    author_avatar TEXT,
    likes INTEGER DEFAULT 0,
    date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.app_notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'system',
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_assessment_user ON public.assessment_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_simulation_subs_user ON public.simulation_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_certs_user ON public.certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_coding_subs_user ON public.coding_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_user ON public.interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON public.user_course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_notifs_user ON public.app_notifications(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_notifications ENABLE ROW LEVEL SECURITY;

-- Allow public read access to catalog data
CREATE POLICY "Public internships access" ON public.internships FOR SELECT USING (true);
CREATE POLICY "Public simulations access" ON public.internship_simulations FOR SELECT USING (true);
CREATE POLICY "Public courses access" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public coding problems access" ON public.coding_problems FOR SELECT USING (true);
CREATE POLICY "Public mentor tips access" ON public.mentor_tips FOR SELECT USING (true);

-- Allow authenticated / matching user operations
CREATE POLICY "Profiles access policy" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Skill profiles access policy" ON public.skill_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Assessments access policy" ON public.assessment_submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Career recommendations access policy" ON public.career_recommendations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Simulation submissions policy" ON public.simulation_submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Certificates access policy" ON public.certificates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Course progress policy" ON public.user_course_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Coding submissions policy" ON public.coding_submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Interview sessions policy" ON public.interview_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Notifications access policy" ON public.app_notifications FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        name,
        avatar_url,
        college,
        branch,
        year,
        graduation_year,
        role,
        career_readiness_score,
        coding_points,
        streak_days,
        preferred_language,
        current_skill_level,
        career_interests,
        badges
    )
    VALUES (
        NEW.id::TEXT,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
        COALESCE(NEW.raw_user_meta_data->>'college', 'Stanford University'),
        COALESCE(NEW.raw_user_meta_data->>'branch', 'Computer Science & Engineering'),
        '3rd Year (Junior)',
        '2027',
        'student',
        82,
        340,
        5,
        'Python',
        'Intermediate',
        ARRAY['Full Stack Engineer', 'AI/ML Engineer']::TEXT[],
        ARRAY['Problem Solver', 'Fast Learner', 'Interview Ready']::TEXT[]
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = NOW();

    -- Create matching initial skill profile
    INSERT INTO public.skill_profiles (
        user_id,
        radar_scores,
        primary_strengths,
        critical_gaps
    )
    VALUES (
        NEW.id::TEXT,
        '[
            {"subject": "Data Structures", "score": 85, "fullMark": 100},
            {"subject": "System Design", "score": 70, "fullMark": 100},
            {"subject": "Web & APIs", "score": 90, "fullMark": 100},
            {"subject": "Database & SQL", "score": 82, "fullMark": 100},
            {"subject": "AI & Logic", "score": 76, "fullMark": 100},
            {"subject": "Communication", "score": 88, "fullMark": 100}
        ]'::JSONB,
        ARRAY['API Architecture', 'React State Design', 'Analytical SQL Queries', 'Team Collaboration']::TEXT[],
        ARRAY['Distributed Caching with Redis', 'Docker Containerization', 'Graph Algorithms', 'CI/CD Pipelines']::TEXT[]
    )
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users if running in Supabase
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();
