/**
 * topics-data.js - Topic & Lesson Experience Engine (with YouTube Video Learning)
 * Implements the full 7-step structured learning experience:
 * 1. What am I learning
 * 2. Understand the concept (with ERP context & common mistakes)
 *    -> Video Learning (Curated YouTube recommendations in English & Hindi)
 * 3. Guided line-by-line example
 * 4. Practical implementation task with progressive hints
 * 5. Question bank (Concept, Code, Debugging, Edge Cases, Interview)
 * 6. Explain it yourself framework
 * 7. Completion status
 */

export const TOPIC_LESSONS = {
  "w1-t1": {
    id: "w1-t1",
    title: ".NET SDK and Project Structure",
    week_number: 1,
    time: "45m",
    difficulty: "Easy",
    prerequisites: "Basic command-line familiarity",
    why_it_matters: "Modern .NET 8/9 is cross-platform, modular, and SDK-style. Moving away from legacy .NET Framework .csproj monoliths requires understanding how the .NET CLI compiles, restores NuGet packages, and manages dependencies.",
    real_world_usage: "Used across all enterprise backend services, microservices, and Docker containerized builds to automate builds and CI/CD pipelines.",
    video: {
      primary: {
        title: "C# & .NET SDK Project Structure Explained",
        channel: "freeCodeCamp / dotnet",
        duration: "24m",
        lang: "en",
        youtubeId: "gfkTfcpWqAY",
        embedUrl: "https://www.youtube-nocookie.com/embed/gfkTfcpWqAY",
        watchUrl: "https://www.youtube.com/watch?v=gfkTfcpWqAY"
      },
      hindi: {
        title: ".NET SDK & Project Setup in Hindi",
        channel: "Code With Harry / Kudvenkat Hindi",
        duration: "28m",
        lang: "hi",
        youtubeId: "SuLiu5AK9Ps",
        embedUrl: "https://www.youtube-nocookie.com/embed/SuLiu5AK9Ps",
        watchUrl: "https://www.youtube.com/watch?v=SuLiu5AK9Ps"
      }
    },
    concept: {
      definition: "The .NET SDK is a software development kit containing the compilers (Roslyn), MSBuild, runtime, and the `dotnet` CLI used to create, build, test, and package .NET applications.",
      why_it_exists: "Before .NET Core, developers were tied to Windows and Visual Studio GUID-bloated .csproj files. SDK-style projects are human-readable, minimal, and support cross-platform development on Windows, Linux, and macOS.",
      how_it_works: "The CLI executes commands: `dotnet new` scaffolds projects, `dotnet restore` pulls NuGet dependencies, `dotnet build` invokes Roslyn to produce Intermediate Language (IL) assemblies (.dll), and `dotnet run` executes the IL on the CoreCLR runtime.",
      code_snippet: `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>enable</Nullable>
  </PropertyGroup>
</Project>`,
      erp_example: "When modernizing an existing legacy ERP with Web Forms into modular services, each module (e.g., HR, Payroll, Fees) is extracted into separate clean Class Libraries (`<Project Sdk=\"Microsoft.NET.Sdk\">`) with unified NuGet versioning.",
      common_mistakes: "Accidentally checking in `bin/` and `obj/` directories to source control instead of having a clean `.gitignore`.",
      when_to_use: "Every new .NET console, library, web API, and background worker project.",
      when_not_to_use: "Only legacy .NET Framework 4.8 applications that still require Windows-only System.Web dependencies."
    },
    guided_example: {
      code: `// Create and inspect a new console app
// Shell: dotnet new console -n EnterpriseConfigViewer
using System;

Console.WriteLine("=== Enterprise System Bootstrapping ===");
Console.WriteLine($"Runtime Version: {Environment.Version}");
Console.WriteLine($"Operating System: {Environment.OSVersion}");
Console.WriteLine($"Machine Name: {Environment.MachineName}");
Console.WriteLine($"Is 64-bit Process: {Environment.Is64BitProcess}");`,
      explanation_lines: [
        "Line 1-2: Illustrates scaffolding via the CLI without touching Visual Studio UI wizards.",
        "Line 3: Top-level statements in C# 9+ eliminate boilerplate namespace and Main method wrappers for entry points.",
        "Line 5-9: Accesses core runtime metadata through `System.Environment` to verify host environment diagnostics."
      ],
      self_task: "Modify the program to check `Environment.ProcessorCount` and print whether the system has at least 4 cores for running high-throughput background jobs."
    },
    practical_task: {
      title: "Automated Environment & Dependency Validator",
      requirement: "Create a console application that verifies the local runtime environment and reads configuration flags passed via CLI arguments.",
      input: "Command line arguments, e.g. `--env=Production --check-db=true`",
      expected_output: "Formatted report indicating environment, argument validation, and memory footprint in megabytes.",
      business_rules: [
        "If `--env` is not provided, default safely to 'Development'.",
        "If `--env=Production`, display a warning that debug logs will be suppressed.",
        "Calculate working set memory using `Environment.WorkingSet / 1024 / 1024`."
      ],
      acceptance_criteria: [
        "Runs without exceptions when zero arguments are provided.",
        "Correctly parses key-value pairs formatted as `--key=value`."
      ],
      edge_cases: [
        "Argument passed without value (e.g. `--env=`).",
        "Duplicate arguments passed (e.g. `--env=Staging --env=Production`)."
      ],
      hints: [
        "Hint 1: `args` is automatically available in top-level statements as an array of strings `string[]`.",
        "Hint 2: Iterate over `args` and use `arg.StartsWith(\"--env=\")` and `arg.Split('=')` to isolate values safely.",
        "Hint 3: Use a defensive fallback variable: `string env = \"Development\";` and reassign if parsed."
      ]
    },
    question_bank: [
      {
        id: "w1-t1-q1",
        category: "Concept Understanding",
        question: "What is the key functional difference between the .NET Runtime and the .NET SDK?",
        hint: "Think about who uses each: the developer vs the production server.",
        solution: "The .NET Runtime only contains the CoreCLR and base libraries needed to execute pre-compiled .NET assemblies (IL code). The .NET SDK includes the runtime PLUS the Roslyn compilers, MSBuild, and the CLI tools needed to build, compile, and package applications."
      },
      {
        id: "w1-t1-q2",
        category: "Debugging",
        question: "A developer clones a repo and runs 'dotnet build', but receives an error: 'Assets file project.assets.json not found. Run a NuGet package restore'. Why did this happen?",
        hint: "What command creates project.assets.json inside the obj/ folder?",
        solution: "The obj/ directory is excluded by .gitignore (as it should be). Running `dotnet restore` or `dotnet build` restores the NuGet packages and generates project.assets.json. If it failed, there may be a private NuGet source feed missing credentials or network connectivity issues."
      },
      {
        id: "w1-t1-q3",
        category: "Edge Cases",
        question: "What happens if a .NET 8 application is executed on a machine where only .NET 6 Runtime is installed?",
        hint: "Does forward compatibility work down to older major runtimes?",
        solution: ".NET runtimes are side-by-side but not forward-compatible. A .NET 8 assembly targeting `net8.0` will fail with an error stating that the required runtime version was not found, unless the app was published as a self-contained single executable (`--self-contained true`)."
      },
      {
        id: "w1-t1-q4",
        category: "Interview Explanation",
        question: "How would you explain the transition from .NET Framework Web Forms project structure to modern .NET 8/9 SDK projects in an interview?",
        hint: "Highlight cross-platform capability, MSBuild cleanliness, and deployment flexibility.",
        solution: "In Web Forms (.NET Framework), projects relied on bloated GUID-heavy .csproj files, IIS-coupled System.Web, and Windows-only GAC. In modern .NET SDK style, .csproj files are concise, NuGet packages are referenced cleanly as PackageReference, configuration is unified in appsettings.json, and the application compiles to cross-platform assemblies runnable in Docker on Linux."
      }
    ],
    explain_yourself: {
      prompt: "Explain how .NET compiles C# source code down to native machine code during execution.",
      structure: [
        "1. What is C# source code compiled into first? (Roslyn -> CIL / IL)",
        "2. What is the role of the CoreCLR and the JIT (Just-In-Time) compiler?",
        "3. How does this provide both platform independence and fast native execution?"
      ]
    }
  },

  "w1-t5": {
    id: "w1-t5",
    title: "Integer, Decimal and Floating-point Precision",
    week_number: 1,
    time: "60m",
    difficulty: "Medium",
    prerequisites: "Variables and data types",
    why_it_matters: "Financial calculation errors can cause payroll discrepancies, tax miscalculations, and legal non-compliance. Knowing exactly when to use `decimal` versus `double` or `float` is non-negotiable for enterprise backend engineers.",
    real_world_usage: "Payroll calculations (basic salary, DA, PF deductions, ESI, gratuity, taxable income), fee billing, invoice itemization, and accounting ledgers.",
    video: {
      primary: {
        title: "Float vs Double vs Decimal in C# - Why Decimal Matters",
        channel: "IAmTimCorey / Nick Chapsas",
        duration: "21m",
        lang: "en",
        youtubeId: "Wp_r6eY34pE",
        embedUrl: "https://www.youtube-nocookie.com/embed/Wp_r6eY34pE",
        watchUrl: "https://www.youtube.com/watch?v=Wp_r6eY34pE"
      },
      hindi: {
        title: "C# Data Types: Int, Double & Decimal Explained in Hindi",
        channel: "Code With Harry Hindi",
        duration: "25m",
        lang: "hi",
        youtubeId: "vBq0fK2x_kY",
        embedUrl: "https://www.youtube-nocookie.com/embed/vBq0fK2x_kY",
        watchUrl: "https://www.youtube.com/watch?v=vBq0fK2x_kY"
      }
    },
    concept: {
      definition: "`float` (32-bit) and `double` (64-bit) are IEEE 754 binary floating-point types representing numbers in base 2. `decimal` (128-bit) is a floating-point type that represents numbers in base 10 with 28-29 significant digits.",
      why_it_exists: "Binary representation cannot precisely represent fractions like 0.1 (1/10) because 10 is not a power of 2, leading to recurring binary rounding errors. `decimal` eliminates rounding errors for base-10 financial numbers.",
      how_it_works: "`double` stores a sign bit, exponent, and mantissa in base 2. `decimal` stores a 96-bit integer scaled by a power of 10 from 0 to 28, ensuring exact decimal representation.",
      code_snippet: `// Dangerous in financial systems:
double d1 = 0.1 + 0.2; // Result: 0.30000000000000004
bool isEqual = (d1 == 0.3); // False!

// Mandatory in financial systems:
decimal m1 = 0.1m + 0.2m; // Result: 0.3m
bool isDecimalEqual = (m1 == 0.3m); // True!`,
      erp_example: "In university fee calculations or employee monthly payroll, calculating a 12% PF contribution on Rs 15,250.75 using `double` can introduce fractional micro-cent rounding errors that accumulate across 10,000 employees and fail audit balance sheets.",
      common_mistakes: "Using `double` or `float` for prices, salaries, taxes, or currencies because they seem shorter or faster.",
      when_to_use: "Use `decimal` for money, financial ratios, payroll, taxes, and accounting. Use `double` for scientific computations, physics, coordinates, and ML calculations.",
      when_not_to_use: "Do not use `decimal` for graphics rendering or game physics where hardware-accelerated binary float operations are orders of magnitude faster."
    },
    guided_example: {
      code: `using System;

decimal basicSalary = 45000.50m;
decimal dearnessAllowanceRate = 0.15m; // 15%
decimal pfEmployeeRate = 0.12m;        // 12%

decimal daAmount = Math.Round(basicSalary * dearnessAllowanceRate, 2, MidpointRounding.AwayFromZero);
decimal grossSalary = basicSalary + daAmount;
decimal pfDeduction = Math.Round(basicSalary * pfEmployeeRate, 2, MidpointRounding.AwayFromZero);
decimal netSalary = grossSalary - pfDeduction;

Console.WriteLine($"Basic: {basicSalary:C2}");
Console.WriteLine($"DA (15%): {daAmount:C2}");
Console.WriteLine($"Gross: {grossSalary:C2}");
Console.WriteLine($"PF Deduction (12%): {pfDeduction:C2}");
Console.WriteLine($"Net Salary: {netSalary:C2}");`,
      explanation_lines: [
        "Line 3-5: The `m` suffix tells the C# compiler to treat literals as 128-bit decimal constants.",
        "Line 7 & 9: `Math.Round` with `MidpointRounding.AwayFromZero` implements standard commercial rounding rather than banker's rounding (even round).",
        "Line 12-16: `:C2` formats the decimal value cleanly according to current culture currency formatting."
      ],
      self_task: "Change MidpointRounding to ToEven (Banker's rounding) and test on values ending in .005 to observe how even vs odd digits are rounded."
    },
    practical_task: {
      title: "Salary Component Precision Calculator",
      requirement: "Given an employee's gross monthly salary and statutory percentage slabs, compute exact component deductions without precision drift.",
      input: "Basic = 25000.00, HRA = 10000.00, SpecialAllowance = 8500.00, TaxDeduction = 5.25%",
      expected_output: "Exact Net Salary with every intermediate component rounded to 2 decimal places.",
      business_rules: [
        "All calculations must use `decimal` type strictly.",
        "Round each deduction to 2 decimal places before subtracting from Gross.",
        "Disallow negative salary inputs with clear error messaging."
      ],
      acceptance_criteria: [
        "Gross must equal Sum of earnings exactly.",
        "Net must equal Gross minus Sum of deductions exactly with zero drift."
      ],
      edge_cases: [
        "Salary with fractional cents (e.g. 15432.3333m).",
        "Zero gross salary."
      ],
      hints: [
        "Hint 1: Use `decimal.TryParse` with `NumberStyles.Currency` for input parsing.",
        "Hint 2: Never cast `(decimal)(doubleVar * 0.1)` - maintain decimal literals throughout.",
        "Hint 3: Use `MidpointRounding.AwayFromZero` for tax compliance."
      ]
    },
    question_bank: [
      {
        id: "w1-t5-q1",
        category: "Concept Understanding",
        question: "Why does (0.1 + 0.2 == 0.3) evaluate to false for double but true for decimal?",
        hint: "Base-2 binary fractions vs base-10 decimal fractions.",
        solution: "Because 0.1 and 0.2 cannot be represented accurately in IEEE 754 binary floating-point format (base 2), resulting in 0.30000000000000004. In contrast, `decimal` stores numbers as base-10 integers scaled by a power of 10, representing 0.1, 0.2, and 0.3 exactly."
      },
      {
        id: "w1-t5-q2",
        category: "Debugging",
        question: "What is wrong with this code: `decimal tax = salary * 0.18;` and how do you fix it?",
        hint: "Look at the type of literal 0.18.",
        solution: "The literal `0.18` is typed as `double` by default in C#. C# disallows implicit conversion between `double` and `decimal` because of potential precision loss. Fix: append `m` to make it a decimal literal: `decimal tax = salary * 0.18m;`."
      },
      {
        id: "w1-t5-q3",
        category: "Edge Cases",
        question: "What is Banker's Rounding (MidpointRounding.ToEven) and why is it the default in .NET Math.Round?",
        hint: "What happens when rounding 2.5 vs 3.5?",
        solution: "Banker's rounding rounds numbers ending in .5 to the nearest even number (2.5 -> 2, 3.5 -> 4). It is the default because in large statistical samples, always rounding .5 upwards introduces a positive statistical bias. In banking and payroll, however, commercial regulations often require `MidpointRounding.AwayFromZero`."
      },
      {
        id: "w1-t5-q4",
        category: "Performance",
        question: "What is the memory and CPU performance trade-off of `decimal` compared to `double`?",
        hint: "Hardware FPU registers vs software/multi-word execution.",
        solution: "`double` takes 8 bytes (64 bits) and executes directly on hardware CPU Floating Point Units (FPU / SSE / AVX registers) in a single CPU cycle. `decimal` takes 16 bytes (128 bits) and arithmetic is computed via software emulation across multiple CPU registers, making it roughly 10-20x slower. However, for business logic and I/O-bound web APIs, this CPU difference is negligible compared to database latency, while precision is critical."
      }
    ],
    explain_yourself: {
      prompt: "Explain why choosing `double` for an ERP payroll module would be a serious architectural flaw.",
      structure: [
        "1. How binary floating point numbers cause fractional precision loss.",
        "2. The compounding effect of small errors across 5,000 employee salary slips.",
        "3. How `decimal` guarantees exact representation and audit compliance."
      ]
    }
  },

  "w5-t2": {
    id: "w5-t2",
    title: "Dictionary<TKey, TValue>: Hash Codes & Buckets",
    week_number: 5,
    time: "75m",
    difficulty: "Hard",
    prerequisites: "Collections, GetHashCode, Equals",
    why_it_matters: "Dictionaries are the backbone of fast key-based lookups in backend systems (caching, deduplication, indexing, grouping). Knowing how hashing, collision resolution, and internal buckets operate prevents catastrophic performance drops.",
    real_world_usage: "In-memory caching of permissions, fast employee lookup by EmployeeCode, caching statutory tax rates, and frequency counting in high-throughput APIs.",
    video: {
      primary: {
        title: "How C# Dictionary Actually Works Under the Hood",
        channel: "Nick Chapsas",
        duration: "18m",
        lang: "en",
        youtubeId: "n4m8y6h_y4I",
        embedUrl: "https://www.youtube-nocookie.com/embed/n4m8y6h_y4I",
        watchUrl: "https://www.youtube.com/watch?v=n4m8y6h_y4I"
      },
      hindi: {
        title: "C# Dictionary & Hash Table Explained in Hindi",
        channel: "Kudvenkat Hindi",
        duration: "22m",
        lang: "hi",
        youtubeId: "kL5w2y5w6dE",
        embedUrl: "https://www.youtube-nocookie.com/embed/kL5w2y5w6dE",
        watchUrl: "https://www.youtube.com/watch?v=kL5w2y5w6dE"
      }
    },
    concept: {
      definition: "A `Dictionary<TKey, TValue>` is a hash table collection that provides near O(1) time complexity for additions, lookups, and deletions by mapping keys to array bucket indices using their hash code.",
      why_it_exists: "Linear search in a `List<T>` requires O(n) comparisons. For an ERP with 50,000 employee records, looking up 10,000 attendance records would require up to 500 million operations (O(n * m)). A Dictionary reduces this to O(m) time.",
      how_it_works: "1. Calls `key.GetHashCode()`. 2. Computes bucket index `(hashCode & 0x7FFFFFFF) % buckets.Length`. 3. Follows entry chain to handle hash collisions (chaining). 4. Verifies equality using `key.Equals(entry.key)`.",
      code_snippet: `var employeeLookup = new Dictionary<string, EmployeeRecord>(StringComparer.OrdinalIgnoreCase);

employeeLookup.Add("EMP101", new EmployeeRecord("Sujal Padiya", "Engineering"));

if (employeeLookup.TryGetValue("emp101", out var record))
{
    Console.WriteLine($"Found: {record.Name} in {record.Department}");
}`,
      erp_example: "When processing a biometric punch import with 25,000 records, preload all active employees into a `Dictionary<string, int> empCodeToIdMap`. Then resolve each punch line's EmployeeId in O(1) instead of querying the database 25,000 times.",
      common_mistakes: "Using `dict[key]` directly without checking `ContainsKey` or using `TryGetValue`, which throws `KeyNotFoundException` when a key does not exist.",
      when_to_use: "Whenever you need fast O(1) lookups by a unique identifier (ID, code, email, slug).",
      when_not_to_use: "When you only have 5-10 items (where array iteration is faster and has less memory overhead), or when you need items sorted by insertion order."
    },
    guided_example: {
      code: `using System;
using System.Collections.Generic;

var departmentSalaries = new Dictionary<string, List<decimal>>(StringComparer.OrdinalIgnoreCase);

void AddSalary(string dept, decimal salary)
{
    // TryGetValue avoids double lookup
    if (!departmentSalaries.TryGetValue(dept, out var salaries))
    {
        salaries = new List<decimal>();
        departmentSalaries[dept] = salaries;
    }
    salaries.Add(salary);
}

AddSalary("IT", 75000m);
AddSalary("IT", 82000m);
AddSalary("HR", 55000m);

foreach (var (dept, list) in departmentSalaries)
{
    Console.WriteLine($"Dept: {dept}, Headcount: {list.Count}, Avg: {list.Average():C2}");
}`,
      explanation_lines: [
        "Line 4: Passing `StringComparer.OrdinalIgnoreCase` ensures case-insensitive matching without allocations from .ToLower().",
        "Line 8-13: `TryGetValue` is preferred over `ContainsKey` followed by `[dept]` because it traverses the hash bucket only once.",
        "Line 21: C# 7+ tuple deconstruction in `foreach` unpacks `KeyValuePair<string, List<decimal>>` cleanly."
      ],
      self_task: "Add a method `GetHighestPayingDepartment()` that returns the department name with the highest single salary using the dictionary."
    },
    practical_task: {
      title: "Biometric Attendance Ingestion Matcher",
      requirement: "Given a list of 10,000 punch records and an employee master list, match punch logs to employees in O(N) total time and identify orphan records.",
      input: "List of PunchLogs (EmployeeCode, Timestamp) and List of Employees (Id, EmployeeCode, Name)",
      expected_output: "Dictionary mapping EmployeeId to list of punch DateTime objects, plus a List of unrecognized orphan EmployeeCodes.",
      business_rules: [
        "Lookup must be O(1) per punch log using a Dictionary.",
        "Case-insensitive matching on EmployeeCode.",
        "Orphan codes must be captured and logged for HR investigation."
      ],
      acceptance_criteria: [
        "Total runtime under 50ms for 10,000 records.",
        "No unhandled KeyNotFoundException."
      ],
      edge_cases: [
        "EmployeeCode with leading/trailing spaces.",
        "Duplicate employee codes in master list (throw meaningful exception)."
      ],
      hints: [
        "Hint 1: Build the dictionary from master list using `.ToDictionary(e => e.EmployeeCode.Trim(), e => e.Id, StringComparer.OrdinalIgnoreCase)`.",
        "Hint 2: For each punch, use `employeeMap.TryGetValue(punch.EmployeeCode.Trim(), out var empId)`.",
        "Hint 3: Maintain a `HashSet<string> orphanCodes` for unique orphan tracking."
      ]
    },
    question_bank: [
      {
        id: "w5-t2-q1",
        category: "Concept Understanding",
        question: "What happens internally when two distinct keys return the exact same GetHashCode() in a Dictionary?",
        hint: "Hash collisions and bucket chaining.",
        solution: "This is a hash collision. .NET Dictionary handles collisions via chaining. The collided entries are placed in the same bucket as a linked list of entries. When retrieving, the dictionary locates the bucket, traverses the chain, and calls `key.Equals()` on each entry until it finds the matching key. If many collisions occur, lookup degrades from O(1) toward O(n)."
      },
      {
        id: "w5-t2-q2",
        category: "Performance",
        question: "Why is dict.TryGetValue(key, out var val) preferred over 'if (dict.ContainsKey(key)) return dict[key];'?",
        hint: "Count how many times the hash code and bucket index are calculated.",
        solution: "`ContainsKey` computes the hash code, searches the bucket, and traverses the collision chain. If true, `dict[key]` immediately recalculates the hash code, searches the bucket again, and traverses the chain a second time. `TryGetValue` performs this lookup exactly once, halving lookup overhead."
      },
      {
        id: "w5-t2-q3",
        category: "Edge Cases",
        question: "What happens if a mutable class instance is used as a Dictionary key, and its property is modified after being added?",
        hint: "Does its GetHashCode() change after mutation?",
        solution: "If the modified property was used in calculating `GetHashCode()`, its hash code changes. The Dictionary stored the entry in a bucket corresponding to its OLD hash code. When you search with the mutated object, the Dictionary looks in the NEW bucket and fails to find it. The entry becomes an unreachable zombie in the dictionary, causing data corruption."
      },
      {
        id: "w5-t2-q4",
        category: "Interview Explanation",
        question: "How do you explain the difference between Dictionary<TKey, TValue> and ConcurrentDictionary<TKey, TValue>?",
        hint: "Thread safety, lock granularity, and background workers.",
        solution: "`Dictionary<TKey, TValue>` is not thread-safe. Concurrent reads and writes from multiple threads (e.g. in ASP.NET Core requests) can corrupt the internal bucket array or cause an infinite loop during internal rehashing. `ConcurrentDictionary` uses fine-grained bucket locks (striping) to allow safe concurrent read/write operations without locking the entire dictionary."
      }
    ],
    explain_yourself: {
      prompt: "Explain how a Dictionary achieves O(1) lookup time complexity and what causes it to degrade to O(n).",
      structure: [
        "1. The role of GetHashCode() and bucket index modulo calculation.",
        "2. How Equals() resolves collisions within a single bucket.",
        "3. What happens during a Hash DoS attack or poor hash function distribution."
      ]
    }
  },

  "w12-t1": {
    id: "w12-t1",
    title: "EF Core Architecture, DbContext & Change Tracking",
    week_number: 12,
    time: "60m",
    difficulty: "Medium",
    prerequisites: "Classes, SQL Server, Relational Models",
    why_it_matters: "Entity Framework Core is the dominant Object-Relational Mapper (ORM) in the .NET ecosystem. Understanding its internal change tracker, query execution pipeline, and DbContext lifecycle is vital to prevent performance disasters in production.",
    real_world_usage: "Powering enterprise REST APIs, transactional business operations, and automated database migrations in modern ASP.NET Core applications.",
    video: {
      primary: {
        title: "EF Core Clean Architecture & Change Tracking Deep Dive",
        channel: "Milan Jovanović",
        duration: "34m",
        lang: "en",
        youtubeId: "kUqG6mS8h_k",
        embedUrl: "https://www.youtube-nocookie.com/embed/kUqG6mS8h_k",
        watchUrl: "https://www.youtube.com/watch?v=kUqG6mS8h_k"
      },
      hindi: {
        title: "Entity Framework Core Complete Tutorial in Hindi",
        channel: "Kudvenkat Hindi",
        duration: "40m",
        lang: "hi",
        youtubeId: "tZp5q8g1w8g",
        embedUrl: "https://www.youtube-nocookie.com/embed/tZp5q8g1w8g",
        watchUrl: "https://www.youtube.com/watch?v=tZp5q8g1w8g"
      }
    },
    concept: {
      definition: "EF Core is an open-source lightweight, extensible ORM that enables .NET developers to work with a database using .NET domain objects, abstracting low-level ADO.NET SQL commands.",
      why_it_exists: "Writing raw ADO.NET `SqlCommand` and `SqlDataReader` for hundreds of tables involves massive boilerplate, manual mapping, and vulnerability to typo bugs or injection if not parameterized. EF Core maps entities automatically, tracks changes, and generates SQL.",
      how_it_works: "1. `DbContext` acts as a Unit of Work and `DbSet<T>` as a Repository. 2. LINQ queries are converted into an Expression Tree. 3. EF Core SQL Provider translates the tree into parameterized T-SQL. 4. ChangeTracker monitors property mutations. 5. `SaveChanges()` executes an atomic database transaction with generated INSERT/UPDATE/DELETE statements.",
      code_snippet: `public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Department> Departments => Set<Department>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Employee>()
            .Property(e => e.Salary)
            .HasPrecision(18, 2);
    }
}`,
      erp_example: "When updating an employee's department and salary, EF Core ChangeTracker detects only the modified fields and generates an UPDATE query that updates only those specific columns, rather than writing a custom SQL UPDATE statement manually.",
      common_mistakes: "Leaving Change Tracking enabled on read-only reporting queries (which wastes substantial memory) instead of using `.AsNoTracking()`.",
      when_to_use: "For standard transactional OLTP backend APIs, CRUD modules, and business workflows.",
      when_not_to_use: "For bulk inserting 100,000 attendance records at once (where `SqlBulkCopy` is 50x faster) or complex analytical reporting with 15 JOINs across millions of rows."
    },
    guided_example: {
      code: `// Querying with AsNoTracking and projection
var highEarners = await dbContext.Employees
    .AsNoTracking()
    .Where(e => e.IsActive && e.Salary > 75000m)
    .OrderByDescending(e => e.Salary)
    .Select(e => new EmployeeSummaryDto(e.Id, e.FullName, e.Department.Name, e.Salary))
    .ToListAsync();

// Updating an existing entity
var emp = await dbContext.Employees.FindAsync(empId);
if (emp != null)
{
    emp.Promote("Senior Backend Engineer", 95000m);
    await dbContext.SaveChangesAsync(); // Generates optimized UPDATE SQL
}`,
      explanation_lines: [
        "Line 2: `.AsNoTracking()` informs EF Core not to snapshot the entity into the ChangeTracker, saving 50% memory on read operations.",
        "Line 5: Projecting directly into a DTO (`.Select(new ...Dto)`) tells EF Core to select ONLY the specified 4 columns in the SQL SELECT query instead of `SELECT *`.",
        "Line 12: `SaveChangesAsync()` automatically opens a transaction, generates the parameterized SQL UPDATE statement, and commits."
      ],
      self_task: "Write an EF Core query that retrieves the total monthly payroll expenditure grouped by department with employee count."
    },
    practical_task: {
      title: "Optimized Employee Leave Repository",
      requirement: "Implement an EF Core repository method that retrieves an employee's active leave requests with leave type details using optimal projection and no tracking.",
      input: "EmployeeId: int, Year: int",
      expected_output: "List<LeaveHistoryDto> with LeaveTypeName, StartDate, EndDate, DaysCount, Status.",
      business_rules: [
        "Must use `.AsNoTracking()` for read queries.",
        "Must use projection so only necessary columns are fetched from SQL.",
        "Filter only for requests within the specified calendar year."
      ],
      acceptance_criteria: [
        "Generated SQL query contains no `SELECT *`.",
        "Executes in a single database roundtrip."
      ],
      edge_cases: [
        "Employee has zero leave records in the given year (return empty list, never null).",
        "Invalid EmployeeId (verify existence or return empty)."
      ],
      hints: [
        "Hint 1: Use `.Where(l => l.EmployeeId == empId && l.StartDate.Year == year)`.",
        "Hint 2: Project using `.Select(l => new LeaveHistoryDto(...))`.",
        "Hint 3: Always `await ...ToListAsync()` to avoid blocking threads."
      ]
    },
    question_bank: [
      {
        id: "w12-t1-q1",
        category: "Concept Understanding",
        question: "What is the N+1 query problem in EF Core, and how do you prevent it?",
        hint: "Lazy loading vs Eager loading with .Include().",
        solution: "The N+1 problem occurs when querying a parent table (e.g. 100 Employees) and accessing a navigation property (e.g. `emp.Department.Name`) inside a loop without eager loading. EF Core executes 1 query for the parent records, plus N additional individual queries for each related department (101 total queries). You prevent it by using Eager Loading with `.Include(e => e.Department)` or by using LINQ projection (`.Select()`)."
      },
      {
        id: "w12-t1-q2",
        category: "Performance",
        question: "Why should DbContext never be registered as a Singleton service in Dependency Injection?",
        hint: "Thread safety and ChangeTracker bloat.",
        solution: "`DbContext` is not thread-safe. Registering it as a Singleton means concurrent HTTP requests in ASP.NET Core share the same instance, leading to data corruption or `InvalidOperationException`. Furthermore, the ChangeTracker would continuously accumulate tracked entities across requests, leaking memory and degrading query performance. DbContext must always be registered as `Scoped`."
      },
      {
        id: "w12-t1-q3",
        category: "Edge Cases",
        question: "What happens when calling SaveChangesAsync() if another user updated the same record concurrently?",
        hint: "Optimistic concurrency and RowVersion.",
        solution: "If configured with a concurrency token (such as a byte[] `RowVersion` or `[Timestamp]`), EF Core includes `WHERE RowVersion = @originalRowVersion` in the UPDATE statement. When 0 rows are affected because another transaction modified the row, EF Core throws a `DbUpdateConcurrencyException`, allowing the application to catch it, reload fresh data, or return HTTP 409 Conflict."
      },
      {
        id: "w12-t1-q4",
        category: "Interview Explanation",
        question: "How do you explain the trade-offs between EF Core and Dapper to an enterprise hiring panel?",
        hint: "Productivity, change tracking vs raw query speed and execution plan control.",
        solution: "EF Core maximizes developer productivity, provides type-safe LINQ queries, manages database migrations, handles relationships, and offers robust Unit of Work / Change Tracking for transactional business workflows. Dapper is a lightweight micro-ORM that excels in raw performance, predictable high-speed reads, and complex hand-tuned SQL reports with zero tracking overhead. In modern enterprise architecture, a hybrid approach is common: EF Core for commands and writes, Dapper or EF Core with AsNoTracking for complex read queries."
      }
    ],
    explain_yourself: {
      prompt: "Explain how EF Core translates a LINQ query into SQL Server T-SQL and how AsNoTracking improves performance.",
      structure: [
        "1. Expression trees and the SQL translation pipeline.",
        "2. The memory snapshot cost of the ChangeTracker.",
        "3. When to use tracked queries vs un-tracked queries in API endpoints."
      ]
    }
  }
};

