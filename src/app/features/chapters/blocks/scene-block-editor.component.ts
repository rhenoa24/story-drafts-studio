import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SceneBlock } from '../../../core/models';

@Component({
  selector: 'app-scene-block-editor',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="fields">
      <label>
        <span class="eyebrow">Location</span>
        <input
          type="text"
          [ngModel]="block.locationName"
          (ngModelChange)="patch.emit({ locationName: $event })"
        />
      </label>
      <label>
        <span class="eyebrow">Time of day</span>
        <input
          type="text"
          placeholder="e.g. Dusk"
          [ngModel]="block.timeOfDay"
          (ngModelChange)="patch.emit({ timeOfDay: $event })"
        />
      </label>
      <label>
        <span class="eyebrow">Background</span>
        <input
          type="text"
          placeholder="filename or label (future: asset picker)"
          [ngModel]="block.backgroundLabel"
          (ngModelChange)="patch.emit({ backgroundLabel: $event })"
        />
      </label>
    </div>
  `,
  styles: [
    `
      .fields {
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
      }

      label {
        display: flex;
        flex-direction: column;
        gap: 4px;
        flex: 1;
        min-width: 160px;
      }
    `
  ]
})
export class SceneBlockEditorComponent {
  @Input({ required: true }) block!: SceneBlock;
  @Output() patch = new EventEmitter<Partial<SceneBlock>>();
}
