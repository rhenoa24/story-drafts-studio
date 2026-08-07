import { Injectable, computed, signal } from '@angular/core';
import { Block, BlockType, Chapter, Character, Collection, createEmptyBlock } from '../models';
import { SEED_CHAPTERS, SEED_CHARACTERS, SEED_COLLECTIONS } from './seed-data';

const STORAGE_KEY = 'story-drafts-studio:v1';

interface StoredState {
  collections: Collection[];
  chapters: Chapter[];
  characters: Character[];
}

function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Story Drafts Studio has no backend. This service is the single source of
 * truth while editing locally: it holds everything in signals, mirrors every
 * change to localStorage so a refresh doesn't lose work, and can export the
 * current story as human-readable JSON files ready to be committed to Git.
 */
@Injectable({ providedIn: 'root' })
export class StoryDataService {
  private readonly _collections = signal<Collection[]>([]);
  private readonly _chapters = signal<Chapter[]>([]);
  private readonly _characters = signal<Character[]>([]);

  readonly collections = this._collections.asReadonly();
  readonly chapters = this._chapters.asReadonly();
  readonly characters = this._characters.asReadonly();

  readonly characterMap = computed(() => {
    const map = new Map<string, Character>();
    for (const c of this._characters()) map.set(c.id, c);
    return map;
  });

  constructor() {
    this.load();
  }

  // ---------- persistence ----------

  private load(): void {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        const parsed: StoredState = JSON.parse(raw);
        this._collections.set(parsed.collections ?? []);
        this._chapters.set(parsed.chapters ?? []);
        this._characters.set(parsed.characters ?? []);
        return;
      } catch {
        // fall through to seed data if the stored blob is corrupt
      }
    }
    this._collections.set(structuredClone(SEED_COLLECTIONS));
    this._chapters.set(structuredClone(SEED_CHAPTERS));
    this._characters.set(structuredClone(SEED_CHARACTERS));
    this.persist();
  }

  private persist(): void {
    if (typeof localStorage === 'undefined') return;
    const state: StoredState = {
      collections: this._collections(),
      chapters: this._chapters(),
      characters: this._characters()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  resetToSampleStory(): void {
    this._collections.set(structuredClone(SEED_COLLECTIONS));
    this._chapters.set(structuredClone(SEED_CHAPTERS));
    this._characters.set(structuredClone(SEED_CHARACTERS));
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
      all.filter((c) => c.id !== id).map((c) => (c.parentId === id ? { ...c, parentId: null } : c))
    );
    this.persist();
  }

  childCollectionsOf(parentId: string | null): Collection[] {
    return this._collections().filter((c) => c.parentId === parentId);
  }

  // ---------- chapters ----------

  addChapter(title: string, collectionId: string): Chapter {
    const chapter: Chapter = { id: newId('chap'), title, collectionIds: [collectionId], blocks: [] };
    this._chapters.update((all) => [...all, chapter]);
    this._collections.update((all) =>
      all.map((c) => (c.id === collectionId ? { ...c, chapterIds: [...c.chapterIds, chapter.id] } : c))
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
      all.map((c) => ({ ...c, chapterIds: c.chapterIds.filter((cid) => cid !== id) }))
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
      })
    );
    this.persist();
  }

  updateBlock(chapterId: string, blockId: string, patch: Partial<Block>): void {
    this._chapters.update((all) =>
      all.map((c) => {
        if (c.id !== chapterId) return c;
        return {
          ...c,
          blocks: c.blocks.map((b) => (b.id === blockId ? ({ ...b, ...patch } as Block) : b))
        };
      })
    );
    this.persist();
  }

  removeBlock(chapterId: string, blockId: string): void {
    this._chapters.update((all) =>
      all.map((c) => (c.id === chapterId ? { ...c, blocks: c.blocks.filter((b) => b.id !== blockId) } : c))
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
      })
    );
    this.persist();
  }

  // ---------- characters ----------

  addCharacter(name: string): Character {
    const character: Character = {
      id: newId('char'),
      name,
      description: '',
      nameplateColor: '#3A5A6E'
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
   * Generates one JSON file per Collection, Chapter, and Character and
   * triggers a download for each - matching the project's "generated/"
   * folder philosophy so the output can be committed straight to Git.
   */
  exportProjectFiles(): void {
    if (typeof document === 'undefined') return;
    const download = (filename: string, data: unknown) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    };

    for (const c of this._collections()) download(`collections/${c.id}.json`, c);
    for (const c of this._chapters()) download(`chapters/${c.id}.json`, c);
    for (const c of this._characters()) download(`characters/${c.id}.json`, c);
  }

  /** Imports a previously-exported full state blob (see exportBundle). */
  importBundle(bundle: StoredState): void {
    this._collections.set(bundle.collections ?? []);
    this._chapters.set(bundle.chapters ?? []);
    this._characters.set(bundle.characters ?? []);
    this.persist();
  }

  exportBundle(): StoredState {
    return {
      collections: this._collections(),
      chapters: this._chapters(),
      characters: this._characters()
    };
  }
}
