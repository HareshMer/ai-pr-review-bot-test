# AI PR Review Bot — Dedicated Demo & Test Repository (`ai-pr-review-bot-test`)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![Clean Baseline](https://img.shields.io/badge/Branch-Clean%20Starter%20Baseline-success.svg)](#clean-baseline-architecture)

A lightweight, independent TypeScript testing environment designed specifically for end-to-end pull request testing of the **AI PR Review Bot**.

---

## 1. Clean Baseline Architecture

To support pull request testing, this repository's default branch (`main`) is structured as a **clean starter baseline**:
- **Clean Application Logic:** Contains only verified, secure code in `src/clean/math.ts` and `src/index.ts`.
- **Zero Vulnerabilities in Base Branch:** The base branch contains no secrets, banned imports, or debug artifacts.
- **Pull Request Driven Testing:** Each test scenario (TC-01 through TC-10) is introduced on its own feature branch (`test/tc-*`) creating a distinct pull request with additions (`+` lines) for the bot to analyze.

---

## 2. Directory Structure

```text
ai-pr-review-bot-test/
├── README.md                      # Project documentation and test overview
├── package.json                   # Minimal package configuration (zero runtime dependencies)
├── tsconfig.json                  # TypeScript compiler options (Node.js 22 ES2022/NodeNext)
├── .gitignore                     # Git ignore rules for build and dependency artifacts
├── docs/
│   ├── TEST_SCENARIOS.md          # Complete specifications & code snippets for TC-01 to TC-10
│   ├── EXPECTED_FINDINGS.md       # Catalog of expected findings, severities, and redactions
│   └── TEST_EXECUTION_GUIDE.md    # Step-by-step instructions for running GitHub PR tests
├── src/
│   ├── index.ts                   # Clean library entrypoint
│   ├── clean/
│   │   └── math.ts                # Clean, secure math utilities (baseline)
│   └── types/
│       └── ambient.d.ts           # Ambient type definitions for testing banned module imports
└── scripts/
    └── verify-project.ts          # Baseline verification script
```

---

## 3. Test Scenarios Quick Reference

| Scenario ID | Feature Branch | Target File | What It Tests | Expected Verdict |
| :--- | :--- | :--- | :--- | :---: |
| **TC-01** | `test/tc-01-clean-pr` | `src/clean/math.ts` | Clean code changes | **APPROVE** |
| **TC-02** | `test/tc-02-aws-secret` | `src/secrets/aws.ts` | Synthetic AWS keys (`AKIA`, `ASIA`, Secret) | **REQUEST_CHANGES** |
| **TC-03** | `test/tc-03-google-secret` | `src/secrets/google.ts` | Synthetic Google/Gemini API key (`AIza...`) | **REQUEST_CHANGES** |
| **TC-04** | `test/tc-04-database-secret`| `src/secrets/database.ts` | Database connection strings with passwords | **REQUEST_CHANGES** |
| **TC-05** | `test/tc-05-github-token` | `src/secrets/github.ts` | GitHub tokens (Classic, Fine-Grained, OAuth) | **REQUEST_CHANGES** |
| **TC-06** | `test/tc-06-private-key` | `src/secrets/private-key.ts`| Multiline PEM & PuTTY private key material | **REQUEST_CHANGES** |
| **TC-07** | `test/tc-07-banned-import` | `src/imports/dangerous-import.ts` | Malicious and deprecated module imports | **REQUEST_CHANGES** |
| **TC-08** | `test/tc-08-debug-statements`| `src/debug/debug-statements.ts` | Leftover `debugger;` and `console.log` statements | **COMMENT** |
| **TC-09** | `test/tc-09-multiple-findings`| `src/aggregation/multiple-findings.ts` | Multi-finding aggregation on identical lines | **REQUEST_CHANGES** |
| **TC-10** | `test/tc-10-ai-review` | `src/ai-review/review-example.ts` | AI bugs (SQL injection, off-by-one, race condition) | **REQUEST_CHANGES** |

---

## 4. Local Verification & Baseline Checking

### Prerequisites
- Node.js `v22.x` or higher
- npm `v10.x` or higher

### Commands
```bash
# Typecheck TypeScript source files
npm run typecheck

# Build the project into ./dist
npm run build

# Verify that the default branch is a clean baseline with no vulnerabilities
npm run verify
```

---

## 5. Documentation References

- [**TEST_SCENARIOS.md**](file:///docs/TEST_SCENARIOS.md): Complete specifications, feature branch names, and exact copy-pasteable snippets.
- [**EXPECTED_FINDINGS.md**](file:///docs/EXPECTED_FINDINGS.md): Matrix of expected findings, rule IDs, and redaction tokens.
- [**TEST_EXECUTION_GUIDE.md**](file:///docs/TEST_EXECUTION_GUIDE.md): Step-by-step instructions for executing GitHub PR test runs.
