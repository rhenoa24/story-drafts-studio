import { Routes } from '@angular/router';
import { editModeGuard } from './core/guards/edit-mode.guard';

import { CollectionListComponent } from './features/collections/collection-list/collection-list.component';
import { CharacterManagerComponent } from './features/characters/character-manager/character-manager.component';
import { ChapterEditorComponent } from './features/chapters/chapter-editor/chapter-editor.component';
import { ReadingModeComponent } from './features/reading/reading-mode/reading-mode.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'collections',
  },
  {
    path: 'collections',
    component: CollectionListComponent,
  },
  {
    path: 'characters',
    component: CharacterManagerComponent,
  },
  {
    path: 'chapters/:id/edit',
    canActivate: [editModeGuard],
    component: ChapterEditorComponent,
  },
  {
    path: 'read/:id',
    component: ReadingModeComponent,
  },
  { path: '**', redirectTo: 'collections' },
];
