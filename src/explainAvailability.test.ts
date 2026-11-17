import { describe, it, expect } from 'vitest';
import {
  mockLlmAdapter,
  explainAvailability,
  type LlmAdapter,
} from '@/explainAvailability';
import { checkAvailability, ROOMS, BOOKINGS, type Verdict } from '@/availability';

const openRoom = ROOMS.find((r) => r.id === 'A101')!;
const blockedRoom = ROOMS.find((r) => r.id === 'B205')!;

const availableVerdict: Verdict = checkAvailability(openRoom, BOOKINGS, 700, 750, 540);
const unavailableVerdict: Verdict = checkAvailability(blockedRoom, BOOKINGS, 700, 750, 540);

describe('mockLlmAdapter', () => {
  it('explains an available verdict without changing the decision', async () => {
    const result = await mockLlmAdapter({ verdict: availableVerdict });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.explanation).toContain(availableVerdict.reason);
      expect(result.explanation.split('.').filter((s) => s.trim()).length).toBeLessThanOrEqual(2);
    }
  });

  it('explains an unavailable verdict without changing the decision', async () => {
    const result = await mockLlmAdapter({ verdict: unavailableVerdict });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.explanation).toContain(unavailableVerdict.reason);
      expect(result.explanation.split('.').filter((s) => s.trim()).length).toBeLessThanOrEqual(2);
    }
  });

  it('rejects an invalid verdict', async () => {
    const result = await mockLlmAdapter({
      verdict: { available: 'yes' } as unknown as Verdict,
    });
    expect(result.ok).toBe(false);
  });
});

describe('explainAvailability', () => {
  it('returns a graceful error when the adapter throws', async () => {
    const throwingAdapter: LlmAdapter = async () => {
      throw new Error('network down');
    };
    const result = await explainAvailability(throwingAdapter, {
      verdict: availableVerdict,
    });
    expect(result.ok).toBe(false);
  });
});
