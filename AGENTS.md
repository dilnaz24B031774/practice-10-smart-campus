# Project
Smart Campus room availability checker.
One set of fictional rooms, fictional bookings, fixed current time.
Availability decision only. No booking is ever saved.

# Constraints
- Preserve AC1–AC6 exactly.
- No backend, no login, no booking creation, no database, no network calls.
- Do not mutate booking fixtures.
- Keep clear responsive UI feedback (desktop + mobile).
- No secrets, no deployment from agent.

# Engineering rules
- Prefer pure functions and minimal changes.
- Use at most 2 justified patterns.
- Preferred: extract pure availability function into its own module.
- Avoid Singleton, Factory, unnecessary class hierarchies and over-engineering.

# Allowed commands
- npm test
- npm run lint
- npm run typecheck
- npm run build

# Forbidden
- Adding real authentication, backend or database
- Changing acceptance criteria without human approval
- Deploying or publishing
- Introducing secrets
- Large unrelated refactors

# Verification & Review gates
- Always run existing tests before proposing changes.
- Report changed files, short rationale and test evidence.
- Human must explicitly approve (LGTM) before any merge.