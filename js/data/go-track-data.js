/**
 * go-track-data.js - Lightweight Secondary Go Learning Track
 * An optional, structured supplementary track for Saturday practice sessions.
 * Designed not to disrupt the primary C# / .NET backend focus.
 */

export const GO_TRACK_MODULES = [
  {
    id: "go-mod-1",
    phase: "Foundation",
    title: "Go Syntax, Types, Functions & Structs",
    suggested_weeks: "Weeks 1–6 (Saturdays)",
    description: "Learn the core philosophy of Go: simplicity, fast compilation, explicit error handling, and memory layout.",
    topics: [
      { id: "go-1-1", title: "Variables, Zero Values & Short Variable Declaration (:=)", docs: "https://go.dev/tour/basics/8" },
      { id: "go-1-2", title: "Functions, Multiple Return Values & Named Returns", docs: "https://go.dev/tour/basics/4" },
      { id: "go-1-3", title: "Control Flow: if with short statement, switch, and single 'for' loop", docs: "https://go.dev/tour/flowcontrol/1" },
      { id: "go-1-4", title: "Pointers & Value vs Pointer Semantics", docs: "https://go.dev/tour/moretypes/1" },
      { id: "go-1-5", title: "Structs, Embedding (Composition over Inheritance)", docs: "https://go.dev/tour/moretypes/2" }
    ],
    milestone_task: "Build a CLI in Go that parses employee records and calculates basic allowances using structs."
  },
  {
    id: "go-mod-2",
    phase: "Data Structures & Idiomatic Patterns",
    title: "Arrays, Slices, Maps & Explicit Errors",
    suggested_weeks: "Weeks 7–12 (Saturdays)",
    description: "Master Go's dynamic slice header, map lookups, package organization, and idiomatic error handling without exceptions.",
    topics: [
      { id: "go-2-1", title: "Arrays vs Slices: Pointer, Length, and Capacity (cap)", docs: "https://go.dev/tour/moretypes/7" },
      { id: "go-2-2", title: "Slice Append & Resizing Gotchas", docs: "https://go.dev/tour/moretypes/15" },
      { id: "go-2-3", title: "Maps, Comma-ok Idiom & Deletion", docs: "https://go.dev/tour/moretypes/19" },
      { id: "go-2-4", title: "Explicit Error Handling (if err != nil) & errors.Is / errors.As", docs: "https://go.dev/blog/go1.13-errors" },
      { id: "go-2-5", title: "Go Modules (go mod init, go mod tidy, internal packages)", docs: "https://go.dev/doc/modules/developing" }
    ],
    milestone_task: "Build an attendance log deduplicator in Go using maps and custom error types."
  },
  {
    id: "go-mod-3",
    phase: "HTTP & Web Services",
    title: "Standard Library HTTP, JSON & Database Interaction",
    suggested_weeks: "Weeks 13–18 (Saturdays)",
    description: "Build lightweight REST services using the standard net/http library and database/sql without bloated frameworks.",
    topics: [
      { id: "go-3-1", title: "net/http Server, ServeMux (Go 1.22+ routing) & Handlers", docs: "https://pkg.go.dev/net/http" },
      { id: "go-3-2", title: "JSON Encoding / Decoding with struct tags (`json:\"name\"`)", docs: "https://go.dev/blog/json" },
      { id: "go-3-3", title: "Middleware Pattern in Go (func(http.Handler) http.Handler)", docs: "https://go.dev/wiki/Middleware" },
      { id: "go-3-4", title: "database/sql with SQL Server / PostgreSQL Drivers", docs: "https://go.dev/doc/database/" },
      { id: "go-3-5", title: "Structured Logging with slog (Go 1.21+)", docs: "https://go.dev/blog/slog" }
    ],
    milestone_task: "Build a minimal Go HTTP microservice that serves employee leave balances as JSON."
  },
  {
    id: "go-mod-4",
    phase: "Concurrency & Distributed Primitives",
    title: "Goroutines, Channels, Select & Context",
    suggested_weeks: "Weeks 19–26 (Saturdays)",
    description: "Explore Communicating Sequential Processes (CSP): lightweight green threads, buffered channels, sync.WaitGroup, and context cancellation.",
    topics: [
      { id: "go-4-1", title: "Goroutines (runtime cost ~2KB stack) vs OS Threads", docs: "https://go.dev/tour/concurrency/1" },
      { id: "go-4-2", title: "Unbuffered vs Buffered Channels", docs: "https://go.dev/tour/concurrency/2" },
      { id: "go-4-3", title: "select Statement, Timeouts & Deadlock Avoidance", docs: "https://go.dev/tour/concurrency/5" },
      { id: "go-4-4", title: "sync.WaitGroup and sync.Mutex for Shared State", docs: "https://go.dev/tour/concurrency/9" },
      { id: "go-4-5", title: "context.Context for Cancellation & Request Deadlines", docs: "https://go.dev/blog/context" }
    ],
    milestone_task: "Build a concurrent worker pool in Go that processes 10,000 attendance records concurrently with cancellation."
  },
  {
    id: "go-mod-5",
    phase: "Production Engineering",
    title: "Testing, Profiling, Docker & Integration",
    suggested_weeks: "Weeks 27–32 (Saturdays)",
    description: "Write table-driven tests, benchmark allocations with `go test -bench`, create minimal scratch Docker images, and compare Go vs .NET.",
    topics: [
      { id: "go-5-1", title: "Table-Driven Unit Tests with `testing` Package", docs: "https://go.dev/doc/tutorial/add-a-test" },
      { id: "go-5-2", title: "Benchmarking & Allocation Profiling (pprof, benchmem)", docs: "https://go.dev/blog/pprof" },
      { id: "go-5-3", title: "Multi-Stage Docker Builds (FROM scratch / alpine ~15MB image)", docs: "https://docs.docker.com/language/golang/build-images/" },
      { id: "go-5-4", title: "Architectural Comparison: When to choose .NET Core vs Go in Enterprise", docs: "https://learn.microsoft.com/" }
    ],
    milestone_task: "Containerize the Go microservice into a 15MB Docker image and document the memory trade-offs vs ASP.NET Core."
  }
];

