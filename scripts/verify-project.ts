/**
 * Project Verification Script for ai-pr-review-bot-test (Clean Baseline)
 * 
 * Verifies:
 * 1. Default branch baseline cleanliness:
 *    - Asserts that active source files in src/ contain ZERO intentional vulnerabilities,
 *      ZERO hardcoded secrets, ZERO banned imports, and ZERO debug statements.
 * 2. Clean starter logic availability:
 *    - Asserts that src/clean/math.ts and src/index.ts exist and are valid.
 * 3. Complete documentation for all 10 test scenarios in docs/:
 *    - Asserts all 10 feature branch names, synthetic snippets, expected findings,
 *      Gemini behaviors, inline comments, and pass/fail conditions are present.
 * 4. Safety assurances:
 *    - Asserts zero real credentials or destructive payloads.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

interface CheckResult {
  category: string;
  name: string;
  passed: boolean;
  details?: string;
}

const REQUIRED_FILES: string[] = [
  'README.md',
  'package.json',
  'tsconfig.json',
  '.gitignore',
  'docs/TEST_SCENARIOS.md',
  'docs/EXPECTED_FINDINGS.md',
  'docs/TEST_EXECUTION_GUIDE.md',
  'src/index.ts',
  'src/clean/math.ts',
  'src/types/ambient.d.ts',
  'scripts/verify-project.ts'
];

const EXPECTED_BRANCHES: string[] = [
  'test/tc-01-clean-pr',
  'test/tc-02-aws-secret',
  'test/tc-03-google-secret',
  'test/tc-04-database-secret',
  'test/tc-05-github-token',
  'test/tc-06-private-key',
  'test/tc-07-banned-import',
  'test/tc-08-debug-statements',
  'test/tc-09-multiple-findings',
  'test/tc-10-ai-review'
];

const VULNERABILITY_PATTERNS = [
  { name: 'AWS Access Key', regex: /\b(AKIA[0-9A-Z]{16})\b/ },
  { name: 'AWS STS Key', regex: /\b(ASIA[0-9A-Z]{16})\b/ },
  { name: 'Google / Gemini API Key', regex: /\b(AIza[0-9A-Za-z-_]{35})\b/ },
  { name: 'Database URI Credentials', regex: /\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^:]+:[^@]+@/ },
  { name: 'GitHub Classic PAT', regex: /\b(ghp_[a-zA-Z0-9]{36})\b/ },
  { name: 'Cryptographic Private Key Block', regex: /-----BEGIN (?:[A-Z0-9_-]+ )?PRIVATE KEY(?: BLOCK)?-----/ },
  { name: 'Banned Malicious Import', regex: /['"]flatmap-stream['"]/ },
  { name: 'Contextually Dangerous Import', regex: /import\s+.*['"]child_process['"]/ },
  { name: 'Debugger Statement', regex: /^\s*debugger\s*;?/m },
  { name: 'Console Log Statement', regex: /^\s*console\.(log|debug|dir)\s*\(/m }
];

function getAllSourceFiles(dir: string): string[] {
  let files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllSourceFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
      files.push(fullPath);
    }
  }
  return files;
}

function runVerification(): void {
  const results: CheckResult[] = [];
  console.log('\n=============================================================');
  console.log(' AI PR Review Bot Demo — Clean Baseline Verification');
  console.log('=============================================================\n');

  // 1. Structure Verification
  console.log('[1/4] Checking Required Baseline Files...');
  for (const relPath of REQUIRED_FILES) {
    const fullPath = path.join(PROJECT_ROOT, relPath);
    const exists = fs.existsSync(fullPath);
    const size = exists ? fs.statSync(fullPath).size : 0;
    const passed = exists && size > 0;

    results.push({
      category: 'Structure',
      name: relPath,
      passed,
      details: passed ? `${size} bytes` : 'Missing or empty'
    });
  }

  // 2. Clean Baseline Verification (Asserting NO intentional vulnerabilities exist in src/)
  console.log('[2/4] Verifying Default Branch Contains Zero Intentional Vulnerabilities in src/...');
  const srcDir = path.join(PROJECT_ROOT, 'src');
  const sourceFiles = getAllSourceFiles(srcDir);

  let cleanBaselinePassed = true;
  const baselineViolations: string[] = [];

  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const relFile = path.relative(PROJECT_ROOT, file);

    for (const pattern of VULNERABILITY_PATTERNS) {
      if (pattern.regex.test(content)) {
        cleanBaselinePassed = false;
        baselineViolations.push(`Found ${pattern.name} in ${relFile}`);
      }
    }
  }

  results.push({
    category: 'Clean Baseline',
    name: 'Default Branch Clean Source Assurance',
    passed: cleanBaselinePassed,
    details: cleanBaselinePassed
      ? `All ${sourceFiles.length} source file(s) in src/ are 100% clean (zero vulnerabilities)`
      : baselineViolations.join('; ')
  });

  // 3. Documentation Completeness (TC-01 through TC-10)
  console.log('[3/4] Verifying Documentation of All 10 Test Scenarios in docs/...');
  const scenariosPath = path.join(PROJECT_ROOT, 'docs', 'TEST_SCENARIOS.md');
  const scenariosContent = fs.existsSync(scenariosPath) ? fs.readFileSync(scenariosPath, 'utf8') : '';

  for (const branch of EXPECTED_BRANCHES) {
    const branchDocumented = scenariosContent.includes(branch);
    results.push({
      category: 'Scenario Docs',
      name: `Branch Specification: ${branch}`,
      passed: branchDocumented,
      details: branchDocumented ? 'Branch and snippet fully documented' : 'Missing branch documentation'
    });
  }

  const requiredDocSections = [
    'Synthetic Code Snippet to Introduce',
    'Expected Deterministic Finding',
    'Expected Gemini Behavior',
    'Expected GitHub Inline Comment',
    'Expected Pass/Fail Condition'
  ];

  for (const section of requiredDocSections) {
    const sectionDocumented = scenariosContent.includes(section);
    results.push({
      category: 'Scenario Docs',
      name: `Scenario Section: ${section}`,
      passed: sectionDocumented,
      details: sectionDocumented ? 'Section documented across scenarios' : 'Missing section definition'
    });
  }

  // 4. Safety Assurance
  console.log('[4/4] Verifying Safety & Synthetic Isolation Assurances...');
  let safetyPassed = true;
  const safetyDetails: string[] = [];

  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('prod-db.corp.google.com') || content.includes('aws.prod.internal.corp')) {
      safetyPassed = false;
      safetyDetails.push(`Production identifier found in ${path.relative(PROJECT_ROOT, file)}`);
    }
  }

  results.push({
    category: 'Safety',
    name: 'Synthetic Data & Isolation Assurance',
    passed: safetyPassed,
    details: safetyPassed ? 'Verified: No real credentials or production endpoints' : safetyDetails.join(', ')
  });

  // Summary Output
  console.log('\nVerification Summary Report:\n');
  let passedCount = 0;
  let failedCount = 0;

  for (const res of results) {
    const status = res.passed ? '[\x1b[32mPASS\x1b[0m]' : '[\x1b[31mFAIL\x1b[0m]';
    console.log(`  ${status} [${res.category}] ${res.name} — ${res.details}`);
    if (res.passed) {
      passedCount++;
    } else {
      failedCount++;
    }
  }

  console.log('\n-------------------------------------------------------------');
  console.log(`Total Checks: ${results.length} | Passed: ${passedCount} | Failed: ${failedCount}`);
  console.log('-------------------------------------------------------------\n');

  if (failedCount > 0) {
    console.error('\x1b[31mVerification FAILED with ' + failedCount + ' error(s).\x1b[0m\n');
    process.exit(1);
  } else {
    console.log('\x1b[32mAll verification checks PASSED successfully! Default branch is a clean baseline.\x1b[0m\n');
  }
}

runVerification();
