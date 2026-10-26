'use client';

import { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import QuizComponent from '@/components/QuizComponent';
import NotesComponent from '@/components/NotesComponent';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight,
  FileText,
  Download,
  Bookmark,
  Award,
  ExternalLink,
  ShieldAlert,
  Play,
  RotateCcw,
} from 'lucide-react';

export default function ClassroomPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const resolvedParams = use(params);
  const { courseId, lessonId } = resolvedParams;
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'resources' | 'notes' | 'quiz'>('content');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isUpdatingCompletion, setIsUpdatingCompletion] = useState(false);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);

  const fetchLessonData = async () => {
    try {
      const res = await fetch(`/api/lessons/${lessonId}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setIsCompleted(json.lesson.progress?.is_completed === 1);
      } else if (res.status === 401) {
        router.push('/login');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonData();
  }, [lessonId]);

  const handleProgressUpdate = async (seconds: number, totalSeconds: number) => {
    setCurrentVideoTime(seconds);
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          courseId,
          secondsWatched: seconds,
          totalSeconds,
          isCompleted: false,
        }),
      });
    } catch (e) {
      // silently log
    }
  };

  const handleToggleCompleted = async () => {
    setIsUpdatingCompletion(true);
    const newStatus = !isCompleted;
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          courseId,
          secondsWatched: currentVideoTime,
          isCompleted: newStatus,
        }),
      });
      setIsCompleted(newStatus);
      // Cập nhật lại curriculum list
      fetchLessonData();
    } catch (e) {
      alert('Không thể lưu trạng thái hoàn thành');
    } finally {
      setIsUpdatingCompletion(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-900 text-white text-xs">
        Đang khởi tạo phòng học tập...
      </div>
    );
  }

  if (!data?.lesson) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-900 text-white">
        <h2 className="text-lg font-bold mb-2">Không tìm thấy nội dung bài học</h2>
        <Link href="/courses" className="text-xs text-blue-400 underline">
          Quay lại danh sách bài giảng
        </Link>
      </div>
    );
  }

  const { lesson, curriculum } = data;

  // Tìm bài trước và bài tiếp theo trong lộ trình
  const allLessonsFlat = curriculum.flatMap((s: any) => s.lessons);
  const currentIndex = allLessonsFlat.findIndex((l: any) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessonsFlat[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessonsFlat.length - 1 ? allLessonsFlat[currentIndex + 1] : null;

  // Tính % hoàn thành của khóa học
  const totalInCurriculum = allLessonsFlat.length || 1;
  const completedInCurriculum = allLessonsFlat.filter((l: any) => l.isCompleted).length;
  const courseCompletionPercent = Math.round((completedInCurriculum / totalInCurriculum) * 100);

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 min-h-[calc(100vh-64px)]">
      {/* Top Learning Header Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${lesson.course_slug}`}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Quay lại trang thông tin khóa học"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
              {lesson.course_title}
            </span>
            <h1 className="font-bold text-xs sm:text-sm text-white truncate max-w-md sm:max-w-xl">
              {lesson.title}
            </h1>
          </div>
        </div>

        {/* Progress Tracker & Completed Button */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] text-slate-400">Tiến độ khóa học</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${courseCompletionPercent}%` }}
                />
              </div>
              <span className="font-mono text-xs font-bold text-emerald-400">
                {courseCompletionPercent}%
              </span>
            </div>
          </div>

          <button
            onClick={handleToggleCompleted}
            disabled={isUpdatingCompletion}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
              isCompleted
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-white' : 'text-slate-400'}`} />
            <span>{isCompleted ? 'Đã Hoàn Thành' : 'Đánh Dấu Hoàn Thành'}</span>
          </button>
        </div>
      </div>

      {/* Main Learning Room Layout: Video + Tabs (Left) and Syllabus Sidebar (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Side: Video Player & Tabs (8 cols) */}
        <div className="lg:col-span-8 flex flex-col p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Big Video Player */}
          <div>
            <VideoPlayer
              lessonVideoUrl={lesson.video_url}
              lessonTitle={lesson.title}
              demo5mUrl={lesson.demo_5m_url}
              demo5mTitle={lesson.demo_5m_title}
              demo20mUrl={lesson.demo_20m_url}
              demo20mTitle={lesson.demo_20m_title}
              hasFullAccess={lesson.canViewFull}
              initialTime={lesson.progress?.seconds_watched || 0}
              onProgressUpdate={handleProgressUpdate}
              onComplete={() => setIsCompleted(true)}
            />
          </div>

          {/* Navigation Prev/Next Lesson */}
          <div className="flex items-center justify-between pt-1">
            {prevLesson ? (
              <Link
                href={`/classroom/${courseId}/${prevLesson.id}`}
                className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="truncate max-w-[150px] sm:max-w-xs">{prevLesson.title}</span>
              </Link>
            ) : <div />}

            {nextLesson ? (
              <Link
                href={`/classroom/${courseId}/${nextLesson.id}`}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span className="truncate max-w-[150px] sm:max-w-xs">Bài tiếp: {nextLesson.title}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : <div />}
          </div>

          {/* Classroom Tabs Header */}
          <div className="border-b border-slate-800 flex items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab('content')}
              className={`pb-3 px-3 font-medium transition-colors flex items-center gap-1.5 border-b-2 ${
                activeTab === 'content'
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Nội Dung Bài Học
            </button>

            <button
              onClick={() => setActiveTab('resources')}
              className={`pb-3 px-3 font-medium transition-colors flex items-center gap-1.5 border-b-2 ${
                activeTab === 'resources'
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              Tài Nguyên & Slide ({lesson.resources?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`pb-3 px-3 font-medium transition-colors flex items-center gap-1.5 border-b-2 ${
                activeTab === 'notes'
                  ? 'border-blue-500 text-blue-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Ghi Chú Cá Nhân
            </button>

            {lesson.quiz && (
              <button
                onClick={() => setActiveTab('quiz')}
                className={`pb-3 px-3 font-medium transition-colors flex items-center gap-1.5 border-b-2 ${
                  activeTab === 'quiz'
                    ? 'border-blue-500 text-blue-400 font-semibold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                Bài Tập Đánh Giá
              </button>
            )}
          </div>

          {/* Tab Content Display */}
          <div className="bg-slate-950/60 rounded-2xl border border-slate-800 p-6">
            {activeTab === 'content' && (
              <div className="prose prose-invert prose-sm max-w-none space-y-4">
                {lesson.content_markdown ? (
                  <div className="whitespace-pre-wrap leading-relaxed text-slate-300 text-xs sm:text-sm">
                    {lesson.content_markdown}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Nội dung bài học chưa có văn bản chi tiết đính kèm.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-3">
                <h4 className="font-semibold text-xs text-slate-300 mb-2">
                  Tài Liệu Đính Kèm Của Bài Học
                </h4>
                {lesson.resources?.length === 0 ? (
                  <p className="text-xs text-slate-500">Bài học này không có tài liệu đính kèm bên ngoài.</p>
                ) : (
                  <div className="space-y-2">
                    {lesson.resources.map((res: any) => (
                      <div
                        key={res.id}
                        className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-slate-800 text-blue-400">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-200">{res.title}</p>
                            <span className="text-[10px] text-slate-500 uppercase font-bold">
                              {res.resource_type}
                            </span>
                          </div>
                        </div>

                        <a
                          href={res.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white font-medium text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <span>Xem/Tải Về</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <NotesComponent
                lessonId={lesson.id}
                currentVideoTime={currentVideoTime}
              />
            )}

            {activeTab === 'quiz' && lesson.quiz && (
              <QuizComponent
                quizId={lesson.quiz.id}
                title={lesson.quiz.title}
                description={lesson.quiz.description}
                passingScore={lesson.quiz.passing_score}
                maxAttempts={lesson.quiz.max_attempts}
                questions={lesson.quiz.questions}
                previousAttemptsCount={lesson.quiz.previousAttemptsCount}
                onQuizPassed={() => {
                  setIsCompleted(true);
                  fetchLessonData();
                }}
              />
            )}
          </div>
        </div>

        {/* Right Side: Curriculum Syllabus Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 sm:p-5 flex flex-col overflow-y-auto">
          <div className="pb-3 mb-3 border-b border-slate-800">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Giáo Trình Khóa Học
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {completedInCurriculum} / {totalInCurriculum} bài hoàn thành
            </p>
          </div>

          <div className="space-y-4 flex-1">
            {curriculum.map((section: any, sIdx: number) => (
              <div key={section.id} className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 block px-2">
                  {section.title}
                </span>

                <div className="space-y-1">
                  {section.lessons.map((item: any) => {
                    const isActive = item.id === lesson.id;
                    return (
                      <Link
                        key={item.id}
                        href={`/classroom/${courseId}/${item.id}`}
                        className={`p-2.5 rounded-xl text-xs flex items-center justify-between gap-2.5 transition-all ${
                          isActive
                            ? 'bg-blue-600/20 text-blue-300 border border-blue-500/50 font-semibold'
                            : 'hover:bg-slate-900 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {item.isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : isActive ? (
                            <Play className="w-4 h-4 text-blue-400 fill-current shrink-0" />
                          ) : (
                            <span className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                          )}
                          <span className="truncate leading-tight">{item.title}</span>
                        </div>

                        <span className="font-mono text-[10px] text-slate-500 shrink-0">
                          {Math.round(item.video_duration_seconds / 60)}p
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
