## What changed
<!-- One or two sentences on the behaviour change, not the diff. Link the Jira ticket (SCRUM-nn). -->

## How it was tested
<!-- Pages checked in a browser, tests run, screenshots for UI changes. "Not tested" is acceptable if you say why. -->

## Deployment notes
- [ ] No new or changed environment variables
- [ ] New or changed `NEXT_PUBLIC_*` variables (list them; they are public by design): ______
- [ ] Requires a matching back-end release first (link PR): ______
- [ ] No new dependencies (new ones need prior approval)

## Checklist
- [ ] Skeleton shown while data loads; no spinner-only or blank states
- [ ] Tailwind classes only (no inline `style`), MUI icons only
- [ ] No `any`, no `console.log`, no commented-out code
- [ ] `pnpm lint:ratchet` and `pnpm exec tsc --noEmit` pass
