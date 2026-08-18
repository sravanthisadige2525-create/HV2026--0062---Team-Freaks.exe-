export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  education: string;
  college: string;
  branch: string;
  graduationYear?: number;
  year?: string;
  preferredLanguage: string;
  careerInterests: string[];
  currentSkillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt?: string;
  streakDays: number;
  codingPoints: number;
  careerReadinessScore: number;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  badges?: string[];
  interviewReports?: InterviewReport[];
  appliedInternships?: InternshipApplication[];
}

export type QuestionCategory = 'technical' | 'mcq' | 'coding' | 'logical' | 'communication';

export interface AssessmentQuestion {
  id: string;
  category: QuestionCategory;
  topic: string;
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  starterCode?: string;
  language?: string;
  testCases?: { input: string; output: string }[];
  scenarioContext?: string;
  points: number;
}

export interface AssessmentSubmission {
  id: string;
  userId: string;
  timestamp: string;
  answers: Record<string, any>;
  overallScore: number;
  technicalScore: number;
  problemSolvingScore: number;
  communicationScore: number;
  strengths: string[];
  weaknesses: string[];
  skillGaps: string[];
  recommendedImprovements: string[];
}

export interface SkillProfile {
  userId: string;
  radarScores: {
    subject: string;
    score: number;
    fullMark: number;
  }[];
  primaryStrengths: string[];
  criticalGaps: string[];
  lastUpdated: string;
}

export interface CareerRecommendation {
  id: string;
  title: string;
  field: string;
  matchPercentage: number;
  reason: string;
  currentSkills: string[];
  missingSkills: string[];
  averageSalary: string;
  growthOutlook: string;
  recommendedLearningPath: RoadmapStage[];
}

export interface RoadmapStage {
  stage: 'Foundation' | 'Core Skills' | 'Projects' | 'Interview Preparation' | 'Internship Readiness';
  title: string;
  description: string;
  skills: string[];
  milestones: string[];
  recommendedCourseIds: string[];
  isCompleted?: boolean;
}

export interface Internship {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  type: 'Remote' | 'Hybrid' | 'On-site';
  stipend: string;
  duration: string;
  role?: string;
  jobDescription: string;
  requiredSkills: string[];
  responsibilities: string[];
  technologies?: string[];
  applyUrl: string;
  deadline?: string;
  isPaid?: boolean;
  perks?: string[];
  simulationAvailable?: boolean;
  hasDemo?: boolean;
  simulationProjectId?: string;
  featured?: boolean;
}

export interface InterviewQuestion {
  id: string;
  type: 'technical' | 'hr' | 'situational' | 'project';
  question: string;
  context?: string;
  expectedKeywords?: string[];
}

export interface InterviewMessage {
  id?: string;
  role: 'ai' | 'user' | 'model' | 'assistant';
  type?: string;
  content: string;
  audioUrl?: string;
  timestamp?: string;
  score?: number;
  feedback?: string;
  communicationSkills?: {
    clarity: number;
    fluency: number;
    articulation: number;
    confidence: number;
  };
}

export interface CommunicationSkillsAnalysis {
  clarityScore: number;
  fluencyScore: number;
  articulationScore: number;
  confidenceScore: number;
  vocabularyScore: number;
  technicalPrecisionScore: number;
  overallCommunicationRating: 'Exceptional' | 'Strong' | 'Proficient' | 'Developing';
  pacingFeedback: string;
  toneFeedback: string;
  keyStrengths: string[];
  growthAreas: string[];
}

export interface InterviewReport {
  id: string;
  userId: string;
  internshipId: string;
  internshipTitle: string;
  company: string;
  companyLogo?: string;
  completedAt: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  internshipReadinessScore: number;
  communicationAnalysis: CommunicationSkillsAnalysis;
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  responsesSummary: {
    question: string;
    userAnswer: string;
    aiFeedback: string;
    score: number;
    communicationScore?: number;
    communicationHighlights?: string;
  }[];
  hiringRecommendation: 'Strong Hire' | 'Hire' | 'Ready with Mentorship' | 'Needs Preparation';
}

export interface InternshipApplication {
  id: string;
  internshipId: string;
  internshipTitle: string;
  company: string;
  companyLogo?: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  college: string;
  branch: string;
  graduationYear: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  coverStatement: string;
  resumeName?: string;
  status: 'Enrolled & Under Review' | 'Shortlisted' | 'Interview Scheduled' | 'Offered';
  submittedAt: string;
  stipend: string;
  location: string;
  duration: string;
  isPaid: boolean;
}

