import { Injectable, computed, signal } from '@angular/core';
import JSZip from 'jszip';
import { Block, BlockType, Chapter, Character, Collection, createEmptyBlock } from '../models';
import { SEED_CHAPTERS, SEED_CHARACTERS, SEED_COLLECTIONS } from './seed-data';
import { EditModeService } from './edit-mode.service';

const STORAGE_KEY = 'story-drafts-studio:v1';

/** Where published JSON lives, relative to the app's <base href>. Copy the
 *  exported `story-data/` folder into your Angular project's `public/`
 *  directory so it ends up served at this same relative path. */
const STORY_DATA_PATH = 'story-data';

interface StoredState {
  collections: Collection[];
  chapters: Chapter[];
  characters: Character[];
}

interface Manifest {
  collectionIds: string[];
  chapterIds: string[];
  characterIds: string[];
}

function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function seedState(): StoredState {
  return {
    collections: structuredClone(SEED_COLLECTIONS),
    chapters: structuredClone(SEED_CHAPTERS),
    characters: structuredClone(SEED_CHARACTERS),
  };
}

/**
 * Story Drafts Studio has no backend. This service is the single source of
 * truth while editing locally: it holds everything in signals.
 *
 * Two different data sources feed it, depending on Edit Mode:
 *
 * - Locally (Edit Mode on): an in-progress draft is mirrored to
 *   `localStorage` on every change, so a refresh never loses work. The very
 *   first time there's no draft yet, it seeds itself from the published
 *   `story-data/` JSON files if present, or the bundled sample story
 *   otherwise.
 * - Published (Edit Mode off, e.g. the deployed GitHub Pages site): it
 *   *only* reads from the published `story-data/` JSON files - there is no
 *   editing there, so `localStorage` is never consulted. This matches the
 *   project's "the published site is purely a reader" rule.
 *
 * `exportProjectFiles()` writes the current draft back out as that same
 * `story-data/` file structure so it can be copied into `public/story-data/`
 * and committed to Git.
 */
@Injectable({ providedIn: 'root' })
export class StoryDataService {
  private readonly _collections = signal<Collection[]>([]);
  private readonly _chapters = signal<Chapter[]>([]);
  private readonly _characters = signal<Character[]>([]);
  private readonly _ready = signal(false);

  readonly collections = this._collections.asReadonly();
  readonly chapters = this._chapters.asReadonly();
  readonly characters = this._characters.asReadonly();

  /** True once the initial load (localStorage draft or published files) has resolved. */
  readonly ready = this._ready.asReadonly();

  readonly characterMap = computed(() => {
    const map = new Map<string, Character>();
    for (const c of this._characters()) map.set(c.id, c);
    return map;
  });

  constructor(private readonly editMode: EditModeService) {
    void this.load();
  }

  // ---------- initial load ----------

  private async load(): Promise<void> {
    const published = await this.loadPublishedFiles();

    if (this.editMode.isEditModeEnabled) {
      const draft = this.loadLocalDraft();
      if (draft) {
        this.applyState(draft);
      } else {
        this.applyState(published ?? seedState());
        this.persist();
      }
    } else {
      // Reading-only: reflect exactly what's been published, never a local draft.
      this.applyState(published ?? seedState());
    }

    this._ready.set(true);
  }

  private applyState(state: StoredState): void {
    this._collections.set(state.collections ?? []);
    this._chapters.set(state.chapters ?? []);
    this._characters.set(state.characters ?? []);
  }

