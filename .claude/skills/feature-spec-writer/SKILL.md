---
name: feature-spec-writer
description: Turns a feature request into a polished, structured PRD/spec md document. Use this whenever the user wants to write up, document, or spec out a new feature or product idea — especially when they mention a feature name/feature requirement path, describe what they want built, share UI screenshots, or paste a Figma link. Trigger on phrases like "I need to spec out X", "write a PRD for...", "here's a screenshot of what I want", "here's the Figma", "turn this into a requirements doc", "help me document this feature", or any request to plan/implement a feature that would benefit from a written spec before coding starts. Make sure to use this skill even if the user only provides partial input (just a Figma link, just a screenshot, or just a rough idea) — the skill handles gathering the rest.
---

# Feature Spec Writer

Turns a feature idea — plus any combination of free-text description, screenshots, and a Figma link — into a structured PRD (Product Requirements Document) delivered as a Word doc.

## Workflow

### Step 1: Gather feature intent

Check what's already been provided in the conversation (feature name, description, goal, screenshots, Figma URL). Only ask about what's genuinely missing — don't re-ask for things already given.

Core inputs to have before drafting:

1. **Feature name / one-line summary**
2. **Problem / motivation** — why does this need to exist?
3. **Target users** — who is this for?
4. **Screenshots** — any uploaded images of current UI, mockups, or references
5. **Figma link** — a design file/frame to pull visual context from
6. **Constraints or must-haves** — platform, deadline, tech constraints, out-of-scope items (optional, skip asking if not offered)

If several of these are missing, ask for them required information.

If the user has only a vague idea ("something to help users track X"), interrogate them extensively.

### Step 2: Pull in design references

**Screenshots**: If images are already visible in context (uploaded by the user), just look at them directly — no tool needed. Note what they show (current state, desired state, competitor reference, etc.) based on what the user says about them.

**Figma link**: If a Figma URL is provided, pull live design context rather than treating the link as a dead reference:

- Call `tool_search` with query like "figma design context" to load the Figma tools if not already loaded.
- Use `Figma:get_design_context` (or `get_metadata` for a lighter pass) on the node/file to get structure, components, and variables.
- Use `Figma:get_screenshot` to capture a visual of the relevant frame so the PRD can reference what the design actually looks like.
- If the link is a whole file rather than a specific frame/node, then drill into the relevant frame the user is referring to.
- If Figma tools fail (no access, bad link, etc.), block and ask for a folder path in which screenshot is

### Step 3: Draft the PRD

Use the structure in `references/prd_template.md` as the section skeleton. Keep it proportional to the input — a small feature shouldn't get a bloated 10-section md file with empty filler. Typical shape:

1. **Overview** — one paragraph: what it is, who it's for, why now
2. **Problem Statement** — the pain point being solved
3. **Goals** / **Non-Goals** — explicit scope boundaries
4. **User Stories** — 3-6 "As a [user], I want [x], so that [y]" statements
5. **Design Reference** — describe what the screenshots/Figma frame show
6. **Functional Requirements** — numbered, testable requirements
7. **Edge Cases & Error States**
8. **Success Metrics** — how you'd know this feature worked
9. **Open Questions / Assumptions** — anything guessed rather than confirmed

Write requirements as concrete, testable statements ("The system must X when Y") rather than vague aspirations. Where you filled a gap with an assumption instead of asking, log it under Open Questions so the user can correct it in one pass.

### Step 4: Produce the md file

Save the output to contenx/features/filename using a filename derived from the feature name (e.g. `feature-name-prd.md`).

### Step 5: Deliver

Keep your chat reply brief — a one-line summary of what the spec covers and any flagged open questions/assumptions worth their attention. Don't restate the whole document in the chat.

## Notes

- If the user explicitly wants something lighter than a full PRD (a quick ticket, a short summary), skip the Word doc and just write it inline in chat or as a lightweight markdown artifact instead — don't force every request into the full md workflow.
- If the user asks for an implementation plan or actual code in addition to the spec, that's a separate follow-on step — finish the spec first, then ask whether they want to move into implementation planning.
