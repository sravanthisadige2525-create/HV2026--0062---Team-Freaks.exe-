import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Play, 
  Award, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  Code2, 
  HelpCircle, 
  Sparkles,
  Layers,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course, Lesson, UserProfile, SimulationCertificate } from '../types';
import { LEARNING_MODULE_CATEGORIES } from '../lib/mockData';
import { dbService } from '../lib/supabase';

interface LearnCoursesViewProps {
  courses: Course[];
  user: UserProfile;
  courseProgress: Record<string, { completedLessons: string[]; progress: number; isCompleted: boolean }>;
  initialCourseId?: string;
  onUpdateProgress: (courseId: string, lessonId: string) => void;
  onNavigateToCertificates: () => void;
}

export const LearnCoursesView: React.FC<LearnCoursesViewProps> = ({
  courses,
  user,
  courseProgress,
  initialCourseId,
  onUpdateProgress,
  onNavigateToCertificates
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Modules');
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId || courses[0]?.id || 'crs_web_fullstack');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const categories = ['All Modules', ...LEARNING_MODULE_CATEGORIES];
  const visibleCourses = selectedCategory === 'All Modules'
    ? courses
    : courses.filter((course) => course.category === selectedCategory);

  const selectedCourse = visibleCourses.find((course) => course.id === selectedCourseId) || visibleCourses[0] || courses[0];
  const activeLesson: Lesson = selectedCourse?.lessons.find((l) => l.id === activeLessonId) || selectedCourse?.lessons[0];
  const currentProg = selectedCourse ? (courseProgress[selectedCourse.id] || { completedLessons: [], progress: 0, isCompleted: false }) : { completedLessons: [], progress: 0, isCompleted: false };

  useEffect(() => {
    if (!selectedCourse) return;
    setSelectedCourseId(selectedCourse.id);
    setActiveLessonId(selectedCourse.lessons[0]?.id || null);
    setQuizAnswers({});
    setQuizSubmitted(false);
  }, [selectedCategory]);

  useEffect(() => {
    if (!selectedCourse) return;
    if (!activeLessonId || !selectedCourse.lessons.some((lesson) => lesson.id === activeLessonId)) {
      setActiveLessonId(selectedCourse.lessons[0]?.id || null);
    }
  }, [selectedCourse, activeLessonId]);

  const handleCompleteLesson = async () => {
    if (!activeLesson) return;
    onUpdateProgress(selectedCourse.id, activeLesson.id);

    // If this completed all lessons in the course, award a course certificate!
    const nextCompleted = Array.from(new Set([...currentProg.completedLessons, activeLesson.id]));
    if (nextCompleted.length === selectedCourse.lessons.length) {
      const certificateNumber = `SPHERE-CRS-${Math.floor(100000 + Math.random() * 900000)}`;
      const courseCert: SimulationCertificate = {
        id: `cert_crs_${Date.now()}`,
        userId: user.id,
        internshipTitle: `${selectedCourse.title} Professional Specialization`,
        company: 'SkillSphere Career Academy',
        issueDate: new Date().toISOString(),
        certificateNumber,
        verificationUrl: `#/verify/${certificateNumber}`,
        score: 98,
        skillsDemonstrated: selectedCourse.topics
      };
      await dbService.saveCertificate(courseCert);

      try {
        confetti({ particleCount: 100, spread: 70 });
      } catch (e) {}
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Targeted Skill Tracks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Interactive Learning & Specializations
          </h1>
          <p className="mt-1 text-sm text-slate-300 max-w-2xl">
            Practical, curriculum-mapped lessons designed to close identified skill gaps and prepare you for engineering simulations.
          </p>
        </div>

        <button
          onClick={onNavigateToCertificates}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition self-start md:self-auto"
        >
          <Award className="w-4 h-4 text-indigo-400" />
          <span>My Verified Certificates</span>
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-3">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-950/60 text-slate-300 border-slate-700 hover:border-slate-600 hover:text-white'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Course Cards Carousel / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {visibleCourses.map(course => {
          const isSelected = course.id === selectedCourse?.id;
          const prog = courseProgress[course.id] || { progress: 0, isCompleted: false };
          return (
            <div
              key={course.id}
              onClick={() => {
                setSelectedCourseId(course.id);
                setActiveLessonId(course.lessons[0]?.id || null);
              }}
              className={`p-5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500 text-white ring-1 ring-indigo-500/50 shadow-xl'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">{course.level}</span>
                  <span className="text-xs text-slate-400 font-mono">{course.lessons.length} modules</span>
                </div>
                <h3 className="font-bold text-sm text-white line-clamp-2">{course.title}</h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{course.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Progress</span>
                  <span className="font-bold text-indigo-300">{prog.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${prog.progress}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Workspace (Course Lesson Viewer & Interactive Workspace) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Syllabus / Lesson List (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl glass-panel p-6 border border-slate-800 space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Curriculum Syllabus</span>
            <h3 className="text-base font-bold text-white mt-0.5">{selectedCourse.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{selectedCourse.lessons.length} structured modules</p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            {selectedCourse.lessons.map((les, idx) => {
              const isActive = (activeLesson?.id === les.id) || (idx === 0 && !activeLessonId);
              const isDone = currentProg.completedLessons.includes(les.id);
              return (
                <button
                  key={les.id}
                  onClick={() => {
                    setActiveLessonId(les.id);
                    setQuizSubmitted(false);
                    setQuizAnswers({});
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs transition flex items-center justify-between ${
                    isActive
                      ? 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 font-mono text-[10px] flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <span className="truncate max-w-[180px]">{les.title}</span>
                  </div>

                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <span className="text-[10px] text-slate-400 font-mono">{les.durationMinutes}m</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Lesson Content & Interactive Quiz (8 cols) */}
        {activeLesson && (
          <div className="lg:col-span-8 rounded-3xl glass-panel p-6 sm:p-8 border border-slate-800 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Active Module</span>
                <h2 className="text-xl font-bold font-display text-white mt-1">{activeLesson.title}</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">{activeLesson.durationMinutes} minutes reading</span>
            </div>

            {/* Lesson Body Content */}
            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
              <p>{activeLesson.content || activeLesson.contentMarkdown || 'This module contains guided learning content for the selected skill track.'}</p>
            </div>

            {/* Code Snippet Box */}
            {(activeLesson.codeSnippet || activeLesson.codeExample) && (
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                  <span className="text-indigo-300 font-semibold">Production Code Implementation</span>
                  <span>TypeScript / ESM</span>
                </div>
                <pre className="text-emerald-400 whitespace-pre-wrap overflow-x-auto">
                  {activeLesson.codeSnippet || activeLesson.codeExample}
                </pre>
              </div>
            )}

            {/* Checkpoint Quiz */}
            {activeLesson.quiz && (
              <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  <h4 className="font-bold text-white text-sm">Module Comprehension Check</h4>
                </div>

                <p className="text-xs text-slate-200">{activeLesson.quiz.question}</p>

                <div className="space-y-2">
                  {activeLesson.quiz.options.map((opt, oIdx) => {
                    const isSelected = quizAnswers[activeLesson.id] === oIdx;
                    const isCorrect = oIdx === activeLesson.quiz?.correctIndex;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => {
                          setQuizAnswers(prev => ({ ...prev, [activeLesson.id]: oIdx }));
                          setQuizSubmitted(true);
                        }}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${
                          quizSubmitted && isSelected
                            ? isCorrect
                              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                              : 'bg-rose-950/40 border-rose-500 text-rose-200'
                            : isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-white'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isSelected && (
                          <span>{isCorrect ? '✓ Correct' : '✗ Incorrect'}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <p className="text-xs text-indigo-300 bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-500/20">
                    💡 <strong>Explanation:</strong> {activeLesson.quiz.explanation}
                  </p>
                )}
              </div>
            )}

            {/* Mark as Complete Button */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {currentProg.completedLessons.includes(activeLesson.id) ? '✓ Completed' : 'Unfinished lesson'}
              </span>

              <button
                onClick={handleCompleteLesson}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
              >
                <Check className="w-4 h-4" />
                <span>Mark Lesson Complete & Next</span>
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
