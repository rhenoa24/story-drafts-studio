import { Component } from '@angular/core';
import { StoryDataService } from '../../../core/services/story-data.service';
import { EditModeService } from '../../../core/services/edit-mode.service';
import { CollectionNodeComponent } from '../collection-node/collection-node.component';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [CollectionNodeComponent],
  templateUrl: './collection-list.component.html',
  styleUrl: './collection-list.component.scss'
})
export class CollectionListComponent {
  constructor(
    private readonly store: StoryDataService,
    readonly editMode: EditModeService
  ) { }

  get roots() {
    return this.store.childCollectionsOf(null);
  }

  addRoot(): void {
    const name = prompt('New collection name?', 'New Collection');
    if (!name) return;
    this.store.addCollection(name, null);
  }

  refresh(): void {
    // signals already trigger re-render; hook kept for future side-effects
  }
}