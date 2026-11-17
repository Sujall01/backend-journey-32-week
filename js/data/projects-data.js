/**
 * projects-data.js - Specifications for 3 Flagship Enterprise Projects
 * 1. Indian Payroll and Salary Calculation Engine
 * 2. Staff, Attendance and Leave Management API
 * 3. Multi-Tenant ERP Backend Platform
 * Complete with task checklists (Core vs Advanced), architecture diagrams,
 * database schema specs, README checklists, and interview talking points.
 */

export const ENTERPRISE_PROJECTS = [
  {
    id: "proj-1",
    title: "Indian Payroll and Salary Calculation Engine",
    subtitle: "Enterprise Statutory Rules Engine, Arrears & Audit-Traceable Payroll",
    roadmap_phase: "Phase 1 & Phase 2 Capstone (Weeks 4 & 8)",
    tech_stack: [".NET 8", "C#", "System.Text.Json", "xUnit", "Console CLI / Library"],
    business_problem: "Companies and universities require exact, compliant salary calculations based on attendance, component allowances, statutory deductions (PF, ESI, PT), and employer contributions. Manual or unversioned calculations cause payroll discrepancies, tax penalties, and audit failures.",
    legal_statutory_note: "IMPORTANT LEGAL NOTICE: Statutory rates (such as EPF 12%, ESI 0.75%/3.25%, and state-specific Professional Tax slabs) are subject to governmental amendments and state jurisdictions. This engine treats statutory rules as configurable, versioned data with effective dates and eligibility ceilings, rather than hardcoded business constants.",
    architecture_overview: `
+---------------------------------------------------------------+
|                    Payroll Engine Architecture                |
+---------------------------------------------------------------+
|  Input Layer: Employee Master, Salary Structure, Attendance   |
+------------------------------+--------------------------------+
                               |
                               v
+---------------------------------------------------------------+
|   Statutory Rules Provider (Versioned by State & Year)        |
|   - EPF Slab Rules (Basic <= statutory limit, 12% employee)   |
|   - ESI Slab Rules (Gross <= threshold, 0.75% / 3.25%)        |
|   - Professional Tax Rules (State slabs, e.g. Gujarat/MH)    |
+------------------------------+--------------------------------+
                               |
                               v
+---------------------------------------------------------------+
|       Salary Calculation Pipeline (Domain Engine)             |
|   1. Prorate Pay by Working Days (Total - LOP Days)          |
|   2. Compute Gross Earnings (Basic, HRA, Allowances)         |
|   3. Compute Statutory Deductions (PF, ESI, PT, TDS)          |
|   4. Compute Employer Contributions & CTC                     |
|   5. Compute Net Payable Salary (Gross - Deductions)         |
+------------------------------+--------------------------------+
                               |
                               v
+---------------------------------------------------------------+
|     Persistence & Audit Layer (JSON / ASCII Payslip / Log)    |
+---------------------------------------------------------------+
    `,
    database_schema: [
      { table: "Employees", columns: "Id, EmployeeCode, FullName, DepartmentId, StateJurisdiction, DateOfJoining, PanNumber, UanNumber, IsActive" },
      { table: "SalaryStructures", columns: "Id, EmployeeId, EffectiveFromDate, EffectiveToDate, BasicMonthly, HraMonthly, SpecialAllowanceMonthly, ConveyanceMonthly" },
      { table: "MonthlyAttendance", columns: "Id, EmployeeId, Year, Month, TotalCalendarDays, WorkingDays, PresentDays, PaidLeaveDays, LossOfPayDays" },
      { table: "StatutoryRuleSets", columns: "Id, Jurisdiction, RuleType (PF/ESI/PT), EffectiveDate, ThresholdMin, ThresholdMax, EmployeeRate, EmployerRate" },
      { table: "PayrollRuns", columns: "Id, Month, Year, ProcessedTimestamp, ProcessedBy, TotalGross, TotalNet, Status" },
      { table: "PayrollItems", columns: "Id, PayrollRunId, EmployeeId, ProratedGross, EmployeePf, EmployeeEsi, ProfessionalTax, TdsDeduction, NetSalary, EmployerCost" }
    ],
    edge_cases: [
      "Mid-Month Joining: Employee joins on the 18th of a 31-day month; earnings and deductions must prorate exactly by 14 calendar days.",
      "Loss of Pay (LOP) Exceeds Working Days: Net payable must clamp to exactly 0.00m rather than computing a negative net salary.",
      "Salary Revision with Backdated Arrears: An incremental pay hike effective 2 months prior must calculate retroactive differential pay in the current run.",
      "Missing Statutory Identifiers: Flag missing PAN or UAN without crashing the batch calculation.",
      "Zero Net Salary Boundary: When voluntary deductions equal total gross pay.",
      "State Boundary Rules: Professional Tax varies by state (e.g. Maharashtra vs Gujarat vs Karnataka); engine must resolve correct ruleset."
    ],
    tasks: [
      { id: "p1-t1", category: "Core", title: "Domain Model: Employee, SalaryStructure, Attendance, and Payslip classes", completed: false },
      { id: "p1-t2", category: "Core", title: "Proration Engine: Prorate earnings by working days vs LOP days using decimal", completed: false },
      { id: "p1-t3", category: "Core", title: "Statutory Rules Provider: Configurable EPF, ESI, and Professional Tax calculations", completed: false },
      { id: "p1-t4", category: "Core", title: "Calculation Pipeline: Gross, Deductions, Net, and Employer CTC calculation", completed: false },
      { id: "p1-t5", category: "Core", title: "ASCII Payslip Generator: Formatted alignment with earnings and deductions columns", completed: false },
      { id: "p1-t6", category: "Core", title: "JSON Persistence: Save and reload monthly payroll runs with System.Text.Json", completed: false },
      { id: "p1-t7", category: "Advanced", title: "Effective-Dated Statutory Rules: Support historical rates without breaking past runs", completed: false },
      { id: "p1-t8", category: "Advanced", title: "Backdated Salary Revisions: Arrears calculator computing 2-month retroactive adjustments", completed: false },
      { id: "p1-t9", category: "Advanced", title: "Comprehensive Audit Trail: Explainable calculation breakdown showing formula steps", completed: false }
    ],
    readme_checklist: [
      "Clear Project Title & Business Problem Statement.",
      "Step-by-step Setup & Execution Instructions (`dotnet run`).",
      "Statutory Calculation Formulas & Legal Disclaimers.",
      "Sample Payslip ASCII Output screenshot / text.",
      "Test Coverage Summary (Unit tests for edge cases).",
      "Architecture diagram & class hierarchy."
    ],
    interview_talking_points: [
      "Why `decimal` is mathematically mandatory in payroll to avoid accumulated fractional cent drift.",
      "How you handled mid-month joinings and zero-net salary boundary conditions defensively.",
      "How statutory rules are decoupled from calculation logic via the Strategy / Provider pattern.",
      "How arrears are calculated idempotently without mutating closed historical payroll runs."
    ]
  },

  {
    id: "proj-2",
    title: "Staff, Attendance and Leave Management API",
    subtitle: "Production REST API with JWT Auth, Role Claims & Concurrency-Safe Approvals",
    roadmap_phase: "Phase 3 & Phase 4 Capstone (Weeks 12 & 16)",
    tech_stack: ["ASP.NET Core Web API", "Entity Framework Core", "SQL Server", "JWT Bearer", "xUnit & Moq", "Swagger/OpenAPI"],
    business_problem: "University and enterprise departments struggle with fragmented attendance tracking, paper leave slips, overlapping leaves, and unauthorized absences. A secure, centralized API is needed to manage staff records, enforce leave policies, and coordinate managerial approvals.",
    legal_statutory_note: "Complies with organizational leave policies (Casual, Sick, Earned/Privilege) and prevents leave balance overdrafts through database row-level concurrency tokens.",
    architecture_overview: `
+---------------------------------------------------------------+
|             Staff & Leave Management API Architecture         |
+---------------------------------------------------------------+
|  Client (Swagger / Postman / Frontend App)                    |
+------------------------------+--------------------------------+
                               |  Bearer JWT Token
                               v
+---------------------------------------------------------------+
|  ASP.NET Core Middleware Pipeline                             |
|  - Global Exception Handling (RFC 7807 ProblemDetails)        |
|  - JWT Authentication & Claims Transformation (UserId, Role)  |
|  - Rate Limiting Middleware                                   |
+------------------------------+--------------------------------+
                               |
                               v
+---------------------------------------------------------------+
|  API Controllers ([Authorize(Roles = "Admin,Manager,Staff")])|
|  - StaffController, AttendanceController, LeaveController     |
+------------------------------+--------------------------------+
                               |
                               v
+---------------------------------------------------------------+
|  Application Business Services (with DTOs & Validation)      |
|  - LeaveService: Validate balance, State Machine transitions   |
|  - AttendanceService: Punch aggregation & shift evaluation    |
+------------------------------+--------------------------------+
                               |
                               v
+---------------------------------------------------------------+
|  Persistence Layer (Entity Framework Core & SQL Server)       |
|  - AppDbContext (Scoped), RowVersion Concurrency Tokens       |
+---------------------------------------------------------------+
    `,
    database_schema: [
      { table: "Users", columns: "Id, Username, PasswordHash, Salt, Role (Admin/Manager/Staff), IsActive" },
      { table: "StaffMembers", columns: "Id, UserId, EmployeeCode, FullName, Email, DepartmentId, ManagerId, JoiningDate, RowVersion" },
      { table: "Departments", columns: "Id, Code, Name, HeadOfDepartmentId" },
      { table: "LeaveTypes", columns: "Id, Code (CL/SL/EL), Name, AnnualQuota, CarryForwardMax" },
      { table: "LeaveBalances", columns: "Id, StaffId, LeaveTypeId, Year, TotalAllocated, UsedDays, PendingDays, RowVersion" },
      { table: "LeaveApplications", columns: "Id, StaffId, LeaveTypeId, StartDate, EndDate, TotalDays, Reason, Status (Pending/Approved/Rejected/Cancelled), ApproverId, Comments, CreatedAt, RowVersion" },
      { table: "LeaveAuditLogs", columns: "Id, ApplicationId, Action, PerformedBy, PreviousStatus, NewStatus, Timestamp" }
    ],
    edge_cases: [
      "Concurrent Approval Double-Spend: Two managers approving concurrent requests that exceed the employee's remaining leave balance.",
      "Weekend / Holiday Inclusion: Calculating net leave days excluding registered institute holidays and Sundays.",
      "Delegated Approval: When a manager is on leave, their designated acting manager must have permission to approve.",
      "Retroactive Leave Cancellation: Cancelling an already approved leave must atomically credit the leave balance back and record an audit log.",
      "Overlapping Leave Requests: Rejecting new applications whose date range overlaps with an existing approved or pending leave."
    ],
    tasks: [
      { id: "p2-t1", category: "Core", title: "RESTful API Scaffolding with ASP.NET Core 8 and Swagger", completed: false },
      { id: "p2-t2", category: "Core", title: "EF Core Code-First DbContext, Entity Configurations & Migrations", completed: false },
      { id: "p2-t3", category: "Core", title: "JWT Bearer Authentication & Password Hashing with Salt", completed: false },
      { id: "p2-t4", category: "Core", title: "Role-Based Authorization ([Authorize(Roles = 'Manager')])", completed: false },
      { id: "p2-t5", category: "Core", title: "Leave Application State Machine: Submit -> Pending -> Approved/Rejected", completed: false },
      { id: "p2-t6", category: "Core", title: "Automated Unit Tests with xUnit and Moq for Leave Validation", completed: false },
      { id: "p2-t7", category: "Advanced", title: "Concurrency-Safe Approvals using EF Core RowVersion token", completed: false },
      { id: "p2-t8", category: "Advanced", title: "Delegated Approvals: Acting manager substitution rules", completed: false },
      { id: "p2-t9", category: "Advanced", title: "Audit Trail Logging for all status transitions and edits", completed: false }
    ],
    readme_checklist: [
      "API Overview & Feature List.",
      "JWT Authentication Flow & Sample Credentials.",
      "Swagger UI Endpoint Documentation.",
      "Database Setup & Migration Execution (`dotnet ef database update`).",
      "Integration Test Instructions (`dotnet test`).",
      "Postman Collection / .http file examples."
    ],
    interview_talking_points: [
      "How RowVersion / optimistic concurrency prevents race conditions during simultaneous leave approvals.",
      "Why DTOs are mandatory to protect domain models and avoid over-posting attacks.",
      "How Global Exception Handling Middleware converts domain errors to standardized ProblemDetails.",
      "The architectural decision between Scoped vs Singleton service lifetimes in ASP.NET Core DI."
    ]
  },

  {
    id: "proj-3",
    title: "Multi-Tenant ERP Backend Platform",
    subtitle: "Enterprise SaaS Architecture, Tenant Isolation, Outbox Messaging & 100K Batch Ingestion",
    roadmap_phase: "Phase 5, Phase 6 & Phase 7 Capstone (Weeks 20, 24, 28)",
    tech_stack: ["ASP.NET Core 8", "EF Core", "SQL Server", "Redis", "RabbitMQ", "Docker Compose", "GitHub Actions CI/CD", "Serilog"],
    business_problem: "A university management SaaS provider hosts 50+ independent colleges on a single cloud platform. Each college requires strict data isolation, custom grading and payroll rules, high-volume student attendance imports, and resilient event delivery without tenant data leakage.",
    legal_statutory_note: "Strict data privacy guarantees: No tenant may ever query or view another tenant's records, enforced at the ORM query level via EF Core Global Query Filters.",
    architecture_overview: `
+---------------------------------------------------------------+
|               Multi-Tenant ERP Backend Architecture           |
+---------------------------------------------------------------+
|  Multi-College Clients (Subdomains: collegeA.erp.com, etc.)   |
+------------------------------+--------------------------------+
                               |
                               v
+---------------------------------------------------------------+
|  API Gateway & Tenant Resolution Middleware                   |
|  - Resolves TenantId from Subdomain or JWT Claim              |
|  - Sets Scoped ITenantContext Provider                        |
+------------------------------+--------------------------------+
                               |
                               v
+---------------------------------------------------------------+
|  Application Core Services & Redis Distributed Cache          |
|  - Tenant-specific feature flags and cached configuration     |
+------------------------------+--------------------------------+
                               |
                               v
+---------------------------------------------------------------+
|  EF Core Multi-Tenant DbContext                               |
|  - HasQueryFilter(e => e.TenantId == _currentTenant.Id)       |
|  - Shared Database with Tenant Column / Dynamic Connection    |
+------------------------------+--------------------------------+
                               |
                               +-------------------+
                               |                   |
                               v                   v
+-----------------------------------+  +------------------------+
| Transactional Outbox Table (SQL)  |  | High-Volume Ingestion  |
| - Pending events stored in same tx|  | - 100K attendance rows |
+------------------+----------------+  | - Row error recovery   |
                   |                   +------------------------+
                   v
+-----------------------------------+
| Background Worker / Message Bus   |
| - Publishes to RabbitMQ Broker    |
| - Idempotent Consumers (DLQ)      |
+-----------------------------------+
    `,
    database_schema: [
      { table: "Tenants", columns: "Id, Subdomain, UniversityName, DatabaseConnectionString, IsActive, CreatedAt" },
      { table: "TenantUsers", columns: "Id, TenantId, Username, Email, Role, IsActive" },
      { table: "Students", columns: "Id, TenantId, EnrollmentNo, FullName, CourseId, Semester, IsActive" },
      { table: "StudentAttendance", columns: "Id, TenantId, StudentId, Date, SubjectId, Status, RecordedBy" },
      { table: "OutboxMessages", columns: "Id, TenantId, EventType, PayloadJson, CreatedAt, ProcessedAt, ErrorLog, RetryCount" },
      { table: "BatchImportJobs", columns: "Id, TenantId, FileName, TotalRows, SuccessRows, FailedRows, Status, StartedAt, CompletedAt" },
      { table: "BatchImportErrors", columns: "Id, JobId, RowNumber, RawData, ErrorReason, Timestamp" }
    ],
    edge_cases: [
      "Cross-Tenant Data Leak: Developer writes a raw LINQ query without filtering by TenantId (prevented by Global Query Filters).",
      "Dual-Write Failure: SQL commits but message broker drops connection (prevented by Transactional Outbox pattern).",
      "Dirty 100,000-Row Bulk Import: 50 rows have invalid student codes (engine must ingest the 99,950 valid rows and write errors to audit table).",
      "Idempotent Webhooks: Message broker delivers attendance notification twice; consumer must detect existing processing key.",
      "Tenant Database Connection Pooling: Preventing connection exhaustion across 50 tenant databases."
    ],
    tasks: [
      { id: "p3-t1", category: "Core", title: "Multi-Tenant Resolution Middleware via Subdomain / JWT", completed: false },
      { id: "p3-t2", category: "Core", title: "EF Core Global Query Filters enforcing automatic TenantId isolation", completed: false },
      { id: "p3-t3", category: "Core", title: "Redis Distributed Caching for Tenant Configuration & Permissions", completed: false },
      { id: "p3-t4", category: "Core", title: "Docker Compose environment orchestrating Web API + SQL Server + Redis", completed: false },
      { id: "p3-t5", category: "Core", title: "GitHub Actions CI/CD Pipeline running automated build and tests", completed: false },
      { id: "p3-t6", category: "Core", title: "Structured Logging with Serilog and Correlation IDs", completed: false },
      { id: "p3-t7", category: "Advanced", title: "Transactional Outbox Pattern guaranteeing reliable event publishing", completed: false },
      { id: "p3-t8", category: "Advanced", title: "Resilient 100K Attendance Bulk Ingestion with Row-Level Error Recovery", completed: false },
      { id: "p3-t9", category: "Advanced", title: "Idempotent Message Consumers with Dead-Letter Queue handling", completed: false }
    ],
    readme_checklist: [
      "Enterprise Multi-Tenancy Architecture Document.",
      "Docker Compose One-Command Setup (`docker-compose up -d`).",
      "Tenant Onboarding Walkthrough & Demo Credentials.",
      "Transactional Outbox & Messaging Lifecycle Diagram.",
      "Performance Benchmark: 100,000 Row Bulk Import Results.",
      "Security & Tenant Isolation Automated Test Suite."
    ],
    interview_talking_points: [
      "How EF Core Global Query Filters prevent tenant data cross-contamination at the compile and query generation level.",
      "How the Transactional Outbox pattern solves the dual-write problem between relational DBs and message queues.",
      "How you achieved high throughput in bulk imports while maintaining individual row error traceability.",
      "How you orchestrated local development with Docker Compose and automated deployment with GitHub Actions."
    ]
  }
];

