#!/usr/bin/env node
/**
 * Benchmark for chokidar file watching performance
 * Measures operations per second for file change detection
 */

import chokidar from '../index.js';
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BENCHMARK_DIR = join(tmpdir(), `chokidar-bench-${Date.now()}`);
const NUM_FILES = 100;
const NUM_CHANGES = 50;

async function setup() {
  await mkdir(BENCHMARK_DIR, { recursive: true });
  // Create initial files
  for (let i = 0; i < NUM_FILES; i++) {
    await writeFile(join(BENCHMARK_DIR, `file${i}.txt`), `initial content ${i}`);
  }
}

async function cleanup() {
  try {
    await rm(BENCHMARK_DIR, { recursive: true, force: true });
  } catch (err) {
    // Ignore cleanup errors
  }
}

async function runBenchmark() {
  await setup();

  return new Promise((resolve, reject) => {
    let detectedChanges = 0;
    const startTime = Date.now();
    const timeout = setTimeout(() => {
      reject(new Error('Benchmark timed out'));
    }, 30000);

    const watcher = chokidar.watch(BENCHMARK_DIR, {
      ignoreInitial: true,
      persistent: true,
      awaitWriteFinish: false,
    });

    watcher.on('ready', async () => {
      const changeStartTime = Date.now();

      // Make changes to files
      for (let i = 0; i < NUM_CHANGES; i++) {
        const fileIndex = i % NUM_FILES;
        const filePath = join(BENCHMARK_DIR, `file${fileIndex}.txt`);
        await writeFile(filePath, `changed content ${i} at ${Date.now()}`);
      }
    });

    watcher.on('change', (path) => {
      detectedChanges++;

      if (detectedChanges >= NUM_CHANGES) {
        const endTime = Date.now();
        const totalTime = (endTime - startTime) / 1000; // in seconds
        const opsPerSec = NUM_CHANGES / totalTime;

        clearTimeout(timeout);
        watcher.close().then(async () => {
          await cleanup();
          resolve(opsPerSec);
        });
      }
    });

    watcher.on('error', (error) => {
      clearTimeout(timeout);
      watcher.close().then(() => cleanup());
      reject(error);
    });
  });
}

async function main() {
  try {
    console.log(`Benchmarking chokidar with ${NUM_FILES} files and ${NUM_CHANGES} changes...`);

    // Warm up run
    await runBenchmark();

    // Actual benchmark runs
    const runs = 3;
    const results = [];

    for (let i = 0; i < runs; i++) {
      const opsPerSec = await runBenchmark();
      results.push(opsPerSec);
      console.log(`Run ${i + 1}: ${opsPerSec.toFixed(2)} ops/sec`);
    }

    const avgOpsPerSec = results.reduce((a, b) => a + b, 0) / results.length;
    console.log(`Average: ${avgOpsPerSec.toFixed(2)} ops/sec`);
    console.log(`METRIC=${avgOpsPerSec.toFixed(2)}`);

  } catch (error) {
    console.error('Benchmark failed:', error);
    await cleanup();
    process.exit(1);
  }
}

main();
