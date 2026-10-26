'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle, XCircle, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';

interface QuestionOption {
  id: string;
  option_text: string;
}

interface Question {
  id: string;
  question_text: string;
  points: number;
  options: QuestionOption[];
}

interface QuizProps {
  quizId: string;
  title: string;
  description?: string;
  passingScore: number;
  maxAttempts: number;
  questions: Question[];
  previousAttemptsCount: number;
  onQuizPassed?: () => void;
}

interface QuizResult {
  score: number;
  isPassed: boolean;
  totalQuestions: number;
  correctCount: number;
  explanations: Record<string, { isCorrect: boolean; explanation: string; correctOptionId?: string }>;
}

export default function QuizComponent({
  quizId,
  title,
  description,
  passingScore,
  maxAttempts,
  questions,
  previousAttemptsCount = 0,
  onQuizPassed,
}: QuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [attemptsCount, setAttemptsCount] = useState(previousAttemptsCount);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (result) return; // Đã nộp bài, không đổi khi chưa làm lại
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      setErrorMsg('Vui lòng trả lời đầy đủ tất cả các câu hỏi trước khi nộp bài.');
      return;
    }

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: selectedAnswers }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Có lỗi xảy ra khi nộp bài');
      }

      const data: QuizResult = await res.json();
      setResult(data);
      setAttemptsCount((prev) => prev + 1);

      if (data.isPassed) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        if (onQuizPassed) onQuizPassed();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <Award className="w-4 h-4" />
            </span>
            <h3 className="font-semibold text-slate-900 text-base">{title}</h3>
          </div>
          {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
            Điểm đạt: {passingScore}%
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
            Lượt làm: {attemptsCount} / {maxAttempts}
          </span>
        </div>
      </div>

      {/* Result Banner after Submission */}
      {result && (
        <div
          className={`p-4 rounded-xl mb-6 border flex items-start gap-3.5 ${
            result.isPassed
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          {result.isPassed ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">
                {result.isPassed ? 'Chúc mừng! Bạn đã đạt bài kiểm tra' : 'Chưa đạt yêu cầu tối thiểu'}
              </span>
              <span className="font-extrabold text-base">
                {result.score}%
              </span>
            </div>
            <p className="mt-1 text-slate-600">
              Đúng {result.correctCount} trên {result.totalQuestions} câu hỏi.
              {result.isPassed
                ? ' Điểm số và tiến độ của bạn đã được ghi nhận vào hệ thống học tập.'
                : ' Bạn có thể xem lại lời giải thích chi tiết bên dưới và thử lại.'}
            </p>
          </div>
        </div>
      )}

      {/* Question List */}
      <div className="space-y-6">
        {questions.map((q, qIndex) => {
          const exp = result?.explanations[q.id];
          return (
            <div key={q.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs font-semibold text-slate-800">
                  Câu {qIndex + 1}: {q.question_text}
                </span>
                <span className="text-[10px] text-slate-400 font-medium shrink-0">
                  {q.points} điểm
                </span>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isSelected = selectedAnswers[q.id] === opt.id;
                  const isCorrectAnswer = exp?.correctOptionId === opt.id;

                  let optionStyle = 'border-slate-200 hover:border-slate-300 hover:bg-white bg-white/70';
                  if (isSelected && !result) {
                    optionStyle = 'border-blue-600 bg-blue-50/60 text-blue-900 font-medium ring-1 ring-blue-600';
                  } else if (result) {
                    if (isCorrectAnswer) {
                      optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-500';
                    } else if (isSelected && !exp?.isCorrect) {
                      optionStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                    } else {
                      optionStyle = 'border-slate-200 bg-white opacity-60';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={!!result}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${optionStyle}`}
                    >
                      <span>{opt.option_text}</span>
                      {result && isCorrectAnswer && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {result && isSelected && !exp?.isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation note after grading */}
              {exp && (
                <div className="mt-3 p-3 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600">
                  <p className="font-semibold text-slate-800 mb-0.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Giải thích chi tiết:
                  </p>
                  <p>{exp.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        {result ? (
          <button
            onClick={handleRetry}
            disabled={attemptsCount >= maxAttempts}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Làm Lại ({maxAttempts - attemptsCount} lượt còn lại)
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-semibold shadow-xs flex items-center gap-2"
          >
            {isSubmitting ? 'Đang chấm điểm...' : 'Nộp Bài Chấm Điểm'}
          </button>
        )}
      </div>
    </div>
  );
}
