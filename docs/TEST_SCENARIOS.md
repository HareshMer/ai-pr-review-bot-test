# AI PR Review Bot — Test Scenarios Specification

This document details all ten test scenarios (TC-01 through TC-10) designed for testing the **AI PR Review Bot**.

> **Important Testing Concept:**  
> The repository's default branch (`main`) is maintained as a **clean starter baseline**.  
> Test scenario files and vulnerability fixtures **must not exist on the default branch**.  
> Instead, each test scenario is introduced as a new file or modification on its dedicated feature branch, creating a clean pull request against `main`.

---

## Scenario Index

| Scenario ID | Feature Branch | Target File | Action | Primary Target |
| :--- | :--- | :--- | :---: | :--- |
| **TC-01** | `test/tc-01-clean-pr` | `src/clean/math.ts` | Modify | Clean code baseline (0 findings) |
| **TC-02** | `test/tc-02-aws-secret` | `src/secrets/aws.ts` | Add | Synthetic AWS credentials (AKIA, ASIA, Secret Key) |
| **TC-03** | `test/tc-03-google-secret` | `src/secrets/google.ts` | Add | Synthetic Google / Gemini API key |
| **TC-04** | `test/tc-04-database-secret`| `src/secrets/database.ts` | Add | Database URI connection strings with passwords |
| **TC-05** | `test/tc-05-github-token` | `src/secrets/github.ts` | Add | Synthetic GitHub tokens (Classic, Fine-Grained, OAuth) |
| **TC-06** | `test/tc-06-private-key` | `src/secrets/private-key.ts`| Add | Cryptographic PEM & PuTTY private key material |
| **TC-07** | `test/tc-07-banned-import` | `src/imports/dangerous-import.ts` | Add | Prohibited, dangerous, and deprecated module imports |
| **TC-08** | `test/tc-08-debug-statements`| `src/debug/debug-statements.ts` | Add | Leftover debugger and console.log statements |
| **TC-09** | `test/tc-09-multiple-findings`| `src/aggregation/multiple-findings.ts` | Add | Multi-finding aggregation on identical code lines |
| **TC-10** | `test/tc-10-ai-review` | `src/ai-review/review-example.ts` | Add | AI review targets (SQL injection, off-by-one, race condition) |

---

## TC-01: Clean PR Baseline

- **Feature Branch:** `test/tc-01-clean-pr`
- **Target File:** `src/clean/math.ts` (Modify existing file)
- **Synthetic Code Snippet to Introduce:**
  ```typescript
  /**
   * Computes base raised to the specified exponent.
   */
  export function power(base: number, exponent: number): number {
    return Math.pow(base, exponent);
  }
  ```
- **Expected Deterministic Finding:** `None` (0 rule findings)
- **Expected Gemini Behavior:** Recognizes clean, idiomatic mathematical utility implementation. Generates an encouraging, positive summary approving the pull request.
- **Expected GitHub Inline Comment:** `None` (0 inline comments)
- **Expected Pass/Fail Condition:**
  - **PASS:** PR Review verdict is `APPROVE` (or positive neutral comment); zero blocking comments; latency < 30s.
  - **FAIL:** Any false positive security warnings, suggestions, or change requests.

---

## TC-02: Synthetic AWS Credentials

- **Feature Branch:** `test/tc-02-aws-secret`
- **Target File:** `src/secrets/aws.ts` (Add new file)
- **Synthetic Code Snippet to Introduce:**
  ```typescript
  export interface AwsServiceConfig {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
  }

  export const SYNTHETIC_AWS_CONFIG: AwsServiceConfig = {
    region: 'us-east-1',
    accessKeyId: 'AKIA1234567890ABCDEF',
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCY1234567890',
    sessionToken: 'ASIA1234567890ABCDEF'
  };

  export function getAwsConfig(): AwsServiceConfig {
    return {
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || SYNTHETIC_AWS_CONFIG.accessKeyId,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || SYNTHETIC_AWS_CONFIG.secretAccessKey,
      sessionToken: process.env.AWS_SESSION_TOKEN || SYNTHETIC_AWS_CONFIG.sessionToken
    };
  }
  ```
