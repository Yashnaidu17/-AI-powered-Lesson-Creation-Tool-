import React from 'react';
import { Sparkles, BookOpen, Search, ArrowRight, Lightbulb, RefreshCw, AlertCircle } from 'lucide-react';

export default function InputSection({
  title,
  setTitle,
  objective,
  setObjective,
  presets,
  onSelectPreset,
  onRunFullPipeline,
  isProcessing,
  activeStep,
  errorMessage
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Preset Pill Selector */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Curriculum Presets & Benchmarks
          </label>
          <span className="text-xs text-rose-400 font-medium hidden sm:inline">
            Click to auto-populate prompt
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              type="button"
              className={`p-3 rounded-xl text-left border transition-all relative ${
                title === preset.title
                  ? 'border-rose-500/80 bg-rose-950/30 text-white shadow-md shadow-rose-950/50'
                  : 'border-slate-800 bg-slate-850/60 hover:border-slate-700 text-slate-300'
              }`}
            >
              {preset.isFeaturedSample && (
                <span className="inline-block px-1.5 py-0.5 mb-1.5 text-[10px] uppercase font-bold tracking-wider rounded bg-rose-600 text-white">
                  Featured Preset
                </span>
              )}
              <div className="font-semibold text-xs text-white truncate">{preset.title}</div>
              <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{preset.objective}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Inputs Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            1. Lesson Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. HTTP Requests and Responses"
            disabled={isProcessing}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition disabled:opacity-50"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300">
              2. Learning Objective <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">Target Duration: 45 Minutes</span>
          </div>
          <textarea
            rows={2}
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="e.g. Explain GET and POST methods and distinguish between 2xx, 4xx, and 5xx response status categories."
            disabled={isProcessing}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition disabled:opacity-50 resize-none"
          />
        </div>

        {/* Error Message banner */}
        {errorMessage && (
          <div className="flex items-center space-x-2 text-rose-400 bg-rose-950/40 border border-rose-800/60 rounded-xl px-4 py-2.5 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Trigger */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Researches Books, MDN/Web Standards & YouTube Videos</span>
          </div>

          <button
            onClick={onRunFullPipeline}
            disabled={isProcessing || !title.trim() || !objective.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Pipeline: {activeStep}...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate 45-Min Lesson & Run Dual QC</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

