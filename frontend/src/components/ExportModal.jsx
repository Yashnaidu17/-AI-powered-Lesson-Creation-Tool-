import React, { useState } from 'react';
import { X, Download, FileText, Code, Check, Printer, Copy } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, lesson }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !lesson) return null;

  const downloadFile = (filename, content, type = 'text/plain') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    const filename = `${lesson.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-45min-lesson.md`;
    downloadFile(filename, lesson.content, 'text/markdown');
  };

  const handleDownloadJson = () => {
    const filename = `${lesson.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-full-package.json`;
    const jsonStr = JSON.stringify(lesson, null, 2);
    downloadFile(filename, jsonStr, 'application/json');
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(lesson.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-rose-500" />
            <h3 className="text-base font-bold text-white">Export Finalized Lesson & QC Bundle</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <p className="text-xs text-slate-300">
            Export the finalized 45-minute lesson content along with verified references and both Quality Control (QC) audit reports:
          </p>

          <div className="space-y-2.5">
            {/* Markdown Export */}
            <button
              onClick={handleDownloadMarkdown}
              className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left flex items-center justify-between transition group"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-rose-400 group-hover:scale-110 transition" />
                <div>
                  <div className="text-xs font-bold text-white">Download Markdown (.md)</div>
                  <div className="text-[11px] text-slate-400">Standard GitHub-flavored markdown with pacing schedule</div>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
            </button>

            {/* Print / Save as PDF */}
            <button
              onClick={handlePrint}
              className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left flex items-center justify-between transition group"
            >
              <div className="flex items-center space-x-3">
                <Printer className="w-5 h-5 text-sky-400 group-hover:scale-110 transition" />
                <div>
                  <div className="text-xs font-bold text-white">Print / Save as PDF</div>
                  <div className="text-[11px] text-slate-400">Print-ready layout formatted for distribution</div>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
            </button>

            {/* JSON Full Bundle */}
            <button
              onClick={handleDownloadJson}
              className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left flex items-center justify-between transition group"
            >
              <div className="flex items-center space-x-3">
                <Code className="w-5 h-5 text-purple-400 group-hover:scale-110 transition" />
                <div>
                  <div className="text-xs font-bold text-white">Download Full Package JSON</div>
                  <div className="text-[11px] text-slate-400">Includes research data, QC1 findings, and QC2 metrics</div>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-500 group-hover:text-white transition" />
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Raw Markdown'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

