# Story Drafts Studio
>Story Drafts Studio is a local-first writing environment built with Angular for organizing, writing, and reading original stories. It combines the structure of a note organizer with the presentation of a linear visual novel. Instead of writing raw JSON or Markdown, stories are created through specialized editing tools that generate structured project files. Those files can then be committed to GitHub and published as a static website through GitHub Pages.

The project is intentionally designed around a single-author workflow rather than collaborative editing or cloud storage.


## Current Scope (MVP)
### Collections

Collections are containers that organize chapters into larger story arcs or groups.

A collection can contain:

- ordered chapters
- standalone chapters
- future support for grouping related chapters

Collections provide navigation and determine reading order without restricting how ideas are drafted.

## Chapters

A chapter is the primary writing document.

Unlike a traditional text editor, chapters are composed of blocks.

Examples:

- dialogue
- narration
- scene changes
- (future) settings
- (future) illustrations

Blocks can be:

- inserted anywhere
- reordered
- edited independently
- expanded later with new block types

The end of a chapter provides navigation to either:

- the next chapter
- return to the collection

## Dialogue Blocks

Dialogue is one of the core block types.

Each dialogue block references a Character rather than duplicating character information.

Properties include:

- character
- dialogue text
- nameplate position (left/right)

The left/right positioning is purely visual, helping conversations naturally alternate between speakers.

Future versions may include:

- sprites
- expressions
- voice
- animations

## Characters

Characters act as reusable templates.

Current properties:

- name
- description
- nameplate color

Future properties might include:

- sprite library
- facial expressions
- aliases
- pronouns
- default text effects
- Reading Mode

## Reading mode mimics the pacing of a visual novel.

Instead of displaying the entire chapter at once:

- only one block is shown
- clicking advances to the next block
- progression is completely linear

This creates a more immersive reading experience while still functioning as a chapter log.

## Edit Mode

When running locally, a chapter can be opened in Edit Mode.

Edit Mode allows:

- block insertion
- block reordering
- rich text editing
- chapter organization

When published to GitHub Pages, editing is unavailable.

Readers only access Reading Mode.

## Out of Scope

The project intentionally does not aim to become:

- a Twine replacement
- a Ren'Py replacement
- a branching narrative engine
- a multiplayer writing platform
- a cloud-based note application

Stories are intentionally linear.
