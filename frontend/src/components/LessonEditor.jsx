import React, { useState, useEffect } from 'react';
import { Save, Check, Eye, Edit3, Columns, Sparkles, BookOpen, Clock } from 'lucide-react';
import { marked } from 'marked';

export default function LessonEditor({
  content,
  onChangeContent,
  onSaveContent,
  isSaving,
  lastSavedTime,
  title,
  objective
}) {
  const [viewMode, setViewMode] = useState('split'); // 'edit' | 'preview' | 'split'
  const [renderedHtml, setRenderedHtml] = useState('');

  useEffect(() => {
    try {
      setRenderedHtml(marked.parse(content || ''));
    } catch (e) {
      setRenderedHtml('<p>Error rendering markdown.</p>');
    }
  }, [content]);

  // Calculations
  const wordCount = content ? content.trim().split(/\s+/).length : 0;
  const estimatedReadingTime = Math.ceil(wordCount / 140);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col h-[750px]">
      {/* Top Toolbar */}
      <div className="bg-slate-850 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-300 text-xs font-semibold border border-rose-500/20 flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5" />
            <span>Instructor Studio</span>
          </div>

          <div className="text-xs text-slate-400 hidden sm:flex items-center space-x-3">
            <span>Words: <strong>{wordCount}</strong></span>
            <span>Est. Session Time: <strong className="text-emerald-400">{estimatedReadingTime + 20}m (45m Target)</strong></span>
          </div>
        </div>

        {/* View mode toggle & Save button */}
        <div className="flex items-center space-x-2">
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex items-center text-xs">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-2.5 py-1 rounded-md transition ${viewMode === 'edit' ? 'bg-rose-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              Editor
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-md hidden md:block transition ${viewMode === 'split' ? 'bg-rose-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1 rounded-md transition ${viewMode === 'preview' ? 'bg-rose-600 text-white font-medium' : 'text-slate-400 hover:text-white'}`}
            >
              Preview
            </button>
          </div>

          <button
            onClick={onSaveContent}
            disabled={isSaving}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <Check className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Lesson</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor & Preview Panes */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
        {/* Editor Pane */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={`h-full flex flex-col bg-slate-950 ${viewMode === 'edit' ? 'col-span-2' : ''}`}>
            <textarea
              value={content}
              onChange={(e) => onChangeContent(e.target.value)}
              className="w-full flex-1 p-5 bg-transparent text-slate-200 font-mono text-xs leading-relaxed focus:outline-none resize-none overflow-y-auto selection:bg-rose-500 selection:text-white"
              placeholder="# Write or edit lesson markdown here..."
            />
          </div>
        )}

        {/* Live Preview Pane */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`h-full overflow-y-auto p-6 bg-slate-900 ${viewMode === 'preview' ? 'col-span-2' : ''}`}>
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-slate-950 border-t border-slate-800/80 px-4 py-2 flex items-center justify-between text-[11px] text-slate-500">
        <div>
          {lastSavedTime ? (
            <span>Auto-saved to disk at: <strong className="text-slate-400">{lastSavedTime}</strong></span>
          ) : (
            <span>Unsaved local changes</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span>Markdown Syntax Supported</span>
        </div>
      </div>
    </div>
  );
}

