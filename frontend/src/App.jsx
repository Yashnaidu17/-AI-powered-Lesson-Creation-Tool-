import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import InputSection from './components/InputSection.jsx';
import PipelineTracker from './components/PipelineTracker.jsx';
import LessonEditor from './components/LessonEditor.jsx';
import QC1ReportView from './components/QC1ReportView.jsx';
import QC2ReportView from './components/QC2ReportView.jsx';
import ResearchViewer from './components/ResearchViewer.jsx';
import StudentPreview from './components/StudentPreview.jsx';
import ExportModal from './components/ExportModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import { BookOpen, ShieldCheck, Award, Eye, Edit3, Sparkles } from 'lucide-react';

const DEFAULT_PRESETS = [
  {
    id: 'http-requests-responses',
    title: 'HTTP Requests and Responses',
    objective: 'Explain GET and POST methods and distinguish between 2xx, 4xx, and 5xx response status categories.',
    durationMinutes: 45,
    isFeaturedSample: true
  },
  {
    id: 'git-branching-merge',
    title: 'Git Branching and Merge Conflict Resolution',
    objective: 'Master branch pointers, 3-way merge algorithms, and systematically resolve conflict markers (<<<<<<<, =======, >>>>>>>) without code regression.',
    durationMinutes: 45,
    isFeaturedSample: false
  },
  {
    id: 'database-indexing',
    title: 'Relational Database Indexing with B-Trees',
    objective: 'Understand how B-Tree indices accelerate SELECT lookups from O(N) to O(log N) and identify the write-overhead tradeoffs on INSERT and UPDATE operations.',
    durationMinutes: 45,
    isFeaturedSample: false
  }
];

