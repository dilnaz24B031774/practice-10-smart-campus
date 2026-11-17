import type { Verdict } from '@/availability';

export interface ExplainRequest {
  verdict: Verdict;
}

export type ExplainResult =
  | { ok: true; explanation: string }
  | { ok: false; error: string };

export type LlmAdapter = (request: ExplainRequest) => Promise<ExplainResult>;

function isVerdict(value: unknown): value is Verdict {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Verdict).available === 'boolean' &&
    typeof (value as Verdict).reason === 'string'
  );
}

/**
 * Mock LLM adapter — no real API calls. It only restates the structured
 * verdict in student-friendly language and never alters the decision
 * or invents booking details.
 */
export const mockLlmAdapter: LlmAdapter = async ({ verdict }) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!isVerdict(verdict)) {
    return {
      ok: false,
      error: 'Could not generate an explanation — the availability result was invalid.',
    };
  }

  const explanation = verdict.available
    ? `${verdict.reason} You're all set to use this slot.`
    : `This slot doesn't work right now. ${verdict.reason}`;

  return { ok: true, explanation };
};

export async function explainAvailability(
  adapter: LlmAdapter,
  request: ExplainRequest,
): Promise<ExplainResult> {
  try {
    return await adapter(request);
  } catch {
    return {
      ok: false,
      error: 'Something went wrong while generating the explanation. Please try again.',
    };
  }
}
