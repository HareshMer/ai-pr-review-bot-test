# AI PR Review Bot — Expected Findings Catalog

This catalog details the exact expected findings for every test scenario when introduced on its feature branch in `ai-pr-review-bot-test`.

---

## 1. Findings Matrix by Feature Branch

| Scenario | Feature Branch | Target File | Line(s) | Rule ID | Source | Severity | Category | Redaction Token |
| :--- | :--- | :--- | :---: | :--- | :---: | :---: | :---: | :--- |
| **TC-01** | `test/tc-01-clean-pr` | `src/clean/math.ts` | — | *(None)* | — | — | — | *(None)* |
| **TC-02** | `test/tc-02-aws-secret` | `src/secrets/aws.ts` | 10 | `secret-aws-access-key` | RULE | CRITICAL | SECURITY | `[REDACTED_AWS_ACCESS_KEY]` |
| **TC-02** | `test/tc-02-aws-secret` | `src/secrets/aws.ts` | 11 | `secret-aws-secret-key` | RULE | CRITICAL | SECURITY | `[REDACTED_AWS_SECRET_KEY]` |
| **TC-02** | `test/tc-02-aws-secret` | `src/secrets/aws.ts` | 12 | `secret-aws-temporary-key` | RULE | CRITICAL | SECURITY | `[REDACTED_AWS_TEMPORARY_KEY]` |
| **TC-03** | `test/tc-03-google-secret` | `src/secrets/google.ts` | 6 | `secret-google-api-key` | RULE | CRITICAL | SECURITY | `[REDACTED_GOOGLE_API_KEY]` |
| **TC-04** | `test/tc-04-database-secret` | `src/secrets/database.ts` | 1 | `secret-database-uri` | RULE | CRITICAL | SECURITY | `[REDACTED_DATABASE_PASSWORD]` |
| **TC-04** | `test/tc-04-database-secret` | `src/secrets/database.ts` | 2 | `secret-database-uri` | RULE | CRITICAL | SECURITY | `[REDACTED_DATABASE_PASSWORD]` |
| **TC-05** | `test/tc-05-github-token` | `src/secrets/github.ts` | 2 | `secret-github-pat` | RULE | CRITICAL | SECURITY | `[REDACTED_GITHUB_PAT]` |
| **TC-05** | `test/tc-05-github-token` | `src/secrets/github.ts` | 3 | `secret-github-fine-grained-pat`| RULE | CRITICAL | SECURITY | `[REDACTED_GITHUB_FINE_GRAINED_PAT]` |
| **TC-05** | `test/tc-05-github-token` | `src/secrets/github.ts` | 4 | `secret-github-oauth-app-token` | RULE | CRITICAL | SECURITY | `[REDACTED_GITHUB_APP_TOKEN]` |
| **TC-06** | `test/tc-06-private-key` | `src/secrets/private-key.ts`| 2 | `secret-private-key` | RULE | CRITICAL | SECURITY | `[REDACTED_PRIVATE_KEY_HEADER]` |
| **TC-06** | `test/tc-06-private-key` | `src/secrets/private-key.ts`| 3, 4 | `secret-private-key` | RULE | CRITICAL | SECURITY | `[REDACTED_PRIVATE_KEY_BODY_LINE]` |
| **TC-06** | `test/tc-06-private-key` | `src/secrets/private-key.ts`| 8 | `secret-private-key` | RULE | CRITICAL | SECURITY | `[REDACTED_PUTTY_PRIVATE_KEY]` |
| **TC-07** | `test/tc-07-banned-import` | `src/imports/dangerous-import.ts` | 1 | `import-prohibited-flatmap-stream` | RULE | CRITICAL | SECURITY | *(None)* |
| **TC-07** | `test/tc-07-banned-import` | `src/imports/dangerous-import.ts` | 2 | `import-dangerous-child-process` | RULE | WARNING | SECURITY | *(None)* |
| **TC-07** | `test/tc-07-banned-import` | `src/imports/dangerous-import.ts` | 3 | `import-supply-chain-event-stream` | RULE | WARNING | SECURITY | *(None)* |
| **TC-07** | `test/tc-07-banned-import` | `src/imports/dangerous-import.ts` | 4 | `import-deprecated-request` | RULE | SUGGESTION | BEST_PRACTICE | *(None)* |
| **TC-07** | `test/tc-07-banned-import` | `src/imports/dangerous-import.ts` | 5 | `import-maintainability-lodash` | RULE | SUGGESTION | BEST_PRACTICE | *(None)* |
| **TC-08** | `test/tc-08-debug-statements`| `src/debug/debug-statements.ts` | 7 | `debug-js-debugger` | RULE | SUGGESTION | BEST_PRACTICE | *(None)* |
| **TC-08** | `test/tc-08-debug-statements`| `src/debug/debug-statements.ts` | 8 | `debug-console-log` | RULE | SUGGESTION | BEST_PRACTICE | *(None)* |
| **TC-08** | `test/tc-08-debug-statements`| `src/debug/debug-statements.ts` | 9 | `debug-console-log` | RULE | SUGGESTION | BEST_PRACTICE | *(None)* |
| **TC-08** | `test/tc-08-debug-statements`| `src/debug/debug-statements.ts` | 10 | `debug-console-log` | RULE | SUGGESTION | BEST_PRACTICE | *(None)* |
| **TC-09** | `test/tc-09-multiple-findings`| `src/aggregation/multiple-findings.ts` | 5 | `debug-console-log` & `secret-aws-access-key` | RULE | SUGGESTION & CRITICAL | BEST_PRACTICE & SECURITY | `[REDACTED_AWS_ACCESS_KEY]` |
| **TC-09** | `test/tc-09-multiple-findings`| `src/aggregation/multiple-findings.ts` | 8 | `debug-js-debugger` & `secret-google-api-key` | RULE | SUGGESTION & CRITICAL | BEST_PRACTICE & SECURITY | `[REDACTED_GOOGLE_API_KEY]` |
| **TC-10** | `test/tc-10-ai-review` | `src/ai-review/review-example.ts` | 7 | *(AI Finding: SQL Injection)* | AI | CRITICAL/WARNING | SECURITY | *(None)* |
| **TC-10** | `test/tc-10-ai-review` | `src/ai-review/review-example.ts` | 14 | *(AI Finding: Off-by-one boundary loop)* | AI | WARNING | BUG | *(None)* |
| **TC-10** | `test/tc-10-ai-review` | `src/ai-review/review-example.ts` | 22 | *(AI Finding: Unhandled null dereference)* | AI | WARNING | BUG | *(None)* |
| **TC-10** | `test/tc-10-ai-review` | `src/ai-review/review-example.ts` | 31 | *(AI Finding: Async race condition)* | AI | WARNING | BUG | *(None)* |

