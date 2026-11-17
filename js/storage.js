/**
 * storage.js - Robust IndexedDB Persistence Manager (Version 2)
 * Local-first storage for user progress, topics, quizzes, projects, applications,
 * settings, video learning tracking, AI conversations, and AI-generated assessments.
 */

const DB_NAME = 'BackendLearningCompanionDB';
const DB_VERSION = 3;

let dbInstance = null;

export const STORES = {
  SETTINGS: 'user_settings',
  TOPICS_PROGRESS: 'topics_progress',
  PROBLEM_ATTEMPTS: 'problem_attempts',
  QUIZ_ATTEMPTS: 'quiz_attempts',
  CHALLENGES: 'challenge_submissions',
  STUDY_SESSIONS: 'study_sessions',
  PROJECT_TASKS: 'project_tasks',
  SPEAKING_LOGS: 'speaking_logs',
  WEEKLY_REVIEWS: 'weekly_reviews',
  JOB_APPLICATIONS: 'job_applications',
  EXTERNAL_PROFILES: 'external_profiles',
  LINKEDIN_POSTS: 'linkedin_posts',
  ACTIVE_STATE: 'active_state',
  // Version 2 additions
  VIDEO_PROGRESS: 'video_progress',
  AI_CONVERSATIONS: 'ai_conversations',
  AI_QUIZZES: 'ai_quizzes',
  AI_CONFIG: 'ai_config',
  // Version 3 additions (Quiz Deduplication & Weak Area Training)
  RESOLVED_QUESTIONS: 'resolved_questions',
  WEAK_CONCEPTS: 'weak_concepts'
};

export async function getDB() {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (e) => {
      console.error('IndexedDB open error:', e);
      reject(e);
    };

    request.onsuccess = (e) => {
      dbInstance = e.target.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (e) => {
      const db = e.target.result;

      // Version 1 stores
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORES.TOPICS_PROGRESS)) {
        db.createObjectStore(STORES.TOPICS_PROGRESS, { keyPath: 'topic_id' });
      }
      if (!db.objectStoreNames.contains(STORES.PROBLEM_ATTEMPTS)) {
        db.createObjectStore(STORES.PROBLEM_ATTEMPTS, { keyPath: 'problem_id' });
      }
      if (!db.objectStoreNames.contains(STORES.QUIZ_ATTEMPTS)) {
        const quizStore = db.createObjectStore(STORES.QUIZ_ATTEMPTS, { keyPath: 'id', autoIncrement: true });
        quizStore.createIndex('week_number', 'week_number', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.CHALLENGES)) {
        db.createObjectStore(STORES.CHALLENGES, { keyPath: 'week_number' });
      }
      if (!db.objectStoreNames.contains(STORES.STUDY_SESSIONS)) {
        const sessionStore = db.createObjectStore(STORES.STUDY_SESSIONS, { keyPath: 'id', autoIncrement: true });
        sessionStore.createIndex('date', 'date', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.PROJECT_TASKS)) {
        db.createObjectStore(STORES.PROJECT_TASKS, { keyPath: 'task_id' });
      }
      if (!db.objectStoreNames.contains(STORES.SPEAKING_LOGS)) {
        db.createObjectStore(STORES.SPEAKING_LOGS, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORES.WEEKLY_REVIEWS)) {
        db.createObjectStore(STORES.WEEKLY_REVIEWS, { keyPath: 'week_number' });
      }
      if (!db.objectStoreNames.contains(STORES.JOB_APPLICATIONS)) {
        db.createObjectStore(STORES.JOB_APPLICATIONS, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORES.EXTERNAL_PROFILES)) {
        db.createObjectStore(STORES.EXTERNAL_PROFILES, { keyPath: 'platform' });
      }
      if (!db.objectStoreNames.contains(STORES.LINKEDIN_POSTS)) {
        db.createObjectStore(STORES.LINKEDIN_POSTS, { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(STORES.ACTIVE_STATE)) {
        db.createObjectStore(STORES.ACTIVE_STATE, { keyPath: 'key' });
      }

      // Version 2 stores
      if (!db.objectStoreNames.contains(STORES.VIDEO_PROGRESS)) {
        db.createObjectStore(STORES.VIDEO_PROGRESS, { keyPath: 'topic_id' });
      }
      if (!db.objectStoreNames.contains(STORES.AI_CONVERSATIONS)) {
        db.createObjectStore(STORES.AI_CONVERSATIONS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.AI_QUIZZES)) {
        db.createObjectStore(STORES.AI_QUIZZES, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.AI_CONFIG)) {
        db.createObjectStore(STORES.AI_CONFIG, { keyPath: 'key' });
      }

      // Version 3 stores (Resolved Questions Deduplication & Weak Concept Tracking)
      if (!db.objectStoreNames.contains(STORES.RESOLVED_QUESTIONS)) {
        db.createObjectStore(STORES.RESOLVED_QUESTIONS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.WEAK_CONCEPTS)) {
        db.createObjectStore(STORES.WEAK_CONCEPTS, { keyPath: 'id' });
      }
    };
  });
}