export interface InterviewSession {
  id: string;
  internshipId: string;
  userId: string;
  startedAt?: string;
  completedAt?: string;
  date?: string;
  messages?: any[];
  scores?: {
    technical?: number;
    communication?: number;
    problemSolving?: number;
    overall?: number;
  };
  feedbackSummary?: string;
  responses?: {
    questionId: string;
    question: string;
    userAnswer: string;
    aiFeedback?: string;
    score?: number;
  }[];
  technicalScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  overallScore?: number;
  strengths?: string[];
  weaknesses?: string[];
  improvementSuggestions?: string[];
  internshipReadinessScore?: number;
}

export interface SimulationTask {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  instructions: string[];
  initialCode?: string;
  starterCode?: string;
  language?: string;
  sampleDataset?: string;
  expectedDeliverable: string;
  hints: string[];
  estimatedMinutes?: number;
}

export interface InternshipSimulation {
  id: string;
  internshipId: string;
  title: string;
  company: string;
  role: string;
  scenario: string;
  tasks: SimulationTask[];
  skillsTested: string[];
}

export interface SimulationSubmission {
  id: string;
  simulationId: string;
  userId: string;
  stepNumber: number;
  codeOrResponse: string;
  aiReview: {
    passed: boolean;
    score: number;
    feedback: string;
    strengths: string[];
    areasToRefactor: string[];
  };
  submittedAt: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration?: string;
  durationMinutes?: number;
  contentMarkdown?: string;
  content?: string;
  codeExample?: string;
  codeSnippet?: string;
  language?: string;
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export type Lesson = CourseLesson;

export interface Course {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  modulesCount: number;
  enrolledStudents: number;
  rating: number;
  lessons: CourseLesson[];
  skillsCovered: string[];
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  userId: string;
  simulationId?: string;
  userName?: string;
  courseOrSimulationTitle?: string;
  internshipTitle?: string;
  company?: string;
  type?: 'Course Completion' | 'Internship Simulation Mastery' | 'Skill Assessment Excellence' | string;
  issuedAt?: string;
  issueDate?: string;
  score: number;
  skills?: string[];
  skillsDemonstrated?: string[];
  verificationUrl: string;
}

export type SimulationCertificate = Certificate;

export interface CodingProblem {
  id: string;
  title: string;
  category: 'Arrays' | 'Strings' | 'Linked Lists' | 'Stack' | 'Queue' | 'Trees' | 'Graphs' | 'Recursion' | 'Sorting' | 'Searching' | 'DP' | 'SQL' | string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples?: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints?: string[];
  hints?: string[];
  starterTemplates?: Record<string, string>;
  starterCode?: Record<string, string> | any;
  testCases: {
    input: string;
    expectedOutput: string;
    output?: string;
    isHidden?: boolean;
  }[];
  hiddenTestCases?: {
    input: string;
    expectedOutput: string;
  }[];
  points: number;
  acceptanceRate: string | number;
}

export interface CodingSubmission {
  id: string;
  problemId: string;
  problemTitle?: string;
  userId: string;
  language: string;
  code: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Compilation Error' | 'Runtime Error' | string;
  passedTests?: number;
  totalTests?: number;
  executionTimeMs?: number;
  memoryKb?: number;
  scoreAwarded?: number;
  score?: number;
  submittedAt: string;
  errorLog?: string;
}

export interface LeaderboardEntry {
  id?: string;
  rank: number;
  userId: string;
  name: string;
  college: string;
  avatarUrl?: string;
  problemsSolved: number;
  points: number;
  accuracy?: number;
  streakDays: number;
  badges: string[];
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  expertise: string[];
  bio: string;
  avatarUrl: string;
  rating: number;
  sessionsCount: number;
}

export interface MentorTip {
  id: string;
  category: 'Career' | 'Interview' | 'Resume' | 'Coding' | 'Internship' | 'Project' | 'Communication';
  title: string;
  summary: string;
  content: string;
  authorName: string;
  authorRole: string;
  likes: number;
  date: string;
}

export interface ResumeAnalysisResult {
  matchScore: number;
  targetRole: string;
  matchedSkills: string[];
  missingSkills: string[];
  atsScore: number;
  atsSuggestions: string[];
  experienceReview: string;
  recommendedImprovements: string[];
  actionItems: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'assessment' | 'internship' | 'coding' | 'certificate' | 'mentor';
  actionUrl?: string;
}
