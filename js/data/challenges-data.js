/**
 * challenges-data.js - 32 Weekly Practical Coding Challenges
 * Real-world enterprise backend scenarios with business context, requirements,
 * constraints, input/output specifications, edge cases, evaluation checklists,
 * and user submission tracking.
 */

export const WEEKLY_CHALLENGES = {
  1: {
    week_number: 1,
    title: "Robust Employee Input Validator & Memory Diagnostic CLI",
    business_context: "Before calculating payroll, HR enters new staff onboarding records. The console application must validate dirty user input defensively, compute standard numeric values with decimal precision, and output a memory footprint diagnostic report.",
    requirements: [
      "Accept Employee Code, Full Name, Date of Joining, Basic Salary, and Tax Deduction percentage via console prompts.",
      "Defensively parse all numbers with TryParse; loop gracefully until valid input is received.",
      "Calculate monthly Net Pay and annual Gross Salary using strictly 128-bit `decimal` precision.",
      "Display runtime diagnostics: .NET version, 64-bit status, and memory working set (MB)."
    ],
    constraints: [
      "Zero unhandled exceptions allowed for any user input.",
      "No `double` or `float` types allowed in salary calculations.",
      "Basic salary must be between 10,000 and 1,000,000."
    ],
    input_output: {
      sample_input: "Code: EMP-101\nName: Sujal Padiya\nSalary: 45000.50\nTax: 5.5",
      expected_output: "Gross Annual: 540,006.00\nMonthly Net: 42,525.47\nRuntime: .NET 8.0, Memory: 14.2 MB"
    },
    edge_cases: [
      "User presses Enter with empty string.",
      "User enters negative salary or letters in numeric fields.",
      "Tax percentage entered as '5.5%' or '0.055' or '5.5'."
    ],
    evaluation_checklist: [
      "Does it use decimal throughout?",
      "Does it handle nulls and empty inputs without crashing?",
      "Is MidpointRounding.AwayFromZero configured?",
      "Is the output clearly formatted with currency symbols?"
    ],
    advanced_variation: "Support an optional command line flag `--batch=employees.txt` to read input from a text file."
  },

  2: {
    week_number: 2,
    title: "Biometric Attendance Shift & Overtime Evaluator",
    business_context: "An educational institute records employee daily check-in and check-out timestamps. Build a shift evaluator that determines working hours, late arrivals, half-days, and overtime multipliers based on institute policies.",
    requirements: [
      "Given scheduled shift start (09:00 AM) and shift end (05:00 PM), evaluate daily punch times.",
      "A grace period of 15 minutes is allowed (up to 09:15 AM). Punches after 09:15 AM are marked 'Late'.",
      "Total duration < 4 hours = Absent; 4 to < 7 hours = Half-Day; >= 7 hours = Full Day Present.",
      "Work beyond 05:30 PM qualifies for Overtime (1.5x hourly rate) if total hours exceed 8."
    ],
    constraints: [
      "Avoid nested if-statements using guard clauses or switch expressions.",
      "Use `TimeSpan` and `TimeOnly` for accurate time calculations."
    ],
    input_output: {
      sample_input: "CheckIn: 09:22 AM, CheckOut: 06:15 PM",
      expected_output: "Status: Full Day (Late by 7m)\nWorking Hours: 8h 53m\nOvertime: 45m"
    },
    edge_cases: [
      "Check-out time is earlier than check-in time (night shift crossover).",
      "Missing check-out punch (mark as Incomplete with warning flag).",
      "Punches on declared holidays or weekends."
    ],
    evaluation_checklist: [
      "Clean time calculation using TimeSpan.",
      "Graceful handling of missing punches.",
      "Correct classification into Absent/Half-Day/Present."
    ],
    advanced_variation: "Process a 7-day work week array and calculate cumulative weekly overtime."
  },

  3: {
    week_number: 3,
    title: "Payroll Component Method Refactoring & Array Deduplicator",
    business_context: "A legacy ERP function contains a single 150-line monolithic method calculating basic pay, allowances, deductions, and PF. Refactor this code into clean, testable, single-responsibility methods and clean up duplicate attendance records.",
    requirements: [
      "Decompose calculation into isolated methods: CalculateHra(), CalculatePf(), CalculateTax(), and CalculateNet().",
      "Demonstrate appropriate use of parameter passing: `in` for read-only salary structure, `out` for multiple calculation summary totals.",
      "Implement a method that removes duplicate employee attendance IDs from an array without using LINQ, preserving original order."
    ],
    constraints: [
      "No method longer than 25 lines.",
      "All public methods must include XML documentation comments.",
      "Maintain 100% mathematical parity with original legacy calculations."
    ],
    input_output: {
      sample_input: "Employee with Basic = 50,000, Metro city = true",
      expected_output: "HRA = 25,000 (50%), PF = 6,000, Net = 69,000"
    },
    edge_cases: [
      "Empty array of attendance IDs.",
      "Array with 10,000 elements where all are duplicates of a single ID."
    ],
    evaluation_checklist: [
      "Single Responsibility Principle obeyed.",
      "Appropriate use of out/in/ref parameters.",
      "Efficient deduplication algorithm (O(N) with tracking array or manual scan)."
    ],
    advanced_variation: "Benchmark the deduplication method using BenchmarkDotNet against LINQ .Distinct()."
  },

  4: {
    week_number: 4,
    title: "Employee Salary Calculator Engine (Phase 1 Capstone)",
    business_context: "Build Milestone 1: A production-ready console salary calculator for Indian enterprise payroll. It parses dirty input, computes exact statutory allowances, deducts PF and Professional Tax according to state slabs, and prints an itemized ASCII payslip.",
    requirements: [
      "Employee Master: Code, Name, Department, Month, Year, Total Working Days, Days Worked, Unpaid Leave.",
      "Salary Structure: Basic, HRA (50% metro / 40% non-metro), Conveyance, Special Allowance.",
      "Statutory Deductions: Employee PF (12% of Basic up to statutory ceiling), ESI (if gross <= 21,000), Professional Tax (PT slab).",
      "Render a polished, aligned ASCII payslip table showing Earnings, Deductions, and Net Payable."
    ],
    constraints: [
      "All monetary calculations must use `decimal` with explicit rounding rules.",
      "Configurable PT slabs (e.g. Gujarat / Maharashtra slab definitions).",
      "Clean separation of calculation logic from console presentation."
    ],
    input_output: {
      sample_input: "Basic: 30,000, Metro: Yes, Days in Month: 30, Days Worked: 28, LOP: 2",
      expected_output: "Prorated Basic: 28,000.00\nProrated Gross: 42,000.00\nPF: 3,360.00\nPT: 200.00\nNet: 38,440.00"
    },
    edge_cases: [
      "Mid-month joining (Days worked less than days in month).",
      "Total LOP equals total working days (Net salary must be 0, not negative).",
      "Gross salary exceeds threshold for ESI eligibility."
    ],
    evaluation_checklist: [
      "Prorated calculations match standard enterprise payroll formulas.",
      "ASCII payslip renders cleanly with column alignment.",
      "Zero crashes on extreme values."
    ],
    advanced_variation: "Export the generated payslip to a formatted CSV or text file."
  }
};

