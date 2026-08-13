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
    const cleanedHtml = this.cleanHtml(
      this.editable.nativeElement.innerHTML
    );

    this.patch.emit({
      html: cleanedHtml,
    });
  }

  // #region for text color
  selectedColor = '#E8F8FF';
  private savedRange: Range | null = null;

  saveSelection(): void {
    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      return;
    }

    this.savedRange = selection.getRangeAt(0).cloneRange();
  }

  restoreSelection(): void {
    if (!this.savedRange) {
      return;
    }

    const selection = window.getSelection();

    if (!selection) {
      return;
    }

    selection.removeAllRanges();
    selection.addRange(this.savedRange);
  }

  setTextColor(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.selectedColor = input.value;

    this.applyColorToSelection(this.selectedColor);

    this.onInput();
    this.saveSelection();
  }

  /**
   * Focuses the editor, restores the saved selection, and returns its range
   * - or null if there's no selection or it's collapsed (nothing to act on).
   * Shared by applyColorToSelection() and clearTextColor().
   */
  private getRestoredSelectionRange(): Range | null {
    this.editable.nativeElement.focus();
    this.restoreSelection();

    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
      return null;
    }

    const range = selection.getRangeAt(0);

    return range.collapsed ? null : range;
  }

  /**
   * Unwraps every color span the given range touches (dropping the wrapper,
   * keeping its text). Used by clearTextColor().
   */
  private clearColorSpansInRange(range: Range): void {
    const colorSpans = Array.from(
      this.editable.nativeElement.querySelectorAll<HTMLElement>('span[style]')
    ).filter((span) => span.style.color && range.intersectsNode(span));

    for (const span of colorSpans) {
      this.unwrapElement(span);
    }
  }

  /**
   * Unwraps color spans nested *inside* root (dropping the wrapper, keeping
   * its text). Used right after wrapping a new color span: anything left
   * inside it is now redundant and would otherwise nest.
   */
  private unwrapNestedColorSpans(root: HTMLElement): void {
    root.querySelectorAll<HTMLElement>('span[style]').forEach((span) => {
      if (span.style.color) {
        this.unwrapElement(span);
      }
    });
  }

  private applyColorToSelection(color: string): void {
    const range = this.getRestoredSelectionRange();

    if (!range) {
      return;
    }

    const span = document.createElement('span');

    span.style.color = color;

    try {
      range.surroundContents(span);
    } catch {
      // Handles selections across multiple elements.
      const contents = range.extractContents();

      span.appendChild(contents);
      range.insertNode(span);
    }

    // Do this *after* wrapping, not before: mutating the DOM and then
    // reusing `range` for the wrap step is what caused the range to
    // collapse and leave an empty, uncolored stray span. Walking the new
    // span's own subtree afterward needs no range at all.
    this.unwrapNestedColorSpans(span);
  }

  /**
   * Clears color from every color span the selection touches, by simply
   * unwrapping those spans (dropping the wrapper, keeping the text).
   *
   * This intentionally clears the *whole* span rather than carving out an
   * exact character-level slice of the selection - trying to split partial,
   * nested spans precisely is what produced the tangled nesting this
   * replaces. Unwrapping is safe at any nesting depth and needs no manual
   * DOM splitting/reinsertion.
   */
  clearTextColor(): void {
    const range = this.getRestoredSelectionRange();

    if (!range) {
      return;
    }

    this.clearColorSpansInRange(range);

    this.selectedColor = '#E8F8FF';

    this.onInput();
    this.savedRange = null;
  }
  // #endregion

  private cleanHtml(html: string): string {
    const container = document.createElement('div');

    container.innerHTML = html;

    let previousHtml = '';

    while (previousHtml !== container.innerHTML) {
      previousHtml = container.innerHTML;

      this.cleanNode(container);
    }

    return container.innerHTML;
  }

  private cleanNode(parent: HTMLElement): void {
    const children = Array.from(parent.children);

    for (const child of children) {
      if (!(child instanceof HTMLElement)) {
        continue;
      }

      // Clean children first.
      this.cleanNode(child);

      // Remove empty style=""
      if (child.getAttribute('style')?.trim() === '') {
        child.removeAttribute('style');
      }

      // --------------------------------------------------
      // Collapse nested color spans
      // --------------------------------------------------

      if (
        child.tagName === 'SPAN' &&
        child.style.color &&
        child.children.length === 1
      ) {
        const inner = child.firstElementChild;

        if (
          inner instanceof HTMLSpanElement &&
          inner.style.color
        ) {
          // The inner/latest color wins.
          child.style.color = inner.style.color;

          // Move the inner contents into the outer span.
          while (inner.firstChild) {
            child.appendChild(inner.firstChild);
          }

          inner.remove();
        }
      }

      // Remove useless <font>/<span> wrappers that carry no attributes.
      if (
        (child.tagName === 'FONT' || child.tagName === 'SPAN') &&
        child.attributes.length === 0
      ) {
        this.unwrapElement(child);
        continue;
      }

      // Merge identical nested tags
      if (
        child.parentElement &&
        child.tagName === child.parentElement.tagName &&
        child.attributes.length === 0 &&
        child.parentElement.attributes.length === 0
      ) {
        this.unwrapElement(child);
      }
    }
  }

  private unwrapElement(element: HTMLElement): void {
    const parent = element.parentNode;

    if (!parent) {
      return;
    }

    while (element.firstChild) {
      parent.insertBefore(
        element.firstChild,
        element
      );
    }

    element.remove();
  }

}