- **Expected Deterministic Finding:**
  - Line 10: `secret-aws-access-key` (Severity: `CRITICAL`, Category: `SECURITY`)
  - Line 11: `secret-aws-secret-key` (Severity: `CRITICAL`, Category: `SECURITY`)
  - Line 12: `secret-aws-temporary-key` (Severity: `CRITICAL`, Category: `SECURITY`)
- **Expected Gemini Behavior:** Prioritizes critical credential exposure in review summary. Explains that exposed credentials must be revoked and rotated immediately. Suggests using environment variables (`process.env.AWS_ACCESS_KEY_ID`).
- **Expected GitHub Inline Comment:**
  - Inline comment on line 10 with masked key: `[REDACTED_AWS_ACCESS_KEY]`
  - Inline comment on line 11 with masked key: `[REDACTED_AWS_SECRET_KEY]`
  - Inline comment on line 12 with masked key: `[REDACTED_AWS_TEMPORARY_KEY]`
- **Expected Pass/Fail Condition:**
  - **PASS:** Verdict is `REQUEST_CHANGES`; exactly 3 critical findings on lines 10–12; all raw secrets completely redacted.
  - **FAIL:** Verdict is approved, any key is missed, or raw credential strings appear unmasked.

---

## TC-03: Synthetic Google / Gemini API Key

- **Feature Branch:** `test/tc-03-google-secret`
- **Target File:** `src/secrets/google.ts` (Add new file)
- **Synthetic Code Snippet to Introduce:**
  ```typescript
  export interface GeminiClientOptions {
    apiKey: string;
    model: string;
  }

  export const SYNTHETIC_GEMINI_API_KEY = 'AIzaSyD-MockGeminiKeyForTest12345678901';

  export function getGeminiClientOptions(): GeminiClientOptions {
    return {
      apiKey: process.env.GEMINI_API_KEY || SYNTHETIC_GEMINI_API_KEY,
      model: 'gemini-1.5-pro'
    };
  }
  ```
- **Expected Deterministic Finding:**
  - Line 6: `secret-google-api-key` (Severity: `CRITICAL`, Category: `SECURITY`)
- **Expected Gemini Behavior:** Confirms critical API key leakage. Highlights risks of quota exhaustion and unauthorized access. Suggests `process.env.GEMINI_API_KEY`.
- **Expected GitHub Inline Comment:**
  - Inline comment on line 6: `Exposed Google Cloud / Gemini API Key detected. ... [REDACTED_GOOGLE_API_KEY]`
- **Expected Pass/Fail Condition:**
  - **PASS:** Verdict is `REQUEST_CHANGES`; rule `secret-google-api-key` triggers on line 6; raw API key is replaced with `[REDACTED_GOOGLE_API_KEY]`.
  - **FAIL:** Key is not detected or raw `AIzaSyD...` string is published.

---

## TC-04: Database URI Credentials

- **Feature Branch:** `test/tc-04-database-secret`
- **Target File:** `src/secrets/database.ts` (Add new file)
- **Synthetic Code Snippet to Introduce:**
  ```typescript
  export const SYNTHETIC_POSTGRES_URI = 'postgres://admin:P%40ss%21w0rd@db.internal:5432/main';
  export const SYNTHETIC_MONGODB_URI = 'mongodb+srv://app_user:SuperSecretPassword123@cluster0.abcde.mongodb.net/production';

  export function getDatabaseUris() {
    return {
      postgres: process.env.DATABASE_URL || SYNTHETIC_POSTGRES_URI,
      mongodb: process.env.MONGODB_URI || SYNTHETIC_MONGODB_URI
    };
  }
  ```
- **Expected Deterministic Finding:**
  - Line 1: `secret-database-uri` (Severity: `CRITICAL`, Category: `SECURITY`)
  - Line 2: `secret-database-uri` (Severity: `CRITICAL`, Category: `SECURITY`)
