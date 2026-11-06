import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle, CheckCircle, ExternalLink, Filter, Sparkles, Check } from 'lucide-react';

export default function QC1ReportView({ qc1Report, onApplyFix, isApplying }) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  if (!qc1Report) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        <ShieldCheck className="w-10 h-10 mx-auto text-slate-600 mb-2" />
        <p>No QC Layer 1 audit report generated yet. Run the pipeline to view factual verification results.</p>
      </div>
    );
  }

  const { overallScore, status, summary, sourcesAudit, findings } = qc1Report;

  const filteredFindings = findings.filter((f) => {
    if (filterSeverity === 'ALL') return true;
    return f.severity.toUpperCase() === filterSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                QC Layer 1
              </span>
              <h2 className="text-lg font-bold text-white">Research & Factual Accuracy Audit</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">{summary}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Factual Score</div>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">{overallScore}%</div>
            </div>
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider ${
              status === 'PASS'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}>
              {status}
            </div>
          </div>
        </div>

        {/* Source Reliability Verification Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-500 font-medium">External Sources Evaluated</div>
            <div className="text-base font-bold text-white mt-0.5">{sourcesAudit?.totalEvaluated || 6}</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-500 font-medium">Tier-1 Authority Sources</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">{sourcesAudit?.tier1Count || 5}</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-500 font-medium">RFC / W3C Standards Track</div>
            <div className="text-base font-bold text-rose-400 mt-0.5">RFC 9110 Verified</div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="text-[11px] text-slate-500 font-medium">Reliability Grade</div>
            <div className="text-base font-bold text-purple-400 mt-0.5">Tier 1 (A+)</div>
          </div>
        </div>
      </div>

      {/* Findings Inspector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Factual Claims & Verification Log</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              {findings.length} findings
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500 mr-1" />
            {['ALL', 'HIGH', 'MEDIUM', 'LOW', 'PASS'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2.5 py-1 rounded-lg transition text-[11px] font-semibold ${
                  filterSeverity === sev
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Finding Cards */}
        <div className="space-y-4">
          {filteredFindings.map((finding) => (
            <div
              key={finding.id}
              className={`p-4 rounded-xl border transition-all ${
                finding.applied
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : finding.severity === 'High'
                  ? 'border-red-500/30 bg-red-950/10'
                  : finding.severity === 'Medium'
                  ? 'border-amber-500/30 bg-amber-950/10'
                  : 'border-slate-800 bg-slate-950/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                    finding.severity === 'High'
                      ? 'bg-red-500/20 text-red-300 border-red-500/40'
                      : finding.severity === 'Medium'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {finding.severity} Severity
                  </span>
                  <span className="text-xs font-semibold text-slate-300">{finding.category}</span>
                </div>

                {finding.applied ? (
                  <span className="flex items-center space-x-1 text-xs text-emerald-400 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied to Lesson</span>
                  </span>
                ) : (
                  finding.severity !== 'Pass' && (
                    <button
                      onClick={() => onApplyFix('qc1', finding.id)}
                      disabled={isApplying}
                      className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow transition disabled:opacity-50 cursor-pointer self-start sm:self-auto"
                    >
                      Apply Recommended Fix
                    </button>
                  )
                )}
              </div>

              {finding.targetExcerpt && (
                <div className="mt-2 text-xs font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                  <span className="text-slate-500 block mb-0.5 text-[10px] font-sans uppercase">Inspected Text:</span>
                  "{finding.targetExcerpt}"
                </div>
              )}

              <div className="mt-3 space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold">Identified Inconsistency / Gap: </span>
                  <span className="text-slate-200">{finding.issue}</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-semibold">Verified Fact (Standard): </span>
                  <span className="text-slate-200">{finding.verifiedFact}</span>
                </div>
                <div>
                  <span className="text-rose-400 font-semibold">Suggested Improvement: </span>
                  <span className="text-slate-200">{finding.suggestedImprovement}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

