/**
 * roadmap-data.js - Complete 32-Week Backend Engineering Roadmap
 * All 8 Phases and 32 Weeks with exact weekly topics, practice quotas, special questions, and milestones.
 */

export const PHASES = [
  {
    id: 1,
    title: "Phase 1: Rebuild C# Fundamentals",
    weeks: [1, 2, 3, 4],
    description: "Solidify core C# syntax, type safety, memory awareness, control flow, methods, arrays, strings, and clean code habits.",
    milestone: "Employee Salary Calculator Console App"
  },
  {
    id: 2,
    title: "Phase 2: Strong C#, OOP and Data Handling",
    weeks: [5, 6, 7, 8],
    description: "Master Generic Collections, Object-Oriented Design, Encapsulation, Polymorphism, Interfaces, LINQ, and JSON data processing.",
    milestone: "Payroll Console v1 with JSON Persistence"
  },
  {
    id: 3,
    title: "Phase 3: SQL and Modern .NET",
    weeks: [9, 10, 11, 12],
    description: "Transition from Web Forms to ASP.NET Core Web API, Dependency Injection, Middleware, DTOs, SQL Server design, and Entity Framework Core.",
    milestone: "ASP.NET Core Web API with SQL Server & EF Core"
  },
  {
    id: 4,
    title: "Phase 4: Authentication, Testing & Real API Development",
    weeks: [13, 14, 15, 16],
    description: "Implement JWT Bearer auth, role/policy claims, xUnit testing, Moq, async/await deep dive, background tasks, and leave management business logic.",
    milestone: "Staff and Leave Management API"
  },
  {
    id: 5,
    title: "Phase 5: Advanced Software Engineering",
    weeks: [17, 18, 19, 20],
    description: "Refactor to Clean Architecture & SOLID, optimize SQL indexes and execution plans, handle ACID transactions and concurrency, and secure APIs against OWASP Top 10.",
    milestone: "Enterprise Hardening: Clean Architecture, Indexing & Security"
  },
  {
    id: 6,
    title: "Phase 6: Production Backend Engineering",
    weeks: [21, 22, 23, 24],
    description: "Implement Redis distributed caching, containerize with Docker & Docker Compose, set up GitHub Actions CI/CD pipelines, and configure Serilog structured logging and health checks.",
    milestone: "Dockerized Backend with Automated CI/CD Pipeline"
  },
  {
    id: 7,
    title: "Phase 7: Advanced Architecture & Multi-Tenancy",
    weeks: [25, 26, 27, 28],
    description: "Design scalable distributed systems, implement multi-tenant database isolation, handle asynchronous messaging with RabbitMQ, and guarantee event delivery via Transactional Outbox.",
    milestone: "Multi-Tenant ERP Backend Platform"
  },
  {
    id: 8,
    title: "Phase 8: MNC Interview Readiness",
    weeks: [29, 30, 31, 32],
    description: "Conduct comprehensive DSA review, SQL query challenges, mock architectural interviews, behavioral/HR practice, and resume alignment.",
    milestone: "Production Portfolio & MNC Interview Readiness"
  }
];

