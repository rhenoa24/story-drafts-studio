import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoryDataService } from '../../../core/services/story-data.service';
import { EditModeService } from '../../../core/services/edit-mode.service';
import { IconComponent } from '../../../shared/icon/icon.component';

@Component({
  selector: 'app-character-manager',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './character-manager.component.html',
  styleUrl: './character-manager.component.scss',
})
export class CharacterManagerComponent {
  constructor(
    readonly store: StoryDataService,
    readonly editMode: EditModeService,
  ) {}

  add(): void {
    const name = prompt('Character name?', 'New Character');
    if (!name) return;
    this.store.addCharacter(name);
  }
}