---

## 2. Redaction Standards

Whenever a secret rule is triggered on a pull request:
1. **Zero Secret Leakage:** The raw secret text must NEVER appear in the posted GitHub review body or inline comment.
2. **Standard Redaction Tokens:**
   - AWS Access Key: `[REDACTED_AWS_ACCESS_KEY]`
   - AWS Secret Access Key: `[REDACTED_AWS_SECRET_KEY]`
   - AWS STS Temporary Key: `[REDACTED_AWS_TEMPORARY_KEY]`
   - Google / Gemini API Key: `[REDACTED_GOOGLE_API_KEY]`
   - Database Connection URI Password: `[REDACTED_DATABASE_PASSWORD]`
   - GitHub Classic PAT: `[REDACTED_GITHUB_PAT]`
   - GitHub Fine-Grained PAT: `[REDACTED_GITHUB_FINE_GRAINED_PAT]`
   - GitHub OAuth / App Token: `[REDACTED_GITHUB_APP_TOKEN]`
   - Private Key Header: `[REDACTED_PRIVATE_KEY_HEADER]`
   - Private Key Body Material: `[REDACTED_PRIVATE_KEY_BODY_LINE]`
   - PuTTY Private Key: `[REDACTED_PUTTY_PRIVATE_KEY]`

---

## 3. Pull Request Verdict Rules

- **REQUEST_CHANGES:** Emitted when **>= 1 CRITICAL** finding exists in the PR diff (e.g., exposed credentials, prohibited malicious package `flatmap-stream`, severe security vulnerabilities).
- **COMMENT:** Emitted when findings are limited to **WARNING** or **SUGGESTION** tiers (e.g., leftover `debugger;` or `console.log` statements).
- **APPROVE:** Emitted when there are **0 findings** or all checks pass cleanly (e.g., clean PR baseline changes in `src/clean/math.ts`).
