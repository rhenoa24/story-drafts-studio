import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StoryDataService } from '../../../core/services/story-data.service';
import { BlockType } from '../../../core/models';
import { SceneBlockEditorComponent } from '../blocks/scene-block-editor/scene-block-editor.component';
import { NarrationBlockEditorComponent } from '../blocks/narration-block-editor/narration-block-editor.component';
import { DialogueBlockEditorComponent } from '../blocks/dialogue-block-editor/dialogue-block-editor.component';

const BLOCK_LABEL: Record<BlockType, string> = {
  scene: 'Scene',
  narration: 'Narration',
  dialogue: 'Dialogue'
};

@Component({
  selector: 'app-chapter-editor',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    SceneBlockEditorComponent,
    NarrationBlockEditorComponent,
    DialogueBlockEditorComponent
  ],
  templateUrl: './chapter-editor.component.html',
  styleUrl: './chapter-editor.component.scss'
})
export class ChapterEditorComponent {
  readonly BLOCK_LABEL = BLOCK_LABEL;
  private readonly chapterId: string;

  constructor(
    private readonly route: ActivatedRoute,
    readonly store: StoryDataService
  ) {
    this.chapterId = this.route.snapshot.paramMap.get('id')!;
  }

  chapter() {
    return this.store.chapter(this.chapterId);
  }

  add(type: BlockType): void {
    this.store.addBlock(this.chapterId, type);
  }
}
