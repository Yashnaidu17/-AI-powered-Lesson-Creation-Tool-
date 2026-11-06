import React from 'react';
import { Search, Sparkles, ShieldCheck, Award, CheckCircle2, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

export default function PipelineTracker({
  stepStates,
  onRetryStep,
  isProcessing
}) {
  const steps = [
    {
      key: 'research',
      title: '1. Multi-Source Research',
      description: 'Books (Google/OpenLib), Docs (MDN/RFC), YouTube',
      icon: Search
    },
    {
      key: 'generate',
      title: '2. 45-Min Lesson Synthesis',
      description: '5-phase active learning roadmap & code walkthrough',
      icon: Sparkles
    },
    {
      key: 'qc1',
      title: '3. QC Layer 1 (Factual Accuracy)',
      description: 'Fact-checking claims against RFC 9110 & citations',
      icon: ShieldCheck
    },
    {
      key: 'qc2',
      title: '4. QC Layer 2 (Instructional Quality)',
      description: 'Learning objective alignment % & 45-min pacing',
      icon: Award
    }
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-rose-400" />
          Autonomous Pipeline Execution Status
        </h3>
        <span className="text-[11px] text-slate-500 hidden sm:inline">Modular & Retriable Workflow</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step) => {
          const state = stepStates[step.key] || { status: 'idle' };
          const Icon = step.icon;

          let badgeColor = 'bg-slate-800 text-slate-400 border-slate-700';
          let borderHighlight = 'border-slate-800';

          if (state.status === 'running') {
            badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse';
            borderHighlight = 'border-rose-500/50 bg-rose-950/10';
          } else if (state.status === 'success') {
            badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
            borderHighlight = 'border-emerald-500/40 bg-emerald-950/10';
          } else if (state.status === 'error') {
            badgeColor = 'bg-red-500/20 text-red-300 border-red-500/40';
            borderHighlight = 'border-red-500/50 bg-red-950/10';
          }

          return (
            <div
              key={step.key}
              className={`p-3.5 rounded-xl border transition-all ${borderHighlight} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                    <Icon className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider flex items-center space-x-1 ${badgeColor}`}>
                    {state.status === 'running' && <RefreshCw className="w-2.5 h-2.5 animate-spin mr-1" />}
                    {state.status === 'success' && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 mr-1" />}
                    {state.status === 'error' && <AlertTriangle className="w-2.5 h-2.5 text-red-400 mr-1" />}
                    <span>{state.status}</span>
                  </div>
                </div>
                <div className="font-semibold text-xs text-white">{step.title}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{step.description}</div>
              </div>

              {/* Action / Metric details */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                {state.metric ? (
                  <span className="text-emerald-400 font-mono font-medium">{state.metric}</span>
                ) : (
                  <span className="text-slate-500">Ready</span>
                )}

                {state.status === 'error' && (
                  <button
                    onClick={() => onRetryStep(step.key)}
                    disabled={isProcessing}
                    className="text-xs text-rose-400 hover:text-rose-300 font-medium underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Retry
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

