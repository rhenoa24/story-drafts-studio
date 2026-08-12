import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { StoryDataService } from './core/services/story-data.service';
import { EditModeService } from './core/services/edit-mode.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <header class="shell-header">
        <a class="brand" routerLink="/collections">
          <span class="brand-mark">SD</span>
          <span class="brand-name">Story Drafts Studio</span>
        </a>
        <nav class="shell-nav">
          <a routerLink="/collections" routerLinkActive="active">Collections</a>
          @if (editMode.isEditModeEnabled) {
            <a routerLink="/characters" routerLinkActive="active">Characters</a>
          }
        </nav>
        @if (editMode.isEditModeEnabled) {
          <button class="btn subtle" (click)="export()">Export Project Files</button>
        }
      </header>
      <main class="shell-main">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [
    `
      .shell {
        min-height: 100%;
        display: flex;
        flex-direction: column;
      }

      .shell-header {
        display: flex;
        align-items: center;
        gap: 24px;
        padding: 14px 28px;
        border-bottom: 1px solid var(--rule);
        background: var(--paper-raised);
      }

      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        color: var(--ink);
      }

      .brand-mark {
        font-family: var(--font-mono);
        font-size: 12px;
        border: 1px solid var(--ink);
        border-radius: var(--radius);
        padding: 3px 6px;
        letter-spacing: 0.04em;
      }

      .brand-name {
        font-family: var(--font-display);
        font-weight: 600;
        font-size: 18px;
      }

      .shell-nav {
        display: flex;
        gap: 18px;
        flex: 1;
        font-family: var(--font-mono);
        font-size: 13px;
      }

      .shell-nav a {
        text-decoration: none;
        color: var(--ink-soft);
        padding-bottom: 2px;
        border-bottom: 2px solid transparent;
      }

      .shell-nav a.active {
        color: var(--ink);
        border-bottom-color: var(--scene);
      }

      .shell-main {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
    `
  ]
})
export class AppComponent {
  constructor(
    private readonly store: StoryDataService,
    readonly editMode: EditModeService
  ) { }

  export(): void {
    this.store.exportProjectFiles();
  }
}