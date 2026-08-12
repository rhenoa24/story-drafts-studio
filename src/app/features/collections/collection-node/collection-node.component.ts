import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Collection, Chapter } from '../../../core/models';
import { StoryDataService } from '../../../core/services/story-data.service';
import { EditModeService } from '../../../core/services/edit-mode.service';

@Component({
  selector: 'app-collection-node',
  standalone: true,
  imports: [RouterLink, CollectionNodeComponent],
  templateUrl: './collection-node.component.html',
  styleUrl: './collection-node.component.scss'
})
export class CollectionNodeComponent {
  @Input({ required: true }) collection!: Collection;
  @Output() changed = new EventEmitter<void>();

  constructor(
    private readonly store: StoryDataService,
    readonly editMode: EditModeService
  ) { }

  get chapters(): Chapter[] {
    return this.store.chaptersIn(this.collection.id);
  }

  get children(): Collection[] {
    return this.store.childCollectionsOf(this.collection.id);
  }

  addSubCollection(): void {
    const name = prompt('New sub-collection name?', 'New Collection');
    if (!name) return;
    this.store.addCollection(name, this.collection.id);
    this.changed.emit();
  }

  addChapter(): void {
    const title = prompt('New chapter title?', 'Untitled Chapter');
    if (!title) return;
    this.store.addChapter(title, this.collection.id);
    this.changed.emit();
  }

  remove(): void {
    if (!confirm(`Delete "${this.collection.name}"? Chapters are kept but unlinked.`)) return;
    this.store.deleteCollection(this.collection.id);
    this.changed.emit();
  }
}