// Fallback dynamic challenge generator ensuring all 32 weeks have complete coding challenges
export function getWeeklyChallenge(weekNumber) {
  const num = Number(weekNumber);
  if (WEEKLY_CHALLENGES[num]) {
    return WEEKLY_CHALLENGES[num];
  }

  // Provide custom real-world challenge aligned with week milestones
  const challengeTitles = {
    5: "High-Performance Attendance Deduplication & Department Aggregator",
    6: "Polymorphic Employee Hierarchy & Salary Contract Domain Model",
    7: "Custom Exception Framework & Generic Repository Engine",
    8: "Payroll Console v1 with File & JSON Persistence (Milestone 2)",
    9: "Git Merge Resolution & RESTful Contract Definition for Staff Module",
    10: "ASP.NET Core Staff Controller with Full CRUD & Swagger Documentation",
    11: "Clean Middleware Pipeline, DTO Mapping & FluentValidation Engine",
    12: "EF Core Code-First University Schema with Keyset Pagination (Milestone 3)",
    13: "JWT Authentication & Role/Policy Claims Authorization Server",
    14: "Comprehensive xUnit & Moq Unit Test Suite for Payroll Calculations",
    15: "Asynchronous Bulk Document Processor with CancellationToken",
    16: "Staff and Leave Management API Complete with Approval Flow (Milestone 4)",
    17: "Clean Architecture Solution Refactoring with Domain Separation",
    18: "SQL Index Optimization & N+1 Query Elimination in EF Core",
    19: "Optimistic Concurrency & Deadlock-Resilient Transaction Processor",
    20: "API Hardening: OWASP Top 10, Rate Limiting & Security Headers (Milestone 5)",
    21: "Redis Distributed Cache-Aside Implementation for Staff Profiles",
    22: "Multi-Stage Dockerfile & Docker Compose with SQL Server and Redis",
    23: "GitHub Actions Automated CI/CD Pipeline with Test Coverage Gate",
    24: "Serilog Structured Logging, Correlation IDs & Health Checks (Milestone 6)",
    25: "System Design: Capacity Estimation for 50-Tenant University ERP",
    26: "Multi-Tenant Data Isolation with EF Core Global Query Filters",
    27: "Reliable Event Publishing with RabbitMQ and Transactional Outbox",
    28: "Resilient 100K Attendance Bulk Import with Row Error Recovery (Milestone 7)",
    29: "High-Frequency Linear DSA: Two-Pointer & Sliding Window Sprint",
    30: "Non-Linear DSA: BST & PriorityQueue Top-K Enterprise Problems",
    31: "Graph Cycle Detection & Dynamic Programming Interview Sprint",
    32: "Production Incident Debugging Simulation & Comprehensive Mock Interview (Milestone 8)"
  };

  const title = challengeTitles[num] || `Week ${num} Enterprise Practical Challenge`;

  return {
    week_number: num,
    title: title,
    business_context: `In modern enterprise backend engineering, Week ${num} concepts solve real architectural challenges in scalability, data integrity, and production reliability. This challenge simulates a real workplace problem in university ERP systems.`,
    requirements: [
      `Implement a clean, testable component demonstrating ${title}.`,
      "Separate business logic from presentation and transport layers.",
      "Ensure comprehensive defensive input validation and error handling.",
      "Write unit tests to verify both happy paths and edge cases."
    ],
    constraints: [
      "Follow clean code naming conventions and C# modern idioms.",
      "Ensure zero unhandled exceptions for corrupt or missing data.",
      "Include structured logging or diagnostic output."
    ],
    input_output: {
      sample_input: `Standard enterprise input data for ${title}.`,
      expected_output: `Verified transaction output with clean status code and diagnostic metrics.`
    },
    edge_cases: [
      "Null or corrupted input payloads.",
      "Concurrent modifications and network timeouts.",
      "Boundary limits and empty collections."
    ],
    evaluation_checklist: [
      "Does the code follow clean architecture separation?",
      "Are all edge cases covered with unit tests?",
      "Is performance optimal with minimal allocations?",
      "Is the repository URL and solution note recorded?"
    ],
    advanced_variation: `Benchmark against alternative approaches and document technical trade-offs.`
  };
}

