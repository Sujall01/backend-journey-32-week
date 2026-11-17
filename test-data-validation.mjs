import { WEEKS, PHASES, getRoadmapStats } from './js/data/roadmap-data.js';
import { getTopicLesson } from './js/data/topics-data.js';
import { getWeeklyQuiz } from './js/data/quizzes-data.js';
import { getWeeklyChallenge } from './js/data/challenges-data.js';
import { ENTERPRISE_PROJECTS } from './js/data/projects-data.js';
import { LEARNING_RESOURCES } from './js/data/resources-data.js';
import { GO_TRACK_MODULES } from './js/data/go-track-data.js';

console.log('--- RUNNING APPLICATION DATA & SCHEMA VALIDATION SUITE ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    passedTests++;
    console.log(`✓ PASS: ${message}`);
  }
}

// 1. Roadmap & Phases Verification
assert(PHASES.length === 8, 'All 8 Phases must be defined in roadmap');
assert(WEEKS.length === 32, 'All 32 Weeks must be defined in roadmap');

for (let i = 1; i <= 32; i++) {
  const week = WEEKS.find(w => w.week_number === i);
  assert(Boolean(week), `Week ${i} exists`);
  assert(week.topics && week.topics.length >= 4, `Week ${i} has at least 4 topics (has ${week.topics.length})`);
  assert(week.targets && typeof week.targets.csharp === 'number', `Week ${i} has numeric csharp target`);
  assert(typeof week.targets.sql === 'number', `Week ${i} has numeric sql target`);
  assert(typeof week.targets.dsa === 'number', `Week ${i} has numeric dsa target`);
}

const stats = getRoadmapStats();
console.log('Computed Roadmap Statistics:', stats);
assert(stats.totalWeeks === 32, 'Computed total weeks is 32');
assert(stats.totalCodingProblems > 0, `Total coding problems computed: ${stats.totalCodingProblems}`);
assert(stats.totalRoadmapHours === 384, 'Total roadmap hours is 32 * 12 = 384');

// 2. 7-Step Topic Lesson Verification
const sampleLesson1 = getTopicLesson('w1-t1', 1, '.NET SDK and Project Structure');
assert(sampleLesson1.concept && sampleLesson1.concept.code_snippet, 'Lesson w1-t1 has concept & code snippet');
assert(sampleLesson1.concept.erp_example, 'Lesson w1-t1 has real-world ERP context');
assert(sampleLesson1.guided_example && sampleLesson1.guided_example.explanation_lines.length > 0, 'Lesson w1-t1 has guided example explanation');
assert(sampleLesson1.practical_task && sampleLesson1.practical_task.hints.length >= 3, 'Lesson w1-t1 has 3 progressive hints');
assert(sampleLesson1.question_bank && sampleLesson1.question_bank.length >= 4, 'Lesson w1-t1 has question bank with at least 4 questions');
assert(sampleLesson1.explain_yourself && sampleLesson1.explain_yourself.structure.length > 0, 'Lesson w1-t1 has 5-step explanation structure');

// Test fallback topic generator on random week topic
const generatedLesson = getTopicLesson('w24-t3', 24, 'ASP.NET Core Health Checks');
assert(generatedLesson.concept && generatedLesson.guided_example && generatedLesson.practical_task, 'Fallback generator generates complete 7-step lesson');

// 3. 32 Weekly Quizzes Verification
for (let i = 1; i <= 32; i++) {
  const quiz = getWeeklyQuiz(i);
  assert(quiz.week_number === i, `Quiz ${i} week_number matches`);
  assert(quiz.questions.length === 10, `Quiz ${i} has exactly 10 questions (has ${quiz.questions.length})`);
  quiz.questions.forEach((q, qIdx) => {
    assert(q.options.length === 4, `Quiz ${i} Q${qIdx+1} has 4 options`);
    assert(q.correct_index >= 0 && q.correct_index < 4, `Quiz ${i} Q${qIdx+1} correct_index in range`);
    assert(Boolean(q.explanation), `Quiz ${i} Q${qIdx+1} has explanation`);
  });
}

// 4. 32 Weekly Challenges Verification
for (let i = 1; i <= 32; i++) {
  const chal = getWeeklyChallenge(i);
  assert(chal.week_number === i, `Challenge ${i} week_number matches`);
  assert(chal.requirements.length >= 3, `Challenge ${i} has at least 3 requirements`);
  assert(chal.edge_cases.length >= 2, `Challenge ${i} has at least 2 edge cases`);
  assert(chal.evaluation_checklist.length >= 3, `Challenge ${i} has evaluation checklist`);
}

// 5. Flagship Projects Verification
assert(ENTERPRISE_PROJECTS.length === 3, 'Exactly 3 Flagship Projects defined');
ENTERPRISE_PROJECTS.forEach(p => {
  assert(p.tasks.some(t => t.category === 'Core'), `${p.title} has Core tasks`);
  assert(p.tasks.some(t => t.category === 'Advanced'), `${p.title} has Advanced tasks`);
  assert(p.database_schema.length >= 5, `${p.title} has at least 5 relational tables`);
  assert(p.edge_cases.length >= 4, `${p.title} has at least 4 critical edge cases`);
  assert(p.interview_talking_points.length >= 4, `${p.title} has interview talking points`);
});

// 6. Resources & Go Track Verification
assert(LEARNING_RESOURCES.length >= 10, 'Curated learning resources directory populated');
assert(GO_TRACK_MODULES.length === 5, 'Go secondary track has all 5 planned modules');

console.log(`\n🎉 ALL ${passedTests} OF ${totalTests} UNIT & DATA INTEGRITY TESTS PASSED!`);

