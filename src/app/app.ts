import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { StoryDataService } from './core/services/story-data.service';
import { EditModeService } from './core/services/edit-mode.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(
    private readonly store: StoryDataService,
    readonly editMode: EditModeService,
  ) {}

  export(): void {
    this.store.exportProjectFiles();
  }
}
