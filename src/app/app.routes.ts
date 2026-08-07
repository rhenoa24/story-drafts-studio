import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'collections' },
  {
    path: 'collections',
    loadComponent: () =>
      import('./features/collections/collection-list.component').then((m) => m.CollectionListComponent)
  },
  {
    path: 'characters',
    loadComponent: () =>
      import('./features/characters/character-manager.component').then((m) => m.CharacterManagerComponent)
  },
  {
    path: 'chapters/:id/edit',
    loadComponent: () =>
      import('./features/chapters/chapter-editor.component').then((m) => m.ChapterEditorComponent)
  },
  {
    path: 'read/:id',
    loadComponent: () =>
      import('./features/reading/reading-mode.component').then((m) => m.ReadingModeComponent)
  },
  { path: '**', redirectTo: 'collections' }
];
