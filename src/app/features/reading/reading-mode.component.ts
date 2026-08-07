import { Component, ElementRef, ViewChild, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StoryDataService } from '../../core/services/story-data.service';
import { Block, SceneBlock } from '../../core/models';

@Component({
  selector: 'app-reading-mode',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (chapter(); as chapter) {
      <div class="stage">
        <div class="stage-head">
          <a class="btn subtle" [routerLink]="['/chapters', chapter.id, 'edit']">Exit to Editor</a>
          <span class="chapter-title">{{ chapter.title }}</span>
          <span class="progress">{{ revealedCount() }} / {{ chapter.blocks.length }}</span>
        </div>

        @if (activeScene(); as scene) {
          <div class="scene-strip">
            <span class="eyebrow">{{ scene.locationName }}</span>
            @if (scene.timeOfDay) {
              <span class="eyebrow dim">{{ scene.timeOfDay }}</span>
            }
          </div>
        }

        <div #scroller class="stage-scroll" (click)="advance()">
          <div class="feed">
            @for (block of revealedBlocks(); track block.id) {
              @switch (block.type) {
                @case ('scene') {
                  <div class="beat scene-beat">
                    <div class="scene-card">
                      <h2>{{ block.locationName }}</h2>
                      @if (block.timeOfDay) {
                        <p class="dim">{{ block.timeOfDay }}</p>
                      }
                    </div>
                  </div>
                }
                @case ('narration') {
                  <div class="beat narration-beat" [innerHTML]="block.html"></div>
                }
                @case ('dialogue') {
                  <div class="beat dialogue-beat" [class.right]="block.align === 'right'">
                    <div class="nameplate" [style.background]="characterColor(block.characterId)">
                      {{ characterName(block.characterId) }}
                    </div>
                    <p class="dialogue-text">{{ block.text }}</p>
                  </div>
                }
              }
            }

            @if (isComplete()) {
              <div class="beat end-beat" (click)="$event.stopPropagation()">
                <p class="eyebrow">End of Chapter</p>
                @if (nextChapterId(); as nextId) {
                  <a class="btn primary" [routerLink]="['/read', nextId]">Continue to Next Chapter</a>
                } @else {
                  <a class="btn primary" routerLink="/collections">Return to Collection</a>
                }
              </div>
            }
          </div>
        </div>

        @if (!isComplete()) {
          <div class="tap-hint">Click anywhere to continue</div>
        }
      </div>
    } @else {
      <p class="empty">Chapter not found.</p>
    }
  `,
  styles: [
    `
      .stage {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: var(--stage);
        color: var(--stage-paper);
        min-height: 0;
      }

      .stage-head {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 12px 20px;
        border-bottom: 1px solid rgba(241, 236, 223, 0.12);
        font-family: var(--font-mono);
        font-size: 13px;
      }

      .chapter-title {
        flex: 1;
        font-family: var(--font-display);
        font-size: 16px;
      }

      .progress {
        color: var(--stage-soft);
      }

      .scene-strip {
        display: flex;
        gap: 12px;
        padding: 8px 20px;
        border-bottom: 1px dashed rgba(241, 236, 223, 0.15);
      }

      .scene-strip .eyebrow {
        color: var(--stage-paper);
      }

      .scene-strip .dim {
        color: var(--stage-soft);
      }

      .stage-scroll {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        cursor: pointer;
        scroll-behavior: smooth;
      }

      .feed {
        max-width: 620px;
        margin: 0 auto;
        padding: 40px 24px 80px;
        display: flex;
        flex-direction: column;
        gap: 36px;
      }

      .beat {
        width: 100%;
        text-align: center;
        animation: rise 0.25s ease;
      }

      @keyframes rise {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .scene-card h2 {
        font-family: var(--font-display);
        font-size: 34px;
        letter-spacing: 0.02em;
      }

      .scene-card .dim {
        color: var(--stage-soft);
        font-family: var(--font-mono);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: 13px;
      }

      .narration-beat {
        font-family: var(--font-body);
        font-size: 20px;
        line-height: 1.7;
        font-style: italic;
        color: var(--stage-paper);
      }

      .dialogue-beat {
        text-align: left;
      }

      .dialogue-beat.right {
        text-align: right;
      }

      .nameplate {
        display: inline-block;
        font-family: var(--font-mono);
        font-size: 12px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: #fff;
        padding: 4px 10px;
        border-radius: var(--radius);
        margin-bottom: 10px;
      }

      .dialogue-text {
        font-family: var(--font-body);
        font-size: 22px;
        line-height: 1.5;
      }

      .end-beat {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        cursor: default;
        padding-top: 20px;
        border-top: 1px dashed rgba(241, 236, 223, 0.2);
      }

      .end-beat .eyebrow {
        color: var(--stage-paper);
      }

      .tap-hint {
        text-align: center;
        font-family: var(--font-mono);
        font-size: 11px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--stage-soft);
        padding: 10px;
      }

      .empty {
        padding: 40px;
        color: var(--ink-soft);
        font-style: italic;
      }
    `
  ]
})
export class ReadingModeComponent {
  private readonly chapterId: string;

  /** Number of blocks revealed so far. Blocks accumulate in the feed rather than replacing one another. */
  readonly revealedCount = signal(1);

  @ViewChild('scroller') private scroller?: ElementRef<HTMLDivElement>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: StoryDataService
  ) {
    this.chapterId = this.route.snapshot.paramMap.get('id')!;
  }

  chapter() {
    return this.store.chapter(this.chapterId);
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
}
