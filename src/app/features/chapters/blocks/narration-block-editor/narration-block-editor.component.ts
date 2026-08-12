import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NarrationBlock } from '../../../../core/models';

@Component({
  selector: 'app-narration-block-editor',
  standalone: true,
  templateUrl: './narration-block-editor.component.html',
  styleUrl: './narration-block-editor.component.scss'
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
