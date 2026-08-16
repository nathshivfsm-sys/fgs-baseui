---
name: feature-implementation-planner
description: Turns an existing PRD/spec (from feature-spec-writer or any other written requirements doc) into an ordered implementation plan and actual code changes against a real codebase. Use this when the user wants to implement, build, or code up a feature that already has a written spec/PRD/requirements doc — e.g. "implement this PRD", "turn this spec into code", "build the top nav based on this doc", "let's start coding this feature". Do NOT use this to write the spec itself (use feature-spec-writer for that) — this skill assumes requirements already exist and focuses on turning them into a task breakdown and working code in the user's actual project.
---

# Feature Implementation Planner

Takes a PRD/spec plus the user's real codebase and produces (1) an ordered implementation plan traceable back to each requirement, and (2) the actual code changes.

This is the deliberate second step after `feature-spec-writer` (or any other requirements doc) — spec and implementation stay separate so the user can review/approve the spec before code gets written.

## Workflow

### Step 1: Locate and read the spec

Find the PRD — it may be a file already in the conversation, an uploaded `.md`/`.docx`, or something generated earlier in this session. Read it fully before doing anything else. If no spec exists yet, tell the user this skill needs one first and offer to run `feature-spec-writer`, rather than improvising requirements from scratch.

### Step 2: Resolve blocking open questions

Most PRDs (especially from `feature-spec-writer`) end with an "Open Questions / Assumptions" section. Don't resolve all of them before proceeding — only the ones that would actually change what code gets written (e.g. "does collapse state persist per-user?" blocks a storage decision; "exact icon for a button" usually doesn't). Ask about blocking ones together in one short pass. For everything else, proceed with the PRD's stated assumptions and carry them into the plan as noted defaults.

### Step 3: Understand the codebase

Before planning any file changes, get real context on what already exists — don't guess at conventions:
- If working inside a project directory (e.g. Claude Code), use `view`/`bash` to inspect the directory structure, identify the framework/language, and look at a couple of existing components similar in kind to what's being built (e.g. an existing nav/layout component if building nav).
- Note existing patterns worth matching: component structure, styling approach (CSS modules, Tailwind, styled-components, etc.), state management, naming conventions, file organization.
- If no project context is available (e.g. a fresh chat with no uploaded code), ask the user for it — either point Claude at the project directory, or upload/paste the relevant existing files — rather than inventing a stack. This is the one point in the flow worth pausing for, since generated code that doesn't match the real codebase is often worse than no code.

### Step 4: Build the implementation plan

Produce a short, ordered task breakdown — not the full PRD restated. Use `references/implementation_plan_template.md` as the shape. Each task should:
- Map back to specific requirement number(s) from the PRD's Functional Requirements section, for traceability.
- Name the actual file(s) to create or modify.
- Flag dependencies between tasks (e.g. "sidebar shell before active-state logic").
- Stay right-sized: a small feature might be 3-5 tasks; don't manufacture ceremony for a one-component change.

Show this plan to the user before writing large amounts of code, unless the feature is small enough that plan and code are effectively the same short unit of work.

### Step 5: Write the code

Implement task by task, following the conventions identified in Step 3. For each task:
- Match existing naming, formatting, and architectural patterns rather than introducing new ones.
- Reference the PRD requirement number in a code comment where it meaningfully aids traceability (don't over-annotate trivial lines).
- Handle the edge cases the PRD called out (Section 8 in the standard template) as part of the relevant task, not as an afterthought.
- If a requirement is ambiguous even after Step 2, make the smallest reasonable choice, implement it, and flag the assumption in your response rather than blocking.

For larger features, work and check in incrementally rather than generating everything silently in one large, unreviewable dump.

### Step 6: Wrap up

- If in a project directory: leave the files in place, and summarize what was created/modified, mapped to the plan.
- If no project context exists (pure chat): present the code as files via `present_files`.
- Call out anything from the PRD that wasn't implemented (e.g. explicitly deferred edge cases, non-goals) so scope stays clear.
- Do not silently expand scope beyond the PRD's Goals/Functional Requirements — flag it first if you think something's missing from the spec itself.

## Notes

- This skill trusts the PRD as the source of truth for *what* to build; it does not re-litigate product decisions already made in the spec.
- If the codebase uses a framework/pattern Claude is unfamiliar with, say so and ask for a short example rather than guessing silently.
- Keep spec changes and implementation changes separate: if building surfaces a flaw in the PRD, flag it to the user rather than quietly patching the spec.
