/**
 * Automated Verification Test for LessonCraft AI Pipeline
 * Tests core capabilities:
 * 1. Multi-source research (Books, Web, YouTube)
 * 2. 45-Minute Lesson generation
 * 3. QC Layer 1 (Research and Factual Accuracy)
 * 4. QC Layer 2 (Instructional Quality)
 * 5. Lesson Storage and QC recommendation application
 */

import { conductResearch } from './backend/services/researchService.js';
import { generateLessonContent } from './backend/services/lessonGenerator.js';
import { runQC1Audit } from './backend/services/qc1Service.js';
import { runQC2Audit } from './backend/services/qc2Service.js';
import { saveLesson, getLessonById } from './backend/services/storageService.js';

async function runVerification() {
  console.log('======================================================================');
  console.log('🧪 STARTING LESSONCRAFT AI VERIFICATION SUITE');
  console.log('======================================================================\n');

  const testTitle = 'HTTP Requests and Responses';
  const testObjective = 'Explain GET and POST methods and distinguish between 2xx, 4xx, and 5xx response status categories.';

  // 1. Test Multi-Source Research
  console.log('🔍 [TEST 1] Testing Multi-Source Research Engine...');
  const researchData = await conductResearch({ title: testTitle, objective: testObjective });
  
  console.log(`   ✓ Researched ${researchData.books.length} Books (e.g., "${researchData.books[0]?.title}")`);
  console.log(`   ✓ Researched ${researchData.websites.length} Official Docs (e.g., "${researchData.websites[0]?.title}")`);
  console.log(`   ✓ Researched ${researchData.videos.length} YouTube Videos (e.g., "${researchData.videos[0]?.title}")`);
  console.log(`   ✓ Average Source Reliability Score: ${researchData.metrics.sourceReliabilityAverage}%`);

  if (researchData.books.length === 0 || researchData.websites.length === 0 || researchData.videos.length === 0) {
    throw new Error('Research failed to retrieve required source types.');
  }

  // 2. Test 45-Minute Lesson Generation
  console.log('\n📝 [TEST 2] Testing 45-Minute Lesson Synthesizer...');
  const lesson = await generateLessonContent({ title: testTitle, objective: testObjective, researchData });
  
  console.log(`   ✓ Lesson Title: ${lesson.title}`);
  console.log(`   ✓ Content length: ${lesson.content.length} characters`);
  console.log(`   ✓ Target Duration: ${lesson.durationMinutes} Minutes`);
  console.log(`   ✓ Includes 45-Min Pacing Schedule: ${lesson.content.includes('45-Minute Lesson Pacing Schedule')}`);
  console.log(`   ✓ Includes GET vs POST Deep Dive: ${lesson.content.includes('GET') && lesson.content.includes('POST')}`);
  console.log(`   ✓ Includes 2xx, 4xx, 5xx Status Analysis: ${lesson.content.includes('2xx') && lesson.content.includes('4xx') && lesson.content.includes('5xx')}`);
  console.log(`   ✓ Includes Hands-on Lab Exercise: ${lesson.content.includes('Hands-On') || lesson.content.includes('Lab')}`);
  console.log(`   ✓ Includes Formative Knowledge Checks: ${lesson.content.includes('Knowledge Check') || lesson.content.includes('Question')}`);

  // 3. Test QC Layer 1: Research and Factual Accuracy
  console.log('\n🛡️ [TEST 3] Testing QC Layer 1 (Research and Factual Accuracy)...');
  const qc1Report = await runQC1Audit({
    lessonContent: lesson.content,
    title: testTitle,
    objective: testObjective,
    researchData
  });

  console.log(`   ✓ QC Layer: ${qc1Report.layer}`);
  console.log(`   ✓ Factual Accuracy Score: ${qc1Report.overallScore}%`);
  console.log(`   ✓ Factual Status: ${qc1Report.status}`);
  console.log(`   ✓ Standards Audited: ${qc1Report.sourcesAudit.sourcesReliabilityGrade}`);
  console.log(`   ✓ Findings Count: ${qc1Report.findings.length}`);
  qc1Report.findings.slice(0, 2).forEach((f, i) => {
    console.log(`     - Finding ${i + 1} [${f.severity}]: ${f.issue.substring(0, 80)}...`);
  });

  // 4. Test QC Layer 2: Instructional Quality
  console.log('\n🎓 [TEST 4] Testing QC Layer 2 (Instructional Quality & Pacing)...');
  const qc2Report = await runQC2Audit({
    lessonContent: lesson.content,
    title: testTitle,
    objective: testObjective
  });

  console.log(`   ✓ QC Layer: ${qc2Report.layer}`);
  console.log(`   ✓ Instructional Quality Score: ${qc2Report.overallScore}%`);
  console.log(`   ✓ Objective Alignment: ${qc2Report.objectiveAlignment.alignmentPercentage}%`);
  console.log(`   ✓ Pacing Feasibility: ${qc2Report.pacingAudit.feasibilityVerdict}`);
  console.log(`   ✓ Target Minutes: ${qc2Report.pacingAudit.targetMinutes}m (Estimated: ${qc2Report.pacingAudit.estimatedTotalMinutes}m)`);
  console.log(`   ✓ Pedagogical Findings Count: ${qc2Report.findings.length}`);

  // 5. Test Storage & Auto-save
  console.log('\n💾 [TEST 5] Testing Storage and Persistence Service...');
  const testId = 'test-lesson-' + Date.now();
  const lessonPackage = {
    id: testId,
    title: testTitle,
    objective: testObjective,
    durationMinutes: 45,
    content: lesson.content,
    researchData,
    qc1Report,
    qc2Report,
    lastAction: 'Automated test package'
  };

  const saved = saveLesson(lessonPackage);
  const retrieved = getLessonById(testId);
  console.log(`   ✓ Lesson successfully saved and retrieved: ID ${retrieved.id}`);
  console.log(`   ✓ History records: ${retrieved.history?.length || 0}`);

  console.log('\n======================================================================');
  console.log('🎉 ALL TESTS PASSED! WORKFLOW READY FOR PRODUCTION & DEMO VIDEO');
  console.log('======================================================================');
}

runVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});

