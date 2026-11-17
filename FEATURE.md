# Feature: Explain Availability

## User Story
As a student, I want a short explanation of room availability 
so that I can understand why the room is available or not.

## Inputs
- roomLabel: string
- startTime: string (ISO)
- endTime: string (ISO)
- isAvailable: boolean
- reasonCode: string (AVAILABLE | OVERLAP | BLOCKED | PAST | INVALID | TOO_LONG | ...)

## Output
{
  explanation: string   // maximum 2 sentences, student-friendly
}

## Rules
- The deterministic checker (src/availability.ts) remains the single source of truth.
- The LLM / mock must never decide availability or invent booking details.
- Explanation must agree with isAvailable + reasonCode.
- Empty, malformed or overly long input is rejected.
- On timeout or error → safe deterministic fallback.

## Architecture Flow
Student input
    → Validation
    → Deterministic Rule Engine (src/availability.ts) → structured result
    → LLM Adapter (mock first)
    → Validated explanation
    → UI (status and explanation are shown separately)