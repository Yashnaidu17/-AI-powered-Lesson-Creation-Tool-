import React from 'react';
import { Sparkles, Sliders, ShieldCheck, BookOpen, Clock, FileText } from 'lucide-react';

export default function Header({ onOpenSettings, activeLesson, onOpenExport }) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-600/20 text-white font-black text-sm tracking-tighter">
            LC
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white tracking-tight text-lg">LessonCraft AI</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium">
                Curriculum & Dual QC Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Autonomous 45-Min Lesson Creation with Research Synthesis & Dual QC Auditing
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {activeLesson && (
            <>
              <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-300">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span>Target: <strong>45 Mins</strong></span>
              </div>
              <button
                onClick={onOpenExport}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Export Lesson</span>
              </button>
            </>
          )}

          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}

