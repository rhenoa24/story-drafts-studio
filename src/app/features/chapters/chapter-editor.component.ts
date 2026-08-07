import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StoryDataService } from '../../core/services/story-data.service';
import { BlockType } from '../../core/models';
import { SceneBlockEditorComponent } from './blocks/scene-block-editor.component';
import { NarrationBlockEditorComponent } from './blocks/narration-block-editor.component';
import { DialogueBlockEditorComponent } from './blocks/dialogue-block-editor.component';

const BLOCK_LABEL: Record<BlockType, string> = {
  scene: 'Scene',
  narration: 'Narration',
  dialogue: 'Dialogue'
};

@Component({
  selector: 'app-chapter-editor',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    SceneBlockEditorComponent,
    NarrationBlockEditorComponent,
    DialogueBlockEditorComponent
  ],
  template: `
    @if (chapter(); as chapter) {
      <div class="page">
        <div class="page-head">
          <div>
            <span class="eyebrow">Editing Chapter</span>
            <input
              type="text"
              class="title-input"
              [ngModel]="chapter.title"
              (ngModelChange)="store.renameChapter(chapter.id, $event)"
            />
          </div>
          <a class="btn primary" [routerLink]="['/read', chapter.id]">Preview in Reading Mode</a>
        </div>

        <ul class="blocks">
          @for (block of chapter.blocks; track block.id; let i = $index) {
            <li class="block-card" [attr.data-type]="block.type">
              <div class="spine">{{ BLOCK_LABEL[block.type] }}</div>
              <div class="block-body">
                <div class="block-toolbar">
                  <button
                    class="btn subtle"
                    [disabled]="i === 0"
                    (click)="store.moveBlock(chapter.id, i, i - 1)"
                  >
                    ↑
                  </button>
                  <button
                    class="btn subtle"
                    [disabled]="i === chapter.blocks.length - 1"
                    (click)="store.moveBlock(chapter.id, i, i + 1)"
                  >
                    ↓
                  </button>
                  <span class="spacer"></span>
                  <button class="btn danger" (click)="store.removeBlock(chapter.id, block.id)">
                    Remove
                  </button>
                </div>

                @switch (block.type) {
                  @case ('scene') {
                    <app-scene-block-editor
                      [block]="block"
                      (patch)="store.updateBlock(chapter.id, block.id, $event)"
                    />
                  }
                  @case ('narration') {
                    <app-narration-block-editor
                      [block]="block"
                      (patch)="store.updateBlock(chapter.id, block.id, $event)"
                    />
                  }
                  @case ('dialogue') {
                    <app-dialogue-block-editor
                      [block]="block"
                      [characters]="store.characters()"
                      (patch)="store.updateBlock(chapter.id, block.id, $event)"
                    />
                  }
                }
              </div>
            </li>
          }
        </ul>

        <div class="add-toolbar">
          <span class="eyebrow">Add block</span>
          <button class="btn" (click)="add('scene')">+ Scene</button>
          <button class="btn" (click)="add('narration')">+ Narration</button>
          <button class="btn" (click)="add('dialogue')">+ Dialogue</button>
        </div>
      </div>
    } @else {
      <p class="empty">Chapter not found.</p>
    }
  `,
  styles: [
    `
      .page {
        max-width: 760px;
        margin: 0 auto;
        padding: 40px 28px 100px;
        width: 100%;
      }

      .page-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 16px;
        border-bottom: 1px solid var(--rule);
        padding-bottom: 16px;
        margin-bottom: 24px;
      }

      .title-input {
        font-family: var(--font-display);
        font-size: 26px;
        font-weight: 600;
        border: none;
        background: transparent;
        padding: 2px 0;
        min-width: 320px;
      }

      .title-input:focus {
        outline: none;
        border-bottom: 2px solid var(--scene);
      }

      .blocks {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }

      .block-card {
        display: flex;
        background: var(--paper-raised);
        border: 1px solid var(--rule);
        border-radius: var(--radius);
        overflow: hidden;
      }

      .spine {
        writing-mode: vertical-rl;
        text-orientation: mixed;
        font-family: var(--font-mono);
        font-size: 11px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #fff;
        padding: 12px 6px;
        flex-shrink: 0;
      }

      .block-card[data-type='scene'] .spine {
        background: var(--scene);
      }

      .block-card[data-type='narration'] .spine {
        background: var(--narration);
      }

      .block-card[data-type='dialogue'] .spine {
        background: var(--dialogue);
      }

      .block-body {
        flex: 1;
        padding: 14px 16px;
        min-width: 0;
      }

      .block-toolbar {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 10px;
      }

      .spacer {
        flex: 1;
      }

      .add-toolbar {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 28px;
        padding-top: 16px;
        border-top: 1px dashed var(--rule);
      }

      .empty {
        padding: 40px;
        color: var(--ink-soft);
        font-style: italic;
      }
    `
  ]
})
export class ChapterEditorComponent {
  readonly BLOCK_LABEL = BLOCK_LABEL;
  private readonly chapterId: string;

  constructor(
    private readonly route: ActivatedRoute,
    readonly store: StoryDataService
  ) {
    this.chapterId = this.route.snapshot.paramMap.get('id')!;
  }

  chapter() {
    return this.store.chapter(this.chapterId);
  }

  add(type: BlockType): void {
    this.store.addBlock(this.chapterId, type);
  }
}
