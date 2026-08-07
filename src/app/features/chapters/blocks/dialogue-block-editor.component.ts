import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogueBlock, Character } from '../../../core/models';

@Component({
  selector: 'app-dialogue-block-editor',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="fields">
      <label class="character">
        <span class="eyebrow">Character</span>
        <select
          [ngModel]="block.characterId"
          (ngModelChange)="patch.emit({ characterId: $event })"
        >
          <option value="" disabled>Choose a character...</option>
          @for (char of characters; track char.id) {
            <option [value]="char.id">{{ char.name }}</option>
          }
        </select>
      </label>

      <label class="align">
        <span class="eyebrow">Nameplate</span>
        <div class="align-toggle">
          <button
            type="button"
            class="btn subtle"
            [class.active]="block.align === 'left'"
            (click)="patch.emit({ align: 'left' })"
          >
            Left
          </button>
          <button
            type="button"
            class="btn subtle"
            [class.active]="block.align === 'right'"
            (click)="patch.emit({ align: 'right' })"
          >
            Right
          </button>
        </div>
      </label>
    </div>

    <label class="text-field">
      <span class="eyebrow">Line</span>
      <textarea
        rows="2"
        [ngModel]="block.text"
        (ngModelChange)="patch.emit({ text: $event })"
      ></textarea>
    </label>
  `,
  styles: [
    `
      .fields {
        display: flex;
        gap: 14px;
        margin-bottom: 10px;
      }

      label {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .character {
        flex: 1;
      }

      .align-toggle {
        display: flex;
        gap: 4px;
      }

      .align-toggle .btn.active {
        background: var(--dialogue);
        border-color: var(--dialogue);
        color: var(--paper-raised);
      }

      .text-field {
        width: 100%;
      }

      textarea {
        width: 100%;
        resize: vertical;
      }
    `
  ]
})
export class DialogueBlockEditorComponent {
  @Input({ required: true }) block!: DialogueBlock;
  @Input({ required: true }) characters!: Character[];
  @Output() patch = new EventEmitter<Partial<DialogueBlock>>();
}