export const WEEKS = [
  // --- Phase 1: Rebuild C# Fundamentals ---
  {
    week_number: 1,
    phase_id: 1,
    title: "C# Project Structure, Variables & Numeric Types",
    description: "Understand the .NET CLI, project SDK structure, value types vs reference types, numeric precision, and standard I/O.",
    targets: { csharp: 8, sql: 3, dsa: 3, special: 4 },
    milestone: null,
    topics: [
      { id: "w1-t1", title: ".NET SDK and Project Structure", time: "45m", diff: "Easy" },
      { id: "w1-t2", title: "Console Applications & Standard I/O", time: "45m", diff: "Easy" },
      { id: "w1-t3", title: "Variables, Value Types vs Reference Types", time: "60m", diff: "Medium" },
      { id: "w1-t4", title: "Operators and Type Conversion (Implicit/Explicit)", time: "60m", diff: "Medium" },
      { id: "w1-t5", title: "Integer, Decimal and Floating-point Precision", time: "60m", diff: "Medium" },
      { id: "w1-t6", title: "Basic Debugging & Visual Studio / VS Code Tools", time: "45m", diff: "Easy" }
    ],
    special_questions: [
      "Difference between int, long, double, and decimal with memory footprint.",
      "Why is decimal mandatory for financial and payroll calculations?",
      "What happens when Console.ReadLine() returns null and how to handle it safely?",
      "Why does Convert.ToInt32 fail on invalid input compared to int.TryParse?"
    ]
  },
  {
    week_number: 2,
    phase_id: 1,
    title: "Control Flow, Conditional Logic & Iteration",
    description: "Master if/else, switch expressions, comparison and logical operators, for/while/foreach loops, and avoiding nested complexity.",
    targets: { csharp: 8, sql: 3, dsa: 3, special: 4 },
    milestone: null,
    topics: [
      { id: "w2-t1", title: "Conditional Statements (if, else if, else)", time: "45m", diff: "Easy" },
      { id: "w2-t2", title: "Switch Statements & Modern Switch Expressions", time: "60m", diff: "Medium" },
      { id: "w2-t3", title: "Comparison and Logical Operators (Short-circuiting)", time: "45m", diff: "Easy" },
      { id: "w2-t4", title: "Loops: for, while, do-while and foreach", time: "60m", diff: "Medium" },
      { id: "w2-t5", title: "Nested Loops & Algorithmic Complexity Awareness", time: "60m", diff: "Medium" },
      { id: "w2-t6", title: "Defensive Conditional Logic & Guard Clauses", time: "45m", diff: "Medium" }
    ],
    special_questions: [
      "Identify the exact cause of an infinite loop in a salary accumulator.",
      "Find the maximum and second maximum of multiple employee salaries without sorting.",
      "Validate employee age (18-65) and salary boundary values defensively.",
      "Explain short-circuit evaluation in logical AND (&&) vs bitwise AND (&)."
    ]
  },
  {
    week_number: 3,
    phase_id: 1,
    title: "Methods, Parameters, Scope & Arrays",
    description: "Structure modular code with clean method signatures, parameter passing (ref/out/in), method overloading, and fixed-size arrays.",
    targets: { csharp: 8, sql: 3, dsa: 3, special: 4 },
    milestone: null,
    topics: [
      { id: "w3-t1", title: "Methods, Return Types, and Void", time: "45m", diff: "Easy" },
      { id: "w3-t2", title: "Parameters: Value, Reference (ref), Output (out), in", time: "60m", diff: "Medium" },
      { id: "w3-t3", title: "Method Overloading & Signature Resolution", time: "45m", diff: "Easy" },
      { id: "w3-t4", title: "Variable Scope, Lifetime & Call Stack", time: "45m", diff: "Medium" },
      { id: "w3-t5", title: "Single-dimensional and Multidimensional Arrays", time: "60m", diff: "Medium" },
      { id: "w3-t6", title: "for vs foreach: Performance, Index Access & Mutability", time: "45m", diff: "Medium" }
    ],
    special_questions: [
      "Refactor a 100-line monolithic salary calculation into reusable single-purpose methods.",
      "Find duplicate elements in an array of employee attendance IDs in O(n) vs O(n^2).",
      "Explain the exact memory behaviour when passing a struct vs class instance to a method.",
      "Why does modifying an array element succeed in a for loop but fail to reassign the loop variable in foreach?"
    ]
  },
  {
    week_number: 4,
    phase_id: 1,
    title: "Strings, Nullable Types, Parsing & Salary Milestone",
    description: "Handle string manipulation, immutability, StringBuilder, int.TryParse, null-coalescing, and build Milestone 1.",
    targets: { csharp: 8, sql: 3, dsa: 3, special: 4 },
    milestone: "Milestone 1: Employee Salary Calculator Console Application",
    topics: [
      { id: "w4-t1", title: "Strings & String Immutability in .NET", time: "45m", diff: "Medium" },
      { id: "w4-t2", title: "String Interpolation, Formatting & StringBuilder", time: "60m", diff: "Medium" },
      { id: "w4-t3", title: "Parsing Strings: Parse vs TryParse Pattern", time: "45m", diff: "Medium" },
      { id: "w4-t4", title: "Null Handling: Nullable Types, ?., ?? and ??=", time: "60m", diff: "Medium" },
      { id: "w4-t5", title: "Defensive Input Validation & Edge Cases", time: "45m", diff: "Medium" },
      { id: "w4-t6", title: "Project Milestone: Salary Calculator Engine", time: "90m", diff: "Hard" }
    ],
    special_questions: [
      "Why does repeated string concatenation in a loop cause excessive GC pressure?",
      "How does int.TryParse guarantee zero exceptions even with corrupted user input?",
      "Handle null reference edge cases in employee middle name or optional allowance fields.",
      "Explain how the Employee Salary Calculator handles negative inputs and zero working days."
    ]
  },

  // --- Phase 2: Strong C#, OOP and Data Handling ---
  {
    week_number: 5,
    phase_id: 2,
    title: "Generic Collections & Memory Data Structures",
    description: "Deep dive into List<T>, Dictionary<TKey, TValue>, HashSet<T>, Queue<T>, Stack<T>, and algorithmic time complexities.",
    targets: { csharp: 8, sql: 4, dsa: 4, special: 4 },
    milestone: null,
    topics: [
      { id: "w5-t1", title: "List<T>: Internal Resizing & Amortized Complexity", time: "60m", diff: "Medium" },
      { id: "w5-t2", title: "Dictionary<TKey, TValue>: Hash Codes & Buckets", time: "75m", diff: "Hard" },
      { id: "w5-t3", title: "HashSet<T>: Set Operations & O(1) Lookups", time: "45m", diff: "Medium" },
      { id: "w5-t4", title: "Queue<T> and Stack<T> in Backend Workflows", time: "45m", diff: "Medium" },
      { id: "w5-t5", title: "Choosing the Right Collection for ERP Scenarios", time: "45m", diff: "Medium" }
    ],
    special_questions: [
      "When is Dictionary<TKey, TValue> preferred over List<T> for employee lookup?",
      "Find duplicate employee records and count department frequencies in O(n).",
      "Remove duplicate attendance entries while preserving the original check-in order.",
      "What happens internally when two different keys produce the same hash code in a Dictionary?"
    ]
  },
  {
    week_number: 6,
    phase_id: 2,
    title: "Object-Oriented Programming (Classes, Encapsulation, Polymorphism)",
    description: "Build robust domain entities with constructors, access modifiers, properties with backing fields, inheritance hierarchies, and method overriding.",
    targets: { csharp: 8, sql: 4, dsa: 4, special: 4 },
    milestone: null,
    topics: [
      { id: "w6-t1", title: "Classes, Objects, and Instantiation", time: "45m", diff: "Easy" },
      { id: "w6-t2", title: "Constructors, Overloading, and Object Initializers", time: "45m", diff: "Medium" },
      { id: "w6-t3", title: "Properties (Auto-properties, Read-only, Init-only)", time: "45m", diff: "Medium" },
      { id: "w6-t4", title: "Encapsulation & Domain Invariants", time: "60m", diff: "Medium" },
      { id: "w6-t5", title: "Inheritance: Base Classes, protected, and base keyword", time: "60m", diff: "Medium" },
      { id: "w6-t6", title: "Polymorphism: virtual, override, and new keywords", time: "75m", diff: "Hard" }
    ],
    special_questions: [
      "Design Employee, Department, and SalaryBreakdown domain classes with proper encapsulation.",
      "Model multiple employee types (FullTime, Contract, Intern) with polymorphic salary calculations.",
      "Explain encapsulation using a real ERP example where salary cannot be set to a negative number.",
      "What is the exact distinction between method overriding (override) and method hiding (new)?"
    ]
  },
  {
    week_number: 7,
    phase_id: 2,
    title: "Interfaces, Generics, Enums & Custom Exceptions",
    description: "Implement decoupled designs with interfaces, generic repository patterns, domain enums, structured exception handling, and custom domain exceptions.",
    targets: { csharp: 8, sql: 4, dsa: 4, special: 4 },
    milestone: null,
    topics: [
      { id: "w7-t1", title: "Interfaces: Contracts and Multiple Implementation", time: "60m", diff: "Medium" },
      { id: "w7-t2", title: "Abstract Classes vs Interfaces: When to Use Which", time: "60m", diff: "Medium" },
      { id: "w7-t3", title: "Generics: Classes, Methods, and Constraints (where T : class)", time: "75m", diff: "Hard" },
      { id: "w7-t4", title: "Enums & Strongly Typed Domain Statuses", time: "45m", diff: "Easy" },
      { id: "w7-t5", title: "Exception Handling: try/catch/finally, rethrowing with throw", time: "60m", diff: "Medium" },
      { id: "w7-t6", title: "Custom Domain Exceptions (e.g., InsufficientLeaveBalanceException)", time: "60m", diff: "Medium" }
    ],
    special_questions: [
      "Compare Interface vs Abstract Class with concrete examples from an ERP payment gateway.",
      "Create a custom InsufficientLeaveException with employee ID and requested days.",
      "How do you safely catch and log a database exception without losing the original stack trace?",
      "Design a generic IRepository<T> interface with basic query and insert operations."
    ]
  },
  {
    week_number: 8,
    phase_id: 2,
    title: "LINQ, File I/O, JSON Serialization & Milestone 2",
    description: "Master LINQ query syntax and method chains (Where, Select, OrderBy, GroupBy, Aggregate), System.Text.Json, and complete Payroll Console v1.",
    targets: { csharp: 8, sql: 4, dsa: 4, special: 4 },
    milestone: "Milestone 2: Payroll Console v1 with File/JSON Persistence",
    topics: [
      { id: "w8-t1", title: "LINQ Fundamentals: Deferred Execution vs Immediate Execution", time: "60m", diff: "Medium" },
      { id: "w8-t2", title: "LINQ Filtering, Projection & Sorting (Where, Select, OrderBy)", time: "60m", diff: "Medium" },
      { id: "w8-t3", title: "LINQ GroupBy, Join, Any, All, and Aggregates", time: "75m", diff: "Hard" },
      { id: "w8-t4", title: "File I/O: File, Directory, Path, and Stream Management", time: "60m", diff: "Medium" },
      { id: "w8-t5", title: "JSON Serialization & Deserialization with System.Text.Json", time: "60m", diff: "Medium" },
      { id: "w8-t6", title: "Project Milestone: Payroll Console v1 Architecture", time: "90m", diff: "Hard" }
    ],
    special_questions: [
      "Explain the deferred execution hazard when using IEnumerable<T> inside a loop.",
      "Group 1,000 employees by department and calculate total payroll and average salary using LINQ.",
      "How to configure System.Text.Json to handle camelCase and ignore null values?",
      "Write safe code to read and write an employee JSON database file with error recovery."
    ]
  },

  // --- Phase 3: SQL and Modern .NET ---
  {
    week_number: 9,
    phase_id: 3,
    title: "Git Collaboration & HTTP / REST Fundamentals",
    description: "Master professional Git branching, commit conventions, merge resolution, HTTP request/response lifecycle, status codes, and REST semantics.",
    targets: { csharp: 5, sql: 5, dsa: 4, special: 4 },
    milestone: null,
    topics: [
      { id: "w9-t1", title: "Git Fundamentals: Staging, Commits, Branches, and History", time: "60m", diff: "Easy" },
      { id: "w9-t2", title: "Branching Strategies, Pull Requests & Merge Conflict Resolution", time: "60m", diff: "Medium" },
      { id: "w9-t3", title: "HTTP Protocol: Headers, Verbs (GET, POST, PUT, DELETE, PATCH)", time: "60m", diff: "Medium" },
      { id: "w9-t4", title: "HTTP Status Codes (200, 201, 204, 400, 401, 403, 404, 409, 500)", time: "45m", diff: "Easy" },
      { id: "w9-t5", title: "RESTful API Architectural Constraints & Resource Modeling", time: "60m", diff: "Medium" }
    ],
    special_questions: [
      "How do you resolve a Git merge conflict in an appsettings.json file safely?",
      "Distinguish between PUT (idempotent replacement) and PATCH (partial update).",
      "Why is a 401 Unauthorized different from a 403 Forbidden in a staff leave API?",
      "Design RESTful endpoint URIs for university student fees and course enrolments."
    ]
  },
  {
    week_number: 10,
    phase_id: 3,
    title: "ASP.NET Core Architecture, Controllers & Routing",
    description: "Build Web API projects from scratch, configure Program.cs, map controller routes, handle query/path/body params, and explore Swagger/OpenAPI.",
    targets: { csharp: 5, sql: 5, dsa: 4, special: 4 },
    milestone: null,
    topics: [
      { id: "w10-t1", title: "ASP.NET Core Architecture & WebApplicationBuilder", time: "60m", diff: "Medium" },
      { id: "w10-t2", title: "API Controllers, ControllerBase, and [ApiController] Attribute", time: "60m", diff: "Medium" },
      { id: "w10-t3", title: "Attribute Routing: Route Templates, Constraints & Parameters", time: "60m", diff: "Medium" },
      { id: "w10-t4", title: "ActionResult<T> and Standard API Response Envelopes", time: "45m", diff: "Medium" },
      { id: "w10-t5", title: "Configuring Swagger / OpenAPI for Interactive API Documentation", time: "45m", diff: "Easy" }
    ],
    special_questions: [
      "What does the [ApiController] attribute do automatically in ASP.NET Core?",
      "How do you return appropriate HTTP status codes (201 Created with Location header)?",
      "What happens if two route templates match the same incoming HTTP request?",
      "How do you configure Swagger to show XML documentation comments on API endpoints?"
    ]
  },
  {
    week_number: 11,
    phase_id: 3,
    title: "Dependency Injection, Middleware, DTOs & Validation",
    description: "Configure IoC container with Transient/Scoped/Singleton lifetimes, custom middleware pipeline, Data Transfer Objects, FluentValidation, and global error handling.",
    targets: { csharp: 5, sql: 5, dsa: 4, special: 4 },
    milestone: null,
    topics: [
      { id: "w11-t1", title: "Dependency Injection: Inversion of Control & Microsoft.Extensions.DI", time: "60m", diff: "Medium" },
      { id: "w11-t2", title: "Service Lifetimes: Transient vs Scoped vs Singleton (Captive Dependencies)", time: "75m", diff: "Hard" },
      { id: "w11-t3", title: "Middleware Pipeline: Request Delegates, next(), and Execution Order", time: "60m", diff: "Medium" },
      { id: "w11-t4", title: "DTO Pattern: Separating Domain Entities from API Contracts", time: "45m", diff: "Medium" },
      { id: "w11-t5", title: "Model Validation: DataAnnotations & FluentValidation", time: "60m", diff: "Medium" },
      { id: "w11-t6", title: "Global Exception Handling: ProblemDetails and Custom Middleware", time: "60m", diff: "Medium" }
    ],
    special_questions: [
      "What is a captive dependency, and why is injecting Scoped into Singleton dangerous?",
      "Why must Exception Handling Middleware be registered at the very top of the pipeline?",
      "Why should database domain entities never be exposed directly in API controller responses?",
      "Implement a global exception middleware that outputs RFC 7807 ProblemDetails."
    ]
  },
  {
    week_number: 12,
    phase_id: 3,
    title: "Entity Framework Core, DbContext & Milestone 3",
    description: "Design relational models with EF Core, run Code-First migrations, configure relationships via Fluent API, AsNoTracking(), and pagination.",
    targets: { csharp: 5, sql: 5, dsa: 4, special: 4 },
    milestone: "Milestone 3: ASP.NET Core Web API with SQL Server and EF Core",
    topics: [
      { id: "w12-t1", title: "EF Core Architecture, DbContext, and DbSet<T>", time: "60m", diff: "Medium" },
      { id: "w12-t2", title: "Database Connections, Connection Strings & User Secrets", time: "45m", diff: "Easy" },
      { id: "w12-t3", title: "Code-First Migrations: Add, Remove, and Update Database", time: "60m", diff: "Medium" },
      { id: "w12-t4", title: "Configuring Relationships: 1-to-1, 1-to-Many, Many-to-Many with Fluent API", time: "75m", diff: "Hard" },
      { id: "w12-t5", title: "Change Tracking: AsNoTracking() vs Tracked Queries", time: "60m", diff: "Medium" },
      { id: "w12-t6", title: "Safe Pagination with Skip and Take", time: "45m", diff: "Medium" }
    ],
    special_questions: [
      "Why does AsNoTracking() improve read performance in read-only API endpoints?",
      "How do you handle shadow properties and foreign key constraints in Fluent API?",
      "What is the difference between client evaluation and server evaluation in EF Core?",
      "Implement keyset pagination (cursor-based) vs offset pagination (Skip/Take) for large tables."
    ]
  },

  // --- Phase 4: Authentication, Testing & Real API Development ---
  {
    week_number: 13,
    phase_id: 4,
    title: "JWT Authentication, Authorization, Roles & Policies",
    description: "Implement secure user authentication with JWT Bearer tokens, claims, role-based authorization, policy-based requirements, and password hashing.",
    targets: { csharp: 5, sql: 4, dsa: 5, special: 4 },
    milestone: null,
    topics: [
      { id: "w13-t1", title: "Authentication vs Authorization Concepts in Web APIs", time: "45m", diff: "Easy" },
      { id: "w13-t2", title: "JSON Web Tokens (JWT): Header, Payload, Signature, and Claims", time: "60m", diff: "Medium" },
      { id: "w13-t3", title: "Configuring JwtBearer in ASP.NET Core Program.cs", time: "60m", diff: "Medium" },
      { id: "w13-t4", title: "Password Hashing: BCrypt / PBKDF2 / Argon2 and Salt", time: "60m", diff: "Medium" },
      { id: "w13-t5", title: "Role-Based & Policy-Based Authorization ([Authorize(Roles = ...)])", time: "60m", diff: "Medium" }
    ],
    special_questions: [
      "Why is symmetric key signing vulnerable if the secret key is less than 256 bits?",
      "How do you safely extract the current user's TenantId and UserId from HttpContext.User.Claims?",
      "Why should sensitive data (passwords, salaries) never be stored in a JWT payload?",
      "How to implement token refresh rotation to prevent stale or compromised sessions?"
    ]
  },
  {
    week_number: 14,
    phase_id: 4,
    title: "Automated Testing with xUnit, Moq & Integration Tests",
    description: "Write unit tests for business logic using xUnit and Moq, design test data builders, and build integration tests with WebApplicationFactory.",
    targets: { csharp: 5, sql: 4, dsa: 5, special: 4 },
    milestone: null,
    topics: [
      { id: "w14-t1", title: "Testing Pyramid: Unit Tests, Integration Tests, End-to-End Tests", time: "45m", diff: "Easy" },
      { id: "w14-t2", title: "Writing Clean Unit Tests with xUnit: [Fact] and [Theory]", time: "60m", diff: "Medium" },
      { id: "w14-t3", title: "Mocking Dependencies with Moq: Setup, Returns, and Verify", time: "75m", diff: "Hard" },
      { id: "w14-t4", title: "Integration Testing APIs with WebApplicationFactory<Program>", time: "75m", diff: "Hard" },
      { id: "w14-t5", title: "Test Data Builders and In-Memory / Test Database Strategies", time: "60m", diff: "Medium" }
    ],
    special_questions: [
      "How do you verify with Moq that a repository method was called exactly once?",
      "Why is mocking an EF Core DbContext directly discouraged compared to repository abstractions?",
      "Test edge cases where salary calculation throws InsufficientWorkingDaysException.",
      "How to set up an in-memory SQL database for integration tests that isolate state between test runs?"
    ]
  },
  {
    week_number: 15,
    phase_id: 4,
    title: "Asynchronous Programming (async/await), Task & Cancellation",
    description: "Master the state machine behind async/await, Task, Task.WhenAll, CancellationToken passing to database operations, and background hosted services.",
    targets: { csharp: 5, sql: 4, dsa: 5, special: 4 },
    milestone: null,
    topics: [
      { id: "w15-t1", title: "Thread Pool, Asynchronous I/O vs CPU-bound Work", time: "60m", diff: "Medium" },
      { id: "w15-t2", title: "async and await: State Machine & Execution Flow", time: "75m", diff: "Hard" },
      { id: "w15-t3", title: "Avoiding Deadlocks: sync-over-async and .Result Anti-pattern", time: "60m", diff: "Hard" },
      { id: "w15-t4", title: "CancellationToken: Graceful Request Cancellation in EF Core", time: "60m", diff: "Medium" },
      { id: "w15-t5", title: "Background Processing with BackgroundService and IHostedService", time: "60m", diff: "Medium" }
    ],
    special_questions: [
      "Why does calling .Result or .Wait() on a Task cause thread pool starvation or deadlocks?",
      "What happens to a running SQL query if the client disconnects and CancellationToken is passed?",
      "How do you process multiple independent external API calls concurrently using Task.WhenAll?",
      "Design a background worker that executes nightly attendance aggregation safely within a scoped service."
    ]
  },
  {
    week_number: 16,
    phase_id: 4,
    title: "Module Integration & Staff and Leave Management API Milestone",
    description: "Assemble authentication, database entities, repository layers, business services, approval workflows, and complete Milestone 4.",
    targets: { csharp: 5, sql: 4, dsa: 5, special: 4 },
    milestone: "Milestone 4: Staff and Leave Management API Complete",
    topics: [
      { id: "w16-t1", title: "Leave Management Business Rules & State Machine (Pending, Approved, Rejected)", time: "60m", diff: "Medium" },
      { id: "w16-t2", title: "Multi-level Approval Hierarchy (Manager -> HR)", time: "60m", diff: "Hard" },
      { id: "w16-t3", title: "Leave Balance Deductions and Concurrency Locks", time: "75m", diff: "Hard" },
      { id: "w16-t4", title: "Comprehensive Postman / HTTP File Test Suite", time: "45m", diff: "Easy" },
      { id: "w16-t5", title: "Project Milestone: Staff and Leave API Deployment & Verification", time: "90m", diff: "Hard" }
    ],
    special_questions: [
      "How do you prevent two concurrent leave requests from double-spending the same remaining leave balance?",
      "What is the recommended transactional design for approving leave and creating attendance records?",
      "How to design an audit log entity that tracks every status change, timestamp, and actor ID?",
      "Explain the complete request flow from client JWT header to database commit in the Staff API."
    ]
  },

  // --- Phase 5: Advanced Software Engineering ---
  {
    week_number: 17,
    phase_id: 5,
    title: "Clean Architecture, SOLID Principles & Refactoring",
    description: "Organize solutions into Domain, Application, Infrastructure, and Presentation layers; adhere to SOLID principles; refactor legacy ERP patterns.",
    targets: { csharp: 3, sql: 5, dsa: 5, special: 4 },
    milestone: null,
    topics: [
      { id: "w17-t1", title: "Clean Architecture: Onion / Hexagonal Architecture Layers", time: "60m", diff: "Medium" },
      { id: "w17-t2", title: "SOLID Principles with C# Real-World Backend Examples", time: "75m", diff: "Hard" },
      { id: "w17-t3", title: "Separation of Concerns: CQRS Intro with MediatR (Optional)", time: "60m", diff: "Hard" },
      { id: "w17-t4", title: "Refactoring Legacy ASP.NET Web Forms Anti-patterns to Clean Services", time: "60m", diff: "Medium" },
      { id: "w17-t5", title: "Domain Entities vs Value Objects vs DTOs", time: "45m", diff: "Medium" }
    ],
    special_questions: [
      "Explain the Dependency Inversion Principle using an IEmailNotificationService example.",
      "Why must the Domain project have zero external dependencies in Clean Architecture?",
      "Refactor a 500-line ERP controller method that mixes SQL queries, validation, and email sending.",
      "How does the Single Responsibility Principle improve testability of payroll calculation modules?"
    ]
  },
  {
    week_number: 18,
    phase_id: 5,
    title: "SQL Indexing, Execution Plans & Query Optimization",
    description: "Master Clustered vs Non-Clustered indexes, composite indexes, covering indexes with INCLUDE, analyzing Graphical Execution Plans, and solving N+1 query bugs.",
    targets: { csharp: 3, sql: 5, dsa: 5, special: 4 },
    milestone: null,
    topics: [
      { id: "w18-t1", title: "SQL Server Storage Engine: Pages, Extents & B-Trees", time: "60m", diff: "Hard" },
      { id: "w18-t2", title: "Clustered vs Non-Clustered Indexes & Heap Tables", time: "60m", diff: "Medium" },
      { id: "w18-t3", title: "Covering Indexes with INCLUDE Columns & Index Key Order", time: "75m", diff: "Hard" },
      { id: "w18-t4", title: "Reading SQL Server Execution Plans: Scans vs Seeks, Key Lookups", time: "75m", diff: "Hard" },
      { id: "w18-t5", title: "SARGable Queries & Avoiding Implicit Data Type Conversions", time: "60m", diff: "Medium" },
      { id: "w18-t6", title: "Diagnosing and Fixing the N+1 Query Problem in EF Core (.Include())", time: "60m", diff: "Hard" }
    ],
    special_questions: [
      "Why does SELECT * prevent the query optimizer from using a covering index?",
      "What is the difference between an Index Seek and an Index Scan in an execution plan?",
      "Why does WHERE YEAR(JoiningDate) = 2024 cause an index scan, and how to write it SARGable?",
      "How do you detect and eliminate N+1 queries when loading employees with their attendance records?"
    ]
  },
  {
    week_number: 19,
    phase_id: 5,
    title: "ACID Transactions, Isolation Levels & Concurrency",
    description: "Explore ACID guarantees, Read Uncommitted, Read Committed, Repeatable Read, Serializable, Snapshot isolation, row-locking, and optimistic concurrency with RowVersion.",
    targets: { csharp: 3, sql: 5, dsa: 5, special: 4 },
    milestone: null,
    topics: [
      { id: "w19-t1", title: "ACID Properties in Enterprise Database Transactions", time: "45m", diff: "Medium" },
      { id: "w19-t2", title: "Transaction Isolation Levels: Dirty Reads, Non-repeatable Reads, Phantoms", time: "75m", diff: "Hard" },
      { id: "w19-t3", title: "SQL Server Locks: Shared, Exclusive, Intent, and Deadlock Graphs", time: "75m", diff: "Hard" },
      { id: "w19-t4", title: "Pessimistic Locking vs Optimistic Concurrency Control", time: "60m", diff: "Medium" },
      { id: "w19-t5", title: "Implementing Optimistic Concurrency in EF Core with [Timestamp] / RowVersion", time: "60m", diff: "Hard" }
    ],
    special_questions: [
      "Two HR officers approve the same leave application simultaneously. How does RowVersion prevent a double approval?",
      "Explain how a SQL Server Deadlock occurs between two transactions updating Employees and Departments.",
      "When is Snapshot Isolation preferred over Read Committed, and what are the tempdb overheads?",
      "How do you handle DbUpdateConcurrencyException in an ASP.NET Core controller and return HTTP 409 Conflict?"
    ]
  },
  {
    week_number: 20,
    phase_id: 5,
    title: "OWASP Top 10, API Security & Hardening Milestone",
    description: "Defend against SQL Injection, XSS, CSRF, broken access control, CORS misconfigurations, secrets leakage, implement rate limiting, and complete Milestone 5.",
    targets: { csharp: 3, sql: 5, dsa: 5, special: 4 },
    milestone: "Milestone 5: Enterprise Hardening: Clean Architecture, Indexing & Security",
    topics: [
      { id: "w20-t1", title: "OWASP Top 10 for Backend Engineers (Broken Auth, Injections, SSRF)", time: "60m", diff: "Medium" },
      { id: "w20-t2", title: "Parameterized Queries vs Dynamic SQL & EF Core Raw SQL Safety", time: "60m", diff: "Medium" },
      { id: "w20-t3", title: "Cross-Origin Resource Sharing (CORS) Policy Configuration", time: "45m", diff: "Easy" },
      { id: "w20-t4", title: "Secrets Management: appsettings vs Environment Variables vs Azure KeyVault", time: "45m", diff: "Medium" },
      { id: "w20-t5", title: "ASP.NET Core Rate Limiting Middleware (Sliding Window, Fixed Window)", time: "60m", diff: "Medium" },
      { id: "w20-t6", title: "Security Headers (HSTS, Content-Security-Policy, X-Frame-Options)", time: "45m", diff: "Easy" }
    ],
    special_questions: [
      "Demonstrate how a string-concatenated SQL query allows SQL Injection and rewrite it using SqlCommand parameters.",
      "Why is CORS not a security boundary against curl or backend HTTP clients?",
      "How do you implement IP-based or User-based rate limiting on sensitive login and payroll endpoints?",
      "Audit your codebase to ensure no connection strings or JWT secret keys are committed to Git."
    ]
  },

  // --- Phase 6: Production Backend Engineering ---
  {
    week_number: 21,
    phase_id: 6,
    title: "Redis Distributed Caching & Performance",
    description: "Integrate Redis for distributed caching, understand Cache-Aside pattern, cache invalidation strategies, Redis data types (strings, hashes, sets), and distributed locks.",
    targets: { csharp: 3, sql: 3, dsa: 5, special: 4 },
    milestone: null,
    topics: [
      { id: "w21-t1", title: "In-Memory Caching (IMemoryCache) vs Distributed Caching (Redis)", time: "60m", diff: "Medium" },
      { id: "w21-t2", title: "Redis Architecture, Data Types & CLI Commands", time: "60m", diff: "Medium" },
      { id: "w21-t3", title: "Cache-Aside Pattern Implementation with StackExchange.Redis & IDistributedCache", time: "75m", diff: "Hard" },
      { id: "w21-t4", title: "Cache Invalidation Strategies: TTL, Event-based Eviction, Cache Stampede", time: "60m", diff: "Hard" },
      { id: "w21-t5", title: "Distributed Locking with RedLock in High-Throughput Scenarios", time: "60m", diff: "Hard" }
    ],
    special_questions: [
      "What is a Cache Stampede (Thundering Herd) and how does probabilistic early expiration or locking solve it?",
      "How do you invalidate cached employee profiles when HR updates salary or designation?",
      "Why must serialized cache objects avoid circular entity references?",
      "Compare Redis key expiration strategies (sliding expiration vs absolute expiration)."
    ]
  },
  {
    week_number: 22,
    phase_id: 6,
    title: "Docker Containerization & Docker Compose",
    description: "Write production-grade multi-stage Dockerfiles for ASP.NET Core, manage container lifecycles, configure networking, volumes, and orchestrate SQL Server + Redis via Compose.",
    targets: { csharp: 3, sql: 3, dsa: 5, special: 4 },
    milestone: null,
    topics: [
      { id: "w22-t1", title: "Containerization Fundamentals: Containers vs Virtual Machines", time: "45m", diff: "Easy" },
      { id: "w22-t2", title: "Writing Multi-Stage Dockerfiles for .NET (Build, Publish, Runtime)", time: "60m", diff: "Medium" },
      { id: "w22-t3", title: "Container Networking, Port Mapping & Volume Persistence", time: "60m", diff: "Medium" },
      { id: "w22-t4", title: "Docker Compose: Orchestrating API + SQL Server + Redis Containers", time: "75m", diff: "Hard" },
      { id: "w22-t5", title: "Managing Secrets and Environment Variables in Containers", time: "45m", diff: "Medium" }
    ],
    special_questions: [
      "Why does a multi-stage Dockerfile drastically reduce the final production container image size?",
      "How do you configure connection strings in docker-compose so the API container talks to the SQL container by service name?",
      "What happens to database data inside a container if named volumes are not configured?",
      "How to set up non-root user execution in an ASP.NET Core Docker container for security?"
    ]
  },
  {
    week_number: 23,
    phase_id: 6,
    title: "CI/CD Pipelines with GitHub Actions",
    description: "Automate build verification, unit/integration test execution, linting, code coverage checks, and container image generation using GitHub Actions workflows.",
    targets: { csharp: 3, sql: 3, dsa: 5, special: 4 },
    milestone: null,
    topics: [
      { id: "w23-t1", title: "CI/CD Core Concepts: Continuous Integration vs Continuous Delivery", time: "45m", diff: "Easy" },
      { id: "w23-t2", title: "GitHub Actions Architecture: Workflows, Jobs, Steps, Runners & Triggers", time: "60m", diff: "Medium" },
      { id: "w23-t3", title: "Writing a .NET Build & Test Workflow (.github/workflows/ci.yml)", time: "60m", diff: "Medium" },
      { id: "w23-t4", title: "Automated Testing & Code Coverage Reports in Pull Requests", time: "60m", diff: "Medium" },
      { id: "w23-t5", title: "Building and Publishing Docker Images to GitHub Container Registry", time: "60m", diff: "Hard" }
    ],
    special_questions: [
      "How do you prevent pull requests from merging if automated xUnit tests fail in GitHub Actions?",
      "How to use GitHub Actions Secrets to store sensitive deployment credentials securely?",
      "Configure dependency caching (NuGet packages) in your workflow to cut build times by 70%.",
      "Write a workflow step that automatically runs EF Core database migration bundles in staging."
    ]
  },
  {
    week_number: 24,
    phase_id: 6,
    title: "Production Observability, Logging, Metrics & Milestone 6",
    description: "Implement structured logging with Serilog, correlation IDs for distributed tracing, ASP.NET Core Health Checks, and complete Milestone 6.",
    targets: { csharp: 3, sql: 3, dsa: 5, special: 4 },
    milestone: "Milestone 6: Dockerized Backend with Automated CI/CD Pipeline",
    topics: [
      { id: "w24-t1", title: "Structured Logging with Serilog: JSON Sinks, Enrichers & Log Levels", time: "60m", diff: "Medium" },
      { id: "w24-t2", title: "Correlation ID Middleware for End-to-End Request Tracing", time: "60m", diff: "Medium" },
      { id: "w24-t3", title: "ASP.NET Core Health Checks (/health/live, /health/ready with DB & Redis checks)", time: "60m", diff: "Medium" },
      { id: "w24-t4", title: "Application Metrics: Prometheus / OpenTelemetry Fundamentals", time: "60m", diff: "Hard" },
      { id: "w24-t5", title: "Production Deployment Checklist & Zero-Downtime Strategies", time: "60m", diff: "Hard" }
    ],
    special_questions: [
      "Why is structured logging in JSON superior to plain text logs in production log analyzers (ELK/Seq)?",
      "Explain the distinction between a liveness probe and a readiness probe in container orchestration.",
      "How do you trace a single HTTP request across multiple services using an X-Correlation-ID header?",
      "Deploy your containerized API and run automated smoke tests against the live endpoints."
    ]
  },

  // --- Phase 7: Advanced Architecture & Multi-Tenancy ---
  {
    week_number: 25,
    phase_id: 7,
    title: "System Design Fundamentals & Capacity Estimation",
    description: "Formulate functional vs non-functional requirements, back-of-the-envelope capacity estimations (QPS, storage, bandwidth), load balancing, and API gateway design.",
    targets: { csharp: 2, sql: 3, dsa: 6, special: 4 },
    milestone: null,
    topics: [
      { id: "w25-t1", title: "System Design Framework: Requirements, Boundaries, APIs & Data Models", time: "60m", diff: "Medium" },
      { id: "w25-t2", title: "Back-of-the-Envelope Capacity Estimation (QPS, Peak Traffic, Storage)", time: "60m", diff: "Hard" },
      { id: "w25-t3", title: "Horizontal vs Vertical Scaling, Load Balancers (L4 vs L7)", time: "60m", diff: "Medium" },
      { id: "w25-t4", title: "Database Partitioning, Sharding & Read Replicas", time: "75m", diff: "Hard" },
      { id: "w25-t5", title: "API Gateway Pattern: Routing, Rate Limiting, SSL Termination", time: "60m", diff: "Medium" }
    ],
    special_questions: [
      "Estimate storage, memory, and bandwidth for 50 university tenants with 200,000 total students.",
      "How do you design a database read replica architecture for heavy attendance reporting queries?",
      "Compare Layer 4 (Transport) vs Layer 7 (Application) load balancing for Web APIs.",
      "How do you prevent a single runaway tenant from consuming all database connection pool resources?"
    ]
  },
  {
    week_number: 26,
    phase_id: 7,
    title: "Multi-Tenant Architecture & Data Isolation",
    description: "Implement SaaS multi-tenancy models: Database-per-Tenant vs Shared Database with TenantId (Global Query Filters), tenant resolution middleware, and security.",
    targets: { csharp: 2, sql: 3, dsa: 6, special: 4 },
    milestone: null,
    topics: [
      { id: "w26-t1", title: "Multi-Tenancy Models: Separate DB vs Separate Schema vs Shared DB", time: "75m", diff: "Hard" },
      { id: "w26-t2", title: "Tenant Resolution Strategies: Subdomain, Request Header, or JWT Claim", time: "60m", diff: "Medium" },
      { id: "w26-t3", title: "Implementing EF Core Global Query Filters (HasQueryFilter(e => e.TenantId == ...))", time: "75m", diff: "Hard" },
      { id: "w26-t4", title: "Dynamic DbContext Connection String Resolution per Tenant", time: "75m", diff: "Hard" },
      { id: "w26-t5", title: "Cross-Tenant Data Leakage Prevention & Automated Security Tests", time: "60m", diff: "Hard" }
    ],
    special_questions: [
      "How does EF Core's Global Query Filter prevent developer error from leaking tenant records?",
      "What are the compliance and backup implications of Database-per-Tenant vs Shared-Database?",
      "How do you bypass a global query filter safely for platform super-admin reports using IgnoreQueryFilters()?",
      "Design tenant onboarding logic that provisions a new tenant and runs migrations automatically."
    ]
  },
  {
    week_number: 27,
    phase_id: 7,
    title: "Message Queues, Event-Driven Architecture & Outbox Pattern",
    description: "Design decoupled event-driven systems using RabbitMQ/Azure Service Bus, guarantee at-least-once delivery with Transactional Outbox pattern, and implement idempotency.",
    targets: { csharp: 2, sql: 3, dsa: 6, special: 4 },
    milestone: null,
    topics: [
      { id: "w27-t1", title: "Synchronous REST vs Asynchronous Event-Driven Messaging", time: "60m", diff: "Medium" },
      { id: "w27-t2", title: "Message Broker Fundamentals: Producers, Exchanges, Queues, Consumers", time: "60m", diff: "Medium" },
      { id: "w27-t3", title: "The Dual-Write Problem and the Transactional Outbox Pattern", time: "75m", diff: "Hard" },
      { id: "w27-t4", title: "Idempotent Message Consumers: Handling Duplicate Messages Gracefully", time: "60m", diff: "Hard" },
      { id: "w27-t5", title: "Dead-Letter Queues (DLQ), Poison Messages, and Retry Backoff Strategies", time: "60m", diff: "Medium" }
    ],
    special_questions: [
      "Explain the dual-write bug when saving payroll to SQL and publishing an event to RabbitMQ.",
      "How does an IdempotencyKey header or processed_messages table prevent duplicate payment execution?",
      "Describe the Transactional Outbox pattern with OutboxMessages table and background poller.",
      "What is exponential backoff with jitter and how does it prevent overwhelming recovering downstream services?"
    ]
  },
  {
    week_number: 28,
    phase_id: 7,
    title: "High-Volume Imports, Bulk Processing & Multi-Tenant Milestone",
    description: "Implement resilient bulk data imports with row-level error handling, SqlBulkCopy / EF Core BulkExtensions, distributed tracing, and complete Milestone 7.",
    targets: { csharp: 2, sql: 3, dsa: 6, special: 4 },
    milestone: "Milestone 7: Multi-Tenant ERP Backend Platform Complete",
    topics: [
      { id: "w28-t1", title: "High-Volume Data Ingestion: Processing 100,000 Attendance Rows Efficiently", time: "75m", diff: "Hard" },
      { id: "w28-t2", title: "SqlBulkCopy vs Batch Inserts: Memory Usage and Performance", time: "75m", diff: "Hard" },
      { id: "w28-t3", title: "Row-Level Error Handling: Segregating Valid Records from Faulty Records", time: "60m", diff: "Medium" },
      { id: "w28-t4", title: "Distributed Tracing with OpenTelemetry and Jaeger", time: "60m", diff: "Hard" },
      { id: "w28-t5", title: "Project Milestone: Multi-Tenant ERP Final Review and Demo", time: "90m", diff: "Hard" }
    ],
    special_questions: [
      "Why does inserting 50,000 entities via standard DbContext.Add() exhaust memory and take minutes?",
      "How to design an import batch job that imports 99 valid rows and writes 1 faulty row to an errors table?",
      "Explain how your Multi-Tenant ERP handles tenant-specific payroll rule execution concurrently.",
      "How would you explain the complete architecture of this platform to an enterprise hiring manager?"
    ]
  },

  // --- Phase 8: MNC Interview Readiness ---
  {
    week_number: 29,
    phase_id: 8,
    title: "Linear Data Structures & Two-Pointer DSA Sprint",
    description: "Master high-frequency interview patterns: Two Pointers, Sliding Window, Prefix Sums, HashMap lookups, and conduct a timed C# coding interview.",
    targets: { csharp: 1, sql: 5, dsa: 8, special: 4 },
    milestone: null,
    topics: [
      { id: "w29-t1", title: "Two Pointers Pattern (Sorted Arrays, Trapping Rain Water, 3Sum)", time: "60m", diff: "Medium" },
      { id: "w29-t2", title: "Sliding Window Pattern (Longest Substring Without Repeating Characters)", time: "60m", diff: "Hard" },
      { id: "w29-t3", title: "Prefix Sum & Subarray Sum Equals K with HashMap", time: "60m", diff: "Medium" },
      { id: "w29-t4", title: "Binary Search Variations (First/Last Occurrence, Rotated Sorted Array)", time: "60m", diff: "Medium" },
      { id: "w29-t5", title: "Mock Technical Interview 1: C# & Live Problem Solving", time: "60m", diff: "Hard" }
    ],
    special_questions: [
      "Solve Two Sum in O(n) time and O(n) space using Dictionary<int, int>.",
      "Explain how the Sliding Window technique reduces time complexity from O(n^2) to O(n).",
      "Write SQL query to find the N-th highest salary using DENSE_RANK() vs subqueries.",
      "Live Coding Practice: Implement an LRU Cache in C# using Dictionary and Doubly Linked List."
    ]
  },
  {
    week_number: 30,
    phase_id: 8,
    title: "Non-Linear DSA (Trees, BST, Heaps) & .NET Deep Dive",
    description: "Master Tree traversals (In-order, Pre-order, Post-order, Level-order), BST validation, PriorityQueue / Heaps for Top-K problems, and .NET runtime internals.",
    targets: { csharp: 1, sql: 5, dsa: 8, special: 4 },
    milestone: null,
    topics: [
      { id: "w30-t1", title: "Binary Tree Traversals (Recursive & Iterative BFS / DFS)", time: "60m", diff: "Medium" },
      { id: "w30-t2", title: "Binary Search Tree (Validate BST, LCA of BST, Inorder Successor)", time: "60m", diff: "Medium" },
      { id: "w30-t3", title: "Heaps and PriorityQueue<TElement, TPriority> in .NET 6+", time: "60m", diff: "Hard" },
      { id: "w30-t4", title: "Top-K Frequent Elements & K-th Largest Element in an Array", time: "60m", diff: "Hard" },
      { id: "w30-t5", title: "Mock Technical Interview 2: .NET Runtime, GC & Async Scenarios", time: "60m", diff: "Hard" }
    ],
    special_questions: [
      "Explain how .NET Garbage Collection generational collection (Gen 0, 1, 2) works.",
      "Find the Lowest Common Ancestor of two nodes in a Binary Search Tree in O(h).",
      "Explain the exact difference between boxing/unboxing and its GC allocation penalty.",
      "Write SQL query using CTE to find all direct and indirect reportees of an employee."
    ]
  },
  {
    week_number: 31,
    phase_id: 8,
    title: "Graphs, Dynamic Programming Intro & System Design Mock",
    description: "Master Graph representation, BFS/DFS algorithms, Cycle Detection, introduction to Dynamic Programming (memoization & tabulation), and conduct a System Design mock.",
    targets: { csharp: 1, sql: 5, dsa: 8, special: 4 },
    milestone: null,
    topics: [
      { id: "w31-t1", title: "Graph Representations (Adjacency Matrix vs Adjacency List)", time: "60m", diff: "Medium" },
      { id: "w31-t2", title: "Graph Traversals: BFS for Shortest Path & DFS for Connected Components", time: "60m", diff: "Hard" },
      { id: "w31-t3", title: "Cycle Detection in Directed and Undirected Graphs", time: "60m", diff: "Hard" },
      { id: "w31-t4", title: "Intro to Dynamic Programming: Climbing Stairs & Coin Change", time: "75m", diff: "Hard" },
      { id: "w31-t5", title: "Mock Technical Interview 3: Scalable Multi-Tenant System Design", time: "60m", diff: "Hard" }
    ],
    special_questions: [
      "How do you detect a deadlock cycle in a transaction dependency graph using DFS?",
      "Solve Course Schedule (Topological Sort / Kahn's Algorithm) in O(V + E).",
      "Design a URL Shortener or Notification Service in a 45-minute architectural interview.",
      "How do you handle schema migrations across 100 enterprise tenants with zero downtime?"
    ]
  },
  {
    week_number: 32,
    phase_id: 8,
    title: "Comprehensive Timed Assessments, Resume & Final Readiness",
    description: "Execute mixed timed assessments, production debugging simulations, resume polish with verified project metrics, and complete 3 mock interviews.",
    targets: { csharp: 3, sql: 5, dsa: 8, special: 4 },
    milestone: "Milestone 8: Production Portfolio & MNC Interview Readiness Complete",
    topics: [
      { id: "w32-t1", title: "Production Incident Debugging Simulation (Memory Leaks, CPU Spikes)", time: "60m", diff: "Hard" },
      { id: "w32-t2", title: "MNC Resume Refinement: Highlighting ERP Experience + Modern .NET Stack", time: "60m", diff: "Medium" },
      { id: "w32-t3", title: "Behavioral & Leadership Principles (STAR Method: Situation, Task, Action, Result)", time: "60m", diff: "Medium" },
      { id: "w32-t4", title: "Negotiating Offers and Evaluating Employment Contracts", time: "45m", diff: "Easy" },
      { id: "w32-t5", title: "Full 3-Round Mock Interview Series (Coding, Design, HR/Cultural)", time: "90m", diff: "Hard" }
    ],
    special_questions: [
      "Walk me through an incident where a production database query slowed down an ERP module and how you fixed it.",
      "How do you answer 'Tell me about yourself' linking Web Forms experience to modern ASP.NET Core Clean Architecture?",
      "Explain the exact business and technical trade-offs you made in your Multi-Tenant ERP project.",
      "How do you respond when asked why you are transitioning from your current company to an MNC?"
    ]
  }
];

// Dynamically compute roadmap statistics from actual seeded weeks
export function getRoadmapStats() {
  let totalWeeks = WEEKS.length;
  let totalCsharp = 0;
  let totalSql = 0;
  let totalDsa = 0;
  let totalMilestones = 0;
  let totalTopics = 0;

  for (const w of WEEKS) {
    totalCsharp += w.targets.csharp || 0;
    totalSql += w.targets.sql || 0;
    totalDsa += w.targets.dsa || 0;
    totalTopics += (w.topics ? w.topics.length : 0);
    if (w.milestone) totalMilestones++;
  }

  return {
    totalWeeks,
    totalPhases: PHASES.length,
    totalTopics,
    totalCsharp,
    totalSql,
    totalDsa,
    totalCodingProblems: totalCsharp + totalSql + totalDsa,
    totalMilestones,
    weeklyTargetHours: 12,
    totalRoadmapHours: totalWeeks * 12
  };
}

