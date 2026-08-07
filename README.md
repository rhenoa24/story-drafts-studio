
# Story Drafts Studio

> A local-first story authoring studio for writing, organizing, and reading linear visual novels.

![Status](https://img.shields.io/badge/status-early%20development-orange)
![Angular](https://img.shields.io/badge/Angular-22-red)

## Overview

Story Drafts Studio is an Angular-based writing environment designed for creating **linear visual novel style stories**.

Unlike traditional visual novel engines, Story Drafts Studio focuses on the **authoring experience** rather than game development. It combines the organization of a note-taking application with the presentation of a visual novel, allowing stories to be written through specialized editing tools and read one block at a time.

The project is intentionally **local-first**. Story content is created and edited locally, then committed to GitHub and published as a static website through GitHub Pages.

There is **no backend**, **no cloud database**, and **no online editing**.


# Project Philosophy

Story Drafts Studio is built around a few core principles:

- ✍️ **Write locally**
- 📁 **Own your files**
- 📚 **Organize stories without restrictions**
- 🎮 **Read stories like a visual novel**
- 🌐 **Publish using GitHub Pages**
- 🧩 **Build everything from reusable content blocks**

The application is designed for a **single-author workflow** rather than collaborative writing.


# Goals

The primary goals of the project are:

- Create an enjoyable writing environment
- Organize scattered story ideas
- Allow chapters to be rearranged freely
- Read stories in a visual novel presentation
- Generate human-readable project files
- Publish stories without requiring a server


# Intended Workflow

```text
Write Story
      │
      ▼
Story Drafts Studio (Angular)
      │
      ▼
Generate Project Files
      │
      ▼
Git Commit
      │
      ▼
Git Push
      │
      ▼
GitHub Pages
      │
      ▼
Read Story Online
```

Editing is only performed locally.

The published GitHub Pages site acts purely as a reader.


# Core Concepts

## Collections

Collections organize chapters into groups.

Collections are intended to behave more like folders or playlists than strict story containers.

Planned capabilities include:

- Nested collections
- Unlimited collection depth
- Reorderable chapters
- Standalone chapters
- Story arcs
- Side stories
- Flashbacks
- Character routes

A chapter may belong to multiple collections.

Example:

```text
Fantasy
 ├── Main Story
 ├── Character Stories
 └── Flashbacks
```


## Chapters

A chapter is the primary writing document.

Rather than consisting of one large text editor, a chapter is composed of a sequence of **Blocks**.

Each block represents a specific part of the story.

Blocks can be:

- inserted anywhere
- rearranged
- duplicated
- removed
- expanded with future block types

At the end of a chapter, readers may:

- Continue to the next chapter
- Return to the parent collection


# The Block System

The Block system is the foundation of Story Drafts Studio.

Everything inside a chapter is represented as a block.

Current planned block types:

- Scene
- Narration
- Dialogue

Future block types may include:

- Illustration
- Music
- Sound Effect
- Choice
- Divider
- Animation
- Custom Blocks

This architecture allows the editor to grow without redesigning chapter structures.


## Scene Block

A Scene Block establishes the current setting of the story.

Future properties may include:

- Background image
- Location name
- Time of day
- Weather
- Music
- Ambient effects

Scene blocks can appear anywhere inside a chapter.

When a new Scene Block appears, it replaces the previous active scene.


## Narration Block

Narration Blocks contain descriptive writing.

Narration supports rich text formatting, including:

- Bold
- Italic
- Underline
- Headings
- Text color
- Lists
- Paragraphs

Example uses:

- Scene descriptions
- Character thoughts
- Internal monologues
- Dramatic emphasis


## Dialogue Block

Dialogue Blocks represent spoken conversations.

Each dialogue references a Character instead of storing duplicated information.

Properties include:

- Character
- Dialogue text
- Nameplate alignment (Left / Right)

The left/right alignment helps conversations visually flow between speakers.

Future additions may include:

- Character sprites
- Expressions
- Voice clips
- Portrait animations


# Characters

Characters act as reusable templates.

Current properties:

- Name
- Description
- Nameplate color

Future ideas:

- Sprites
- Expressions
- Alternate outfits
- Pronouns
- Aliases
- Default emotions

Dialogue Blocks reference characters by ID rather than storing repeated information.

This allows changes to automatically update throughout every chapter.


# Reading Mode

Reading Mode is designed to feel like reading a visual novel.

Instead of displaying an entire chapter at once, only one block is shown.

Each click advances to the next block.

```text
Scene

↓

Narration

↓

Dialogue

↓

Dialogue

↓

Narration

↓

Scene

↓

Dialogue
```

This creates a slower, more immersive reading experience while preserving a linear narrative.


# Edit Mode

When running locally, chapters may be opened in Edit Mode.

Edit Mode includes:

- Rich text editing
- Block insertion
- Block reordering
- Character selection
- Scene editing
- Chapter organization

When published to GitHub Pages, Edit Mode is disabled.

Readers only have access to Reading Mode.


# Rich Text

Narration and Dialogue support formatted text.

The current plan is to use a rich text editor capable of generating HTML stored inside project files.

Supported formatting includes:

- Bold
- Italic
- Underline
- Headings
- Colors
- Lists
- Paragraphs

This allows expressive writing without inventing a custom markup language.


# Project Structure (Planned)

```text
story/
│
├── collections/
│
├── chapters/
│
├── characters/
│
├── assets/
│   ├── backgrounds/
│   ├── sprites/
│   ├── music/
│   └── sound/
│
└── generated/
```


# Data Philosophy

Story Drafts Studio is designed around **human-readable files**.

Current plan:

- One file per Collection
- One file per Chapter
- One file per Character

Files should remain easy to inspect, edit, and version through Git.

The current preferred format is JSON.


# Technical Stack

Current technologies:

- Angular 22
- TypeScript
- HTML
- SCSS
- Git
- GitHub Pages

Future technologies may evolve as the project grows.


# Current Scope (MVP)

The first version focuses on the essentials.

### Included

- Collection management
- Nested collections
- Multi-collection chapters
- Chapter editor
- Scene blocks
- Narration blocks
- Dialogue blocks
- Character management
- Rich text formatting
- Reading mode
- Local file generation
- GitHub Pages publishing


### Future Features

Potential future additions include:

- Character sprites
- Background artwork
- Music
- Sound effects
- Portrait expressions
- Search
- Tags
- Favorites
- Writing statistics
- Timeline view
- Story relationship graph
- Theme customization
- Keyboard shortcuts
- Asset manager
- Plugin support


# Out of Scope

Story Drafts Studio is intentionally **not** trying to become:

- A Ren'Py replacement
- A Twine replacement
- A branching narrative engine
- A multiplayer writing platform
- A cloud-based note application
- A game engine

Stories are intentionally designed to be **linear**.


# Project Status

🚧 **Early Development**

Story Drafts Studio is currently in active development.

The focus is on designing a flexible, block-based writing system before expanding into advanced visual novel features such as sprites, backgrounds, music, and additional editor tools.

As a personal project, features and architecture may evolve significantly over time.

# Why This Exists

Many writing tools excel at either note-taking or game development, but few focus on creating a comfortable environment for writing **linear visual novel style stories**.

Story Drafts Studio aims to bridge that gap by combining structured writing, reusable story components, and an immersive reading experience into a single local-first application.

