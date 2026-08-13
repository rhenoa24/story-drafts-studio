import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NarrationBlock } from '../../../../core/models';
import { IconComponent } from '../../../../shared/icon/icon.component';

@Component({
  selector: 'app-narration-block-editor',
  standalone: true,
  templateUrl: './narration-block-editor.component.html',
  styleUrl: './narration-block-editor.component.scss',
  imports: [IconComponent],
})
export class NarrationBlockEditorComponent implements OnChanges, AfterViewInit {
  @Input({ required: true }) block!: NarrationBlock;
  @Output() patch = new EventEmitter<Partial<NarrationBlock>>();

  @ViewChild('editable') editable!: ElementRef<HTMLDivElement>;

  /** id of the block whose content is currently reflected in the DOM. */
  private syncedBlockId: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['block']) {
      this.syncFromBlockIfChanged();
    }
  }

  ngAfterViewInit(): void {
    this.syncFromBlockIfChanged();
  }

  /**
   * Only writes `block.html` into the contenteditable DOM node when we've
   * switched to a *different* block. Re-setting `innerHTML` on every
   * keystroke - even to the same value the user just typed - resets the
   * caret to the start, which is what was causing the caret to jump while
   * typing. Once a block is synced, further edits flow one-way (DOM -> patch
   * emit -> store) until the block identity changes again.
   */
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