  private loadLocalDraft(): StoredState | null {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StoredState;
    } catch {
      return null;
    }
  }

  private async fetchJson<T>(path: string): Promise<T | null> {
    if (typeof fetch === 'undefined') return null;
    try {
      const res = await fetch(path, { cache: 'no-cache' });
      if (!res.ok) return null;
      return (await res.json()) as T;
    } catch {
      return null;
    }
  }

  /** Loads the manifest + every referenced file from `story-data/`. Returns null if nothing's been published yet. */
  private async loadPublishedFiles(): Promise<StoredState | null> {
    const manifest = await this.fetchJson<Manifest>(`${STORY_DATA_PATH}/manifest.json`);
    if (!manifest) return null;

    const [collections, chapters, characters] = await Promise.all([
      Promise.all(
        (manifest.collectionIds ?? []).map((id) =>
          this.fetchJson<Collection>(`${STORY_DATA_PATH}/collections/${id}.json`),
        ),
      ),
      Promise.all(
        (manifest.chapterIds ?? []).map((id) =>
          this.fetchJson<Chapter>(`${STORY_DATA_PATH}/chapters/${id}.json`),
        ),
      ),
      Promise.all(
        (manifest.characterIds ?? []).map((id) =>
          this.fetchJson<Character>(`${STORY_DATA_PATH}/characters/${id}.json`),
        ),
      ),
    ]);

    return {
      collections: collections.filter((c): c is Collection => !!c),
      chapters: chapters.filter((c): c is Chapter => !!c),
      characters: characters.filter((c): c is Character => !!c),
    };
  }

  // ---------- persistence (local draft only) ----------

  private persist(): void {
    if (typeof localStorage === 'undefined') return;
    const state: StoredState = {
      collections: this._collections(),
      chapters: this._chapters(),
      characters: this._characters(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  resetToSampleStory(): void {
    this.applyState(seedState());
    this.persist();
  }

  // ---------- collections ----------

  addCollection(name: string, parentId: string | null): Collection {
    const collection: Collection = { id: newId('col'), name, parentId, chapterIds: [] };
    this._collections.update((all) => [...all, collection]);
    this.persist();
    return collection;
  }

  renameCollection(id: string, name: string): void {
    this._collections.update((all) => all.map((c) => (c.id === id ? { ...c, name } : c)));
    this.persist();
  }

  deleteCollection(id: string): void {
    this._collections.update((all) =>
      all.filter((c) => c.id !== id).map((c) => (c.parentId === id ? { ...c, parentId: null } : c)),
    );
    this.persist();
  }

  childCollectionsOf(parentId: string | null): Collection[] {
    return this._collections().filter((c) => c.parentId === parentId);
  }

  moveChapterInCollection(collectionId: string, fromIndex: number, toIndex: number): void {
    this._collections.update((all) =>
      all.map((c) => {
        if (c.id !== collectionId) return c;
        const chapterIds = [...c.chapterIds];
        const [moved] = chapterIds.splice(fromIndex, 1);
        chapterIds.splice(toIndex, 0, moved);
        return { ...c, chapterIds };
      }),
    );
    this.persist();
  }

  moveCollectionInParent(parentId: string | null, fromIndex: number, toIndex: number): void {
    this._collections.update((all) => {
      // positions in the full array occupied by this parent's children, in order
      const siblingPositions = all
        .map((c, i) => ({ c, i }))
        .filter(({ c }) => c.parentId === parentId)
        .map(({ i }) => i);

      if (fromIndex < 0 || fromIndex >= siblingPositions.length) return all;
      if (toIndex < 0 || toIndex >= siblingPositions.length) return all;

      const siblings = siblingPositions.map((i) => all[i]);
      const [moved] = siblings.splice(fromIndex, 1);
      siblings.splice(toIndex, 0, moved);

      const result = [...all];
      siblingPositions.forEach((pos, idx) => {
        result[pos] = siblings[idx];
      });
      return result;
    });
    this.persist();
  }

  // ---------- chapters ----------

  addChapter(title: string, collectionId: string): Chapter {
    const chapter: Chapter = {
      id: newId('chap'),
      title,
      collectionIds: [collectionId],
      blocks: [],
    };
    this._chapters.update((all) => [...all, chapter]);
    this._collections.update((all) =>
      all.map((c) =>
        c.id === collectionId ? { ...c, chapterIds: [...c.chapterIds, chapter.id] } : c,
      ),
    );
    this.persist();
    return chapter;
  }

  renameChapter(id: string, title: string): void {
    this._chapters.update((all) => all.map((c) => (c.id === id ? { ...c, title } : c)));
    this.persist();
  }

  deleteChapter(id: string): void {
    this._chapters.update((all) => all.filter((c) => c.id !== id));
    this._collections.update((all) =>
      all.map((c) => ({ ...c, chapterIds: c.chapterIds.filter((cid) => cid !== id) })),
    );
    this.persist();
  }

  chaptersIn(collectionId: string): Chapter[] {
    const col = this._collections().find((c) => c.id === collectionId);
    if (!col) return [];
    const byId = new Map(this._chapters().map((ch) => [ch.id, ch]));
    return col.chapterIds.map((id) => byId.get(id)).filter((c): c is Chapter => !!c);
  }

  chapter(id: string): Chapter | undefined {
    return this._chapters().find((c) => c.id === id);
  }

  // ---------- blocks ----------

  addBlock(chapterId: string, type: BlockType, atIndex?: number): void {
    this._chapters.update((all) =>
      all.map((c) => {
        if (c.id !== chapterId) return c;
        const block = createEmptyBlock(type, newId('blk'));
        const blocks = [...c.blocks];
        const index = atIndex ?? blocks.length;
        blocks.splice(index, 0, block);
        return { ...c, blocks };
      }),
    );
    this.persist();
  }

  updateBlock(chapterId: string, blockId: string, patch: Partial<Block>): void {
    this._chapters.update((all) =>
      all.map((c) => {
        if (c.id !== chapterId) return c;
        return {
          ...c,
          blocks: c.blocks.map((b) => (b.id === blockId ? ({ ...b, ...patch } as Block) : b)),
        };
      }),
    );
    this.persist();
  }

  removeBlock(chapterId: string, blockId: string): void {
    this._chapters.update((all) =>
      all.map((c) =>
        c.id === chapterId ? { ...c, blocks: c.blocks.filter((b) => b.id !== blockId) } : c,
      ),
    );
    this.persist();
  }

  moveBlock(chapterId: string, fromIndex: number, toIndex: number): void {
    this._chapters.update((all) =>
      all.map((c) => {
        if (c.id !== chapterId) return c;
        const blocks = [...c.blocks];
        const [moved] = blocks.splice(fromIndex, 1);
        blocks.splice(toIndex, 0, moved);
        return { ...c, blocks };
      }),
    );
    this.persist();
  }

  // ---------- characters ----------

  addCharacter(name: string): Character {
    const character: Character = {
      id: newId('char'),
      name,
      description: '',
      nameplateColor: '#3A5A6E',
    };
    this._characters.update((all) => [...all, character]);
    this.persist();
    return character;
  }

  updateCharacter(id: string, patch: Partial<Character>): void {
    this._characters.update((all) => all.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    this.persist();
  }

  deleteCharacter(id: string): void {
    this._characters.update((all) => all.filter((c) => c.id !== id));
    this.persist();
  }

  // ---------- export: human-readable project files ----------

  /**
   * Bundles the current draft into a single `story-data.zip`, structured as
   * a `story-data/` folder (a manifest plus one JSON file per Collection,
   * Chapter, and Character) - unzip it and drop the `story-data/` folder
   * straight into your Angular project's `public/` directory, then commit.
   */
  async exportProjectFiles(): Promise<void> {
    if (typeof document === 'undefined') return;

    const collections = this._collections();
    const chapters = this._chapters();
    const characters = this._characters();

    const manifest: Manifest = {
      collectionIds: collections.map((c) => c.id),
      chapterIds: chapters.map((c) => c.id),
      characterIds: characters.map((c) => c.id),
    };

    const zip = new JSZip();
    const root = zip.folder(STORY_DATA_PATH)!;
    const json = (data: unknown) => JSON.stringify(data, null, 2);

    root.file('manifest.json', json(manifest));

    const collectionsFolder = root.folder('collections')!;
    for (const c of collections) collectionsFolder.file(`${c.id}.json`, json(c));

    const chaptersFolder = root.folder('chapters')!;
    for (const c of chapters) chaptersFolder.file(`${c.id}.json`, json(c));

    const charactersFolder = root.folder('characters')!;
    for (const c of characters) charactersFolder.file(`${c.id}.json`, json(c));

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${STORY_DATA_PATH}.zip`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  /** Imports a previously-exported full state blob (see exportBundle). */
  importBundle(bundle: StoredState): void {
    this.applyState(bundle);
    this.persist();
  }

  exportBundle(): StoredState {
    return {
      collections: this._collections(),
      chapters: this._chapters(),
      characters: this._characters(),
    };
  }
}
