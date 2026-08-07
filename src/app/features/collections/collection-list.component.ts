import { Component } from '@angular/core';
import { StoryDataService } from '../../core/services/story-data.service';
import { CollectionNodeComponent } from './collection-node.component';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [CollectionNodeComponent],
  template: `
    <div class="page">
      <div class="page-head">
        <div>
          <span class="eyebrow">Library</span>
          <h1>Collections</h1>
        </div>
        <button class="btn primary" (click)="addRoot()">+ New Collection</button>
      </div>

      @if (roots.length === 0) {
        <p class="empty">No collections yet. Start with one to hold your chapters.</p>
      } @else {
        <ul class="root-list">
          @for (root of roots; track root.id) {
            <app-collection-node [collection]="root" (changed)="refresh()" />
          }
        </ul>
      }
    </div>
  `,
  styles: [
    `
      .page {
        max-width: 820px;
        margin: 0 auto;
        padding: 40px 28px 80px;
        width: 100%;
      }

      .page-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 24px;
        border-bottom: 1px solid var(--rule);
        padding-bottom: 16px;
      }

      h1 {
        font-size: 30px;
      }

      .empty {
        color: var(--ink-soft);
        font-style: italic;
      }

      .root-list {
        list-style: none;
        margin: 0;
        padding: 0;
      }
    `
  ]
})
export class CollectionListComponent {
  constructor(private readonly store: StoryDataService) {}

  get roots() {
    return this.store.childCollectionsOf(null);
  }

  addRoot(): void {
    const name = prompt('New collection name?', 'New Collection');
    if (!name) return;
    this.store.addCollection(name, null);
  }

  refresh(): void {
    // signals already trigger re-render; hook kept for future side-effects
  }
}
