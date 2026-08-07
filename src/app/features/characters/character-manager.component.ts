import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoryDataService } from '../../core/services/story-data.service';

@Component({
  selector: 'app-character-manager',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="page">
      <div class="page-head">
        <div>
          <span class="eyebrow">Cast</span>
          <h1>Characters</h1>
        </div>
        <button class="btn primary" (click)="add()">+ New Character</button>
      </div>

      @if (store.characters().length === 0) {
        <p class="empty">No characters yet. Dialogue Blocks reference characters from here.</p>
      }

      <ul class="cards">
        @for (char of store.characters(); track char.id) {
          <li class="card" [style.borderLeftColor]="char.nameplateColor">
            <div class="row">
              <span class="swatch" [style.background]="char.nameplateColor"></span>
              <input
                type="text"
                [ngModel]="char.name"
                (ngModelChange)="store.updateCharacter(char.id, { name: $event })"
              />
              <input
                type="text"
                class="color-input"
                [ngModel]="char.nameplateColor"
                (ngModelChange)="store.updateCharacter(char.id, { nameplateColor: $event })"
              />
              <button class="btn danger" (click)="store.deleteCharacter(char.id)">Delete</button>
            </div>
            <textarea
              rows="2"
              placeholder="Description..."
              [ngModel]="char.description"
              (ngModelChange)="store.updateCharacter(char.id, { description: $event })"
            ></textarea>
          </li>
        }
      </ul>
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

      .cards {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .card {
        background: var(--paper-raised);
        border: 1px solid var(--rule);
        border-left: 4px solid;
        border-radius: var(--radius);
        padding: 12px 14px;
      }

      .row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .swatch {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 1px solid var(--rule);
        flex-shrink: 0;
      }

      .row input[type='text']:not(.color-input) {
        flex: 1;
        font-family: var(--font-display);
        font-weight: 600;
      }

      .color-input {
        width: 90px;
        font-family: var(--font-mono);
        font-size: 12px;
      }

      textarea {
        width: 100%;
        resize: vertical;
      }
    `
  ]
})
export class CharacterManagerComponent {
  constructor(readonly store: StoryDataService) {}

  add(): void {
    const name = prompt('Character name?', 'New Character');
    if (!name) return;
    this.store.addCharacter(name);
  }
}
