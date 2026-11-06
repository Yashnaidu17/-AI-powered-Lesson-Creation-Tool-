import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '..', 'data', 'lessons.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

// Ensure lessons.json exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ lessons: [] }, null, 2), 'utf-8');
}

export function getAllLessons() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed.lessons || [];
  } catch (err) {
    console.error('Error reading lessons.json:', err);
    return [];
  }
}

export function getLessonById(id) {
  const lessons = getAllLessons();
  return lessons.find((l) => l.id === id) || null;
}

export function saveLesson(lesson) {
  const lessons = getAllLessons();
  const index = lessons.findIndex((l) => l.id === lesson.id);
  const now = new Date().toISOString();
  
  if (index >= 0) {
    lessons[index] = {
      ...lessons[index],
      ...lesson,
      updatedAt: now,
      history: [
        ...(lessons[index].history || []),
        {
          timestamp: now,
          action: lesson.lastAction || 'Saved update',
          contentPreview: (lesson.content || '').substring(0, 100)
        }
      ]
    };
  } else {
    lessons.unshift({
      ...lesson,
      createdAt: now,
      updatedAt: now,
      history: [{ timestamp: now, action: 'Created lesson' }]
    });
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify({ lessons }, null, 2), 'utf-8');
  return index >= 0 ? lessons[index] : lessons[0];
}

export function deleteLesson(id) {
  let lessons = getAllLessons();
  lessons = lessons.filter((l) => l.id !== id);
  fs.writeFileSync(DATA_FILE, JSON.stringify({ lessons }, null, 2), 'utf-8');
  return true;
}