export default function App() {
  const [title, setTitle] = useState(DEFAULT_PRESETS[0].title);
  const [objective, setObjective] = useState(DEFAULT_PRESETS[0].objective);
  const [presets, setPresets] = useState(DEFAULT_PRESETS);

  const [activeLesson, setActiveLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'qc1' | 'qc2' | 'research' | 'preview'
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isApplyingFix, setIsApplyingFix] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [llmConfig, setLlmConfig] = useState({
    apiKey: '',
    provider: 'gemini',
    model: 'gemini-2.5-flash'
  });

  const [stepStates, setStepStates] = useState({
    research: { status: 'idle', metric: null },
    generate: { status: 'idle', metric: null },
    qc1: { status: 'idle', metric: null },
    qc2: { status: 'idle', metric: null }
  });

  // Fetch presets and initial history from server
  useEffect(() => {
    fetch('/api/presets')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setPresets(data);
      })
      .catch((err) => console.log('Using local preset defaults'));

    // Check if there are previously saved lessons
    fetch('/api/lessons')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const latest = data[0];
          setActiveLesson(latest);
          setTitle(latest.title);
          setObjective(latest.objective);
          setLastSavedTime(new Date(latest.updatedAt || latest.createdAt).toLocaleTimeString());
          setStepStates({
            research: { status: 'success', metric: `${(latest.researchData?.books?.length || 0) + (latest.researchData?.websites?.length || 0)} sources` },
            generate: { status: 'success', metric: '45-Min Lesson' },
            qc1: { status: 'success', metric: `${latest.qc1Report?.overallScore || 95}% Factual` },
            qc2: { status: 'success', metric: `${latest.qc2Report?.overallScore || 94}% Pedagogical` }
          });
        }
      })
      .catch((err) => console.log('No previous saved lessons found'));
  }, []);

  const handleSelectPreset = (preset) => {
    setTitle(preset.title);
    setObjective(preset.objective);
    setErrorMessage('');
  };

  // Run the full pipeline: Research -> Synthesis -> QC1 -> QC2
  const handleRunFullPipeline = async () => {
    if (!title.trim() || !objective.trim()) {
      setErrorMessage('Please provide both a Lesson Title and Learning Objective.');
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);

    try {
      // 1. Research phase
      setActiveStep('Researching Sources');
      setStepStates({
        research: { status: 'running' },
        generate: { status: 'idle' },
        qc1: { status: 'idle' },
        qc2: { status: 'idle' }
      });

      const resResearch = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, objective })
      });
      if (!resResearch.ok) throw new Error('Research phase failed');
      const researchData = await resResearch.json();
      setStepStates((prev) => ({
        ...prev,
        research: { status: 'success', metric: `${researchData.metrics?.totalSources || 6} sources` }
      }));

      // 2. Generation phase
      setActiveStep('Synthesizing 45-Min Lesson');
      setStepStates((prev) => ({ ...prev, generate: { status: 'running' } }));

      const resGen = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, objective, researchData, llmConfig })
      });
      if (!resGen.ok) throw new Error('Lesson generation phase failed');
      const lessonGen = await resGen.json();
      setStepStates((prev) => ({
        ...prev,
        generate: { status: 'success', metric: '45-Min Paced' }
      }));

      // 3. QC Layer 1 (Factual Accuracy)
      setActiveStep('Running QC1 (Factual Accuracy)');
      setStepStates((prev) => ({ ...prev, qc1: { status: 'running' } }));

      const resQc1 = await fetch('/api/qc1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonContent: lessonGen.content,
          title,
          objective,
          researchData,
          llmConfig
        })
      });
      if (!resQc1.ok) throw new Error('QC Layer 1 audit failed');
      const qc1Report = await resQc1.json();
      setStepStates((prev) => ({
        ...prev,
        qc1: { status: 'success', metric: `${qc1Report.overallScore}% RFC-9110` }
      }));

      // 4. QC Layer 2 (Instructional Quality)
      setActiveStep('Running QC2 (Instructional Quality)');
      setStepStates((prev) => ({ ...prev, qc2: { status: 'running' } }));

      const resQc2 = await fetch('/api/qc2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonContent: lessonGen.content,
          title,
          objective,
          llmConfig
        })
      });
      if (!resQc2.ok) throw new Error('QC Layer 2 audit failed');
      const qc2Report = await resQc2.json();
      setStepStates((prev) => ({
        ...prev,
        qc2: { status: 'success', metric: `${qc2Report.overallScore}% Paced` }
      }));

      // Assemble full lesson object and save to persistent storage
      const fullPackage = {
        id: crypto.randomUUID(),
        title,
        objective,
        durationMinutes: 45,
        content: lessonGen.content,
        researchData,
        qc1Report,
        qc2Report,
        isFinalized: false
      };

      const resSave = await fetch('/api/lessons/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullPackage)
      });
      const savedLesson = await resSave.json();

      setActiveLesson(savedLesson);
      setLastSavedTime(new Date().toLocaleTimeString());
      setActiveTab('editor');
    } catch (err) {
      console.error(err);
      setErrorMessage(`Pipeline failed: ${err.message}. You can retry failed steps individually.`);
    } finally {
      setIsProcessing(false);
      setActiveStep('');
    }
  };

  // Modular retry for individual steps
  const handleRetryStep = async (stepKey) => {
    if (!activeLesson) return;
    setIsProcessing(true);
    setActiveStep(`Retrying ${stepKey.toUpperCase()}`);

    try {
      if (stepKey === 'research') {
        const res = await fetch('/api/research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: activeLesson.title, objective: activeLesson.objective })
        });
        const researchData = await res.json();
        const updated = { ...activeLesson, researchData };
        await fetch('/api/lessons/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
        setActiveLesson(updated);
        setStepStates((prev) => ({
          ...prev,
          research: { status: 'success', metric: `${researchData.metrics?.totalSources || 6} sources` }
        }));
      } else if (stepKey === 'qc1') {
        const res = await fetch('/api/qc1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonContent: activeLesson.content,
            title: activeLesson.title,
            objective: activeLesson.objective,
            researchData: activeLesson.researchData,
            llmConfig
          })
        });
        const qc1Report = await res.json();
        const updated = { ...activeLesson, qc1Report };
        await fetch('/api/lessons/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
        setActiveLesson(updated);
        setStepStates((prev) => ({
          ...prev,
          qc1: { status: 'success', metric: `${qc1Report.overallScore}% Factual` }
        }));
      } else if (stepKey === 'qc2') {
        const res = await fetch('/api/qc2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lessonContent: activeLesson.content,
            title: activeLesson.title,
            objective: activeLesson.objective,
            llmConfig
          })
        });
        const qc2Report = await res.json();
        const updated = { ...activeLesson, qc2Report };
        await fetch('/api/lessons/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated)
        });
        setActiveLesson(updated);
        setStepStates((prev) => ({
          ...prev,
          qc2: { status: 'success', metric: `${qc2Report.overallScore}% Pedagogical` }
        }));
      }
    } catch (err) {
      setErrorMessage(`Retry failed for ${stepKey}: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setActiveStep('');
    }
  };

  // Instructor manual save
  const handleSaveContent = async () => {
    if (!activeLesson) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/lessons/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeLesson)
      });
      const saved = await res.json();
      setActiveLesson(saved);
      setLastSavedTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // 1-Click Apply QC Recommendation
  const handleApplyFix = async (qcType, findingId) => {
    if (!activeLesson?.id) return;
    setIsApplyingFix(true);
    try {
      const res = await fetch(`/api/lessons/${activeLesson.id}/apply-fix`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qcType, findingId })
      });
      const updated = await res.json();
      setActiveLesson(updated);
      setLastSavedTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Apply fix error:', err);
    } finally {
      setIsApplyingFix(false);
    }
  };

  const handleContentChange = (newContent) => {
    setActiveLesson((prev) => ({ ...prev, content: newContent }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeLesson={activeLesson}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Step 1: Input & Presets */}
        <InputSection
          title={title}
          setTitle={setTitle}
          objective={objective}
          setObjective={setObjective}
          presets={presets}
          onSelectPreset={handleSelectPreset}
          onRunFullPipeline={handleRunFullPipeline}
          isProcessing={isProcessing}
          activeStep={activeStep}
          errorMessage={errorMessage}
        />

        {/* Step 2: Pipeline Visual Tracker */}
        <PipelineTracker
          stepStates={stepStates}
          onRetryStep={handleRetryStep}
          isProcessing={isProcessing}
        />

        {/* Navigation Tabs (Only visible when lesson exists) */}
        {activeLesson && (
          <div className="border-b border-slate-800 flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'editor'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>1. Lesson Studio & Editor</span>
            </button>

            <button
              onClick={() => setActiveTab('qc1')}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'qc1'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>2. QC Layer 1 (Factual Accuracy)</span>
              {activeLesson.qc1Report && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  {activeLesson.qc1Report.overallScore}%
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('qc2')}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'qc2'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>3. QC Layer 2 (Instructional Quality)</span>
              {activeLesson.qc2Report && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono">
                  {activeLesson.qc2Report.overallScore}%
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('research')}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'research'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>4. Researched Sources</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'preview'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>5. 45-Min Student Preview</span>
            </button>
          </div>
        )}

        {/* Tab Content Display */}
        {activeLesson && (
          <div>
            {activeTab === 'editor' && (
              <LessonEditor
                content={activeLesson.content || ''}
                onChangeContent={handleContentChange}
                onSaveContent={handleSaveContent}
                isSaving={isSaving}
                lastSavedTime={lastSavedTime}
                title={activeLesson.title}
                objective={activeLesson.objective}
              />
            )}

            {activeTab === 'qc1' && (
              <QC1ReportView
                qc1Report={activeLesson.qc1Report}
                onApplyFix={handleApplyFix}
                isApplying={isApplyingFix}
              />
            )}

            {activeTab === 'qc2' && (
              <QC2ReportView
                qc2Report={activeLesson.qc2Report}
                onApplyFix={handleApplyFix}
                isApplying={isApplyingFix}
              />
            )}

            {activeTab === 'research' && (
              <ResearchViewer researchData={activeLesson.researchData} />
            )}

            {activeTab === 'preview' && (
              <StudentPreview lesson={activeLesson} />
            )}
          </div>
        )}
      </main>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        lesson={activeLesson}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={llmConfig}
        onSaveConfig={setLlmConfig}
      />
    </div>
  );
}

