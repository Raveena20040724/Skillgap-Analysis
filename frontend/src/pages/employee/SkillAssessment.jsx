import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  Clock, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import Button from '../../components/common/Button';
import { ROUTES } from '../../constants/routes';

// Benchmark Questions Data
const BENCHMARK_QUESTIONS = [
  {
    id: 1,
    question: "What is the primary benefit of TypeScript's 'unknown' type over 'any'?",
    options: [
      "It forces type checking before performing any operations or method calls.",
      "It automatically converts string variables to numbers at runtime.",
      "It completely disables type checking for performance gains.",
      "It can only store primitive numerical values."
    ],
    correctAnswer: 0,
    explanation: "'unknown' is the type-safe counterpart of 'any'. Anything is assignable to 'unknown', but 'unknown' is not assignable to anything without a type assertion or type guard."
  },
  {
    id: 2,
    question: "In modern React, what is the primary purpose of the 'use' hook?",
    options: [
      "To read asynchronous resources like Promises or Context dynamically inside render.",
      "To completely replace useEffect for browser DOM updates.",
      "To initialize Redux toolkit slices inside class components.",
      "To style components dynamically using CSS-in-JS primitives."
    ],
    correctAnswer: 0,
    explanation: "The 'use' hook allows reading values from Promises or Context directly during component render without blocking."
  },
  {
    id: 3,
    question: "Which React hook should be used to cache expensive calculations between re-renders?",
    options: [
      "useMemo",
      "useCallback",
      "useRef",
      "useImperativeHandle"
    ],
    correctAnswer: 0,
    explanation: "useMemo caches the result of a calculation between renders unless dependencies change."
  },
  {
    id: 4,
    question: "How does React's Virtual DOM diffing algorithm optimize DOM updates?",
    options: [
      "By comparing fiber trees and batching minimal DOM mutations.",
      "By saving HTML snapshots directly into browser localStorage.",
      "By running WebAssembly scripts on the server.",
      "By bypassing layout calculations completely."
    ],
    correctAnswer: 0,
    explanation: "React compares Virtual DOM nodes using heuristic diffing algorithms and applies only the required patches to the real DOM."
  },
  {
    id: 5,
    question: "What happens when a component throws a Promise inside a <Suspense> boundary?",
    options: [
      "React suspends rendering and displays the fallback UI until the Promise resolves.",
      "The browser throws an unhandled error and halts JavaScript execution.",
      "The page reloads immediately.",
      "All state variables are reset to null."
    ],
    correctAnswer: 0,
    explanation: "Suspense catches thrown promises, pauses rendering of that subtree, and displays fallback UI until the promise resolves."
  }
];

