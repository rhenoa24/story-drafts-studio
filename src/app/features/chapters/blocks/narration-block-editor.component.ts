import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NarrationBlock } from '../../../core/models';

@Component({
  selector: 'app-narration-block-editor',
  standalone: true,
  template: `
    <div class="toolbar">
      <button type="button" class="btn subtle" (mousedown)="$event.preventDefault()" (click)="exec('bold')">
        <strong>B</strong>
      </button>
      <button type="button" class="btn subtle" (mousedown)="$event.preventDefault()" (click)="exec('italic')">
        <em>I</em>
      </button>
      <button
        type="button"
        class="btn subtle"
        (mousedown)="$event.preventDefault()"
        (click)="exec('underline')"
      >
        <u>U</u>
      </button>
    </div>
    <div
      #editable
      class="editable"
      contenteditable="true"
      [innerHTML]="block.html"
      (input)="onInput()"
    ></div>
  `,
  styles: [
    `
      .toolbar {
        display: flex;
        gap: 6px;
        margin-bottom: 6px;
      }

      .editable {
        min-height: 60px;
        padding: 10px 12px;
        background: var(--paper-raised);
        border: 1px solid var(--rule);
        border-radius: var(--radius);
        font-family: var(--font-body);
      }

      .editable:focus {
        outline: 2px solid var(--narration);
        outline-offset: 1px;
      }
    `
  ]
})
export class NarrationBlockEditorComponent {
  @Input({ required: true }) block!: NarrationBlock;
  @Output() patch = new EventEmitter<Partial<NarrationBlock>>();

  @ViewChild('editable') editable!: ElementRef<HTMLDivElement>;

  exec(command: string): void {
    document.execCommand(command, false);
    this.onInput();
  }

  onInput(): void {
    this.patch.emit({ html: this.editable.nativeElement.innerHTML });
  }
}