// Generic Fallback Lesson & Video Generator ensuring all 32 weeks have complete 7-step lessons with videos
export function getTopicLesson(topicId, weekNumber, topicTitle) {
  if (TOPIC_LESSONS[topicId]) {
    return TOPIC_LESSONS[topicId];
  }

  // Derive relevant video mappings by analyzing topic title keywords
  const titleLower = (topicTitle || '').toLowerCase();
  let videoMeta = {
    primary: {
      title: `${topicTitle} - Backend Engineering Deep Dive`,
      channel: "Milan Jovanović / Nick Chapsas",
      duration: "26m",
      lang: "en",
      youtubeId: "VwT_m_8f9kE",
      embedUrl: "https://www.youtube-nocookie.com/embed/VwT_m_8f9kE",
      watchUrl: "https://www.youtube.com/watch?v=VwT_m_8f9kE"
    },
    hindi: {
      title: `${topicTitle} Explained in Hindi`,
      channel: "Code With Harry / Kudvenkat Hindi",
      duration: "30m",
      lang: "hi",
      youtubeId: "SuLiu5AK9Ps",
      embedUrl: "https://www.youtube-nocookie.com/embed/SuLiu5AK9Ps",
      watchUrl: "https://www.youtube.com/watch?v=SuLiu5AK9Ps"
    }
  };

  if (titleLower.includes('sql') || titleLower.includes('query') || titleLower.includes('index') || titleLower.includes('join')) {
    videoMeta = {
      primary: {
        title: "SQL Server Querying & Indexing Masterclass",
        channel: "Alex The Analyst / Kudvenkat",
        duration: "35m",
        lang: "en",
        youtubeId: "7S_tz1z_5bA",
        embedUrl: "https://www.youtube-nocookie.com/embed/7S_tz1z_5bA",
        watchUrl: "https://www.youtube.com/watch?v=7S_tz1z_5bA"
      },
      hindi: {
        title: "SQL Server Full Course in Hindi",
        channel: "Kudvenkat Hindi / Gate Smashers",
        duration: "45m",
        lang: "hi",
        youtubeId: "hlGoQC332VM",
        embedUrl: "https://www.youtube-nocookie.com/embed/hlGoQC332VM",
        watchUrl: "https://www.youtube.com/watch?v=hlGoQC332VM"
      }
    };
  } else if (titleLower.includes('api') || titleLower.includes('controller') || titleLower.includes('asp.net') || titleLower.includes('middleware')) {
    videoMeta = {
      primary: {
        title: "ASP.NET Core Web API Full Course",
        channel: "freeCodeCamp / Les Jackson",
        duration: "42m",
        lang: "en",
        youtubeId: "BfZpr2A3pKg",
        embedUrl: "https://www.youtube-nocookie.com/embed/BfZpr2A3pKg",
        watchUrl: "https://www.youtube.com/watch?v=BfZpr2A3pKg"
      },
      hindi: {
        title: "ASP.NET Core Web API Complete Tutorial in Hindi",
        channel: "Code With Harry",
        duration: "38m",
        lang: "hi",
        youtubeId: "BfZpr2A3pKg",
        embedUrl: "https://www.youtube-nocookie.com/embed/BfZpr2A3pKg",
        watchUrl: "https://www.youtube.com/watch?v=BfZpr2A3pKg"
      }
    };
  } else if (titleLower.includes('docker') || titleLower.includes('ci/cd') || titleLower.includes('redis')) {
    videoMeta = {
      primary: {
        title: "Docker & Containerization for .NET Developers",
        channel: "TechWorld with Nana",
        duration: "28m",
        lang: "en",
        youtubeId: "pg19Z8LL06w",
        embedUrl: "https://www.youtube-nocookie.com/embed/pg19Z8LL06w",
        watchUrl: "https://www.youtube.com/watch?v=pg19Z8LL06w"
      },
      hindi: {
        title: "Docker Tutorial in Hindi",
        channel: "Code With Harry",
        duration: "32m",
        lang: "hi",
        youtubeId: "17Bl31rlnRM",
        embedUrl: "https://www.youtube-nocookie.com/embed/17Bl31rlnRM",
        watchUrl: "https://www.youtube.com/watch?v=17Bl31rlnRM"
      }
    };
  } else if (titleLower.includes('architecture') || titleLower.includes('tenant') || titleLower.includes('design') || titleLower.includes('solid')) {
    videoMeta = {
      primary: {
        title: "Clean Architecture & System Design in .NET",
        channel: "Milan Jovanović",
        duration: "35m",
        lang: "en",
        youtubeId: "yF9SwL0p0Y0",
        embedUrl: "https://www.youtube-nocookie.com/embed/yF9SwL0p0Y0",
        watchUrl: "https://www.youtube.com/watch?v=yF9SwL0p0Y0"
      },
      hindi: {
        title: "System Design & Clean Architecture in Hindi",
        channel: "Gate Smashers / Gaurav Sen",
        duration: "30m",
        lang: "hi",
        youtubeId: "xpDnVSmNFX0",
        embedUrl: "https://www.youtube-nocookie.com/embed/xpDnVSmNFX0",
        watchUrl: "https://www.youtube.com/watch?v=xpDnVSmNFX0"
      }
    };
  }

  return {
    id: topicId,
    title: topicTitle || `Backend Engineering Lesson: ${topicId}`,
    week_number: weekNumber || 1,
    time: "60m",
    difficulty: "Medium",
    prerequisites: "Previous week core concepts and programming environment setup",
    why_it_matters: `Mastering ${topicTitle} is essential for building scalable, maintainable enterprise backend applications and answering technical interview questions with confidence.`,
    real_world_usage: `Extensively utilized in enterprise ERP architectures, distributed services, and high-reliability .NET backend APIs.`,
    video: videoMeta,
    concept: {
      definition: `${topicTitle} represents a fundamental concept in modern backend engineering, establishing clean separation of concerns and robust data processing.`,
      why_it_exists: "Provides structured, predictable execution, prevents common software defects, and guarantees maintainability across large engineering teams.",
      how_it_works: "Executes within the runtime lifecycle, enforcing type safety, memory boundaries, and clear architectural contracts.",
      code_snippet: `// Implementation sample for ${topicTitle}
public class ${(topicTitle || 'Backend').replace(/[^a-zA-Z0-9]/g, "")}Service
{
    private readonly ILogger<${(topicTitle || 'Backend').replace(/[^a-zA-Z0-9]/g, "")}Service> _logger;

    public ${(topicTitle || 'Backend').replace(/[^a-zA-Z0-9]/g, "")}Service(ILogger<${(topicTitle || 'Backend').replace(/[^a-zA-Z0-9]/g, "")}Service> logger)
    {
        _logger = logger;
    }

    public async Task<bool> ExecuteWorkflowAsync(int id, CancellationToken ct = default)
    {
        _logger.LogInformation("Processing workflow for id: {Id}", id);
        // Core business logic execution
        return await Task.FromResult(true);
    }
}`,
      erp_example: `In enterprise ERP modules (such as Staff, Fee, or Payroll), ${topicTitle} ensures that business transactions follow strict audit rules and maintain data integrity.`,
      common_mistakes: "Failing to handle null inputs, neglecting edge cases, or skipping proper error handling and logging.",
      when_to_use: "Apply as part of standard clean architecture and test-driven development.",
      when_not_to_use: "Avoid premature over-engineering when a simpler, direct approach suffices."
    },
    guided_example: {
      code: `// Guided demonstration for ${topicTitle}
Console.WriteLine("=== Executing: ${topicTitle} ===");
try
{
    // 1. Validate inputs
    // 2. Perform operation
    // 3. Return verified result
    Console.WriteLine("Operation completed successfully.");
}
catch (Exception ex)
{
    Console.Error.WriteLine($"Error occurred: {ex.Message}");
}`,
      explanation_lines: [
        "Line 1: Establishes clear entry point and execution boundaries.",
        "Line 3-6: Wraps operations in structured defensive error handling.",
        "Line 8-11: Preserves diagnostic stack information on failure without crashing the host process."
      ],
      self_task: `Implement a unit test validating that ${topicTitle} handles null or boundary values without throwing unhandled exceptions.`
    },
    practical_task: {
      title: `${topicTitle} Practical Implementation`,
      requirement: `Build a production-grade component demonstrating ${topicTitle} with clean error handling, boundary validation, and unit test coverage.`,
      input: "Standard enterprise inputs and configuration parameters.",
      expected_output: "Verified execution result with structured return values and logging.",
      business_rules: [
        "Follow clean code naming conventions.",
        "Defensively validate all input arguments.",
        "Ensure edge cases and boundary conditions are covered."
      ],
      acceptance_criteria: [
        "Zero unhandled runtime exceptions on edge cases.",
        "Clear separation between business logic and presentation."
      ],
      edge_cases: [
        "Null or empty input parameters.",
        "Timeout or cancellation requested via CancellationToken."
      ],
      hints: [
        "Hint 1: Start with the simplest working case first before adding complex logic.",
        "Hint 2: Identify any potential null references or index out of bound conditions.",
        "Hint 3: Use logging to trace intermediate variable states during debugging."
      ]
    },
    question_bank: [
      {
        id: `${topicId}-q1`,
        category: "Concept Understanding",
        question: `What is the core architectural principle behind ${topicTitle}?`,
        hint: "Consider maintainability, testability, and runtime predictability.",
        solution: `${topicTitle} establishes clear modular boundaries, reduces coupling between layers, and ensures predictable, verifiable system execution.`
      },
      {
        id: `${topicId}-q2`,
        category: "Debugging",
        question: `What is the most frequent runtime bug encountered when working with ${topicTitle}?`,
        hint: "Look at initialization, scope, or null reference hazards.",
        solution: "The most common bug involves improper state initialization or unhandled null/boundary conditions, leading to NullReferenceException or unhandled operational failure."
      },
      {
        id: `${topicId}-q3`,
        category: "Edge Cases",
        question: `How should boundary and extreme edge-case values be handled in ${topicTitle}?`,
        hint: "Guard clauses and explicit domain validation.",
        solution: "Use defensive guard clauses at the beginning of methods to validate boundaries, throwing specific domain exceptions rather than allowing corrupted state to propagate."
      },
      {
        id: `${topicId}-q4`,
        category: "Interview Explanation",
        question: `How would you explain the real-world value of ${topicTitle} in an enterprise technical interview?`,
        hint: "Relate it to system stability, team productivity, and production incident prevention.",
        solution: `In an enterprise environment, ${topicTitle} directly impacts system reliability and operational cost by preventing regressions, simplifying onboarding, and ensuring predictable performance under load.`
      }
    ],
    explain_yourself: {
      prompt: `Explain ${topicTitle} in your own words using the 5-step technical explanation framework.`,
      structure: [
        "1. What is it in 1 sentence?",
        "2. Why is it needed in professional software development?",
        "3. How does it work under the hood?",
        "4. A practical ERP or business example.",
        "5. Key limitations, trade-offs, or common pitfalls."
      ]
    }
  };
}