- **Expected Gemini Behavior:** Flags hardcoded database connection URIs containing embedded passwords. Suggests standard connection pooling and environment variables.
- **Expected GitHub Inline Comment:**
  - Inline comment on lines 1 & 2 with password masked: `[REDACTED_DATABASE_PASSWORD]`
- **Expected Pass/Fail Condition:**
  - **PASS:** Verdict is `REQUEST_CHANGES`; both connection strings flagged; embedded passwords replaced with `[REDACTED_DATABASE_PASSWORD]`.
  - **FAIL:** Any connection string missed or raw password displayed.

---

## TC-05: Synthetic GitHub Tokens

- **Feature Branch:** `test/tc-05-github-token`
- **Target File:** `src/secrets/github.ts` (Add new file)
- **Synthetic Code Snippet to Introduce:**
  ```typescript
  export const SYNTHETIC_GITHUB_TOKENS = {
    classicPat: 'ghp_123456789012345678901234567890123456',
    fineGrainedPat: 'github_pat_11AAAAAAA0123456789012345678901234567890123456789012345678901234567890123456789012',
    oauthToken: 'gho_123456789012345678901234567890123456'
  };

  export function getGitHubAuthHeader(): string {
    const token = process.env.GITHUB_TOKEN || SYNTHETIC_GITHUB_TOKENS.classicPat;
    return `Bearer ${token}`;
  }
  ```
- **Expected Deterministic Finding:**
  - Line 2: `secret-github-pat` (Severity: `CRITICAL`, Category: `SECURITY`)
  - Line 3: `secret-github-fine-grained-pat` (Severity: `CRITICAL`, Category: `SECURITY`)
  - Line 4: `secret-github-oauth-app-token` (Severity: `CRITICAL`, Category: `SECURITY`)
- **Expected Gemini Behavior:** Flags high-privilege GitHub tokens that could grant full repository access. Advises revoking immediately in GitHub Personal Settings.
- **Expected GitHub Inline Comment:**
  - Line 2: `[REDACTED_GITHUB_PAT]`
  - Line 3: `[REDACTED_GITHUB_FINE_GRAINED_PAT]`
  - Line 4: `[REDACTED_GITHUB_APP_TOKEN]`
- **Expected Pass/Fail Condition:**
  - **PASS:** Verdict is `REQUEST_CHANGES`; all 3 token variants detected; all raw token values redacted.
  - **FAIL:** Any token omitted or unredacted.

---

## TC-06: Cryptographic Private Key Material

- **Feature Branch:** `test/tc-06-private-key`
- **Target File:** `src/secrets/private-key.ts` (Add new file)
- **Synthetic Code Snippet to Introduce:**
  ```typescript
  export const SYNTHETIC_PEM_PRIVATE_KEY = `
  -----BEGIN RSA PRIVATE KEY-----
  MIIEowIBAAKCAQEA0m5kYf7vMockPrivateKeyMaterial1234567890ABCDEF12
  MIIEowIBAAKCAQEA0m5kYf7vMockPrivateKeyMaterial1234567890ABCDEF34
  -----END RSA PRIVATE KEY-----
  `.trim();

  export const SYNTHETIC_PUTTY_HEADER = 'PuTTY-User-Key-File-2: ssh-rsa';

  export function getSigningPrivateKey(): string {
    return process.env.SIGNING_PRIVATE_KEY || SYNTHETIC_PEM_PRIVATE_KEY;
  }
  ```
- **Expected Deterministic Finding:**
  - Line 2: `secret-private-key` (Severity: `CRITICAL`) — Private key header
  - Lines 3 & 4: `secret-private-key` (Severity: `CRITICAL`) — Private key body material
  - Line 8: `secret-private-key` (Severity: `CRITICAL`) — PuTTY private key header
- **Expected Gemini Behavior:** Explains that committing cryptographic private keys compromises infrastructure security. Urges key rotation and repository history cleansing (e.g., git-filter-repo).
- **Expected GitHub Inline Comment:**
  - Header: `[REDACTED_PRIVATE_KEY_HEADER]`
  - Body lines: `[REDACTED_PRIVATE_KEY_BODY_LINE]`
  - PuTTY header: `[REDACTED_PUTTY_PRIVATE_KEY]`
