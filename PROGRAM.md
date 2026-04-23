# Research Program

cli_version: 0.5.3
default_branch: main
lead_github_login: samadin-123
maintainer_github_login: samadin-123
metric_tolerance: 0.01
metric_direction: higher_is_better
required_confirmations: 0
auto_approve: true
min_queue_depth: 5
assignment_timeout: 24h

## Goal

Improve file change detection performance (ops/sec) in the chokidar file watching library. Target: achieve at least 5% improvement in the benchmark that measures how quickly chokidar can detect file changes across 100 files with 50 sequential modifications.

## What you CAN modify

- `src/index.ts` — main file watcher implementation
- `src/handler.ts` — event handling and platform-specific logic

## What you CANNOT modify

- `PROGRAM.md` — research program specification
- `PREPARE.md` — evaluation setup and trust boundary
- `.polyresearch/` — runtime directory including benchmark.js
- `src/index.test.ts` — test suite (must continue to pass)
- `package.json` — project configuration
- `tsconfig.json` — TypeScript configuration
- Any file that defines the evaluation harness or scoring logic

## Constraints

- All changes must pass the evaluation harness defined in PREPARE.md.
- Each experiment should be atomic and independently verifiable.
- All else being equal, simpler is better. A small improvement that adds ugly complexity is not worth keeping. Removing code and getting equal or better results is a great outcome.
- If a run crashes, use judgment: fix trivial bugs (typos, missing imports) and re-run. If the idea is fundamentally broken, skip it and move on.
- Document what you tried and what you observed in the attempt summary.

## Strategy hints

- Read the full codebase before your first experiment. Understand what you are working with.
- Start with the lowest-hanging fruit.
- Measure before and after every change.
- Read results.tsv to learn from history. Do not repeat approaches that already failed.
- If an approach does not show improvement after reasonable effort, release and move on.
- Try combining ideas from previous near-misses.
- If you are stuck, try something more radical. Re-read the source for new angles.
