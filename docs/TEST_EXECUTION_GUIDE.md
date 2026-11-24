# AI PR Review Bot — Test Execution Guide

This guide provides end-to-end instructions for QA engineers and developers to test the **AI PR Review Bot** against this test repository.

---

## 1. Clean Baseline Concept

The default branch (`main`) represents the **clean application starter baseline**. It contains:
- Clean mathematical utilities in `src/clean/math.ts`.
- Zero secrets, zero banned imports, and zero debug statements.
- Complete documentation and verification tooling.

**How Pull Request Testing Works:**
1. Check out a feature branch from the clean `main` branch.
2. Introduce the target test scenario code (by adding or modifying a single file).
3. Push the feature branch to GitHub and open a Pull Request targeting `main`.
4. Observe the bot's review comments and verify they match the expectations in [EXPECTED_FINDINGS.md](EXPECTED_FINDINGS.md).

---

## 2. Test Execution Matrix

Execute the tests in isolation using the following standard feature branches:

| Step | Branch Name | Action & File | Expected Verdict | Expected Findings |
| :---: | :--- | :--- | :---: | :--- |
| **TC-01** | `test/tc-01-clean-pr` | Modify `src/clean/math.ts` | **APPROVE** | 0 findings |
| **TC-02** | `test/tc-02-aws-secret` | Add `src/secrets/aws.ts` | **REQUEST_CHANGES** | 3 CRITICAL (AWS keys redacted) |
| **TC-03** | `test/tc-03-google-secret` | Add `src/secrets/google.ts` | **REQUEST_CHANGES** | 1 CRITICAL (Google key redacted) |
| **TC-04** | `test/tc-04-database-secret`| Add `src/secrets/database.ts` | **REQUEST_CHANGES** | 2 CRITICAL (Passwords redacted) |
| **TC-05** | `test/tc-05-github-token` | Add `src/secrets/github.ts` | **REQUEST_CHANGES** | 3 CRITICAL (PATs redacted) |
| **TC-06** | `test/tc-06-private-key` | Add `src/secrets/private-key.ts` | **REQUEST_CHANGES** | 4 CRITICAL (Private key redacted) |
| **TC-07** | `test/tc-07-banned-import` | Add `src/imports/dangerous-import.ts` | **REQUEST_CHANGES** | 1 CRITICAL, 2 WARNING, 2 SUGGESTION |
| **TC-08** | `test/tc-08-debug-statements`| Add `src/debug/debug-statements.ts` | **COMMENT** | 4 SUGGESTIONS (`debugger`, `console.log`) |
| **TC-09** | `test/tc-09-multiple-findings`| Add `src/aggregation/multiple-findings.ts` | **REQUEST_CHANGES** | Multi-finding lines aggregated |
| **TC-10** | `test/tc-10-ai-review` | Add `src/ai-review/review-example.ts` | **REQUEST_CHANGES** | AI finds SQLi, off-by-one, race condition |

---

## 3. Step-by-Step Procedure for a Test Run

### Example Walkthrough: Testing TC-02 (Synthetic AWS Credentials)

1. **Ensure you are on the clean default branch:**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create the dedicated feature branch:**
   ```bash
   git checkout -b test/tc-02-aws-secret
   ```

3. **Add the test fixture file:**
   Create `src/secrets/aws.ts` with the snippet specified in [TEST_SCENARIOS.md](TEST_SCENARIOS.md#tc-02-synthetic-aws-credentials):
   ```typescript
   export const SYNTHETIC_AWS_CONFIG = {
     region: 'us-east-1',
     accessKeyId: 'AKIA1234567890ABCDEF',
     secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCY1234567890',
     sessionToken: 'ASIA1234567890ABCDEF'
   };
   ```

4. **Commit and push to remote:**
   ```bash
   git add src/secrets/aws.ts
   git commit -m "test: introduce synthetic AWS credentials for TC-02"
   git push origin test/tc-02-aws-secret
   ```

5. **Open a GitHub Pull Request:**
   - Base branch: `main`
   - Compare branch: `test/tc-02-aws-secret`
   - Title: `[Test] TC-02: Synthetic AWS Credentials`

6. **Verify Review Bot Response:**
   - Verdict must be `REQUEST_CHANGES`.
   - Inline comments must flag lines containing `AKIA...`, `ASIA...`, and `wJalr...`.
   - All secret values must be masked with their respective `[REDACTED_AWS_*]` tokens.
   - Clean files (e.g. `src/clean/math.ts`) must receive no comments.

---

## 4. Local Baseline Verification

Run the verification suite locally at any time to verify that the default branch remains clean:
```bash
npm run typecheck
npm run build
npm run verify
```
When running on the default branch, the verification script confirms that `src/` contains **0** vulnerabilities, secrets, or banned imports.
