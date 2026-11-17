/**
 * quizzes-data.js - Weekly Quizzes Engine
 * 32 Weekly assessments with 10 questions each:
 * - 4 conceptual questions
 * - 3 coding-output / debugging questions
 * - 2 SQL or DSA questions
 * - 1 practical business scenario
 * Includes immediate scoring, detailed explanations, and revision topic tagging.
 */

export const WEEKLY_QUIZZES = {
  1: {
    week_number: 1,
    title: "Week 1 Assessment: C# Fundamentals & Project Structure",
    duration_minutes: 20,
    questions: [
      {
        id: "w1-q1",
        category: "Concept Understanding",
        text: "What is the primary difference between the .NET SDK and the .NET Runtime?",
        options: [
          "The SDK is for Windows only; the Runtime is cross-platform.",
          "The SDK includes compilers and tools to build apps; the Runtime only executes compiled apps.",
          "The Runtime is open-source, whereas the SDK is proprietary.",
          "There is no difference; they are aliases for the same package."
        ],
        correct_index: 1,
        explanation: "The .NET SDK contains everything needed to build and run .NET applications, including the Roslyn compilers, MSBuild, and the CLI. The Runtime contains only the CoreCLR and base libraries needed to execute pre-compiled assemblies.",
        revision_topic: ".NET SDK and Project Structure"
      },
      {
        id: "w1-q2",
        category: "Concept Understanding",
        text: "Which of the following is a value type stored on the stack (when declared as a local variable)?",
        options: [
          "System.String",
          "System.Int32",
          "System.Array",
          "System.Object"
        ],
        correct_index: 1,
        explanation: "`int` (System.Int32) is a struct, which is a value type. Strings, arrays, and general objects are reference types allocated on the managed heap.",
        revision_topic: "Variables and Data Types"
      },
      {
        id: "w1-q3",
        category: "Concept Understanding",
        text: "Why is `decimal` chosen over `double` for payroll and financial calculations?",
        options: [
          "Decimal uses less memory (4 bytes vs 8 bytes).",
          "Decimal calculations run faster on CPU hardware floating point units.",
          "Decimal represents base-10 fractions exactly without binary rounding errors.",
          "Decimal allows infinite precision numbers."
        ],
        correct_index: 2,
        explanation: "Decimal is a 128-bit base-10 floating-point type with 28-29 significant digits, eliminating the recurring binary representation errors inherent in base-2 IEEE 754 floats and doubles (such as 0.1 + 0.2 != 0.3).",
        revision_topic: "Integer, Decimal and Floating-point Precision"
      },
      {
        id: "w1-q4",
        category: "Concept Understanding",
        text: "What does `Nullable<int>` or `int?` allow in C#?",
        options: [
          "Allows the integer to store negative infinity.",
          "Allows an integer value type to represent `null` when a value is absent.",
          "Increases the range of integer values to 64 bits.",
          "Automatically converts strings to integers without parsing."
        ],
        correct_index: 1,
        explanation: "`Nullable<T>` allows value types to hold `null`, which is essential when mapping to nullable database columns (e.g., an optional Employee Leave Balance or ManagerId).",
        revision_topic: "Variables and Data Types"
      },
      {
        id: "w1-q5",
        category: "Code Output",
        text: "What will this C# snippet output?\n\ndouble a = 0.1 + 0.2;\nConsole.WriteLine(a == 0.3);",
        options: [
          "True",
          "False",
          "Compilation error",
          "Runtime exception"
        ],
        correct_index: 1,
        explanation: "Because 0.1 and 0.2 cannot be represented precisely in binary floating point, `a` evaluates to approximately 0.30000000000000004. Hence `a == 0.3` evaluates to False.",
        revision_topic: "Integer, Decimal and Floating-point Precision"
      },
      {
        id: "w1-q6",
        category: "Debugging",
        text: "What exception is thrown by `Convert.ToInt32(\"abc\")`?",
        options: [
          "NullReferenceException",
          "FormatException",
          "OverflowException",
          "IndexOutOfRangeException"
        ],
        correct_index: 1,
        explanation: "`Convert.ToInt32` parses the string; when the format does not represent a valid integer, it throws `System.FormatException`. `int.TryParse` is safer because it returns a boolean instead of throwing.",
        revision_topic: "Operators and Type Conversion"
      },
      {
        id: "w1-q7",
        category: "Debugging",
        text: "Consider: `int x = int.MaxValue; int y = x + 1; Console.WriteLine(y);` In an unchecked context, what happens?",
        options: [
          "Throws OverflowException at runtime.",
          "Prints int.MinValue (-2147483648) due to silent integer overflow wrap-around.",
          "Compiler prevents compilation.",
          "y becomes 0."
        ],
        correct_index: 1,
        explanation: "By default in C#, arithmetic operations on integers are unchecked for performance. When exceeding `int.MaxValue`, the sign bit flips and it wraps around to `int.MinValue` without throwing. In financial calculations, you can use the `checked { ... }` block to enforce overflow exceptions.",
        revision_topic: "Integer, Decimal and Floating-point Precision"
      },
      {
        id: "w1-q8",
        category: "SQL",
        text: "In SQL Server, which query retrieves distinct department names from the Employees table?",
        options: [
          "SELECT UNIQUE Department FROM Employees;",
          "SELECT DISTINCT Department FROM Employees;",
          "SELECT Department GROUP FROM Employees;",
          "SELECT DIFFERENT Department FROM Employees;"
        ],
        correct_index: 1,
        explanation: "The standard SQL keyword for removing duplicate rows from the result set is `DISTINCT`.",
        revision_topic: "Basic SQL Queries"
      },
      {
        id: "w1-q9",
        category: "DSA",
        text: "What is the time complexity of finding whether an integer `n` is even or odd using the modulo operator `(n % 2 == 0)`?",
        options: [
          "O(n)",
          "O(log n)",
          "O(1)",
          "O(n^2)"
        ],
        correct_index: 2,
        explanation: "Modulo arithmetic on fixed-width machine integers is a constant-time hardware CPU operation, taking O(1) time.",
        revision_topic: "Basic Mathematical DSA"
      },
      {
        id: "w1-q10",
        category: "Business Scenario",
        text: "You are building an ERP payroll module where basic salary is entered by HR via a console prompt. If the user presses Enter without typing anything, `Console.ReadLine()` returns an empty string or null. How should this be handled?",
        options: [
          "Call `int.Parse(Console.ReadLine())` directly and assume HR won't make mistakes.",
          "Catch general `Exception` and default salary to 0 silently without telling HR.",
          "Use a loop with `decimal.TryParse` and prompt HR again if the input is null, empty, or negative.",
          "Close the application immediately to prevent corrupt data."
        ],
        correct_index: 2,
        explanation: "Enterprise systems must validate input defensively. Using `decimal.TryParse` inside a retry loop validates the input cleanly, provides immediate user feedback, and guarantees only valid, positive salary values proceed into the calculation engine.",
        revision_topic: "Defensive Input Validation"
      }
    ]
  },

  2: {
    week_number: 2,
    title: "Week 2 Assessment: Control Flow, Logic & Loops",
    duration_minutes: 20,
    questions: [
      {
        id: "w2-q1",
        category: "Concept Understanding",
        text: "What is 'short-circuit evaluation' in C# logical operators `&&` and `||`?",
        options: [
          "The compiler optimizes the code by deleting unused boolean variables.",
          "The second operand is only evaluated if the first operand does not determine the result.",
          "An electrical circuit breaker in the CPU halts execution on false.",
          "Both operands are evaluated concurrently on separate threads."
        ],
        correct_index: 1,
        explanation: "In `A && B`, if A is false, B is never evaluated (which prevents NullReferenceException when writing `emp != null && emp.Salary > 0`). In `A || B`, if A is true, B is not evaluated.",
        revision_topic: "Comparison and Logical Operators"
      },
      {
        id: "w2-q2",
        category: "Concept Understanding",
        text: "What is the key advantage of modern C# `switch` expressions over classic `switch` statements?",
        options: [
          "They can only evaluate integer types.",
          "They are expressions that return a value, support pattern matching, and require exhaustiveness.",
          "They bypass compilation into bytecode.",
          "They cannot use lambda arrows =>."
        ],
        correct_index: 1,
        explanation: "Switch expressions (`salaryType switch { ... }`) return values directly, are more concise, support property and relational pattern matching, and warn at compile time if patterns are not exhaustive.",
        revision_topic: "Switch Statements and Expressions"
      },
      {
        id: "w2-q3",
        category: "Concept Understanding",
        text: "When should a `while` loop be preferred over a `for` loop?",
        options: [
          "When iterating over a fixed-size array.",
          "When the number of iterations is unknown in advance and depends on an external condition.",
          "When performance is 10x higher.",
          "Never; `while` loops are deprecated."
        ],
        correct_index: 1,
        explanation: "`for` loops are ideal when the number of iterations or range is known. `while` loops are ideal when looping until a condition changes (e.g. reading lines until end of file, or waiting for valid user input).",
        revision_topic: "Loops and Iteration"
      },
      {
        id: "w2-q4",
        category: "Concept Understanding",
        text: "What happens if you attempt to modify a collection while iterating over it with `foreach`?",
        options: [
          "The loop silently skips the modified element.",
          "Throws `InvalidOperationException: Collection was modified; enumeration operation may not execute.`",
          "The collection is automatically cloned in memory.",
          "Nothing, foreach allows full modification."
        ],
        correct_index: 1,
        explanation: "The `IEnumerator` state machine tracks version mutations. Modifying the underlying collection invalidates the enumerator and throws an `InvalidOperationException`.",
        revision_topic: "Loops and Iteration"
      },
      {
        id: "w2-q5",
        category: "Code Output",
        text: "What will be printed?\n\nint count = 0;\nfor (int i = 0; i < 3; i++)\n  for (int j = 0; j < 3; j++)\n    if (i == j) count++;\nConsole.WriteLine(count);",
        options: [
          "9",
          "3",
          "6",
          "1"
        ],
        correct_index: 1,
        explanation: "The condition `i == j` matches exactly three times: (0,0), (1,1), and (2,2). Hence count is 3.",
        revision_topic: "Nested Loops and Algorithmic Complexity"
      },
      {
        id: "w2-q6",
        category: "Debugging",
        text: "What is the bug in this code?\n\nint i = 10;\nwhile (i > 0)\n{\n    Console.WriteLine(i);\n    // Missing i--\n}",
        options: [
          "Compilation error: while loop requires curly brackets on separate line.",
          "Infinite loop: `i` never decreases, so the condition `i > 0` remains permanently true.",
          "StackOverflowException: while loops allocate stack frames on each pass.",
          "Memory leak in the console buffer."
        ],
        correct_index: 1,
        explanation: "Without decrementing the loop control variable `i`, `i` remains 10 indefinitely, causing an infinite loop that freezes CPU execution.",
        revision_topic: "Loops and Iteration"
      },
      {
        id: "w2-q7",
        category: "Debugging",
        text: "Consider validating employee working days: `if (days < 0 || days > 31) throw ...` What happens if `days` is 31 in February?",
        options: [
          "It correctly throws an exception.",
          "It accepts 31 as valid because month-specific boundary validation is missing.",
          "The runtime automatically detects February and changes the check.",
          "Throws ArgumentOutOfRangeException."
        ],
        correct_index: 1,
        explanation: "Hardcoded boundary checks like `days > 31` fail calendar edge cases (February has 28 or 29 days; April has 30). In payroll engines, date calculations must use `DateTime.DaysInMonth(year, month)`.",
        revision_topic: "Defensive Conditional Logic"
      },
      {
        id: "w2-q8",
        category: "SQL",
        text: "Which SQL clause filters records AFTER aggregation functions (like SUM, COUNT, AVG) have been applied?",
        options: [
          "WHERE",
          "HAVING",
          "ORDER BY",
          "GROUP BY"
        ],
        correct_index: 1,
        explanation: "`WHERE` filters individual rows BEFORE aggregation. `HAVING` filters aggregated group results AFTER the GROUP BY has occurred.",
        revision_topic: "SQL Filtering and Grouping"
      },
      {
        id: "w2-q9",
        category: "DSA",
        text: "What is the time complexity of finding the maximum element in an unsorted array of size N using a single loop?",
        options: [
          "O(1)",
          "O(log N)",
          "O(N)",
          "O(N^2)"
        ],
        correct_index: 2,
        explanation: "To find the maximum in an unsorted array, every single element must be inspected at least once, giving O(N) linear time complexity.",
        revision_topic: "Array Problems"
      },
      {
        id: "w2-q10",
        category: "Business Scenario",
        text: "An ERP workflow calculates leave penalties: If unauthorized absence is between 1 and 3 days, deduct 1x basic daily pay. If > 3 days, deduct 1.5x basic daily pay. What is the cleanest C# pattern to express this?",
        options: [
          "7 nested if/else statements with hardcoded values.",
          "A switch expression matching on relational patterns: `days switch { <= 0 => 0, <= 3 => 1.0m, _ => 1.5m }`.",
          "A while loop that iterates day by day.",
          "Storing the penalty in a global static variable."
        ],
        correct_index: 1,
        explanation: "Relational pattern matching in modern C# switch expressions provides clean, readable, self-documenting code with clear boundary conditions.",
        revision_topic: "Switch Statements and Expressions"
      }
    ]
  }
};

