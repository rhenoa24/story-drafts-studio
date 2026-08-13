import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogueBlock, Character } from '../../../../core/models';

@Component({
  selector: 'app-dialogue-block-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dialogue-block-editor.component.html',
  styleUrl: './dialogue-block-editor.component.scss',
})
export class DialogueBlockEditorComponent implements OnChanges, AfterViewInit {
  @Input({ required: true }) block!: DialogueBlock;
  @Input({ required: true }) characters!: Character[];
  @Output() patch = new EventEmitter<Partial<DialogueBlock>>();

  @ViewChild('editable') editable!: ElementRef<HTMLDivElement>;

  /** id of the block whose content is currently reflected in the DOM. */
  private syncedBlockId: string | null = null;

  ngOnChanges(): void {
    this.syncFromBlockIfChanged();
  }

  ngAfterViewInit(): void {
    this.syncFromBlockIfChanged();
  }

  private syncFromBlockIfChanged(): void {
    if (!this.editable || this.block.id === this.syncedBlockId) return;
    this.editable.nativeElement.innerHTML = this.block.html;
    this.syncedBlockId = this.block.id;
  }

  exec(command: string): void {
    document.execCommand(command, false);
    this.onInput();
  }

  onInput(): void {
    this.patch.emit({ html: this.editable.nativeElement.innerHTML });
  }
}
