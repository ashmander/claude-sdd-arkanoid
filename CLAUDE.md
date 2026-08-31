# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

This repo is a **pre-implementation** Arkanoid/Breakout game. The goal (from `README.md`, written in Spanish) is a browser game built with plain HTML, CSS, and JavaScript, zero dependencies, playable by end users. As of now the game itself does not exist yet — there is no HTML entry point, no game loop, and no build tooling. The only real content is:

- `assets/spritesheet-breakout.png` — the sprite atlas.
- `assets/spritesheet.js` — sprite coordinate definitions and a `loadSpritesheet(cb)` loader that draws the raw image into an offscreen canvas (`ssImg`) and invokes queued callbacks once loaded. Defines `SPRITES` (paddle, ball, block colors) and `EXPLOSION_FRAMES` (per-color 4-frame animations) with sprite rects (`sx, sy, sw, sh`).
- `assets/sounds/*.mp3` — ball-bounce and break sound effects.

There is no package.json, build step, linter, or test suite. Since the game must have zero dependencies, do not introduce a bundler, npm packages, or a framework — write vanilla HTML/CSS/JS and open `index.html` directly (or serve the folder with any static file server) to run/test it.

## Spec-driven workflow

This repo uses a two-command spec workflow (installed as skills under `.agents/skills/` and `.claude/skills/`, sourced from `Klerith/fernando-skills`):

- **`/spec <description>`** — interactively drafts a spec through clarifying questions, then writes it to `specs/NN-slug.md` (numbered sequentially, kebab-case slug) in state `Draft`. Never writes code.
- **`/spec-impl <NN-slug>`** — implements a spec, but only once its state is manually changed to `Approved` (or the equivalent word in another language). It creates a git branch `spec-NN-slug` (controlled by `AutoCreateBranch` in `specs/.spec-config.yml`, default `true`), then implements the plan step by step, pausing for review after each step. It never commits automatically.

`specs/` does not exist yet — the first `/spec` invocation creates it. When implementing features in this repo, check whether an approved spec exists in `specs/` first; if the work is non-trivial, prefer routing it through `/spec` rather than improvising structure ad hoc, since that's the established convention here.

## Language

The README and spec workflow default to Spanish for spec content (the skill matches whatever language the initiating prompt uses). Match the language of the surrounding spec/doc content when adding to it.