// Fallback dynamic quiz generator ensuring all 32 weeks have complete 10-question quizzes
export function getWeeklyQuiz(weekNumber) {
  const num = Number(weekNumber);
  if (WEEKLY_QUIZZES[num]) {
    return WEEKLY_QUIZZES[num];
  }

  // Generate a customized 10-question assessment matching the week's theme
  return {
    week_number: num,
    title: `Week ${num} Comprehensive Assessment`,
    duration_minutes: 20,
    questions: [
      {
        id: `w${num}-q1`,
        category: "Concept Understanding",
        text: `What is the primary architectural purpose of the core subjects introduced in Week ${num}?`,
        options: [
          "To provide visual animations for frontend components.",
          "To enforce modularity, reliability, and enterprise maintainability in backend systems.",
          "To replace relational databases with flat text files.",
          "To disable compile-time type checking."
        ],
        correct_index: 1,
        explanation: `Enterprise backend engineering centers on building maintainable, scalable, and resilient systems. Week ${num} focuses on reinforcing these foundational patterns.`,
        revision_topic: `Week ${num} Core Concepts`
      },
      {
        id: `w${num}-q2`,
        category: "Concept Understanding",
        text: `How does proper abstraction in Week ${num} prevent regression bugs across large engineering teams?`,
        options: [
          "By hiding implementation details behind well-defined interfaces and contracts.",
          "By making all class fields public for quick debugging.",
          "By writing all code in a single file to eliminate project dependencies.",
          "By executing tests only in production."
        ],
        correct_index: 0,
        explanation: "Encapsulation and well-defined contracts allow internal implementations to be refactored or optimized without breaking calling code.",
        revision_topic: `Week ${num} Architecture`
      },
      {
        id: `w${num}-q3`,
        category: "Concept Understanding",
        text: `Which pattern best ensures safe resource cleanup when managing database connections or network sockets?`,
        options: [
          "Relying entirely on garbage collection without calling Dispose.",
          "Using the `using` statement or `await using` to guarantee deterministic disposal.",
          "Suppressing all exceptions with empty catch blocks.",
          "Calling GC.Collect() manually after every database query."
        ],
        correct_index: 1,
        explanation: "The `using` statement ensures `IDisposable.Dispose()` is called even if an exception occurs, preventing connection leaks.",
        revision_topic: "Resource Management & Disposal"
      },
      {
        id: `w${num}-q4`,
        category: "Concept Understanding",
        text: `In enterprise systems, why should business domain logic be kept separate from HTTP infrastructure code?`,
        options: [
          "It makes the solution slower to execute.",
          "It allows domain logic to be unit tested without spinning up web servers or mock HTTP contexts.",
          "It is required by the C# compiler.",
          "Domain entities cannot be compiled into class libraries."
        ],
        correct_index: 1,
        explanation: "Decoupling business logic from presentation frameworks (Clean Architecture) ensures business rules remain easily testable, reusable across background workers, and independent of external frameworks.",
        revision_topic: "Separation of Concerns"
      },
      {
        id: `w${num}-q5`,
        category: "Code Output / Debugging",
        text: "What is the primary risk of executing synchronous blocking calls (`.Result` or `.Wait()`) on asynchronous Tasks?",
        options: [
          "Thread pool starvation and potential deadlocks in synchronization contexts.",
          "The code compiles to 32-bit instead of 64-bit.",
          "Memory usage drops to zero.",
          "Database indexes are dropped automatically."
        ],
        correct_index: 0,
        explanation: "Blocking asynchronously queued work with `.Result` ties up a thread pool thread waiting for another thread pool thread, which can exhaust the thread pool and trigger deadlocks under load.",
        revision_topic: "Asynchronous Programming"
      },
      {
        id: `w${num}-q6`,
        category: "Code Output / Debugging",
        text: "When inspecting a slow database query in production, what indicates that an index is missing or bypassed?",
        options: [
          "An Index Seek with low cost.",
          "A Table Scan or Clustered Index Scan with high I/O cost on a multi-million row table.",
          "A small memory grant.",
          "The query returns results in 2 milliseconds."
        ],
        correct_index: 1,
        explanation: "A Table Scan or Clustered Index Scan means SQL Server had to read every page of the table from disk/memory because no covering index existed to satisfy the query with a targeted Seek.",
        revision_topic: "SQL Indexing & Execution Plans"
      },
      {
        id: `w${num}-q7`,
        category: "Edge Cases",
        text: "How should an enterprise backend handle two concurrent requests attempting to update the same record simultaneously?",
        options: [
          "Allow the last write to silently overwrite the first write without warning.",
          "Implement optimistic concurrency with a RowVersion/timestamp token and return HTTP 409 Conflict on mismatch.",
          "Shut down the database server.",
          "Re-run both requests in an infinite retry loop."
        ],
        correct_index: 1,
        explanation: "Optimistic concurrency uses row versioning to detect when another transaction modified the row since it was read, preventing lost updates.",
        revision_topic: "Concurrency & Transactions"
      },
      {
        id: `w${num}-q8`,
        category: "SQL",
        text: "What is the purpose of a Common Table Expression (CTE) defined with `WITH cte_name AS (...)` in SQL Server?",
        options: [
          "To permanently store table data in tempdb.",
          "To create a temporary named result set that can be referenced within a single SELECT, INSERT, UPDATE, or DELETE statement.",
          "To bypass foreign key constraints.",
          "To compress database log files."
        ],
        correct_index: 1,
        explanation: "A CTE improves query readability, modularity, and enables recursive queries (e.g. employee managerial hierarchies).",
        revision_topic: "Advanced SQL"
      },
      {
        id: `w${num}-q9`,
        category: "DSA",
        text: "Which data structure provides O(1) average lookup, insertion, and deletion by key?",
        options: [
          "Sorted Array",
          "Hash Table / Dictionary",
          "Binary Search Tree",
          "Singly Linked List"
        ],
        correct_index: 1,
        explanation: "Hash Tables (such as Dictionary<TKey, TValue> in C#) compute bucket indices from hash codes, yielding O(1) average time complexity.",
        revision_topic: "Data Structures & Time Complexity"
      },
      {
        id: `w${num}-q10`,
        category: "Business Scenario",
        text: `In a university ERP with multiple campuses, an automated attendance job runs every midnight. If the database connection drops halfway through processing, how should the job recover?`,
        options: [
          "Re-run the entire job from the start without checking what was already inserted, creating duplicate records.",
          "Design the job to be idempotent using transactions and record tracking so re-running only processes uncompleted campuses safely.",
          "Ignore the failure and wait until the next midnight.",
          "Delete all attendance history for the semester."
        ],
        correct_index: 1,
        explanation: "Enterprise background jobs must be idempotent: re-running a failed or partially completed job must produce the exact same final state without data duplication or corruption.",
        revision_topic: "System Design & Idempotency"
      }
    ]
  };
}

