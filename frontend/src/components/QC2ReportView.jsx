import React from 'react';
import { Award, CheckCircle2, Clock, Target, Check, AlertTriangle, BookOpen, Layers } from 'lucide-react';

export default function QC2ReportView({ qc2Report, onApplyFix, isApplying }) {
  if (!qc2Report) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        <Award className="w-10 h-10 mx-auto text-slate-600 mb-2" />
        <p>No QC Layer 2 audit report generated yet. Run the pipeline to view instructional quality metrics.</p>
      </div>
    );
  }

  const { overallScore, status, summary, objectiveAlignment, pacingAudit, findings } = qc2Report;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                QC Layer 2
              </span>
              <h2 className="text-lg font-bold text-white">Instructional Quality & Pacing Audit</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">{summary}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Quality Score</div>
              <div className="text-3xl font-extrabold text-rose-400 font-mono">{overallScore}%</div>
            </div>
            <div className="px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
              {status}
            </div>
          </div>
        </div>

        {/* 45-Minute Pacing Audit Bar */}
        <div className="pt-5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>45-Minute Time Budget & Pedagogical Allocation</span>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              {pacingAudit?.estimatedTotalMinutes || 45} / 45 Minutes Budgeted
            </span>
          </div>

          <div className="w-full bg-slate-950 rounded-xl p-3 border border-slate-800">
            {/* Visual multi-segment bar */}
            <div className="h-3 w-full rounded-lg overflow-hidden flex bg-slate-800">
              <div style={{ width: '11.1%' }} className="bg-sky-500" title="Hook & Intro (5m)" />
              <div style={{ width: '22.2%' }} className="bg-indigo-500" title="Theory & Concepts (10m)" />
              <div style={{ width: '22.2%' }} className="bg-purple-500" title="Deep Dive Mechanics (10m)" />
              <div style={{ width: '22.2%' }} className="bg-emerald-500" title="Hands-On Lab (10m)" />
              <div style={{ width: '22.2%' }} className="bg-amber-500" title="Knowledge Check & Quiz (10m)" />
            </div>

            {/* Pacing Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-3 text-[11px]">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                <span className="text-slate-300 font-medium">Hook (5m)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span className="text-slate-300 font-medium">Theory (10m)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                <span className="text-slate-300 font-medium">Deep Dive (10m)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-300 font-medium">Hands-On Lab (10m)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-slate-300 font-medium">Quiz & Wrap (10m)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Objective Alignment Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Learning Objective Alignment Breakdown</h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold">
            {objectiveAlignment?.alignmentPercentage || 100}% Aligned
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {objectiveAlignment?.criteriaEvaluated?.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs"
            >
              <span className="text-slate-300">{c.label}</span>
              <span className="flex items-center space-x-1 text-emerald-400 font-semibold font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Covered (+{c.weight}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Pedagogical Findings & Scaffolding */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center space-x-2 mb-4">
          <Layers className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-white">Pedagogical Findings & Scaffolding Critiques</h3>
        </div>

        <div className="space-y-4">
          {findings.map((f) => (
            <div
              key={f.id}
              className={`p-4 rounded-xl border transition-all ${
                f.applied
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : 'border-slate-800 bg-slate-950/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {f.dimension}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">{f.targetSection}</span>
                </div>

                {f.applied ? (
                  <span className="flex items-center space-x-1 text-xs text-emerald-400 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied to Lesson</span>
                  </span>
                ) : (
                  f.severity !== 'Pass' && (
                    <button
                      onClick={() => onApplyFix('qc2', f.id)}
                      disabled={isApplying}
                      className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow transition disabled:opacity-50 cursor-pointer self-start sm:self-auto"
                    >
                      Apply Enhancement
                    </button>
                  )
                )}
              </div>

              <div className="mt-2 space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold">Pedagogical Critique: </span>
                  <span className="text-slate-200">{f.critique}</span>
                </div>
                <div>
                  <span className="text-purple-400 font-semibold">Cognitive Scaffolding Rationale: </span>
                  <span className="text-slate-300">{f.pedagogicalRationale}</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-semibold">Suggested Enhancement: </span>
                  <span className="text-slate-200">{f.suggestedEnhancement}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

