-- ==============================================================================
-- AI-Based Skill Assessment & Personalized Career Recommendation System
-- Complete Supabase PostgreSQL Schema with RLS Policies
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    avatar_url TEXT,
    education TEXT,
    college TEXT,
    branch TEXT,
    graduation_year INT,
    preferred_language TEXT DEFAULT 'Python',
    career_interests TEXT[] DEFAULT '{}',
    current_skill_level TEXT DEFAULT 'Beginner',
    streak_days INT DEFAULT 0,
    coding_points INT DEFAULT 0,
    career_readiness_score INT DEFAULT 0,
    bio TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Assessments & Questions
CREATE TABLE IF NOT EXISTS assessment_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL,
    topic TEXT NOT NULL,
    question TEXT NOT NULL,
    options JSONB,
    correct_answer TEXT,
    starter_code TEXT,
    language TEXT,
    test_cases JSONB,
    scenario_context TEXT,
    points INT DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    overall_score INT NOT NULL,
    technical_score INT NOT NULL,
    problem_solving_score INT NOT NULL,
    communication_score INT NOT NULL,
    strengths TEXT[] DEFAULT '{}',
    weaknesses TEXT[] DEFAULT '{}',
    skill_gaps TEXT[] DEFAULT '{}',
    recommended_improvements TEXT[] DEFAULT '{}',
    answers JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Skill Profiles & Radar
CREATE TABLE IF NOT EXISTS skill_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    radar_scores JSONB NOT NULL DEFAULT '[]',
    primary_strengths TEXT[] DEFAULT '{}',
    critical_gaps TEXT[] DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Career Recommendations
CREATE TABLE IF NOT EXISTS career_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    field TEXT NOT NULL,
    match_percentage INT NOT NULL,
    reason TEXT NOT NULL,
    current_skills TEXT[] DEFAULT '{}',
    missing_skills TEXT[] DEFAULT '{}',
    average_salary TEXT,
    growth_outlook TEXT,
    recommended_learning_path JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Internships & Simulations
CREATE TABLE IF NOT EXISTS internships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    company_logo TEXT,
    location TEXT NOT NULL,
    type TEXT DEFAULT 'Remote',
    stipend TEXT,
    duration TEXT,
    role TEXT NOT NULL,
    job_description TEXT NOT NULL,
    required_skills TEXT[] DEFAULT '{}',
    responsibilities TEXT[] DEFAULT '{}',
    technologies TEXT[] DEFAULT '{}',
    apply_url TEXT NOT NULL,
    deadline TEXT,
    simulation_available BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS internship_simulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    scenario TEXT NOT NULL,
    tasks JSONB NOT NULL DEFAULT '[]',
    skills_tested TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS simulation_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    simulation_id UUID REFERENCES internship_simulations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    code_or_response TEXT NOT NULL,
    ai_review JSONB NOT NULL DEFAULT '{}',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. AI Interview Sessions
CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    responses JSONB DEFAULT '[]',
    technical_score INT,
    communication_score INT,
    problem_solving_score INT,
    overall_score INT,
    strengths TEXT[] DEFAULT '{}',
    weaknesses TEXT[] DEFAULT '{}',
    improvement_suggestions TEXT[] DEFAULT '{}',
    internship_readiness_score INT
);

-- 7. Courses & Progress
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT,
    description TEXT NOT NULL,
    level TEXT DEFAULT 'Beginner',
    duration TEXT,
    modules_count INT DEFAULT 4,
    enrolled_students INT DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 4.8,
    lessons JSONB NOT NULL DEFAULT '[]',
    skills_covered TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS course_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    completed_lessons TEXT[] DEFAULT '{}',
    progress_percentage INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    quiz_scores JSONB DEFAULT '{}',
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, course_id)
);

-- 8. Certificates
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    course_or_simulation_title TEXT NOT NULL,
    type TEXT NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    score INT NOT NULL,
    skills TEXT[] DEFAULT '{}',
    verification_url TEXT
);

-- 9. Coding Arena & Submissions
CREATE TABLE IF NOT EXISTS coding_problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    description TEXT NOT NULL,
    examples JSONB NOT NULL DEFAULT '[]',
    constraints TEXT[] DEFAULT '{}',
    starter_templates JSONB NOT NULL DEFAULT '{}',
    test_cases JSONB NOT NULL DEFAULT '[]',
    points INT DEFAULT 20,
    acceptance_rate TEXT DEFAULT '75%',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS coding_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id UUID REFERENCES coding_problems(id) ON DELETE CASCADE,
    problem_title TEXT NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    language TEXT NOT NULL,
    code TEXT NOT NULL,
    status TEXT NOT NULL,
    passed_tests INT DEFAULT 0,
    total_tests INT DEFAULT 0,
    execution_time_ms INT DEFAULT 0,
    memory_kb INT DEFAULT 0,
    score_awarded INT DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Mentors & Tips
CREATE TABLE IF NOT EXISTS mentors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    expertise TEXT[] DEFAULT '{}',
    bio TEXT,
    avatar_url TEXT,
    rating NUMERIC(3, 2) DEFAULT 4.9,
    sessions_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS mentor_tips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_role TEXT NOT NULL,
    likes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    type TEXT DEFAULT 'internship',
    action_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE internship_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE coding_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE coding_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Public read for catalog items
CREATE POLICY "Public read for internships" ON internships FOR SELECT USING (true);
CREATE POLICY "Public read for simulations" ON internship_simulations FOR SELECT USING (true);
CREATE POLICY "Public read for courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Public read for coding problems" ON coding_problems FOR SELECT USING (true);
CREATE POLICY "Public read for mentors and tips" ON mentors FOR SELECT USING (true);
CREATE POLICY "Public read for mentor tips" ON mentor_tips FOR SELECT USING (true);
CREATE POLICY "Public read for public certificates" ON certificates FOR SELECT USING (true);

-- User-specific access policies
CREATE POLICY "Users can manage own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can view all profiles on leaderboard" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage own assessments" ON assessments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own skill profiles" ON skill_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own recommendations" ON career_recommendations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own simulation submissions" ON simulation_submissions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own interview sessions" ON interview_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own course progress" ON course_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own coding submissions" ON coding_submissions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