- **Expected Pass/Fail Condition:**
  - **PASS:** Verdict is `REQUEST_CHANGES`; multiline key body and header detected; redaction applied.
  - **FAIL:** Multiline private key passes without detection.

---

## TC-07: Banned & Risky Imports

- **Feature Branch:** `test/tc-07-banned-import`
- **Target File:** `src/imports/dangerous-import.ts` (Add new file)
- **Synthetic Code Snippet to Introduce:**
  ```typescript
  import 'flatmap-stream';
  import { exec } from 'child_process';
  import 'event-stream';
  import request from 'request';
  import _ from 'lodash';

  export function executeDangerousTask(command: string): void {
    exec(command, (error, stdout) => {
      if (error) throw error;
      return stdout;
    });
  }

  export function fetchAndTransform(url: string): void {
    request(url, (_err: unknown, _res: unknown, body: string) => {
      return _.chunk(body.split(''), 2);
    });
  }
  ```
- **Expected Deterministic Finding:**
  - Line 1: `import-prohibited-flatmap-stream` (Severity: `CRITICAL`, Category: `SECURITY`)
  - Line 2: `import-dangerous-child-process` (Severity: `WARNING`, Category: `SECURITY`)
  - Line 3: `import-supply-chain-event-stream` (Severity: `WARNING`, Category: `SECURITY`)
  - Line 4: `import-deprecated-request` (Severity: `SUGGESTION`, Category: `BEST_PRACTICE`)
  - Line 5: `import-maintainability-lodash` (Severity: `SUGGESTION`, Category: `BEST_PRACTICE`)
- **Expected Gemini Behavior:** Flags malicious package `flatmap-stream` as an immediate security blocker. Warns about command injection risks with `child_process.exec`. Suggests native `fetch` and modern ES6 utilities.
- **Expected GitHub Inline Comment:**
  - Inline comments on each import line explaining the specific risk and suggested alternative.
- **Expected Pass/Fail Condition:**
  - **PASS:** Verdict is `REQUEST_CHANGES` (due to CRITICAL finding on `flatmap-stream`); all 5 module rules correctly triggered.
  - **FAIL:** Malicious import passes unflagged.

---

## TC-08: Debug Statements & Artifacts

- **Feature Branch:** `test/tc-08-debug-statements`
- **Target File:** `src/debug/debug-statements.ts` (Add new file)
- **Synthetic Code Snippet to Introduce:**
  ```typescript
  export interface OrderPayload {
    orderId: string;
    total: number;
  }

  export function processOrder(payload: OrderPayload): boolean {
    debugger;
    console.log('Processing order payload:', payload.orderId);
    console.debug('Calculated order total amount:', payload.total);
    console.dir(payload);

    return payload.total > 0;
  }
  ```
- **Expected Deterministic Finding:**
  - Line 7: `debug-js-debugger` (Severity: `SUGGESTION`, Category: `BEST_PRACTICE`)
  - Line 8: `debug-console-log` (Severity: `SUGGESTION`, Category: `BEST_PRACTICE`)
  - Line 9: `debug-console-log` (Severity: `SUGGESTION`, Category: `BEST_PRACTICE`)
  - Line 10: `debug-console-log` (Severity: `SUGGESTION`, Category: `BEST_PRACTICE`)
- **Expected Gemini Behavior:** Advises removing `debugger;` statement to prevent unintended runtime halting in production. Recommends structured logger (e.g., Pino).
- **Expected GitHub Inline Comment:**
  - Suggestion comments on lines 7 through 10.
- **Expected Pass/Fail Condition:**
  - **PASS:** Verdict is `COMMENT` (no CRITICAL findings; non-blocking suggestions); all 4 debug statements identified.
  - **FAIL:** Verdict is `REQUEST_CHANGES` for mere suggestions, or debug statements are missed.

---

## TC-09: Aggregation & Multiple Findings on Same Line

