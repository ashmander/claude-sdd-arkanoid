# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Playable Arkanoid/Breakout game, plain HTML/CSS/JS, zero dependencies. Entry point is `index.html`; all game logic lives in `game.js`. Open `index.html` directly (or serve the folder with any static file server) to run/test — no build step, no package.json, no linter, no test suite.

- `assets/spritesheet-breakout.png` + `assets/spritesheet.js` — sprite atlas, `loadSpritesheet(cb)` loader, `SPRITES`/`EXPLOSION_FRAMES` rects.
- `assets/sounds/*.mp3` — ball-bounce and break sound effects.
- `game.js` — game states (`start`/playing/etc.), 5 levels, paddle/ball physics, block collisions, explosions, lives/hearts, score, and a start-screen level/speed selector (`selectedLevel`, `selectedBaseSpeed`).

Since the game must have zero dependencies, do not introduce a bundler, npm packages, or a framework — keep writing vanilla HTML/CSS/JS.

## Spec-driven workflow

This repo uses a two-command spec workflow (installed as skills under `.agents/skills/` and `.claude/skills/`, sourced from `Klerith/fernando-skills`):

- **`/spec <description>`** — interactively drafts a spec through clarifying questions, then writes it to `specs/NN-slug.md` (numbered sequentially, kebab-case slug) in state `Draft`. Never writes code.
- **`/spec-impl <NN-slug>`** — implements a spec, but only once its state is manually changed to `Approved` (or the equivalent word in another language). It creates a git branch `spec-NN-slug` (controlled by `AutoCreateBranch` in `specs/.spec-config.yml`, default `true`), then implements the plan step by step, pausing for review after each step. It never commits automatically.

`specs/` already contains 5 implemented specs (01–05). When adding features, check `specs/` for an existing/relevant spec first; for non-trivial work, prefer routing through `/spec` rather than improvising structure ad hoc.

## Language

The README and spec workflow default to Spanish for spec content (the skill matches whatever language the initiating prompt uses). Match the language of the surrounding spec/doc content when adding to it.
