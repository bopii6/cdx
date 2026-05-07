# Repository Guidelines

## Project Structure & Module Organization

This repository is a small static documentation site for the Codex Chinese practical guide. The main application is `index.html`, which contains the page markup, embedded styles, and in-page content. Automated checks live in `tests/`; currently `tests/validate-index.mjs` verifies required course content and internal anchors. Keep future assets in clearly named directories such as `assets/`, `images/`, or `scripts/` rather than expanding the repository root.

## Build, Test, and Development Commands

- `node tests/validate-index.mjs`: validates required `index.html` content and checks that `href="#..."` links point to existing sections.
- `python -m http.server 8000`: serves the static site locally from the repository root; open `http://localhost:8000/index.html`.

There is no package manifest or build step at present. If you add tooling, document the new command here and prefer scripts in `package.json` for repeatable workflows.

## Coding Style & Naming Conventions

Use two-space indentation for HTML, CSS, and JavaScript to match the existing file. Keep semantic section IDs lowercase and hyphenated, for example `screenshot-course`, and update navigation links when adding or renaming sections. Prefer readable class names that describe layout or purpose. For Chinese content, ensure files are saved as UTF-8 and verify rendered text in a browser, especially after editing from Windows shells.

## Testing Guidelines

Run `node tests/validate-index.mjs` before submitting changes. Add checks to `tests/validate-index.mjs` when introducing required sections, anchor conventions, or other static invariants. If new test files are added, use descriptive names such as `validate-anchors.mjs` or `validate-assets.mjs`, and keep them runnable with plain Node unless a project-wide test runner is introduced.

## Commit & Pull Request Guidelines

This workspace does not include Git history, so no local commit convention can be inferred. Use concise imperative commit messages, for example `Add screenshot course section` or `Fix broken guide anchors`. Pull requests should include a short summary, the validation command output, linked issue or task context when applicable, and screenshots for visible layout or content changes.

## Agent-Specific Instructions

Before editing, inspect the current file structure and avoid assuming additional build tooling exists. Keep documentation updates concise, repo-specific, and synchronized with actual commands and tests.
