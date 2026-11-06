import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, CheckCircle2, HelpCircle, Award, BookOpen } from 'lucide-react';
import { marked } from 'marked';

export default function StudentPreview({ lesson }) {
  const [secondsRemaining, setSecondsRemaining] = useState(45 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((sec) => sec - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setSecondsRemaining(45 * 60);
  };

  const content = lesson?.content || '';
  const renderedHtml = marked.parse(content);

  // Sample Interactive Quiz Questions (derived from content)
  const sampleQuiz = [
    {
      id: 1,
      question: "Which of the following operations violates HTTP method idempotency semantics?",
      options: [
        { key: 'A', text: "Re-running a GET request to query user balance 10 times consecutively." },
        { key: 'B', text: "Submitting a POST request that charges a credit card $50 each time it is executed." },
        { key: 'C', text: "Making a GET request with query parameter ?filter=active." },
        { key: 'D', text: "Sending a HEAD request to verify file size." }
      ],
      correctKey: 'B',
      explanation: "POST is non-idempotent by specification (RFC 9110); executing it multiple times causes multiple transactions or duplicate resource creations."
    },
    {
      id: 2,
      question: "A client submits a valid API token for a standard student account, but requests an administrative endpoint (/api/admin/reset). Which status code should the server return?",
      options: [
        { key: 'A', text: "401 Unauthorized" },
        { key: 'B', text: "403 Forbidden" },
        { key: 'C', text: "404 Not Found" },
        { key: 'D', text: "500 Internal Server Error" }
      ],
      correctKey: 'B',
      explanation: "The user is authenticated (so 401 is incorrect), but lacks authorization/permission to perform the administrative action, making 403 Forbidden the semantically correct code."
    },
    {
      id: 3,
      question: "If an upstream API service crashes and drops the TCP connection to a reverse proxy (e.g. Nginx), what status code does the proxy return?",
      options: [
        { key: 'A', text: "400 Bad Request" },
        { key: 'B', text: "404 Not Found" },
        { key: 'C', text: "502 Bad Gateway" },
        { key: 'D', text: "204 No Content" }
      ],
      correctKey: 'C',
      explanation: "When an intermediary reverse proxy receives an invalid or dropped response from the upstream service, it produces a 502 Bad Gateway error."
    }
  ];

  const handleSelectOption = (qId, key) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: key }));
  };

  return (
    <div className="space-y-6">
      {/* 45-Minute Lesson Pacing Floating Tracker */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl sticky top-20 z-20 backdrop-blur-md bg-opacity-95 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Live 45-Minute Lesson Delivery Mode
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{lesson?.title || 'Active Session'}</p>
        </div>

        {/* Stopwatch timer */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <Clock className="w-4 h-4 text-rose-400" />
            <span className="font-mono text-lg font-bold text-white tracking-wider">
              {formatTime(secondsRemaining)}
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-bold">Remaining</span>
          </div>

          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition cursor-pointer"
            title={isTimerRunning ? 'Pause Session' : 'Start 45m Timer'}
          >
            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={resetTimer}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            title="Reset to 45:00"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rendered Lesson Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl">
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      </div>

      {/* Interactive Formative Quiz Runner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-800">
          <HelpCircle className="w-5 h-5 text-rose-400" />
          <h3 className="text-base font-bold text-white">Interactive Student Knowledge Check</h3>
          <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Immediate Diagnostic Feedback
          </span>
        </div>

        <div className="space-y-6">
          {sampleQuiz.map((q) => {
            const selected = userAnswers[q.id];
            const isAnswered = !!selected;
            const isCorrect = selected === q.correctKey;

            return (
              <div key={q.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs font-semibold text-rose-400 mb-1">Question {q.id}</div>
                <div className="text-sm font-medium text-white mb-3">{q.question}</div>

                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isOptionSelected = selected === opt.key;
                    let optionStyle = 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700';

                    if (isAnswered) {
                      if (opt.key === q.correctKey) {
                        optionStyle = 'border-emerald-500/80 bg-emerald-950/30 text-emerald-200 font-semibold';
                      } else if (isOptionSelected) {
                        optionStyle = 'border-red-500/80 bg-red-950/30 text-red-200';
                      }
                    }

                    return (
                      <button
                        key={opt.key}
                        onClick={() => handleSelectOption(q.id, opt.key)}
                        disabled={isAnswered}
                        className={`w-full text-left p-3 rounded-lg border text-xs flex items-center space-x-3 transition ${optionStyle}`}
                      >
                        <span className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center font-bold text-slate-300 flex-shrink-0">
                          {opt.key}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback */}
                {isAnswered && (
                  <div className={`mt-3 p-3 rounded-lg text-xs border ${
                    isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-950/20 border-red-500/30 text-red-300'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                      {isCorrect ? '✅ Correct Answer!' : '❌ Incorrect Selection'}
                    </div>
                    <div>{q.explanation}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

