import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoryDataService } from '../../../core/services/story-data.service';

@Component({
  selector: 'app-character-manager',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './character-manager.component.html',
  styleUrl: './character-manager.component.scss'
})
export class CharacterManagerComponent {
  constructor(readonly store: StoryDataService) { }

  add(): void {
    const name = prompt('Character name?', 'New Character');
    if (!name) return;
    this.store.addCharacter(name);
  }
}
