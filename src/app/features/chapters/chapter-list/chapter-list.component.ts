import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoryDataService } from '../../../core/services/story-data.service';
import { EditModeService } from '../../../core/services/edit-mode.service';
import { IconComponent } from '../../../shared/icon/icon.component';
import { Chapter } from '../../../core/models';

@Component({
  selector: 'app-chapter-list',
  standalone: true,
  imports: [RouterLink, IconComponent],
  templateUrl: './chapter-list.component.html',
  styleUrl: './chapter-list.component.scss',
})
export class ChapterListComponent {
  constructor(
    private readonly store: StoryDataService,
    readonly editMode: EditModeService,
  ) {}

  get chapters(): Chapter[] {
    return this.store.chapters();
  }

  get orphanedChapters(): Chapter[] {
    return this.store.orphanedChapters();
  }

  collectionPathsFor(chapter: Chapter): string {
    return chapter.collectionIds.map((id) => this.store.collectionPath(id)).join(', ');
  }

  addOrphanChapter(): void {
    const title = prompt('New chapter title?', 'Untitled Chapter');
    if (!title) return;
    this.store.createOrphanChapter(title);
  }

  remove(chapter: Chapter): void {
    if (!confirm(`Delete "${chapter.title}"? This cannot be undone.`)) return;
    this.store.deleteChapter(chapter.id);
  }
}
