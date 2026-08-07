import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Collection, Chapter } from '../../core/models';
import { StoryDataService } from '../../core/services/story-data.service';

@Component({
  selector: 'app-collection-node',
  standalone: true,
  imports: [RouterLink, CollectionNodeComponent],
  template: `
    <li class="node">
      <div class="node-row">
        <span class="eyebrow">Collection</span>
        <span class="node-name">{{ collection.name }}</span>
        <span class="node-actions">
          <button class="btn subtle" (click)="addSubCollection()">+ Sub-collection</button>
          <button class="btn subtle" (click)="addChapter()">+ Chapter</button>
          <button class="btn danger" (click)="remove()">Delete</button>
        </span>
      </div>

      @if (chapters.length) {
        <ul class="chapters">
          @for (chapter of chapters; track chapter.id) {
            <li class="chapter-row">
              <span class="chapter-title">{{ chapter.title }}</span>
              <span class="chapter-actions">
                <a class="btn subtle" [routerLink]="['/chapters', chapter.id, 'edit']">Edit</a>
                <a class="btn subtle" [routerLink]="['/read', chapter.id]">Read</a>
              </span>
            </li>
          }
        </ul>
      }

      @if (children.length) {
        <ul class="children">
          @for (child of children; track child.id) {
            <app-collection-node [collection]="child" (changed)="changed.emit()" />
          }
        </ul>
      }
    </li>
  `,
  styles: [
    `
      .node {
        list-style: none;
        margin: 10px 0;
        padding: 12px 14px;
        background: var(--paper-raised);
        border: 1px solid var(--rule);
        border-left: 3px solid var(--scene);
        border-radius: var(--radius);
      }

      .node-row {
        display: flex;
        align-items: baseline;
        gap: 10px;
      }

      .node-name {
        font-family: var(--font-display);
        font-weight: 600;
        font-size: 16px;
        flex: 1;
      }

      .node-actions {
        display: flex;
        gap: 6px;
      }

      .chapters {
        list-style: none;
        margin: 10px 0 0;
        padding: 0;
        border-top: 1px dashed var(--rule);
      }

      .chapter-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 4px 8px 18px;
        border-bottom: 1px dashed var(--rule);
      }

      .chapter-title {
        flex: 1;
        font-family: var(--font-body);
      }

      .chapter-actions {
        display: flex;
        gap: 6px;
      }

      .children {
        list-style: none;
        margin: 8px 0 0;
        padding: 0 0 0 18px;
      }
    `
  ]
})
export class CollectionNodeComponent {
  @Input({ required: true }) collection!: Collection;
  @Output() changed = new EventEmitter<void>();

  constructor(private readonly store: StoryDataService) {}

  get chapters(): Chapter[] {
    return this.store.chaptersIn(this.collection.id);
  }

  get children(): Collection[] {
    return this.store.childCollectionsOf(this.collection.id);
  }

  addSubCollection(): void {
    const name = prompt('New sub-collection name?', 'New Collection');
    if (!name) return;
    this.store.addCollection(name, this.collection.id);
    this.changed.emit();
  }

  addChapter(): void {
    const title = prompt('New chapter title?', 'Untitled Chapter');
    if (!title) return;
    this.store.addChapter(title, this.collection.id);
    this.changed.emit();
  }

  remove(): void {
    if (!confirm(`Delete "${this.collection.name}"? Chapters are kept but unlinked.`)) return;
    this.store.deleteCollection(this.collection.id);
    this.changed.emit();
  }
}
