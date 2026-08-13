import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Collection, Chapter } from '../../../core/models';
import { StoryDataService } from '../../../core/services/story-data.service';
import { EditModeService } from '../../../core/services/edit-mode.service';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-collection-node',
  standalone: true,
  imports: [RouterLink, CollectionNodeComponent, IconComponent],
  templateUrl: './collection-node.component.html',
  styleUrl: './collection-node.component.scss',
})
export class CollectionNodeComponent {
  @Input({ required: true }) collection!: Collection;
  @Output() changed = new EventEmitter<void>();

  private readonly _isEditingThisNode = signal(false);
  readonly isEditingThisNode = this._isEditingThisNode.asReadonly();

  constructor(
    private readonly store: StoryDataService,
    readonly editMode: EditModeService,
  ) {}

  toggleNodeEdit(): void {
    this._isEditingThisNode.update((v) => !v);
  }

  get chapters(): Chapter[] {
    return this.store.chaptersIn(this.collection.id);
  }

  get children(): Collection[] {
    return this.store.childCollectionsOf(this.collection.id);
  }

  rename(): void {
    const name = prompt('Rename collection to?', this.collection.name);
    if (!name || name === this.collection.name) return;
    this.store.renameCollection(this.collection.id, name);
    this.changed.emit();
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

  moveChapterUp(index: number): void {
    if (index <= 0) return;
    this.store.moveChapterInCollection(this.collection.id, index, index - 1);
    this.changed.emit();
  }

  moveChapterDown(index: number): void {
    if (index >= this.chapters.length - 1) return;
    this.store.moveChapterInCollection(this.collection.id, index, index + 1);
    this.changed.emit();
  }

  moveSubCollectionUp(index: number): void {
    if (index <= 0) return;
    this.store.moveCollectionInParent(this.collection.id, index, index - 1);
    this.changed.emit();
  }

  moveSubCollectionDown(index: number): void {
    if (index >= this.children.length - 1) return;
    this.store.moveCollectionInParent(this.collection.id, index, index + 1);
    this.changed.emit();
  }
}
