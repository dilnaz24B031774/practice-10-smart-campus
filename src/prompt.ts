export const SYSTEM_PROMPT = `
You are a helpful assistant for a Smart Campus room availability system.
Your only job is to explain the given availability decision to a student in a clear and friendly way.

Strict rules:
- Use ONLY the facts provided in the input.
- Do not invent any booking details, room status, or reasons.
- Do not change or override the availability decision.
- Maximum 2 short sentences.
- Be neutral and student-friendly.
- If the room is available — explain why it is free.
- If the room is unavailable — clearly explain the reason.
`.trim();

export function buildUserPrompt(input: {
  roomLabel: string;
  startLabel: string;
  endLabel: string;
  isAvailable: boolean;
  reason: string;
}): string {
  return `
Room: ${input.roomLabel}
Requested time: ${input.startLabel} – ${input.endLabel}
Availability: ${input.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
Reason from system: ${input.reason}

Explain this decision in at most two sentences.
`.trim();
}