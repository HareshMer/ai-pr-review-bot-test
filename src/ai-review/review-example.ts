/**
 * TC-10: Synthetic AI Code Review Test Scenario
 * Objective: Verify that Google Gemini detects logic bugs, SQL injection, off-by-one errors, and race conditions.
 */

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

// AI Target 3: Safely handled null/undefined dereference with optional chaining and fallback
export function getUserTier(user: { profile?: { tier?: string } }): string {
  return user.profile?.tier?.toUpperCase() ?? 'STANDARD';
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

