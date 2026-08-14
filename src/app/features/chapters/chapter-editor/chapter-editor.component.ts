import { Component, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StoryDataService } from '../../../core/services/story-data.service';
import { BlockType, Collection } from '../../../core/models';
import { SceneBlockEditorComponent } from '../blocks/scene-block-editor/scene-block-editor.component';
import { NarrationBlockEditorComponent } from '../blocks/narration-block-editor/narration-block-editor.component';
import { DialogueBlockEditorComponent } from '../blocks/dialogue-block-editor/dialogue-block-editor.component';
import { IconComponent } from '../../../shared/icon/icon.component';

const BLOCK_LABEL: Record<BlockType, string> = {
  scene: 'Scene',
  narration: 'Narration',
  dialogue: 'Dialogue',
};

@Component({
  selector: 'app-chapter-editor',
  standalone: true,
  imports: [
    FormsModule,
    NgTemplateOutlet,
    RouterLink,
    SceneBlockEditorComponent,
    NarrationBlockEditorComponent,
    DialogueBlockEditorComponent,
    IconComponent,
  ],
  templateUrl: './chapter-editor.component.html',
  styleUrl: './chapter-editor.component.scss',
})
export class ChapterEditorComponent {
  readonly BLOCK_LABEL = BLOCK_LABEL;
  private readonly chapterId: string;

  constructor(
    private readonly route: ActivatedRoute,
    readonly store: StoryDataService,
  ) {
    this.chapterId = this.route.snapshot.paramMap.get('id')!;
  }

  chapter() {
    return this.store.chapter(this.chapterId);
  }

  add(type: BlockType): void {
    this.store.addBlock(this.chapterId, type);
  }

  /** Which "insert here" slot (by target index) currently has its type-picker open, if any. */
  private readonly _openInsertIndex = signal<number | null>(null);

  toggleInsertMenu(atIndex: number): void {
    this._openInsertIndex.update((current) => (current === atIndex ? null : atIndex));
  }

  isInsertMenuOpen(atIndex: number): boolean {
    return this._openInsertIndex() === atIndex;
  }

  insertBlockAt(type: BlockType, atIndex: number): void {
    this.store.addBlock(this.chapterId, type, atIndex);
    this._openInsertIndex.set(null);
  }

  /** Collections this chapter currently belongs to. */
  collectionsFor(collectionIds: string[]): Collection[] {
    return this.store.collections().filter((c) => collectionIds.includes(c.id));
  }

  /** Collections this chapter could still be added to. */
  availableCollectionsFor(collectionIds: string[]): Collection[] {
    return this.store.collections().filter((c) => !collectionIds.includes(c.id));
  }

  collectionPath(id: string): string {
    return this.store.collectionPath(id);
  }

  linkToCollection(select: HTMLSelectElement): void {
    const collectionId = select.value;
    if (!collectionId) return;
    this.store.linkChapterToCollection(this.chapterId, collectionId);
    select.value = '';
  }

  unlinkFromCollection(collectionId: string): void {
    this.store.unlinkChapterFromCollection(this.chapterId, collectionId);
  }
}
