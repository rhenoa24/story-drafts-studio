import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogueBlock, Character } from '../../../../core/models';

@Component({
  selector: 'app-dialogue-block-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dialogue-block-editor.component.html',
  styleUrl: './dialogue-block-editor.component.scss'
})
export class DialogueBlockEditorComponent {
  @Input({ required: true }) block!: DialogueBlock;
  @Input({ required: true }) characters!: Character[];
  @Output() patch = new EventEmitter<Partial<DialogueBlock>>();
}
