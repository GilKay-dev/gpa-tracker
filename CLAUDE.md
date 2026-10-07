# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication rules

- Address the user as **"Boss"** and refer to yourself as **"tôi"**. Treat the user as the project's PM.
- Always reply in Vietnamese with full diacritics (tiếng Việt có dấu), short and easy to understand.
- Avoid detailed technical jargon unless the user explicitly asks for technical detail.

## Project status

Pre-implementation: the repo currently holds only `PRD.md`, `PLAN.md`, `STATUS.md`, `.gitignore`, and custom slash commands in `.claude/commands/`. There is no `package.json` or source code yet. **`PRD.md` is the source of truth** for requirements (written in Vietnamese) — read it before implementing any feature, and update its feature status table (section 4) when a feature (F1–F5) is completed.

## Development process (Waterfall)

The project follows a **waterfall model**. Phases run strictly in order; do not start a phase until the previous one is finished and approved by Boss:

1. **Requirements** — `PRD.md` (done, source of truth).
2. **Business-flow design** — flowcharts in **Mermaid** syntax (` ```mermaid ` blocks, `flowchart TD`), one per feature F1–F5 plus an overall app flow, stored in `docs/FLOWS.md`. Boss reviews before coding starts.
3. **Implementation + automated testing** — build F1–F5 following the flowcharts, with Vitest unit tests; all tests must pass before moving on.
4. **User acceptance testing** — performed by **Boss**. Claude provides a test checklist and fixes reported bugs, but does not mark this phase done on its own.
5. **Deploy to Vercel** — only after Boss approves UAT; record the public URL in `STATUS.md`.

Tracking files (keep them current, written in Vietnamese):

- **`PLAN.md`** — the project plan: phases, tasks, deliverables, exit criteria. Tick tasks off as they finish.
- **`STATUS.md`** — current phase/progress, technical decisions (with reasons), and any changes versus the original PRD/plan. Update it at the end of every phase and whenever a decision or deviation is made.

If a later phase reveals a requirement or design problem, do not silently change it: note the change in `STATUS.md`, update the affected document (PRD / flowchart), and tell Boss.

## What is being built

A client-only GPA calculator web app for Vietnamese credit-based university students. No login, no backend, no database — all data lives in `localStorage`.

- **Stack (mandated by PRD):** Vite + vanilla HTML/CSS/JavaScript (no framework), Vitest for unit tests, deployed to Vercel.
- **UI language:** Vietnamese, including all validation error messages. Responsive down to 360px width.

## Commands

Once the Vite project is scaffolded, the expected commands are:

```bash
npm install
npm run dev            # Vite dev server
npm run build          # production build to dist/
npx vitest             # run tests in watch mode
npx vitest run         # run tests once
npx vitest run path/to/file.test.js   # single test file
npx vitest run -t "test name"         # single test by name
```

Update this section if the actual `package.json` scripts differ.

## Domain rules that are easy to get wrong

Details are in `PRD.md`; these are the points that need care:

- **Score input** accepts both comma and dot decimal separators (`8,5` and `8.5`), range 0–10, rounded to 1 decimal. Rounding happens *before* conversion, so band boundaries (e.g. 8.4 → B+, 8.5 → A) apply to the rounded value.
- **Credits:** integer 1–10. **Course name:** trimmed, non-empty, ≤100 chars.
- **Grade conversion (F2)** is a fixed 10-point → letter → 4-point table (A/B+/B/C+/C/D+/D/F).
- **GPA (F3):** credit-weighted average on both 4-point and 10-point scales, rounded to 2 decimals. "Credits passed" counts courses with 10-point score ≥ 4.0. Classification (Xuất sắc/Giỏi/Khá/Trung bình/Yếu) is based on the 4-point GPA. Empty list shows "—" plus the hint "Hãy thêm môn học đầu tiên".
- **Persistence (F5):** localStorage key `"gpa-tracker:v1"`. Corrupt/unreadable data must fall back to an empty list without breaking the page.
- Delete and "Xoá tất cả" both require confirmation; edit (F4) reuses the F1 validation.

Feature dependency order: F1 → F2 → F3; F1 → F4; F1 + F4 → F5.

Because tests use Vitest, keep validation, grade conversion, GPA calculation, and storage parsing as pure functions in modules separate from DOM code so they can be unit-tested directly.

## Workflow conventions

**Branch per feature:** each feature (F1–F5) is developed on its own branch off `main` (use `/git-branch`). Merge it into `main` (use `/merge`) only after the feature is complete and has no errors (all tests pass).

Custom slash commands in `.claude/commands/` define the git workflow: `/git-branch` (feature/bug-named branches off `main`), `/commit`, `/merge` (merge into `main` with clean-tree check), `/push` (confirm before pushing to `main`), `/pull`, `/learn-by-mistake` (records mistakes in `common_errors.md`), and `/wrap-up`. `/new-project` is only for cloning this template — do not run it here.

`/wrap-up` updates the **Project structure** section below; keep it limited to important level-1/level-2 files and folders.

## Project structure

```
PRD.md              # Requirements (Vietnamese) — source of truth
PLAN.md             # Waterfall project plan (phases, tasks, exit criteria)
STATUS.md           # Current status, technical decisions, change log
.claude/commands/   # Custom slash commands for git workflow
```