// Generic Helpers
export async function dbGet(storeName, key) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function dbPut(storeName, item) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.put(item);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function dbGetAll(storeName) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function dbDelete(storeName, key) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function dbClear(storeName) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// User Settings
export async function getUserSettings() {
  const res = await dbGet(STORES.SETTINGS, 'profile');
  return res ? res.data : null;
}

export async function saveUserSettings(settings) {
  return await dbPut(STORES.SETTINGS, { key: 'profile', data: settings, updatedAt: new Date().toISOString() });
}

// Topic Progress
export async function getTopicProgress(topicId) {
  return await dbGet(STORES.TOPICS_PROGRESS, topicId);
}

export async function saveTopicProgress(topicId, data) {
  const existing = await getTopicProgress(topicId) || { topic_id: topicId, status: 'not-started' };
  const updated = {
    ...existing,
    ...data,
    topic_id: topicId,
    last_accessed: new Date().toISOString()
  };
  await dbPut(STORES.TOPICS_PROGRESS, updated);
  return updated;
}

export async function getAllTopicsProgress() {
  const all = await dbGetAll(STORES.TOPICS_PROGRESS);
  const map = {};
  for (const item of all) {
    map[item.topic_id] = item;
  }
  return map;
}

// Problem Attempts
export async function getProblemAttempt(problemId) {
  return await dbGet(STORES.PROBLEM_ATTEMPTS, problemId);
}

export async function saveProblemAttempt(problemId, data) {
  const existing = await getProblemAttempt(problemId) || { problem_id: problemId, attempts_count: 0 };
  const updated = {
    ...existing,
    ...data,
    problem_id: problemId,
    attempts_count: (existing.attempts_count || 0) + 1,
    last_attempted: new Date().toISOString()
  };
  await dbPut(STORES.PROBLEM_ATTEMPTS, updated);
  return updated;
}

export async function getAllProblemAttempts() {
  return await dbGetAll(STORES.PROBLEM_ATTEMPTS);
}

// Quizzes
export async function getQuizAttempts(weekNumber) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORES.QUIZ_ATTEMPTS, 'readonly');
    const store = tx.objectStore(STORES.QUIZ_ATTEMPTS);
    const index = store.index('week_number');
    const req = index.getAll(Number(weekNumber));
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function saveQuizAttempt(attemptData) {
  const record = {
    ...attemptData,
    week_number: Number(attemptData.week_number),
    timestamp: new Date().toISOString()
  };
  return await dbPut(STORES.QUIZ_ATTEMPTS, record);
}

export async function getAllQuizAttempts() {
  return await dbGetAll(STORES.QUIZ_ATTEMPTS);
}

// Coding Challenges
export async function getChallengeSubmission(weekNumber) {
  return await dbGet(STORES.CHALLENGES, Number(weekNumber));
}

export async function saveChallengeSubmission(weekNumber, data) {
  const record = {
    ...data,
    week_number: Number(weekNumber),
    updated_at: new Date().toISOString()
  };
  await dbPut(STORES.CHALLENGES, record);
  return record;
}

export async function getAllChallengeSubmissions() {
  return await dbGetAll(STORES.CHALLENGES);
}

// Project Tasks
export async function getProjectTasks() {
  const list = await dbGetAll(STORES.PROJECT_TASKS);
  const map = {};
  for (const t of list) {
    map[t.task_id] = t.completed;
  }
  return map;
}

export async function setProjectTask(taskId, completed, projectId) {
  return await dbPut(STORES.PROJECT_TASKS, {
    task_id: taskId,
    project_id: projectId,
    completed: Boolean(completed),
    updated_at: new Date().toISOString()
  });
}