- **Feature Branch:** `test/tc-09-multiple-findings`
- **Target File:** `src/aggregation/multiple-findings.ts` (Add new file)
- **Synthetic Code Snippet to Introduce:**
  ```typescript
  export function executeAuditWithLeak(): { status: string; timestamp: number } {
    const timestamp = Date.now();

    // Line 5: Both console.log AND exposed AWS secret key
    console.log("Connecting to AWS with key: " + "AKIA1234567890ABCDEF");

    // Line 8: Both debugger statement AND exposed Google API key
    debugger; const apiKey = "AIzaSyD-MockGeminiKeyForTest12345678901";

    return {
      status: apiKey ? 'authenticated' : 'failed',
      timestamp
    };
  }
  ```
- **Expected Deterministic Finding:**
  - Line 5: Both `debug-console-log` (SUGGESTION) AND `secret-aws-access-key` (CRITICAL)
  - Line 8: Both `debug-js-debugger` (SUGGESTION) AND `secret-google-api-key` (CRITICAL)
- **Expected Gemini Behavior:** Coordinates multi-finding analysis on single lines. Highlights critical credential risks as primary blockers while retaining code quality suggestions.
- **Expected GitHub Inline Comment:**
  - Line 5: Comment flagging AWS secret with `[REDACTED_AWS_ACCESS_KEY]` plus debug notice.
  - Line 8: Comment flagging Google API key with `[REDACTED_GOOGLE_API_KEY]` plus debugger notice.
- **Expected Pass/Fail Condition:**
  - **PASS:** Verdict is `REQUEST_CHANGES`; aggregator surfaces both findings per line without dropping comments; secrets are redacted.
  - **FAIL:** Findings overwrite each other or secret is unredacted.

---

## TC-10: Mixed Code & AI Review Targets

- **Feature Branch:** `test/tc-10-ai-review`
- **Target File:** `src/ai-review/review-example.ts` (Add new file)
- **Synthetic Code Snippet to Introduce:**
  ```typescript
  export interface DatabaseDriver {
    query(sql: string): Promise<any[]>;
  }

  // AI Target 1: SQL Injection via Dynamic Query Construction
  export async function findUserById(db: DatabaseDriver, userId: string) {
    const sql = "SELECT * FROM users WHERE id = '" + userId + "' AND is_active = 1";
    return db.query(sql);
  }

  // AI Target 2: Off-By-One Array Boundary Bug
  export function calculateTotals(items: readonly number[]): number {
    let total = 0;
    for (let i = 0; i <= items.length; i++) {
      total += items[i];
    }
    return total;
  }

  // AI Target 3: Unhandled Null / Undefined Dereference
  export function getUserTier(user: { profile?: { tier?: string } }) {
    return user.profile!.tier!.toUpperCase();
  }

  // AI Target 4: In-Memory Concurrency Race Condition
  export class BalanceManager {
    private balance = 1000;

    public async withdraw(amount: number): Promise<boolean> {
      if (this.balance >= amount) {
        await new Promise(resolve => setTimeout(resolve, 50));
        this.balance -= amount;
        return true;
      }
      return false;
    }
  }
  ```
- **Expected Deterministic Finding:** `None` (0 deterministic rule hits)
- **Expected Gemini Behavior:**
  1. Identifies SQL injection vulnerability in `findUserById` (suggests parameterized queries).
  2. Identifies off-by-one boundary error in `calculateTotals` (`<=` causes `undefined` addition yielding `NaN`).
  3. Identifies unsafe non-null assertion in `getUserTier` causing runtime `TypeError`.
  4. Identifies concurrency race condition in `BalanceManager.withdraw`.
- **Expected GitHub Inline Comment:**
  - Inline AI review comments on lines 7, 14, 22, and 31.
- **Expected Pass/Fail Condition:**
  - **PASS:** Verdict is `REQUEST_CHANGES` (due to high-confidence SQL injection security finding); AI accurately flags SQLi and off-by-one bug.
  - **FAIL:** AI review fails to detect SQL injection or hallucinate non-existent syntax errors.
