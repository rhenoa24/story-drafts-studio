import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SceneBlock } from '../../../../core/models';

@Component({
  selector: 'app-scene-block-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './scene-block-editor.component.html',
  styleUrl: './scene-block-editor.component.scss'
})
export class SceneBlockEditorComponent {
  @Input({ required: true }) block!: SceneBlock;
  @Output() patch = new EventEmitter<Partial<SceneBlock>>();
}
