import { Component, ElementRef, ViewChild, computed, effect, inject, signal } from '@angular/core';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StoryDataService } from '../../../core/services/story-data.service';
import { EditModeService } from '../../../core/services/edit-mode.service';
import { Block, SceneBlock } from '../../../core/models';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-reading-mode',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './reading-mode.component.html',
  styleUrl: './reading-mode.component.scss',
})
export class ReadingModeComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(StoryDataService);
  private readonly sanitizer = inject(DomSanitizer);
  readonly editMode = inject(EditModeService);

  /** Reactive route param - updates even when Angular reuses this component instance across /read/:id navigations. */
  private readonly paramMap = toSignal(this.route.paramMap);
  private readonly chapterId = computed(() => this.paramMap()?.get('id') ?? '');

  /** Number of blocks revealed so far. Blocks accumulate in the feed rather than replacing one another. */
  readonly revealedCount = signal(1);

  @ViewChild('scroller') private scroller?: ElementRef<HTMLDivElement>;

  constructor() {
    // Whenever the chapter changes (including a "Continue" link reusing this
    // same component instance), reset progress and jump the feed back to the top.
    effect(() => {
      this.chapterId();
      this.revealedCount.set(1);
      const el = this.scroller?.nativeElement;
      if (el) el.scrollTop = 0;
    });
  }

  chapter() {
    return this.store.chapter(this.chapterId());
  }

  revealedBlocks(): Block[] {
    const chapter = this.chapter();
    if (!chapter) return [];
    return chapter.blocks.slice(0, this.revealedCount());
  }

  isComplete(): boolean {
    const chapter = this.chapter();
    return !!chapter && this.revealedCount() >= chapter.blocks.length;
  }

  /** The most recent Scene Block among the revealed blocks sets the active backdrop. */
  activeScene = computed<SceneBlock | undefined>(() => {
    const chapter = this.chapter();
    if (!chapter) return undefined;
    let scene: SceneBlock | undefined;
    for (let i = 0; i < this.revealedCount() && i < chapter.blocks.length; i++) {
      const b = chapter.blocks[i];
      if (b.type === 'scene') scene = b;
    }
    return scene;
  });

  nextChapterId(): string | undefined {
    const chapter = this.chapter();
    if (!chapter || chapter.collectionIds.length === 0) return undefined;
    const collection = this.store.collections().find((c) => c.id === chapter.collectionIds[0]);
    if (!collection) return undefined;
    const i = collection.chapterIds.indexOf(chapter.id);
    if (i === -1 || i === collection.chapterIds.length - 1) return undefined;
    return collection.chapterIds[i + 1];
  }

  advance(): void {
    const chapter = this.chapter();
    if (!chapter) return;
    if (this.revealedCount() < chapter.blocks.length) {
      this.revealedCount.update((n) => n + 1);
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    requestAnimationFrame(() => {
      const el = this.scroller?.nativeElement;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
  }

  characterName(id: string): string {
    return this.store.characterMap().get(id)?.name ?? 'Unknown';
  }

  characterColor(id: string): string {
    return this.store.characterMap().get(id)?.nameplateColor ?? '#3A5A6E';
  }

  trustedHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
