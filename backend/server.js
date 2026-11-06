import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { conductResearch } from './services/researchService.js';
import { generateLessonContent } from './services/lessonGenerator.js';
import { runQC1Audit } from './services/qc1Service.js';
import { runQC2Audit } from './services/qc2Service.js';
import { getAllLessons, getLessonById, saveLesson, deleteLesson } from './services/storageService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve built frontend assets if present
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Preset Topics for Evaluation and Testing
app.get('/api/presets', (req, res) => {
  res.json([
    {
      id: 'http-requests-responses',
      title: 'HTTP Requests and Responses',
      objective: 'Explain GET and POST methods and distinguish between 2xx, 4xx, and 5xx response status categories.',
      durationMinutes: 45,
      isFeaturedSample: true,
      description: 'Featured curriculum benchmark evaluating safe vs idempotent methods and status taxonomy.'
    },
    {
      id: 'git-branching-merge',
      title: 'Git Branching and Merge Conflict Resolution',
      objective: 'Master branch pointers, 3-way merge algorithms, and systematically resolve conflict markers (<<<<<<<, =======, >>>>>>>) without code regression.',
      durationMinutes: 45,
      isFeaturedSample: false,
      description: 'Software engineering benchmark demonstrating VCS workflows, conflict mechanics, and active lab activities.'
    },
    {
      id: 'database-indexing',
      title: 'Relational Database Indexing with B-Trees',
      objective: 'Understand how B-Tree indices accelerate SELECT lookups from O(N) to O(log N) and identify the write-overhead tradeoffs on INSERT and UPDATE operations.',
      durationMinutes: 45,
      isFeaturedSample: false,
      description: 'High-yield systems architecture topic evaluating search depth and query optimization.'
    }
  ]);
});

// Step 1: Research Only
app.post('/api/research', async (req, res) => {
  try {
    const { title, objective } = req.body;
    if (!title || !objective) {
      return res.status(400).json({ error: 'Lesson Title and Learning Objective are required.' });
    }
    const research = await conductResearch({ title, objective });
    res.json(research);
  } catch (err) {
    console.error('Research error:', err);
    res.status(500).json({ error: `Research failed: ${err.message}` });
  }
});

// Step 2: Generate Lesson Content
app.post('/api/generate', async (req, res) => {
  try {
    const { title, objective, researchData, llmConfig } = req.body;
    if (!title || !objective || !researchData) {
      return res.status(400).json({ error: 'Title, objective, and research data are required.' });
    }
    const lesson = await generateLessonContent({ title, objective, researchData, llmConfig });
    res.json(lesson);
  } catch (err) {
    console.error('Generation error:', err);
    res.status(500).json({ error: `Lesson generation failed: ${err.message}` });
  }
});

// Step 3: Run QC Layer 1 (Research and Factual Accuracy)
app.post('/api/qc1', async (req, res) => {
  try {
    const { lessonContent, title, objective, researchData, llmConfig } = req.body;
    if (!lessonContent) {
      return res.status(400).json({ error: 'Lesson content is required for QC Layer 1 audit.' });
    }
    const qc1Report = await runQC1Audit({ lessonContent, title, objective, researchData, llmConfig });
    res.json(qc1Report);
  } catch (err) {
    console.error('QC1 error:', err);
    res.status(500).json({ error: `QC Layer 1 audit failed: ${err.message}` });
  }
});

// Step 4: Run QC Layer 2 (Instructional Quality)
app.post('/api/qc2', async (req, res) => {
  try {
    const { lessonContent, title, objective, llmConfig } = req.body;
    if (!lessonContent) {
      return res.status(400).json({ error: 'Lesson content is required for QC Layer 2 audit.' });
    }
    const qc2Report = await runQC2Audit({ lessonContent, title, objective, llmConfig });
    res.json(qc2Report);
  } catch (err) {
    console.error('QC2 error:', err);
    res.status(500).json({ error: `QC Layer 2 audit failed: ${err.message}` });
  }
});

// Full Pipeline: Execute Research -> Generate -> QC1 -> QC2 in a unified workflow
app.post('/api/pipeline/all', async (req, res) => {
  try {
    const { title, objective, llmConfig } = req.body;
    if (!title?.trim() || !objective?.trim()) {
      return res.status(400).json({ error: 'Lesson Title and Learning Objective are required.' });
    }

    console.log(`[Pipeline] Initiating pipeline for "${title}"...`);

    // 1. Research
    const researchData = await conductResearch({ title, objective });

    // 2. Generation
    const lessonGen = await generateLessonContent({ title, objective, researchData, llmConfig });

    // 3. QC Layer 1: Research and Factual Accuracy
    const qc1Report = await runQC1Audit({
      lessonContent: lessonGen.content,
      title,
      objective,
      researchData,
      llmConfig
    });

    // 4. QC Layer 2: Instructional Quality
    const qc2Report = await runQC2Audit({
      lessonContent: lessonGen.content,
      title,
      objective,
      llmConfig
    });

    const lessonPackage = {
      id: uuidv4(),
      title,
      objective,
      durationMinutes: 45,
      content: lessonGen.content,
      researchData,
      qc1Report,
      qc2Report,
      isFinalized: false,
      lastAction: 'Full pipeline completed'
    };

    const saved = saveLesson(lessonPackage);
    res.json(saved);
  } catch (err) {
    console.error('[Pipeline] Error executing end-to-end pipeline:', err);
    res.status(500).json({ error: `Pipeline execution failed: ${err.message}` });
  }
});

// Get All Lessons
app.get('/api/lessons', (req, res) => {
  try {
    const lessons = getAllLessons();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Specific Lesson
app.get('/api/lessons/:id', (req, res) => {
  try {
    const lesson = getLessonById(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save / Autosave Lesson
app.post('/api/lessons/save', (req, res) => {
  try {
    const lesson = req.body;
    if (!lesson.id) lesson.id = uuidv4();
    const saved = saveLesson(lesson);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Lesson
app.delete('/api/lessons/:id', (req, res) => {
  try {
    deleteLesson(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Apply QC Recommendation into Lesson Content
app.post('/api/lessons/:id/apply-fix', (req, res) => {
  try {
    const { id } = req.params;
    const { qcType, findingId, customReplacement } = req.body;

    const lesson = getLessonById(id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

    let updatedContent = lesson.content;
    let findingFound = false;

    if (qcType === 'qc1' && lesson.qc1Report) {
      const finding = lesson.qc1Report.findings.find(f => f.id === findingId);
      if (finding) {
        findingFound = true;
        finding.applied = true;
        // Append note or enrich section
        const patchNote = `\n\n> 🔍 **QC Verified Note:** ${finding.verifiedFact} (${finding.suggestedImprovement})\n`;
        updatedContent += patchNote;
      }
    } else if (qcType === 'qc2' && lesson.qc2Report) {
      const finding = lesson.qc2Report.findings.find(f => f.id === findingId);
      if (finding) {
        findingFound = true;
        finding.applied = true;
        const patchNote = `\n\n> 💡 **Pedagogical Enhancement Note:** ${finding.suggestedEnhancement}\n`;
        updatedContent += patchNote;
      }
    }

    lesson.content = customReplacement || updatedContent;
    lesson.lastAction = `Applied recommendation from ${qcType.toUpperCase()} (${findingId})`;
    const saved = saveLesson(lesson);
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fallback wildcard for client-side routing
app.get('*', (req, res) => {
  const indexHtml = path.join(frontendDist, 'index.html');
  res.sendFile(indexHtml);
});

app.listen(PORT, () => {
  console.log(`[Server] LessonCraft AI API listening on port ${PORT}`);
});