const SkillAssessment = () => {
  const navigate = useNavigate();
  const [isStarted, setIsStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes = 900 seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  // Timer Countdown Effect
  useEffect(() => {
    let timer;
    if (isStarted && !isSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isStarted && !isSubmitted) {
      handleFinalSubmit();
    }
    return () => clearInterval(timer);
  }, [isStarted, isSubmitted, timeLeft]);

  // Format Time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (qId, optionIdx) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleFinalSubmit = () => {
    let correctCount = 0;
    BENCHMARK_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / BENCHMARK_QUESTIONS.length) * 100);
    const passed = percentage >= 80;

    setScoreResult({
      score: percentage,
      correctCount,
      total: BENCHMARK_QUESTIONS.length,
      passed,
    });
    setIsSubmitted(true);
  };

  // Restart Quiz
  const handleRestart = () => {
    setIsStarted(false);
    setIsSubmitted(false);
    setCurrentIndex(0);
    setUserAnswers({});
    setTimeLeft(900);
    setScoreResult(null);
  };

  // RESULTS VIEW
  if (isSubmitted && scoreResult) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
        <div className="text-center p-8 bg-white dark:bg-[#1a2336] text-slate-900 dark:text-white border border-slate-200 dark:border-[#2b3854] rounded-3xl shadow-xl space-y-6">
          <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-gradient-to-tr from-blue-500 to-teal-400 p-1 shadow-lg shadow-teal-500/20">
            <div className="w-full h-full rounded-full bg-slate-100 dark:bg-[#0f1524] flex items-center justify-center">
              {scoreResult.passed ? (
                <CheckCircle2 className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="w-10 h-10 text-amber-500 dark:text-amber-400" />
              )}
            </div>
          </div>

          <div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                scoreResult.passed
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30'
              }`}
            >
              {scoreResult.passed ? 'PASSED - BENCHMARK MET' : 'NEEDS REVISION'}
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-3">
              Your Score: <span className="text-blue-600 dark:text-teal-400">{scoreResult.score}%</span>
            </h2>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">
              Correct Answers: {scoreResult.correctCount} out of {scoreResult.total} Questions
            </p>
          </div>

          {/* Details Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-[#0f1524] rounded-2xl border border-slate-200 dark:border-[#2b3854] text-left">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Target Benchmark</p>
              <p className="text-base font-black text-slate-900 dark:text-white">80%</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">AI Readiness Impact</p>
              <p className="text-base font-black text-emerald-600 dark:text-emerald-400">
                {scoreResult.passed ? '+15% Readiness' : '+0% Baseline'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Assessed Proficiency</p>
              <p className="text-base font-black text-blue-600 dark:text-teal-400">
                {scoreResult.score >= 80 ? 'Senior' : 'Intermediate'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button variant="outline" onClick={handleRestart} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Retake Assessment
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate(ROUTES.SKILL_GAP_RESULTS)}
              className="gap-2 bg-gradient-to-r from-blue-600 to-teal-500 shadow-md shadow-teal-500/20"
            >
              <Sparkles className="w-4 h-4" />
              View Skill Gap Analysis
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ IN PROGRESS VIEW
  if (isStarted) {
    const currentQ = BENCHMARK_QUESTIONS[currentIndex];
    const isLast = currentIndex === BENCHMARK_QUESTIONS.length - 1;

    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
        {/* Top Assessment Navigation & Timer Bar */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-[#1a2336] text-slate-900 dark:text-white border border-slate-200 dark:border-[#2b3854] rounded-2xl shadow-sm">
          <div>
            <span className="text-[10px] font-black tracking-wider uppercase text-blue-600 dark:text-blue-400">
              PROGRAMMING BENCHMARK
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Question {currentIndex + 1} of {BENCHMARK_QUESTIONS.length}
            </h3>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-[#0f1524] rounded-xl border border-slate-200 dark:border-[#2b3854]">
            <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-pulse" />
            <span className="text-xs font-black font-mono text-slate-900 dark:text-white">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-[#0f1524] rounded-full h-2 overflow-hidden border border-slate-200 dark:border-[#2b3854]">
          <div
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / BENCHMARK_QUESTIONS.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Box */}
        <div className="p-6 md:p-8 bg-white dark:bg-[#1a2336] text-slate-900 dark:text-white border border-slate-200 dark:border-[#2b3854] rounded-3xl shadow-xl space-y-6">
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = userAnswers[currentQ.id] === idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(currentQ.id, idx)}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-600/20 ring-2 ring-blue-500/40 dark:ring-blue-500/50'
                      : 'border-slate-200 dark:border-[#2b3854] bg-slate-50/50 dark:bg-[#0f1524]/60 hover:bg-slate-100 dark:hover:bg-[#0f1524]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-500'
                    }`}
                  >
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white"></span>}
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {opt}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-[#2b3854]">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>

            {isLast ? (
              <Button
                variant="primary"
                onClick={handleFinalSubmit}
                className="bg-gradient-to-r from-blue-600 to-teal-500 shadow-md shadow-teal-500/20"
              >
                Submit Assessment
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next Question
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // DYNAMIC CARD (LIGHT BG IN LIGHT MODE, DARK NAVY IN DARK MODE)
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 animate-fade-in">
      <div className="p-8 md:p-10 bg-white dark:bg-[#1a2336] text-slate-900 dark:text-white border border-slate-200/90 dark:border-[#2b3854] rounded-3xl shadow-xl dark:shadow-2xl space-y-8 transition-colors duration-300">
        {/* Top Tag & Header */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-600/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center shrink-0">
            <CheckSquare className="w-7 h-7 text-blue-600 dark:text-blue-500" />
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
              PROGRAMMING
            </span>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Advanced React & Modern TypeScript Benchmark
            </h1>
          </div>
        </div>

        {/* Metrics Box (Light in Light Mode, Dark in Dark Mode) */}
        <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-[#2b3854] border border-slate-200 dark:border-[#2b3854] rounded-2xl bg-slate-50 dark:bg-[#0f1524] p-5 text-center transition-colors">
          <div className="px-2">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">TOTAL QUESTIONS</p>
            <p className="text-lg md:text-xl font-black text-slate-900 dark:text-white mt-1">5 MCQs</p>
          </div>
          <div className="px-2">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">TIME DURATION</p>
            <p className="text-lg md:text-xl font-black text-slate-900 dark:text-white mt-1">15 Minutes</p>
          </div>
          <div className="px-2">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">PASSING BENCHMARK</p>
            <p className="text-lg md:text-xl font-black text-emerald-600 dark:text-[#10b981] mt-1">80%</p>
          </div>
        </div>

        {/* Assessment Instructions */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Assessment Instructions</h3>
          <ul className="space-y-2 text-xs font-medium text-slate-700 dark:text-slate-300">
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 shrink-0"></span>
              Ensure you have a stable internet connection. Timer will count down once started.
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 shrink-0"></span>
              Each question has multiple choices with exactly 1 correct answer.
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 shrink-0"></span>
              Your results will immediately update your profile's AI Skill Readiness Score.
            </li>
          </ul>
        </div>

        {/* Start Button (Full Width Gradient Button) */}
        <button
          onClick={() => setIsStarted(true)}
          className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-2xl font-black text-sm transition-all duration-300 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer group"
        >
          <span>Start Assessment Now</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default SkillAssessment;