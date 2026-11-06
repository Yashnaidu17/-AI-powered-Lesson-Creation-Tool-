# LessonCraft AI: Demonstration Video Walkthrough Script

Use this structured script to record a professional **walkthrough video** demonstrating LessonCraft AI.

---

## ⏱️ Target Video Duration: 3 – 5 Minutes

### Video Outline & Timestamps

| Timestamp | Phase | What to Show on Screen | What to Say / Explain |
| :--- | :--- | :--- | :--- |
| **00:00 – 00:45** | **Introduction & Architecture** | Homepage (`http://localhost:5000`) and the `README.md` architecture diagram. | "Hello! Today I'm showcasing **LessonCraft AI**, an autonomous curriculum engineering and validation studio. The tool researches across books, official RFC standards, and video instruction, synthesizes a 45-minute lesson, and validates it through two independent Quality Control layers." |
| **00:45 – 01:30** | **Input & Lesson Generation** | Click the **Featured Preset: 'HTTP Requests and Responses'** and click **'Generate 45-Min Lesson & Run Dual QC'**. | "Here we test the curriculum benchmark: 'HTTP Requests and Responses', with the objective to explain GET vs POST and distinguish 2xx, 4xx, and 5xx status codes. Watch the live pipeline execute: first conducting multi-source research, synthesizing the 45-minute active learning roadmap, and running both QC auditors." |
| **01:30 – 02:15** | **Multi-Source Research Matrix** | Click the **'4. Researched Sources'** tab. Scroll through Books, Official Docs, and YouTube videos. | "In the research matrix, notice the breadth of sources: authoritative books with ISBNs like O'Reilly's *HTTP: The Definitive Guide*, official IETF standards including RFC 9110 and MDN documentation, and curated YouTube video tutorials with specific recommended segment timestamps." |
| **02:15 – 03:00** | **QC Layer 1: Research & Factual Accuracy** | Click the **'2. QC Layer 1 (Factual Accuracy)'** tab. Point out the Factual Score, Standards audit, and Findings. Click **'Apply Recommended Fix'**. | "Here is QC Layer 1. It acts as an automated standards compliance auditor. It cross-checks all technical claims against RFC 9110, ensuring concepts like method safety, idempotency, and the crucial distinction between 401 Unauthorized (unauthenticated) and 403 Forbidden are strictly maintained. Instructors can adopt recommendations with one click." |
| **03:00 – 03:45** | **QC Layer 2: Instructional Quality & Pacing** | Click the **'3. QC Layer 2 (Instructional Quality)'** tab. Highlight the 45-min pacing bar and alignment checklist. | "QC Layer 2 focuses on pedagogical design. It checks objective alignment—verifying that GET, POST, and 2xx, 4xx, and 5xx categories are thoroughly scaffolded. It also audits the 45-minute pacing: allocating 5 minutes for the mental model hook, 10 for core concepts, 10 for technical mechanics, 10 for hands-on coding, and 10 for assessment." |
| **03:45 – 04:30** | **Studio Editor & Interactive Student Preview** | Switch between the **'Lesson Studio & Editor'** (make an edit) and the **'45-Min Student Preview'**. Test the quiz! | "In the Lesson Studio, instructors can edit Markdown in real time with auto-save to persistent storage. In the Student Preview mode, instructors get an interactive 45-minute countdown clock, embedded video players, and a diagnostic quiz that provides instant pedagogical feedback when students answer questions." |
| **04:30 – 05:00** | **Export & Wrap-Up** | Click **'Export Lesson'** in the top navigation bar. Show Markdown, PDF/Print, and JSON export. | "Finally, instructors can export the finalized package in multiple formats: Markdown for version control, print-ready PDF for classroom handouts, or full JSON for LMS integration. Thank you!" |

---

## 💡 Key Technical Highlights to Mention
- **Zero-Config Resilient Fallback:** Works 100% offline out-of-the-box with deterministic academic synthesis, while also supporting live Google Gemini and OpenAI models via the Settings menu.
- **RFC 9110 Standards Compliance:** Demonstrates rigorous engineering precision by grounding web concepts in authoritative standards.
- **Modular Retries:** Any individual step of the pipeline can be retried independently without re-running everything.
- **Persistent Storage:** Saves all drafts, edits, and audit reports to disk (`backend/data/lessons.json`).