// Speaking Practice Logs
export async function getSpeakingLogs() {
  const logs = await dbGetAll(STORES.SPEAKING_LOGS);
  return logs.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function saveSpeakingLog(logData) {
  const record = {
    ...logData,
    date: logData.date || new Date().toISOString()
  };
  return await dbPut(STORES.SPEAKING_LOGS, record);
}

// Weekly Reviews
export async function getWeeklyReview(weekNumber) {
  return await dbGet(STORES.WEEKLY_REVIEWS, Number(weekNumber));
}

export async function saveWeeklyReview(weekNumber, reviewData) {
  const record = {
    ...reviewData,
    week_number: Number(weekNumber),
    date: new Date().toISOString()
  };
  await dbPut(STORES.WEEKLY_REVIEWS, record);
  return record;
}

export async function getAllWeeklyReviews() {
  return await dbGetAll(STORES.WEEKLY_REVIEWS);
}

// Job Applications
export async function getJobApplications() {
  const apps = await dbGetAll(STORES.JOB_APPLICATIONS);
  return apps.sort((a, b) => new Date(b.applied_date || 0) - new Date(a.applied_date || 0));
}

export async function saveJobApplication(appData) {
  const record = {
    ...appData,
    updated_at: new Date().toISOString()
  };
  return await dbPut(STORES.JOB_APPLICATIONS, record);
}

export async function deleteJobApplication(id) {
  return await dbDelete(STORES.JOB_APPLICATIONS, Number(id));
}

// External Developer Profiles (LeetCode, HackerRank, etc.)
export async function getExternalProfiles() {
  const profiles = await dbGetAll(STORES.EXTERNAL_PROFILES);
  const map = {};
  for (const p of profiles) {
    map[p.platform] = p;
  }
  return map;
}

export async function saveExternalProfile(platform, data) {
  const record = {
    platform,
    ...data,
    updated_at: new Date().toISOString()
  };
  await dbPut(STORES.EXTERNAL_PROFILES, record);
  return record;
}

// LinkedIn Posts
export async function getLinkedInPosts() {
  const posts = await dbGetAll(STORES.LINKEDIN_POSTS);
  return posts.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

export async function saveLinkedInPost(postData) {
  const record = {
    ...postData,
    created_at: postData.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  return await dbPut(STORES.LINKEDIN_POSTS, record);
}

// Active State / Last Visited Topic
export async function getLastActiveTopic() {
  const state = await dbGet(STORES.ACTIVE_STATE, 'last_topic');
  return state ? state.data : null;
}

export async function setLastActiveTopic(topicId, weekNumber, topicTitle) {
  return await dbPut(STORES.ACTIVE_STATE, {
    key: 'last_topic',
    data: { topic_id: topicId, week_number: weekNumber, topic_title: topicTitle, timestamp: new Date().toISOString() }
  });
}

// ============================================================================
// Version 2 New Store Methods: Video Progress, AI Conversations & AI Quizzes
// ============================================================================

// Video Progress
export async function getVideoProgress(topicId) {
  return await dbGet(STORES.VIDEO_PROGRESS, topicId);
}

export async function saveVideoProgress(topicId, data) {
  const existing = await getVideoProgress(topicId) || { topic_id: topicId, watched: false };
  const updated = {
    ...existing,
    ...data,
    topic_id: topicId,
    updated_at: new Date().toISOString()
  };
  await dbPut(STORES.VIDEO_PROGRESS, updated);
  return updated;
}

export async function getAllVideoProgress() {
  const list = await dbGetAll(STORES.VIDEO_PROGRESS);
  const map = {};
  for (const v of list) {
    map[v.topic_id] = v;
  }
  return map;
}

// AI Conversations
export async function getAIConversations() {
  const convos = await dbGetAll(STORES.AI_CONVERSATIONS);
  return convos.sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0));
}

export async function saveAIConversation(convo) {
  const record = {
    ...convo,
    updated_at: new Date().toISOString(),
    created_at: convo.created_at || new Date().toISOString()
  };
  return await dbPut(STORES.AI_CONVERSATIONS, record);
}

export async function deleteAIConversation(id) {
  return await dbDelete(STORES.AI_CONVERSATIONS, String(id));
}

export async function clearAllAIConversations() {
  return await dbClear(STORES.AI_CONVERSATIONS);
}

// AI Quizzes
export async function getAIQuizzes() {
  const quizzes = await dbGetAll(STORES.AI_QUIZZES);
  return quizzes.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
}

export async function saveAIQuiz(quizData) {
  const record = {
    ...quizData,
    id: quizData.id || 'quiz_' + Date.now(),
    created_at: quizData.created_at || new Date().toISOString()
  };
  return await dbPut(STORES.AI_QUIZZES, record);
}

// Resolved Questions (Deduplication across the entire application)
export async function getResolvedQuestions() {
  return await dbGetAll(STORES.RESOLVED_QUESTIONS);
}

export async function markQuestionsResolved(questions) {
  for (const q of questions) {
    const key = q.id || 'res_' + Math.abs(hashString(q.question || ''));
    await dbPut(STORES.RESOLVED_QUESTIONS, {
      id: String(key),
      question: q.question,
      topic: q.topic || '',
      difficulty: q.difficulty || '',
      resolved_at: new Date().toISOString()
    });
  }
}

export async function isQuestionResolved(questionText) {
  const all = await getResolvedQuestions();
  const normalized = (questionText || '').trim().toLowerCase();
  return all.some(r => (r.question || '').trim().toLowerCase() === normalized);
}

// Weak Concepts & Mistake Profile (Deep Understanding Tracker)
export async function getWeakConcepts() {
  const list = await dbGetAll(STORES.WEAK_CONCEPTS);
  return list.sort((a, b) => new Date(b.flagged_at || 0) - new Date(a.flagged_at || 0));
}

export async function saveWeakConcept(data) {
  const key = data.id || 'weak_' + Math.abs(hashString((data.concept || '') + (data.question || '')));
  const record = {
    id: String(key),
    concept: data.concept || 'General Backend Architecture',
    topic: data.topic || '',
    question: data.question || '',
    explanation: data.explanation || '',
    user_mistake: data.user_mistake || '',
    flagged_at: new Date().toISOString(),
    resolved: false
  };
  return await dbPut(STORES.WEAK_CONCEPTS, record);
}

export async function deleteWeakConcept(id) {
  return await dbDelete(STORES.WEAK_CONCEPTS, String(id));
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}

// AI Configuration
export async function getAIConfig() {
  const res = await dbGet(STORES.AI_CONFIG, 'active_config');
  return res ? res.data : {
    provider: 'gemini',
    model: 'gemini-2.5-flash',
    include_roadmap_context: true,
    learning_mode: true, // true = hints first, false = full solutions
    enabled: true
  };
}

export async function saveAIConfig(config) {
  return await dbPut(STORES.AI_CONFIG, {
    key: 'active_config',
    data: config,
    updated_at: new Date().toISOString()
  });
}

// Full Backup Export
export async function exportFullBackupJSON() {
  const backup = {
    version: 2,
    export_date: new Date().toISOString(),
    app: "32-Week Backend Engineering Learning Companion",
    data: {
      settings: await dbGetAll(STORES.SETTINGS),
      topics_progress: await dbGetAll(STORES.TOPICS_PROGRESS),
      problem_attempts: await dbGetAll(STORES.PROBLEM_ATTEMPTS),
      quiz_attempts: await dbGetAll(STORES.QUIZ_ATTEMPTS),
      challenges: await dbGetAll(STORES.CHALLENGES),
      study_sessions: await dbGetAll(STORES.STUDY_SESSIONS),
      project_tasks: await dbGetAll(STORES.PROJECT_TASKS),
      speaking_logs: await dbGetAll(STORES.SPEAKING_LOGS),
      weekly_reviews: await dbGetAll(STORES.WEEKLY_REVIEWS),
      job_applications: await dbGetAll(STORES.JOB_APPLICATIONS),
      external_profiles: await dbGetAll(STORES.EXTERNAL_PROFILES),
      linkedin_posts: await dbGetAll(STORES.LINKEDIN_POSTS),
      active_state: await dbGetAll(STORES.ACTIVE_STATE),
      // v2 additions
      video_progress: await dbGetAll(STORES.VIDEO_PROGRESS),
      ai_conversations: await dbGetAll(STORES.AI_CONVERSATIONS),
      ai_quizzes: await dbGetAll(STORES.AI_QUIZZES),
      ai_config: await dbGetAll(STORES.AI_CONFIG),
      // v3 additions
      resolved_questions: await dbGetAll(STORES.RESOLVED_QUESTIONS),
      weak_concepts: await dbGetAll(STORES.WEAK_CONCEPTS)
    }
  };
  return JSON.stringify(backup, null, 2);
}

// Full Backup Import
export async function importFullBackupJSON(jsonString) {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    throw new Error('Invalid JSON format: Unable to parse file.');
  }

  if (!parsed || !parsed.data || typeof parsed.data !== 'object') {
    throw new Error('Invalid backup schema: Missing expected "data" structure.');
  }

  const db = await getDB();
  const tx = db.transaction(Object.values(STORES), 'readwrite');

  for (const storeName of Object.values(STORES)) {
    const store = tx.objectStore(storeName);
    store.clear();
  }

  // Populate data safely (handles both v1 and v2 backups)
  const data = parsed.data;
  if (Array.isArray(data.settings)) for (const item of data.settings) tx.objectStore(STORES.SETTINGS).put(item);
  if (Array.isArray(data.topics_progress)) for (const item of data.topics_progress) tx.objectStore(STORES.TOPICS_PROGRESS).put(item);
  if (Array.isArray(data.problem_attempts)) for (const item of data.problem_attempts) tx.objectStore(STORES.PROBLEM_ATTEMPTS).put(item);
  if (Array.isArray(data.quiz_attempts)) for (const item of data.quiz_attempts) tx.objectStore(STORES.QUIZ_ATTEMPTS).put(item);
  if (Array.isArray(data.challenges)) for (const item of data.challenges) tx.objectStore(STORES.CHALLENGES).put(item);
  if (Array.isArray(data.study_sessions)) for (const item of data.study_sessions) tx.objectStore(STORES.STUDY_SESSIONS).put(item);
  if (Array.isArray(data.project_tasks)) for (const item of data.project_tasks) tx.objectStore(STORES.PROJECT_TASKS).put(item);
  if (Array.isArray(data.speaking_logs)) for (const item of data.speaking_logs) tx.objectStore(STORES.SPEAKING_LOGS).put(item);
  if (Array.isArray(data.weekly_reviews)) for (const item of data.weekly_reviews) tx.objectStore(STORES.WEEKLY_REVIEWS).put(item);
  if (Array.isArray(data.job_applications)) for (const item of data.job_applications) tx.objectStore(STORES.JOB_APPLICATIONS).put(item);
  if (Array.isArray(data.external_profiles)) for (const item of data.external_profiles) tx.objectStore(STORES.EXTERNAL_PROFILES).put(item);
  if (Array.isArray(data.linkedin_posts)) for (const item of data.linkedin_posts) tx.objectStore(STORES.LINKEDIN_POSTS).put(item);
  if (Array.isArray(data.active_state)) for (const item of data.active_state) tx.objectStore(STORES.ACTIVE_STATE).put(item);
  if (Array.isArray(data.video_progress)) for (const item of data.video_progress) tx.objectStore(STORES.VIDEO_PROGRESS).put(item);
  if (Array.isArray(data.ai_conversations)) for (const item of data.ai_conversations) tx.objectStore(STORES.AI_CONVERSATIONS).put(item);
  if (Array.isArray(data.ai_quizzes)) for (const item of data.ai_quizzes) tx.objectStore(STORES.AI_QUIZZES).put(item);
  if (Array.isArray(data.ai_config)) for (const item of data.ai_config) tx.objectStore(STORES.AI_CONFIG).put(item);
  if (Array.isArray(data.resolved_questions)) for (const item of data.resolved_questions) tx.objectStore(STORES.RESOLVED_QUESTIONS).put(item);
  if (Array.isArray(data.weak_concepts)) for (const item of data.weak_concepts) tx.objectStore(STORES.WEAK_CONCEPTS).put(item);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

// Export Job Applications to CSV
export async function exportJobApplicationsCSV() {
  const apps = await getJobApplications();
  const headers = ['ID', 'Company', 'Title', 'Location', 'Status', 'Date Applied', 'Tech Stack', 'Min Exp', 'Recruiter', 'Interview Date', 'Followup Date', 'Notes'];
  const rows = apps.map(a => [
    a.id,
    `"${(a.company || '').replace(/"/g, '""')}"`,
    `"${(a.title || '').replace(/"/g, '""')}"`,
    `"${(a.location || '').replace(/"/g, '""')}"`,
    `"${(a.status || '').replace(/"/g, '""')}"`,
    a.applied_date || '',
    `"${(a.stack || '').replace(/"/g, '""')}"`,
    `"${(a.min_exp || '').replace(/"/g, '""')}"`,
    `"${(a.recruiter || '').replace(/"/g, '""')}"`,
    a.interview_date || '',
    a.followup_date || '',
    `"${(a.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  return csvContent;
}

// Complete Database Reset
export async function resetAllData() {
  const db = await getDB();
  const tx = db.transaction(Object.values(STORES), 'readwrite');
  for (const storeName of Object.values(STORES)) {
    tx.objectStore(storeName).clear();
  }
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}
