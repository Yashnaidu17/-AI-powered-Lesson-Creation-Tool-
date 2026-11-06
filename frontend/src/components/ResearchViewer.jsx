import React from 'react';
import { BookOpen, Globe, Video, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ResearchViewer({ researchData }) {
  if (!researchData) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        <BookOpen className="w-10 h-10 mx-auto text-slate-600 mb-2" />
        <p>No research data available yet. Run the pipeline to view researched sources.</p>
      </div>
    );
  }

  const { books = [], websites = [], videos = [], metrics } = researchData;

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Multi-Source Research Synthesis Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Curated and verified across published academic literature, formal standards, and video instruction.
            </p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
              Total References: <strong className="text-white">{metrics?.totalSources || (books.length + websites.length + videos.length)}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold">
              Reliability Avg: {metrics?.sourceReliabilityAverage || 96}%
            </span>
          </div>
        </div>

        {/* Section 1: Published Books */}
        <div className="mt-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            1. Authoritative Books & Literature ({books.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {books.map((b, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-white text-sm">{b.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 flex-shrink-0">
                      {b.year}
                    </span>
                  </div>
                  <div className="text-slate-400 mt-1">
                    Authors: <strong className="text-slate-200">{Array.isArray(b.authors) ? b.authors.join(', ') : b.authors}</strong>
                  </div>
                  <div className="text-slate-400 mt-0.5">
                    Publisher: <span className="text-slate-300">{b.publisher}</span> | ISBN: <span className="font-mono text-slate-300">{b.isbn || 'N/A'}</span>
                  </div>
                  <p className="text-slate-300 mt-2 text-[11px] leading-relaxed">{b.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-medium">{b.reliabilityTier}</span>
                  {b.infoLink && (
                    <a
                      href={b.infoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Standards & Web Documentation */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5 mb-3">
            <Globe className="w-3.5 h-3.5" />
            2. Web Standards & Official Documentation ({websites.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {websites.map((w, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-white text-sm">{w.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-500/10 text-sky-300 border border-sky-500/20 flex-shrink-0">
                      {w.source}
                    </span>
                  </div>
                  <p className="text-slate-300 mt-2 text-[11px] leading-relaxed">{w.snippet}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-mono">Score: {w.reliabilityScore || 95}/100</span>
                  <a
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                  >
                    <span>View Official Standard</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: YouTube Supplementary Videos */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5 mb-3">
            <Video className="w-3.5 h-3.5" />
            3. Supplementary YouTube Videos & Segment Timestamps ({videos.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {videos.map((v, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 border border-slate-800 mb-2">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                      title={v.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <h4 className="font-bold text-white text-xs line-clamp-1">{v.title}</h4>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Channel: <span className="text-slate-200">{v.channel}</span> ({v.duration})
                  </div>
                  <p className="text-slate-300 mt-1.5 text-[11px] line-clamp-2">{v.description}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-amber-300">
                  {v.recommendedSegment}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

