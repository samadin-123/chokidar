# Evaluation Setup

This file is outside the editable surface. It defines how results are judged. Agents cannot modify the evaluator or the scoring logic — the evaluation is the trust boundary.

Consider defining more than one evaluation criterion. Optimizing for a single number makes it easy to overfit and silently break other things. A secondary metric or sanity check helps keep the process honest.

eval_cores: 1
eval_memory_gb: 1.0
prereq_command: npm run build

## Setup

Install dependencies and prepare the evaluation environment:

```bash
npm install
npm run build
```

The project uses TypeScript and must be compiled before running the benchmark. The `prereq_command` is set to `npm run build` to ensure compiled output is measured.

## Run command

```bash
node .polyresearch/benchmark.js
```

## Output format

The benchmark must print `METRIC=<number>` to stdout.

## Metric parsing

The CLI looks for `METRIC=<number>` or `ops_per_sec=<number>` in the output. The benchmark outputs the average operations per second across 3 runs in the format `METRIC=<number>`.

## Ground truth

The baseline metric represents file change detection throughput measured in operations per second (ops/sec).

**Measurement methodology:**
- Creates 100 text files in a temporary directory
- Initializes a chokidar watcher with `ignoreInitial: true`
- Sequentially modifies 50 files (with wraparound)
- Measures time from watcher initialization until all 50 changes are detected
- Runs 3 iterations after a warmup run and reports the average

**Baseline performance:** ~1590 ops/sec on the test environment (Linux 6.8.0, Node.js 20+)

**Secondary validation:** The full test suite in `src/index.test.ts` must pass (`npm test`) to ensure correctness is maintained. This guards against breaking changes while optimizing for performance.
