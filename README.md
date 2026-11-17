# 32-Week Backend Engineering & Career Development Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![.NET Core](https://img.shields.io/badge/.NET-8%20%7C%209-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tests Passing](https://img.shields.io/badge/Tests-1342%2F1342%20Passing-brightgreen.svg)](test-data-validation.mjs)
[![Zero Dependencies](https://img.shields.io/badge/npm%20dependencies-0-success.svg)](package.json)

A local-first, privacy-respecting, responsive web application and installable Windows desktop app designed to transition existing ERP software development experience (ASP.NET Web Forms, C#, SQL Server) into senior backend engineering competence in modern **.NET 8/9, ASP.NET Core Web API, Entity Framework Core, SQL Server Optimization, Clean Architecture, Distributed Systems, Multi-Tenancy, and DSA**.

---

## ⚡ Quick Start — Run Locally in 5 Seconds

No complex setup, build steps, or external database required. Choose whichever method fits your workflow:

### Option 1: One-Click Windows Runner (Easiest)
Simply **double-click** `start.bat` in this folder:
- Automatically detects Node.js (or falls back to Python).
- Opens your default browser to `http://127.0.0.1:3000`.
- Starts the local zero-dependency proxy and static file server.

*(For PowerShell users: run `./start.ps1`)*

### Option 2: Standard npm (Node.js)
```bash
npm start
```
Then open `http://127.0.0.1:3000` in your browser.

### Option 3: Pure Python (Zero Node.js Required)
```bash
python -m http.server 8000
```
Then open `http://127.0.0.1:8000` in your browser. All core features, videos, and offline AI knowledge drills work 100% in-browser!

---

## 1. Executive Summary & Design Philosophy

This platform is built as a personal learning companion—calm, structured, achievable, and rewarding. It avoids excessive gamification, dark patterns, and overwhelming task backlogs.

### Core Architectural Principles
- **Full-Width Usable Workspace:** Fluid responsive layout (`clamp(20px, 3.5vw, 56px)`) utilizing 92–96% of available viewport width on desktop and ultrawide displays, paired with readable prose constraints (`max-width: 80ch`).
- **High-Signal Uncluttered UI:** Redesigned command center eliminating repetitive boxed sections in favor of clean, meaningful metrics, dynamic data insights, and single-action focus.
- **Local-First & Zero-Cloud Dependency:** All progress, quiz scores, project milestones, speaking recordings, video watch history, and AI conversations are stored locally on your machine in **IndexedDB** (`BackendLearningCompanionDB`).
- **No Mandatory Backend or Login:** Operates entirely in modern browsers (Microsoft Edge, Google Chrome) with zero external server or cloud database requirements.
- **PWA & Windows Native App:** Fully installable as a standalone Windows desktop app with offline capability via Service Worker caching.
- **Continuous Embedded Video Learning:** Verified English and Hindi YouTube video lessons integrated directly inside topics with privacy-enhanced 16:9 player, watch tracking, and notes.
- **Personal AI Learning Mentor:** Context-aware engineering mentor (understands your ERP background, active roadmap week, and revision backlog) with Socratic hints vs. complete architecture modes, dynamic quiz generation, and mock technical interviews.
- **Zero-Leakage Security:** Local proxy server (`server.mjs`) for Gemini, OpenAI, or local Ollama. API keys never leak into client code or Git. 100% functional offline knowledge engine fallback.
- **12-Hour Weekly Workload:** Balanced realistically for working professionals. Wednesday is treated as the primary day off with a dedicated 4-hour focused deep-study block, while other days feature manageable 1h 15m to 1h 30m sessions.

---

## 2. Weekly 12-Hour Study Schedule

| Day | Duration | Focus Activity |
|:---|:---:|:---|
| **Monday** | 1 hr 15 min | C# / .NET core concepts, type systems, and code revision |
| **Tuesday** | 1 hr 15 min | DSA problem solving, quantitative aptitude, and speaking |
| **Wednesday** | **4 hours** | **Main weekly day off:** 4-hour deep study session (Concept, Code, SQL, Speaking) |
| **Thursday** | 1 hr 15 min | SQL Server queries, execution plans, and logical reasoning |
| **Friday** | 1 hr 15 min | DSA patterns, production debugging, and speaking practice |
| **Saturday** | 1 hr 30 min | Flagship project development and optional Go practice |
| **Sunday** | 1 hr 30 min | Weekly assessment quiz, coding challenge, job tracking, and guided review |
| **Total** | **12 hours** | **Sustainable, consistent, and balanced** |

### Wednesday 4-Hour Deep Study Session Breakdown
1. **75 Minutes:** Main concept deep dive and architectural reading.
2. **10 Minutes:** Rest break (stand up, hydrate, rest eyes).
3. **75 Minutes:** Hands-on implementation and boundary edge-case coding.
4. **10 Minutes:** Rest break (light walk, screen-free interval).
5. **45 Minutes:** Relational SQL Server querying, indexing, and execution plans.
6. **25 Minutes:** Speaking and verbal explanation practice using the 5-step framework.

---

## 3. The 32-Week Curriculum Roadmap

The roadmap is structured into 8 distinct phases, each culminating in a verified milestone:

### Phase 1: Rebuild C# Fundamentals (Weeks 1–4)
- **Week 1:** .NET SDK, project structure, CLI commands, variables, value types vs reference types, integer vs double vs decimal precision.
- **Week 2:** Control flow, if/else, switch expressions, logical operators, for/while/foreach loops, and avoiding nested complexity.
- **Week 3:** Methods, parameters (ref/out/in), scope, method overloading, single/multi-dimensional arrays, for vs foreach performance.
- **Week 4:** String immutability, StringBuilder, TryParse patterns, null handling (`?.`, `??`), defensive input validation.
- **Milestone 1:** Employee Salary Calculator Console Application.

### Phase 2: Strong C#, OOP and Data Handling (Weeks 5–8)
- **Week 5:** Generic collections (`List<T>`, `Dictionary<TKey, TValue>`, `HashSet<T>`, `Queue<T>`, `Stack<T>`), hash buckets, O(1) lookups.
- **Week 6:** OOP foundations, encapsulation, domain invariants, constructors, properties, inheritance, polymorphism (`virtual`, `override`, `new`).
- **Week 7:** Interfaces, abstract classes, generics (`where T : class`), enums, custom domain exceptions, structured error handling.
- **Week 8:** LINQ (Where, Select, OrderBy, GroupBy, Aggregate), deferred execution, File I/O, System.Text.Json serialization.
- **Milestone 2:** Payroll Console v1 with File & JSON Persistence.

### Phase 3: SQL and Modern .NET (Weeks 9–12)
- **Week 9:** Git branching, merge conflict resolution, HTTP methods (GET, POST, PUT, DELETE, PATCH), status codes, RESTful semantics.
- **Week 10:** ASP.NET Core architecture, `WebApplicationBuilder`, controllers, attribute routing, Swagger/OpenAPI documentation.
- **Week 11:** Dependency Injection (Transient, Scoped, Singleton, captive dependencies), middleware pipeline, DTO mapping, FluentValidation.
- **Week 12:** Entity Framework Core, DbContext lifecycle, Code-First migrations, Fluent API relationships, `.AsNoTracking()`, keyset pagination.
- **Milestone 3:** Basic ASP.NET Core Web API with SQL Server & EF Core.

### Phase 4: Authentication, Testing & Real API Development (Weeks 13–16)
- **Week 13:** JWT Bearer authentication, claims extraction, password hashing with salt (Argon2/PBKDF2), role/policy authorization.
- **Week 14:** Automated testing with xUnit (`[Fact]`, `[Theory]`), mocking dependencies with Moq, WebApplicationFactory integration tests.
- **Week 15:** Asynchronous programming (`async`/`await`), state machine, avoiding `.Result` deadlocks, CancellationToken passing, `BackgroundService`.
- **Week 16:** Staff & leave state machine, approval hierarchy, concurrency-safe leave balance deduction, comprehensive API test suite.
- **Milestone 4:** Staff and Leave Management API Complete.

### Phase 5: Advanced Software Engineering (Weeks 17–20)
- **Week 17:** SOLID principles, Clean Architecture layers (Domain, Application, Infrastructure, Presentation), refactoring legacy Web Forms patterns.
- **Week 18:** SQL Server storage engine (pages/extents/B-trees), clustered vs non-clustered indexes, covering indexes with INCLUDE, execution plans, N+1 query elimination.
- **Week 19:** ACID guarantees, transaction isolation levels (Dirty, Non-repeatable, Phantom reads), SQL locking, deadlocks, optimistic concurrency with `RowVersion`.
- **Week 20:** OWASP Top 10 API security, SQL injection defense, CORS configuration, secrets management, rate limiting middleware, security headers.
- **Milestone 5:** Enterprise Hardening: Clean Architecture, Indexing & Security.

### Phase 6: Production Backend Engineering (Weeks 21–24)
- **Week 21:** In-memory caching vs Redis distributed caching, Cache-Aside pattern, cache invalidation strategies, cache stampede prevention.
- **Week 22:** Docker containerization, multi-stage Dockerfiles for .NET, volumes, networking, Docker Compose orchestration (API + SQL + Redis).
- **Week 23:** GitHub Actions CI/CD workflows, automated build and test gates, NuGet dependency caching, container image publishing.
- **Week 24:** Production observability, Serilog structured JSON logging, correlation ID tracing middleware, ASP.NET Core health checks (`/health/live`, `/health/ready`).
- **Milestone 6:** Dockerized Backend with Automated CI/CD Pipeline.

### Phase 7: Advanced Architecture & Multi-Tenancy (Weeks 25–28)
- **Week 25:** System design fundamentals, capacity estimation (QPS, storage, bandwidth), horizontal scaling, L4 vs L7 load balancing.
- **Week 26:** Multi-tenancy isolation models (Database-per-Tenant vs Shared Database), EF Core Global Query Filters, tenant resolution middleware.
- **Week 27:** Asynchronous event messaging with RabbitMQ, dual-write hazard, Transactional Outbox pattern, idempotent message consumers.
- **Week 28:** High-volume data ingestion, `SqlBulkCopy` vs batch inserts, row-level error handling, OpenTelemetry distributed tracing.
- **Milestone 7:** Multi-Tenant ERP Backend Platform Complete.

### Phase 8: MNC Interview Readiness (Weeks 29–32)
- **Week 29:** Linear DSA sprint (Two Pointers, Sliding Window, Prefix Sums, Binary Search), timed C# live coding mock.
- **Week 30:** Non-linear DSA sprint (Trees, BST, Heaps, PriorityQueue Top-K), .NET runtime internals and GC generational analysis.
- **Week 31:** Graphs (BFS, DFS, cycle detection), introductory dynamic programming, scalable multi-tenant system design mock interview.
- **Week 32:** Production incident debugging simulations, STAR method behavioral interview preparation, resume refinement, employment contract evaluation.
- **Milestone 8:** Production Portfolio & MNC Interview Readiness Complete.

---

## 4. Key Application Modules & Features

### A. Redesigned Dashboard — Calm, High-Signal Command Center
- **Compact Learning Overview:** Displays active Phase name & focus, Week X of 32 badge, compact progress bar, and weekly 12h progress tracker.
- **Prominent "Continue Where I Left Off" Hero:** Immediately identifies the exact active lesson, time estimate, and provides single-click `[Continue Lesson →]` action.
- **Meaningful Progress Row:** Compact, lightweight metrics without nested card clutter:
  - Estimated study hours logged
  - Topics mastered / total
  - Practice questions solved
  - SQL queries practised
  - Portfolio milestones completed
- **Dynamic Learning Insight:** Analyzes real history to surface actionable suggestions (e.g. revision topics flagged, consistency streaks, Wednesday countdown).
- **Upcoming Milestone Strip:** Concise target week and project link.
- **Contextual Wednesday 4-Hour Reminder:** Real-time day-of-week detection with structured session timeline.

### B. Continuous Video Learning in Lessons
- **Integrated YouTube Video Player:** Verified, curated lessons embedded inside each topic via responsive 16:9 privacy-enhanced `youtube-nocookie.com` iframes.
- **Language Toggle:** Instant switching between English and Hindi tutorials with duration indicators.
- **Watch Tracking:** "Mark as Watched" button persists view state in IndexedDB.
- **Fallback Links:** Direct YouTube link for alternative viewing.
- **Integrated Lesson Progression:** Video player sits alongside Concept explanation, Guided line-by-line examples, ERP business contexts, Edge cases, Practice tasks, and 8-tier Mastery status selector.

### C. Personal AI Learning Mentor & Technical Coach
- **ERP-Aware Context:** Pre-conditioned to understand your background (B.Tech IT, ASP.NET Web Forms, C#, SQL Server, Staff/Fee/HR/Payroll modules) and your target (Backend Software Engineer / .NET Developer in top MNCs and product firms).
- **Dual Operating Modes:**
  - *💡 Learning Mode (Default):* Socratic hints, thought-provoking questions, underlying CLR/DB engine mechanics, small snippets without spoiling full solutions.
  - *🚀 Solution Mode:* Production-grade C# code, defensive guards, exception handling, and enterprise architectural trade-offs.
- **Interactive Tools:**
  - *⚡ Quick 5-Question Quiz:* Instant quiz on your current week syllabus.
  - *🎙️ Mock Technical Interview:* 1-by-1 question drills across C# Internals, SQL Performance, ASP.NET Core, System Design, ERP Migration, and HR with MNC senior rubric evaluations.
  - *📅 Wednesday 4-Hour Planner:* Automatically organizes your 4-hour day off based on your active backlog.
  - *🧹 Chat History Controls:* One-click conversation reset or export.
- **Zero-Leakage Security & Local Proxy:**
  - Local proxy server (`server.mjs`) securely handles Google Gemini, OpenAI, or local Ollama.
  - Secrets reside in `.env.local` or `ai-config.local.json` (gitignored).
  - Built-in **Offline Knowledge Engine** automatically handles queries and drills if running without an API key or offline!

### D. Dedicated AI Engineering Assessment & Quiz Lab (`#quiz`)
A dedicated full-screen, focused examination page replacing modal popups with professional MNC-grade testing infrastructure:
- **Custom Question Count Input:** Enter any desired number of questions (e.g. 5, 10, 20) instead of being constrained to fixed dropdowns.
- **Difficulty Toggles:** Foundation, Standard, Advanced, or **Edge-Case & Tricky Questions**.
- **MNC Exam Simulator Checkbox:** Specifically prompts model for questions from top product companies and MNC question papers (Microsoft, Amazon, Goldman Sachs, Uber).
- **Deep Web Research & Synthesized Edge Cases:** Instructs the AI engine to research common failure modes, memory leaks, concurrency races, and tricky CLR/SQL behaviors.
- **Full-Screen Examination with Timer:** Clean multi-choice interface with optional countdown timer and progress indicators.
- **Zero-Duplicate Question Protection:** Every answered question is hashed and cataloged in the `resolved_questions` object store. Resolved questions are filtered out so you never see the same question twice across assessments!
- **Adaptive Weak Concept Targeting:** Missed questions and conceptual mistakes are automatically tracked in `weak_concepts`. The AI quiz engine adapts future questions to strengthen your identified weak areas.
- **Instant Q&A JSON Export:** Export any quiz with complete questions, chosen answers, correct solutions, and in-depth rationales for offline study.

### E. Practice & Assessment Hub
- **32 Weekly Quizzes:** 10 questions per week (concept, code, SQL, business logic). Instant scoring, retakes, explanations, and automatic revision tagging.
- **32 Weekly Coding Challenges:** Practical scenarios (biometric attendance evaluation, attendance deduplication, idempotent APIs). Tracks GitHub repository URLs and implementation notes.
- **Special Question Bank:** Filterable repository of edge cases and interview questions.
- **Aptitude & Reasoning Track:** Quantitative shortcuts, logical reasoning guides, and direct links to IndiaBix/GeeksforGeeks.

### F. Flagship Enterprise Projects
Detailed specifications for three portfolio-grade systems:
1. **Indian Payroll and Salary Calculation Engine:** Proration by working days, versioned statutory rules (EPF, ESI, Professional Tax slabs), backdated arrears, audit-traceable ASCII payslips.
2. **Staff, Attendance and Leave Management API:** ASP.NET Core Web API, JWT Bearer authentication, role/policy claims, approval workflows, optimistic concurrency with `RowVersion`.
3. **Multi-Tenant ERP Backend Platform:** Multi-college SaaS architecture, EF Core Global Query Filters, Redis caching, Docker Compose, GitHub Actions, Transactional Outbox pattern, 100K-row bulk attendance ingestion with error recovery.

### G. Career Development & Job Tracker
- **Practical Application Tracker:** 10 statuses (*Saved, To apply, Applied, Recruiter contacted, Assessment, Technical interview, HR interview, Offer, Rejected, Closed*).
- **CSV Export:** One-click download of all application records for offline review.
- **Developer Proof:** Tracks LeetCode (Easy/Medium/Hard, rating) and HackerRank (SQL stars, certificates) honestly without fake badges.
- **LinkedIn Visibility:** Profile checklist and bi-weekly milestone post templates based on actual roadmap accomplishments.

### H. Communication Practice & In-Browser Voice Recorder
- **Daily 15-Minute Routine:** 2m relax, 3m read aloud, 4m explain concept, 3m record/review, 3m interview question.
- **Client-Side Voice Recorder:** Records audio locally via browser `MediaRecorder` API; nothing is ever sent over the internet.
- **Self-Assessment Rating:** 1–5 scale evaluating Pace, Sentence Completion, Filler Words, Clarity, and Confidence.
- **Responsible Health Notice:** Clear medical disclaimer regarding persistent speech or saliva concerns, plus emergency FAST stroke symptoms.

---

## 5. Technology Stack & Local Storage Architecture

```text
Frontend:        HTML5, CSS3 (Custom Design Tokens, Full-Width Workspace), Vanilla JavaScript (ES Modules)
Storage Engine:  IndexedDB (BackendLearningCompanionDB v3) with 19 Object Stores
Local Server:    Node.js native HTTP server (server.mjs) with Zero external npm dependencies
AI Integration:  Google Gemini API / OpenAI Compatible / Local Ollama (Ollama at localhost:11434)
PWA Engine:      Service Worker (service-worker.js), Web App Manifest (manifest.json)
Audio API:       HTML5 MediaDevices / MediaRecorder API
```

### IndexedDB Object Stores (Version 3)
1. `user_settings`: User profile, start date, target hours, onboarding flag.
2. `topics_progress`: Topic status (8-tier mastery), notes, explanation drafts.
3. `problem_attempts`: Problem status (`attempted`, `solved`, `mastered`), notes, attempt count.
4. `quiz_attempts`: Week number, score, total, question answers, timestamp, revision topics.
5. `challenge_submissions`: Week number, GitHub repo URL, solution notes, status.
6. `study_sessions`: Daily study duration, activity type, completion timestamp.
7. `project_tasks`: Project ID, task ID, completion status (Core vs Advanced).
8. `speaking_logs`: Audio session duration, 1–5 ratings, reflection notes.
9. `weekly_reviews`: Sunday reflection answers, planned vs actual hours, next week priorities.
10. `job_applications`: Company, title, location, status, dates, recruiter, notes, tech stack.
11. `external_profiles`: LeetCode, HackerRank, CodeChef profile URLs, problem counts, contest ratings.
12. `linkedin_posts`: Milestone drafts, post status, dates.
13. `active_state`: Last accessed topic ID and week number for seamless session resumption.
14. `video_progress`: Watched status, watch duration, and notes for embedded YouTube lessons.
15. `ai_conversations`: Local persistent chat history with the AI Learning Mentor.
16. `ai_quizzes`: Generated quiz scores, topics, and date records.
17. `ai_config`: Local provider preferences and settings.
18. `resolved_questions`: Unique SHA-256 question hashes, resolution status, and difficulty metadata (zero-duplicate protection).
19. `weak_concepts`: Error patterns, missed topics, and mastery deficit log for targeted AI learning adaptation.

---

## 6. Windows Setup & Running Instructions

### Recommended: Running with the Built-in Server & AI Proxy

1. Open PowerShell or Command Prompt in the project folder:
   ```powershell
   cd c:\Users\Sujal\Documents\32-Week-Plan
   ```

2. Optional: Set your Gemini or OpenAI API key in `.env.local` (already gitignored):
   ```text
   GEMINI_API_KEY=your_gemini_api_key_here
   AI_MODEL=gemini-1.5-flash
   ```

3. Start the local server:
   ```powershell
   node server.mjs
   ```

4. Open your browser:
   ```text
   http://127.0.0.1:3000
   ```

*Note:* You can also run Ollama completely offline on `http://localhost:11434` without any API keys!

### Alternative: Running Purely Offline with Python or Live Server
If you prefer not to use Node.js:
```powershell
python -m http.server 8000
```
Open `http://localhost:8000`. The platform, video lessons, and built-in AI Knowledge Engine will function smoothly.

### Installing as a Standalone Windows Desktop App (PWA)
1. Open `http://127.0.0.1:3000` in **Microsoft Edge** or **Google Chrome**.
2. Click the **App Available (🖥️ or ➕)** icon in the address bar, then click **Install**.
3. The platform launches in its own native Windows application window.
4. Pin it to your **Windows Taskbar** or **Start Menu**.
5. All features and progress remain fully accessible offline.

---

## 7. Data Backup & Safety

- **100% Data Preservation:** Upgrading the schema never deletes your existing study records, quiz scores, or completed lessons.
- **Export Full Backup:** Go to *More Tools ▾* → *Settings* (`#settings`) → click **Export Full JSON Backup**.
- **Restore Backup:** Select your `.json` file under *Settings* to seamlessly restore all records across any machine.

---

## 8. Automated Verification Suite

Run the full integrity test suite anytime:
```powershell
node test-data-validation.mjs
```
Validates all 8 phases, 32 weeks, 160+ topics, 32 quizzes, 32 challenges, and project schemas (1342/1342 checks passing).
