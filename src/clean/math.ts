/**
 * Clean Mathematical Utilities
 * 
 * Test Scenario: TC-01 (Clean PR)
 * Objective: Verify that clean, secure, and idiomatic TypeScript code produces zero findings.
 * Expected Bot Findings: 0 (No secrets, no banned imports, no debug statements, no AI bugs).
 */

export interface DivisionResult {
  quotient: number;
  remainder: number;
}

/**
 * Calculates the sum of an array of numbers.
 * Handled edge case: Returns 0 for empty arrays.
 */
export function sum(numbers: readonly number[]): number {
  return numbers.reduce((accumulator, current) => accumulator + current, 0);
}

/**
 * Calculates the arithmetic mean (average) of an array of numbers.
 * Throws RangeError if the array is empty.
 */
export function average(numbers: readonly number[]): number {
  if (numbers.length === 0) {
    throw new RangeError('Cannot compute average of an empty array');
  }
  return sum(numbers) / numbers.length;
}

/**
 * Clamps a numeric value within the specified inclusive range [min, max].
 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new RangeError(`Minimum bound (${min}) cannot exceed maximum bound (${max})`);
  }
  return Math.min(Math.max(value, min), max);
}

/**
 * Safely performs integer division and returns quotient and remainder.
 * Throws RangeError if divisor is zero.
 */
export function safeDivide(numerator: number, divisor: number): DivisionResult {
  if (divisor === 0) {
    throw new RangeError('Division by zero is undefined');
  }

  const quotient = Math.floor(numerator / divisor);
  const remainder = numerator % divisor;

  return { quotient, remainder };
}

/**
 * Computes the factorial of a non-negative integer n.
 * Throws RangeError if n is negative or non-integer.
 */
export function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError('Factorial requires a non-negative integer');
  }

  if (n === 0 || n === 1) {
    return 1;
  }

  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Checks whether a number is even.
 */
export function isEven(value: number): boolean {
  return value % 2 === 0;
}

